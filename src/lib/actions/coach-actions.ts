"use server";

import { revalidatePath } from "next/cache";
import { requirePageRole, requirePageSportScope } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { getStaffAssignment } from "@/lib/data/staff";
import { todayDateOnly, parseDateOnly } from "@/lib/date";

export async function createDrillAction(formData: FormData) {
  const sportId = String(formData.get("sportId") ?? "");
  const session = await requirePageSportScope(sportId, ["COACH", "HOD"]);

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  if (!title || !description) throw new Error("Title and description are required");

  await prisma.drill.create({
    data: { sportId, coachId: session.user.id, title, description },
  });

  revalidatePath(`/coach/drills`);
  revalidatePath(`/hod/${sportId}/drills`);
}

export async function createMatchAction(formData: FormData) {
  const sportId = String(formData.get("sportId") ?? "");
  const session = await requirePageSportScope(sportId, ["COACH", "HOD"]);

  const opponent = String(formData.get("opponent") ?? "").trim();
  const matchDate = String(formData.get("matchDate") ?? "");
  const venue = String(formData.get("venue") ?? "").trim();
  if (!opponent || !matchDate || !venue) throw new Error("All match fields are required");

  await prisma.matchSchedule.create({
    data: {
      sportId,
      opponent,
      venue,
      matchDate: new Date(matchDate),
      createdById: session.user.id,
    },
  });

  revalidatePath(`/coach/matches`);
  revalidatePath(`/hod/${sportId}/matches`);
}

export async function setTimingAction(formData: FormData) {
  const sportId = String(formData.get("sportId") ?? "");
  const session = await requirePageSportScope(sportId, ["COACH", "HOD"]);

  const startTime = String(formData.get("startTime") ?? "");
  const endTime = String(formData.get("endTime") ?? "");
  const dateInput = String(formData.get("date") ?? "");
  if (!startTime || !endTime || !dateInput) throw new Error("Date, start and end time are required");

  const date = parseDateOnly(dateInput);
  await prisma.campTiming.upsert({
    where: { sportId_date: { sportId, date } },
    update: { startTime, endTime, setById: session.user.id },
    create: { sportId, date, startTime, endTime, setById: session.user.id },
  });

  revalidatePath(`/coach/timings`);
  revalidatePath(`/hod/${sportId}/timings`);
}

export async function markCoachAttendanceAction() {
  const session = await requirePageRole(["COACH"]);
  const assignment = await getStaffAssignment(session.user.id);

  const date = todayDateOnly();
  await prisma.staffAttendance.upsert({
    where: { staffAssignmentId_date: { staffAssignmentId: assignment.id, date } },
    update: {},
    create: { staffAssignmentId: assignment.id, date },
  });

  revalidatePath("/coach/my-attendance");
}
