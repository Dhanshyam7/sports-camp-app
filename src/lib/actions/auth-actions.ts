"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type LoginState = { error?: string } | undefined;

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  try {
    await signIn("credentials", { username, password, redirect: false });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid username or password." };
    }
    throw error;
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}

const RegisterSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .max(20, "Username must be at most 20 characters.")
    .regex(/^[a-zA-Z0-9_.]+$/, "Only letters, numbers, dots, and underscores are allowed."),
  email: z.string().trim().email("Enter a valid email."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[a-zA-Z]/, "Password must contain a letter.")
    .regex(/[0-9]/, "Password must contain a number."),
  ktuId: z.string().trim().min(3, "Enter a valid KTU ID."),
  semester: z.coerce.number().int().min(1).max(12),
  department: z.string().trim().min(2, "Enter a department."),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, "Enter a 10-digit phone number."),
  dob: z.coerce.date(),
});

export type RegisterState =
  | {
      error?: string;
      fieldErrors?: Partial<Record<keyof z.infer<typeof RegisterSchema>, string[]>>;
    }
  | undefined;

export async function registerAction(_prevState: RegisterState, formData: FormData): Promise<RegisterState> {
  const parsed = RegisterSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { name, username, email, password, ktuId, semester, department, phone, dob } = parsed.data;

  const [existingUsername, existingEmail, existingKtu] = await Promise.all([
    prisma.user.findUnique({ where: { username } }),
    prisma.user.findUnique({ where: { email } }),
    prisma.studentProfile.findUnique({ where: { ktuId } }),
  ]);
  if (existingUsername) {
    return { fieldErrors: { username: ["This username is already taken. Please choose a different one."] } };
  }
  if (existingEmail) return { error: "An account with this email already exists." };
  if (existingKtu) return { error: "An account with this KTU ID already exists." };

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      username,
      email,
      passwordHash,
      role: "STUDENT",
      studentProfile: {
        create: { ktuId, semester, department, phone, dob },
      },
    },
  });

  redirect("/login?registered=1");
}
