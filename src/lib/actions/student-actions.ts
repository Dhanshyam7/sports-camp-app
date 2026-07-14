"use server";

import { revalidatePath } from "next/cache";
import { requirePageRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { getStudentProfileByUserId } from "@/lib/data/student";
import { getExactTodayTiming } from "@/lib/data/sport";
import { getAttendanceDay } from "@/lib/data/attendance";
import { todayDateOnly } from "@/lib/date";
import { getAttendanceWindow } from "@/lib/attendance";

export async function requestEnrollmentAction(formData: FormData) {
  const session = await requirePageRole(["STUDENT"]);
  const sportId = String(formData.get("sportId") ?? "");
  if (!sportId) throw new Error("Sport is required");

  const profile = await getStudentProfileByUserId(session.user.id);

  await prisma.enrollment.upsert({
    where: { studentProfileId_sportId: { studentProfileId: profile.id, sportId } },
    update: {},
    create: { studentProfileId: profile.id, sportId, status: "PENDING" },
  });

  revalidatePath("/student");
  revalidatePath("/student/join");
}

export async function markOwnAttendanceAction(formData: FormData) {
  const session = await requirePageRole(["STUDENT"]);
  const sportId = String(formData.get("sportId") ?? "");
  if (!sportId) throw new Error("Sport is required");

  const profile = await getStudentProfileByUserId(session.user.id);
  const enrollment = await prisma.enrollment.findUnique({
    where: { studentProfileId_sportId: { studentProfileId: profile.id, sportId } },
  });
  if (!enrollment || enrollment.status !== "APPROVED") {
    throw new Error("You are not an approved member of this sport");
  }

  const timing = await getExactTodayTiming(sportId);
  const window = getAttendanceWindow(timing);
  if (!window.open) throw new Error(window.reason);

  const date = todayDateOnly();
  const attendanceDay = await getAttendanceDay(sportId, date);
  if (attendanceDay?.closedAt) {
    throw new Error("Attendance for today has been closed by the coordinator.");
  }

  await prisma.attendance.upsert({
    where: { enrollmentId_date: { enrollmentId: enrollment.id, date } },
    update: {},
    create: {
      enrollmentId: enrollment.id,
      campTimingId: timing!.id,
      date,
      status: "PRESENT",
      markedById: session.user.id,
    },
  });

  revalidatePath(`/student/${sportId}/attendance`);
}
