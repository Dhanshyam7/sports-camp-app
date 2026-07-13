import "server-only";
import { prisma } from "@/lib/prisma";

export async function getAllSports() {
  return prisma.sport.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { enrollments: { where: { status: "APPROVED" } } } } },
  });
}

export async function getSportRoster(sportId: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: { sportId, status: "APPROVED" },
    include: { studentProfile: { include: { user: true } } },
  });
  enrollments.sort((a, b) => a.studentProfile.user.name.localeCompare(b.studentProfile.user.name));
  return enrollments;
}
