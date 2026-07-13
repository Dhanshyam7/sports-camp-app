import { Role } from "@/generated/prisma/enums";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role: Role;
    sportId: string | null;
  }

  interface Session {
    user: {
      id: string;
      role: Role;
      sportId: string | null;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: Role;
    sportId: string | null;
  }
}
