import "server-only";
import { prisma } from "@/lib/prisma";

export async function getStudentProfileByUserId(userId: string) {
  const profile = await prisma.studentProfile.findUnique({ where: { userId } });
  if (!profile) throw new Error("Student profile not found");
  return profile;
}

export async function getEnrollments(userId: string) {
  const profile = await getStudentProfileByUserId(userId);
  return prisma.enrollment.findMany({
    where: { studentProfileId: profile.id },
    include: { sport: true },
    orderBy: { appliedAt: "desc" },
  });
}

export async function getApprovedEnrollment(userId: string, sportId: string) {
  const profile = await getStudentProfileByUserId(userId);
  return prisma.enrollment.findUnique({
    where: { studentProfileId_sportId: { studentProfileId: profile.id, sportId } },
    include: { sport: true },
  });
}

export async function getAttendanceHistory(enrollmentId: string) {
  return prisma.attendance.findMany({
    where: { enrollmentId },
    orderBy: { date: "desc" },
    take: 30,
  });
}

export async function getPresentDaysCount(enrollmentId: string) {
  return prisma.attendance.count({ where: { enrollmentId, status: "PRESENT" } });
}

export async function getJoinableSports(userId: string) {
  const profile = await getStudentProfileByUserId(userId);
  const [allSports, enrollments] = await Promise.all([
    prisma.sport.findMany({ orderBy: { name: "asc" } }),
    prisma.enrollment.findMany({ where: { studentProfileId: profile.id } }),
  ]);
  const takenSportIds = new Set(enrollments.map((e) => e.sportId));
  return allSports.filter((s) => !takenSportIds.has(s.id));
}
