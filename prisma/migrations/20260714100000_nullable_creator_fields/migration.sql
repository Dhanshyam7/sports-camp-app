-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_markedById_fkey";

-- DropForeignKey
ALTER TABLE "CampTiming" DROP CONSTRAINT "CampTiming_setById_fkey";

-- DropForeignKey
ALTER TABLE "Drill" DROP CONSTRAINT "Drill_coachId_fkey";

-- DropForeignKey
ALTER TABLE "MatchSchedule" DROP CONSTRAINT "MatchSchedule_createdById_fkey";

-- AlterTable
ALTER TABLE "Attendance" ALTER COLUMN "markedById" DROP NOT NULL;

-- AlterTable
ALTER TABLE "CampTiming" ALTER COLUMN "setById" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Drill" ALTER COLUMN "coachId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "MatchSchedule" ALTER COLUMN "createdById" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_markedById_fkey" FOREIGN KEY ("markedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Drill" ADD CONSTRAINT "Drill_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchSchedule" ADD CONSTRAINT "MatchSchedule_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampTiming" ADD CONSTRAINT "CampTiming_setById_fkey" FOREIGN KEY ("setById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

