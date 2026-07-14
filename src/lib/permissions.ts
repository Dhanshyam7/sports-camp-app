import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { Role } from "@/generated/prisma/enums";

export class UnauthorizedError extends Error {}
export class ForbiddenError extends Error {}

const STAFF_ROLES: Role[] = ["COACH", "COORDINATOR"];

export function roleHome(role: Role) {
  switch (role) {
    case "STUDENT":
      return "/student";
    case "COACH":
      return "/coach";
    case "COORDINATOR":
      return "/coordinator";
    case "HOD":
      return "/hod";
    case "ADMIN":
      return "/admin";
  }
}

/** Page/layout use: redirects instead of throwing. */
export async function requireSession() {
  const session = await auth();
  if (!session?.user || session.revoked) redirect("/login");
  return session;
}

export async function requirePageRole(roles: Role[]) {
  const session = await requireSession();
  if (!roles.includes(session.user.role)) redirect(roleHome(session.user.role));
  return session;
}

export async function requirePageSportScope(sportId: string, roles: Role[]) {
  const session = await requirePageRole(roles);
  if (STAFF_ROLES.includes(session.user.role) && session.user.sportId !== sportId) {
    redirect(roleHome(session.user.role));
  }
  return session;
}

/** API route use: throws typed errors mapped to status codes by apiErrorResponse(). */
export async function requireApiSession() {
  const session = await auth();
  if (!session?.user || session.revoked) throw new UnauthorizedError("Not signed in");
  return session;
}

export async function requireApiRole(roles: Role[]) {
  const session = await requireApiSession();
  if (!roles.includes(session.user.role)) throw new ForbiddenError("Role not permitted");
  return session;
}

export async function requireApiSportScope(sportId: string, roles: Role[]) {
  const session = await requireApiRole(roles);
  if (STAFF_ROLES.includes(session.user.role) && session.user.sportId !== sportId) {
    throw new ForbiddenError("Not your sport");
  }
  return session;
}
