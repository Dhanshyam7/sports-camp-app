"use server";

import { revalidatePath } from "next/cache";
import { requirePageSportScope } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { findStudentByIdentifier } from "@/lib/data/coordinator";
import { getTimingForDate } from "@/lib/data/sport";
import { todayDateOnly, parseDateOnly } from "@/lib/date";
import { getAttendanceWindow } from "@/lib/attendance";

export async function markRosterAttendanceAction(formData: FormData) {
  const sportId = String(formData.get("sportId") ?? "");
  const enrollmentId = String(formData.get("enrollmentId") ?? "");
  const status = String(formData.get("status") ?? "");
  const dateInput = String(formData.get("date") ?? "");
  const session = await requirePageSportScope(sportId, ["COORDINATOR", "HOD"]);

  if (status !== "PRESENT" && status !== "ABSENT") throw new Error("Invalid status");

  const enrollment = await prisma.enrollment.findUnique({ where: { id: enrollmentId } });
  if (!enrollment || enrollment.sportId !== sportId) throw new Error("Enrollment not found for this sport");

  const date = dateInput ? parseDateOnly(dateInput) : todayDateOnly();
  const timing = await getTimingForDate(sportId, date);
  const window = getAttendanceWindow(timing);
  if (!window.open) throw new Error(window.reason);

  const existing = await prisma.attendance.findUnique({
    where: { enrollmentId_date: { enrollmentId, date } },
  });

  if (existing) {
    await prisma.attendance.update({
      where: { id: existing.id },
      data: { status, editedAt: new Date(), editedById: session.user.id },
    });
  } else {
    await prisma.attendance.create({
      data: { enrollmentId, campTimingId: timing!.id, date, status, markedById: session.user.id },
    });
  }

  revalidatePath("/coordinator/attendance");
  revalidatePath(`/hod/${sportId}/attendance`);
}

export async function closeAttendanceDayAction(formData: FormData) {
  const sportId = String(formData.get("sportId") ?? "");
  const dateInput = String(formData.get("date") ?? "");
  const session = await requirePageSportScope(sportId, ["COORDINATOR", "HOD"]);

  const date = dateInput ? parseDateOnly(dateInput) : todayDateOnly();

  await prisma.attendanceDay.upsert({
    where: { sportId_date: { sportId, date } },
    update: { closedAt: new Date(), closedById: session.user.id },
    create: { sportId, date, closedAt: new Date(), closedById: session.user.id },
  });

  revalidatePath("/coordinator/attendance");
  revalidatePath(`/hod/${sportId}/attendance`);
}

export async function decideEnrollmentAction(formData: FormData) {
  const sportId = String(formData.get("sportId") ?? "");
  const enrollmentId = String(formData.get("enrollmentId") ?? "");
  const decision = String(formData.get("decision") ?? "");
  const session = await requirePageSportScope(sportId, ["COORDINATOR", "HOD"]);

  if (decision !== "APPROVED" && decision !== "REJECTED") throw new Error("Invalid decision");

  const enrollment = await prisma.enrollment.findUnique({ where: { id: enrollmentId } });
  if (!enrollment || enrollment.sportId !== sportId) throw new Error("Enrollment not found for this sport");

  await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: { status: decision, decidedById: session.user.id, decidedAt: new Date() },
  });

  revalidatePath("/coordinator/enrollments");
  revalidatePath(`/hod/${sportId}/enrollments`);
}

export async function addStudentDirectlyAction(formData: FormData) {
  const sportId = String(formData.get("sportId") ?? "");
  const identifier = String(formData.get("identifier") ?? "").trim();
  const session = await requirePageSportScope(sportId, ["COORDINATOR", "HOD"]);

  if (!identifier) throw new Error("Enter a KTU ID or email");

  const profile = await findStudentByIdentifier(identifier);
  if (!profile) throw new Error("No student found with that KTU ID or email");

  await prisma.enrollment.upsert({
    where: { studentProfileId_sportId: { studentProfileId: profile.id, sportId } },
    update: { status: "APPROVED", decidedById: session.user.id, decidedAt: new Date() },
    create: {
      studentProfileId: profile.id,
      sportId,
      status: "APPROVED",
      decidedById: session.user.id,
      decidedAt: new Date(),
    },
  });

  revalidatePath("/coordinator/enrollments");
  revalidatePath(`/hod/${sportId}/enrollments`);
}
