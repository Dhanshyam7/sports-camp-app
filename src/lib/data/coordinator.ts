import "server-only";
import { prisma } from "@/lib/prisma";

export async function getPendingEnrollments(sportId: string) {
  return prisma.enrollment.findMany({
    where: { sportId, status: "PENDING" },
    include: { studentProfile: { include: { user: true } } },
    orderBy: { appliedAt: "asc" },
  });
}

export async function findStudentByIdentifier(identifier: string) {
  const trimmed = identifier.trim();
  const profile = await prisma.studentProfile.findFirst({
    where: {
      OR: [{ ktuId: trimmed }, { user: { email: trimmed } }],
    },
    include: { user: true },
  });
  return profile;
}
