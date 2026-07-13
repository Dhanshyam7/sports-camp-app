"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { requirePageRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

const CreateStaffSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .max(20, "Username must be at most 20 characters.")
    .regex(/^[a-zA-Z0-9_.]+$/, "Only letters, numbers, dots, and underscores are allowed."),
  email: z.string().trim().email("Enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  role: z.enum(["COACH", "COORDINATOR", "HOD"]),
  sportId: z.string().optional(),
});

export type CreateStaffState = { error?: string; success?: boolean } | undefined;

export async function createStaffAccountAction(
  _prevState: CreateStaffState,
  formData: FormData
): Promise<CreateStaffState> {
  const session = await requirePageRole(["ADMIN", "HOD"]);

  const parsed = CreateStaffSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { name, username, email, password, role, sportId } = parsed.data;

  if (session.user.role === "HOD" && role === "HOD") {
    return { error: "Only an Admin can create another HOD account." };
  }
  if ((role === "COACH" || role === "COORDINATOR") && !sportId) {
    return { error: "Select a sport for this role" };
  }

  const [existingUsername, existingEmail] = await Promise.all([
    prisma.user.findUnique({ where: { username } }),
    prisma.user.findUnique({ where: { email } }),
  ]);
  if (existingUsername) return { error: "This username is already taken. Please choose a different one." };
  if (existingEmail) return { error: "An account with this email already exists." };

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      username,
      email,
      passwordHash,
      role,
      staffAssignment:
        role === "HOD" ? undefined : { create: { sportId: sportId!, role } },
    },
  });

  revalidatePath("/admin/staff");
  revalidatePath("/hod/staff");
  return { success: true };
}

const ResetPasswordSchema = z.object({
  identifier: z.string().trim().min(1, "Enter a username or email."),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[a-zA-Z]/, "Password must contain a letter.")
    .regex(/[0-9]/, "Password must contain a number."),
});

export type ResetPasswordState = { error?: string; success?: string } | undefined;

export async function adminResetPasswordAction(
  _prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  await requirePageRole(["ADMIN"]);

  const parsed = ResetPasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { identifier, newPassword } = parsed.data;
  const user = await prisma.user.findFirst({
    where: { OR: [{ username: identifier }, { email: identifier }] },
  });
  if (!user) return { error: "No account found with that username or email." };

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

  return { success: `Password updated for ${user.name} (@${user.username}).` };
}

export async function deleteStaffAccountAction(formData: FormData) {
  const session = await requirePageRole(["ADMIN", "HOD"]);
  const userId = String(formData.get("userId") ?? "");
  if (!userId) throw new Error("User is required");
  if (userId === session.user.id) throw new Error("You cannot delete your own account");

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target || !["COACH", "COORDINATOR", "HOD"].includes(target.role)) {
    throw new Error("Staff account not found");
  }
  if (session.user.role === "HOD" && target.role === "HOD") {
    throw new Error("Only an Admin can delete a HOD account");
  }

  await prisma.user.delete({ where: { id: userId } });

  revalidatePath("/admin/staff");
  revalidatePath("/hod/staff");
}

export async function deletePlayerAccountAction(formData: FormData) {
  await requirePageRole(["ADMIN", "HOD"]);

  const userId = String(formData.get("userId") ?? "").trim();
  const identifier = String(formData.get("identifier") ?? "").trim();

  let targetUserId = userId;
  if (!targetUserId) {
    if (!identifier) throw new Error("Enter a KTU ID, username, or email");
    const profile = await prisma.studentProfile.findFirst({
      where: {
        OR: [{ ktuId: identifier }, { user: { username: identifier } }, { user: { email: identifier } }],
      },
    });
    if (!profile) throw new Error("No student found with that KTU ID, username, or email");
    targetUserId = profile.userId;
  }

  const target = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!target || target.role !== "STUDENT") throw new Error("Student account not found");

  await prisma.user.delete({ where: { id: targetUserId } });

  revalidatePath("/hod/players");
  revalidatePath("/admin/players");
}
