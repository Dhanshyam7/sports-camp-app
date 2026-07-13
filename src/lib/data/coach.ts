import "server-only";
import { prisma } from "@/lib/prisma";
import { todayDateOnly } from "@/lib/date";

export { getStaffAssignment } from "@/lib/data/staff";

export async function getRosterAttendance(sportId: string, date: Date = todayDateOnly()) {
  const enrollments = await prisma.enrollment.findMany({
    where: { sportId, status: "APPROVED" },
    include: {
      studentProfile: { include: { user: true } },
      attendance: { where: { date } },
    },
  });
  enrollments.sort((a, b) => a.studentProfile.user.name.localeCompare(b.studentProfile.user.name));

  return enrollments.map((e) => ({
    enrollmentId: e.id,
    studentName: e.studentProfile.user.name,
    ktuId: e.studentProfile.ktuId,
    attendance: e.attendance[0] ?? null,
  }));
}

export async function getCoachAttendanceHistory(staffAssignmentId: string) {
  return prisma.staffAttendance.findMany({
    where: { staffAssignmentId },
    orderBy: { date: "desc" },
    take: 30,
  });
}
