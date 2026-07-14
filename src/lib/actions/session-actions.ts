"use server";

import { revalidatePath } from "next/cache";
import { requirePageRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export async function forceLogoutSessionAction(formData: FormData) {
  const session = await requirePageRole(["ADMIN"]);
  const sessionId = String(formData.get("sessionId") ?? "");
  if (!sessionId) throw new Error("Session is required");

  const target = await prisma.adminSession.findUnique({ where: { id: sessionId } });
  if (!target || target.userId !== session.user.id) {
    throw new Error("You can only manage your own sessions");
  }

  await prisma.adminSession.update({ where: { id: sessionId }, data: { revokedAt: new Date() } });

  revalidatePath("/admin/sessions");
}
