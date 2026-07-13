import { nowISTMinutesOfDay, timeStringToMinutes } from "@/lib/date";

export type AttendanceWindow = { open: boolean; reason?: string };

/**
 * Attendance can only be marked once the coach has set today's camp timing,
 * and only from that timing's start time onward (IST).
 */
export function getAttendanceWindow(timing: { startTime: string } | null): AttendanceWindow {
  if (!timing) {
    return { open: false, reason: "The coach hasn't set today's camp timing yet." };
  }
  if (nowISTMinutesOfDay() < timeStringToMinutes(timing.startTime)) {
    return { open: false, reason: `Attendance opens at ${timing.startTime} (camp start time).` };
  }
  return { open: true };
}
