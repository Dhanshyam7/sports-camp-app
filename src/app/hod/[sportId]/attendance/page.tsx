import { requirePageRole } from "@/lib/permissions";
import { getRosterAttendance } from "@/lib/data/coach";
import { getExactTodayTiming } from "@/lib/data/sport";
import { getAttendanceWindow } from "@/lib/attendance";
import { EditableRoster } from "@/components/attendance/EditableRoster";
import { heading } from "@/lib/ui";

export default async function HodAttendancePage({ params }: { params: Promise<{ sportId: string }> }) {
  await requirePageRole(["HOD"]);
  const { sportId } = await params;
  const roster = await getRosterAttendance(sportId);
  const timing = await getExactTodayTiming(sportId);
  const window = getAttendanceWindow(timing);

  return (
    <div>
      <h2 className={`mb-3 ${heading}`}>Today&apos;s Attendance</h2>
      <EditableRoster sportId={sportId} roster={roster} window={window} />
    </div>
  );
}
