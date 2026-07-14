import "server-only";
import { prisma } from "@/lib/prisma";

export async function getAttendanceDay(sportId: string, date: Date) {
  return prisma.attendanceDay.findUnique({
    where: { sportId_date: { sportId, date } },
  });
}

/**
 * One row per camp session (CampTiming) for a sport, most recent first, each annotated with how many
 * players were marked present and whether the day has been closed. Powers the "recent days" summary
 * shown alongside the day-detail roster view.
 */
export async function getAttendanceDayHistory(sportId: string, limit = 14) {
  const [timings, totalApproved] = await Promise.all([
    prisma.campTiming.findMany({
      where: { sportId },
      orderBy: { date: "desc" },
      take: limit,
    }),
    prisma.enrollment.count({ where: { sportId, status: "APPROVED" } }),
  ]);

  const closedDays = await prisma.attendanceDay.findMany({
    where: { sportId, date: { in: timings.map((t) => t.date) } },
  });
  const closedByDate = new Map(closedDays.map((d) => [d.date.getTime(), d.closedAt]));

  return Promise.all(
    timings.map(async (timing) => {
      const present = await prisma.attendance.count({
        where: { campTimingId: timing.id, status: "PRESENT" },
      });
      return {
        date: timing.date,
        present,
        total: totalApproved,
        closedAt: closedByDate.get(timing.date.getTime()) ?? null,
      };
    })
  );
}
