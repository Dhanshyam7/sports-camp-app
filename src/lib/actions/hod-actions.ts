"use server";

import { revalidatePath } from "next/cache";
import { requirePageRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createSportAction(formData: FormData) {
  await requirePageRole(["HOD"]);
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Sport name is required");

  await prisma.sport.create({ data: { name, slug: slugify(name) } });
  revalidatePath("/hod/sports");
  revalidatePath("/hod");
}

export async function deleteSportAction(formData: FormData) {
  await requirePageRole(["HOD"]);
  const sportId = String(formData.get("sportId") ?? "");
  if (!sportId) throw new Error("Sport is required");

  await prisma.sport.delete({ where: { id: sportId } });
  revalidatePath("/hod/sports");
  revalidatePath("/hod");
}

export async function removeEnrollmentAction(formData: FormData) {
  await requirePageRole(["HOD"]);
  const enrollmentId = String(formData.get("enrollmentId") ?? "");
  const sportId = String(formData.get("sportId") ?? "");
  if (!enrollmentId) throw new Error("Enrollment is required");

  await prisma.enrollment.delete({ where: { id: enrollmentId } });
  revalidatePath("/hod/players");
  revalidatePath(`/hod/${sportId}/attendance`);
}
