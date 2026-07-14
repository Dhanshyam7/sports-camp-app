-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "campTimingId" TEXT;

-- CreateTable
CREATE TABLE "AttendanceDay" (
    "id" TEXT NOT NULL,
    "sportId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "closedAt" TIMESTAMP(3),
    "closedById" TEXT,

    CONSTRAINT "AttendanceDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "AdminSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceDay_sportId_date_key" ON "AttendanceDay"("sportId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "AdminSession_sessionToken_key" ON "AdminSession"("sessionToken");

-- CreateIndex
CREATE INDEX "AdminSession_userId_idx" ON "AdminSession"("userId");

-- CreateIndex
CREATE INDEX "Attendance_campTimingId_idx" ON "Attendance"("campTimingId");

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_campTimingId_fkey" FOREIGN KEY ("campTimingId") REFERENCES "CampTiming"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceDay" ADD CONSTRAINT "AttendanceDay_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "Sport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceDay" ADD CONSTRAINT "AttendanceDay_closedById_fkey" FOREIGN KEY ("closedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminSession" ADD CONSTRAINT "AdminSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DataMigration: backfill campTimingId by matching each attendance row's sport+date to its camp timing
UPDATE "Attendance" a
SET "campTimingId" = ct.id
FROM "CampTiming" ct, "Enrollment" e
WHERE a."enrollmentId" = e.id
  AND ct."sportId" = e."sportId"
  AND ct."date" = a."date";

-- DataMigration: drop any attendance rows that predate the camp-timing gating rule and have no matching session
DELETE FROM "Attendance" WHERE "campTimingId" IS NULL;

-- AlterTable: campTimingId is now backfilled for every remaining row
ALTER TABLE "Attendance" ALTER COLUMN "campTimingId" SET NOT NULL;
