import "server-only";
import { prisma } from "@/lib/prisma";
import { todayDateOnly } from "@/lib/date";

export async function getDrills(sportId: string) {
  return prisma.drill.findMany({
    where: { sportId },
    orderBy: { createdAt: "desc" },
    include: { coach: true },
  });
}

export async function getUpcomingMatches(sportId: string) {
  return prisma.matchSchedule.findMany({
    where: { sportId, matchDate: { gte: new Date() } },
    orderBy: { matchDate: "asc" },
  });
}

export async function getAllMatches(sportId: string) {
  return prisma.matchSchedule.findMany({
    where: { sportId },
    orderBy: { matchDate: "desc" },
  });
}

export async function getTodayTiming(sportId: string) {
  const today = todayDateOnly();
  const timing = await prisma.campTiming.findUnique({
    where: { sportId_date: { sportId, date: today } },
  });
  if (timing) return timing;

  return prisma.campTiming.findFirst({
    where: { sportId },
    orderBy: { date: "desc" },
  });
}

/** The timing set for exactly today (IST) — no fallback to a prior date. Used to gate attendance marking. */
export async function getExactTodayTiming(sportId: string) {
  const today = todayDateOnly();
  return prisma.campTiming.findUnique({
    where: { sportId_date: { sportId, date: today } },
  });
}

export async function getTimingHistory(sportId: string) {
  return prisma.campTiming.findMany({
    where: { sportId },
    orderBy: { date: "desc" },
    take: 30,
  });
}

export async function getSportById(sportId: string) {
  return prisma.sport.findUnique({ where: { id: sportId } });
}
