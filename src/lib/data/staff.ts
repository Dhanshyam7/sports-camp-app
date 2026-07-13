import "server-only";
import { prisma } from "@/lib/prisma";

export async function getStaffAssignment(userId: string) {
  const assignment = await prisma.staffAssignment.findUnique({
    where: { userId },
    include: { sport: true },
  });
  if (!assignment) throw new Error("No sport assignment found for this account");
  return assignment;
}
