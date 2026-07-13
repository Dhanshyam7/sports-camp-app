import "server-only";
import { prisma } from "@/lib/prisma";

export async function getLoginStats() {
  const users = await prisma.user.findMany({
    include: {
      staffAssignment: { include: { sport: true } },
      studentProfile: {
        include: { enrollments: { where: { status: "APPROVED" }, include: { sport: true } } },
      },
      loginLogs: { orderBy: { timestamp: "desc" } },
    },
    orderBy: { name: "asc" },
  });

  return users.map((u) => ({
    id: u.id,
    name: u.name,
    username: u.username,
    email: u.email,
    role: u.role,
    sportLabel:
      u.staffAssignment?.sport.name ??
      u.studentProfile?.enrollments.map((e) => e.sport.name).join(", ") ??
      "-",
    loginCount: u.loginLogs.length,
    lastLogin: u.loginLogs[0]?.timestamp ?? null,
  }));
}

export async function getSportLoginSummary() {
  const sports = await prisma.sport.findMany({
    include: {
      enrollments: {
        where: { status: "APPROVED" },
        include: { studentProfile: { include: { user: { include: { loginLogs: true } } } } },
      },
      staffAssignments: { include: { user: { include: { loginLogs: true } } } },
    },
    orderBy: { name: "asc" },
  });

  return sports.map((sport) => {
    const studentLogins = sport.enrollments.reduce(
      (sum, e) => sum + e.studentProfile.user.loginLogs.length,
      0
    );
    const staffLogins = sport.staffAssignments.reduce((sum, sa) => sum + sa.user.loginLogs.length, 0);
    return {
      id: sport.id,
      name: sport.name,
      players: sport.enrollments.length,
      totalLogins: studentLogins + staffLogins,
    };
  });
}

export async function getStaffAccounts() {
  return prisma.user.findMany({
    where: { role: { in: ["COACH", "COORDINATOR", "HOD"] } },
    include: { staffAssignment: { include: { sport: true } } },
    orderBy: { name: "asc" },
  });
}

export async function getAllSportsForForm() {
  return prisma.sport.findMany({ orderBy: { name: "asc" } });
}
