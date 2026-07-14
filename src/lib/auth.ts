import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, request) => {
        const username = credentials?.username as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!username || !password) return null;

        const user = await prisma.user.findUnique({
          where: { username },
          include: { staffAssignment: true },
        });
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        await prisma.loginLog.create({ data: { userId: user.id } });

        // Admin logins get a revocable server-side session record for the "manage my devices" feature.
        // Every other role stays plain stateless JWT, unchanged.
        let adminSessionToken: string | null = null;
        if (user.role === "ADMIN") {
          adminSessionToken = randomUUID();
          const userAgent = request.headers.get("user-agent");
          const ipAddress =
            request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
            request.headers.get("x-real-ip") ??
            null;
          await prisma.adminSession.create({
            data: { userId: user.id, sessionToken: adminSessionToken, userAgent, ipAddress },
          });
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          sportId: user.staffAssignment?.sportId ?? null,
          adminSessionToken,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role;
        token.sportId = user.sportId;
        token.adminSessionToken = user.adminSessionToken ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.sportId = token.sportId;
      session.adminSessionToken = token.adminSessionToken ?? null;

      if (token.role === "ADMIN" && token.adminSessionToken) {
        const adminSession = await prisma.adminSession.findUnique({
          where: { sessionToken: token.adminSessionToken },
        });
        if (!adminSession || adminSession.revokedAt) {
          session.revoked = true;
        } else {
          prisma.adminSession
            .update({ where: { id: adminSession.id }, data: { lastSeenAt: new Date() } })
            .catch(() => {});
        }
      }

      return session;
    },
  },
});
