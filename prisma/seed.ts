import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const SPORTS = [
  "Football",
  "Cricket",
  "Basketball",
  "Volleyball",
  "Kho-Kho",
  "Handball",
  "Badminton",
  "Table Tennis",
  "Chess",
  "Athletics",
  "Netball",
  "Tug of War",
];

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const DEFAULT_PASSWORD = "ChangeMe@123";

async function main() {
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  const sports = await Promise.all(
    SPORTS.map((name) =>
      prisma.sport.upsert({
        where: { name },
        update: {},
        create: { name, slug: slugify(name) },
      })
    )
  );

  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      name: "App Admin",
      username: "admin",
      email: "admin@sportscamp.college",
      passwordHash,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { username: "hod" },
    update: {},
    create: {
      name: "PE HOD",
      username: "hod",
      email: "hod@sportscamp.college",
      passwordHash,
      role: "HOD",
    },
  });

  const football = sports.find((s) => s.name === "Football")!;

  const coach = await prisma.user.upsert({
    where: { username: "coach_football" },
    update: {},
    create: {
      name: "Football Coach",
      username: "coach_football",
      email: "coach.football@sportscamp.college",
      passwordHash,
      role: "COACH",
    },
  });
  await prisma.staffAssignment.upsert({
    where: { userId: coach.id },
    update: {},
    create: { userId: coach.id, sportId: football.id, role: "COACH" },
  });

  const coordinator = await prisma.user.upsert({
    where: { username: "coordinator_football" },
    update: {},
    create: {
      name: "Football Coordinator",
      username: "coordinator_football",
      email: "coordinator.football@sportscamp.college",
      passwordHash,
      role: "COORDINATOR",
    },
  });
  await prisma.staffAssignment.upsert({
    where: { userId: coordinator.id },
    update: {},
    create: { userId: coordinator.id, sportId: football.id, role: "COORDINATOR" },
  });

  const student = await prisma.user.upsert({
    where: { username: "student_demo" },
    update: {},
    create: {
      name: "Demo Student",
      username: "student_demo",
      email: "student.demo@sportscamp.college",
      passwordHash,
      role: "STUDENT",
    },
  });
  const studentProfile = await prisma.studentProfile.upsert({
    where: { userId: student.id },
    update: {},
    create: {
      userId: student.id,
      ktuId: "KTU2026CS001",
      semester: 5,
      department: "Computer Science",
      phone: "9999999999",
      dob: new Date("2004-06-15"),
    },
  });
  await prisma.enrollment.upsert({
    where: { studentProfileId_sportId: { studentProfileId: studentProfile.id, sportId: football.id } },
    update: {},
    create: {
      studentProfileId: studentProfile.id,
      sportId: football.id,
      status: "APPROVED",
      decidedById: coordinator.id,
      decidedAt: new Date(),
    },
  });

  console.log("Seed complete. Default password for all seeded accounts:", DEFAULT_PASSWORD);
  console.log("Usernames: admin, hod, coach_football, coordinator_football, student_demo");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
