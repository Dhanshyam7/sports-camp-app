import { requirePageRole } from "@/lib/permissions";
import { getStaffAssignment, getRosterAttendance } from "@/lib/data/coach";
import { getExactTodayTiming } from "@/lib/data/sport";
import { getAttendanceWindow } from "@/lib/attendance";
import { EditableRoster } from "@/components/attendance/EditableRoster";
import { heading } from "@/lib/ui";

export default async function CoordinatorAttendancePage() {
  const session = await requirePageRole(["COORDINATOR"]);
  const assignment = await getStaffAssignment(session.user.id);
  const roster = await getRosterAttendance(assignment.sportId);
  const timing = await getExactTodayTiming(assignment.sportId);
  const window = getAttendanceWindow(timing);

  return (
    <div>
      <h2 className={`mb-3 ${heading}`}>Mark Today&apos;s Attendance</h2>
      <EditableRoster sportId={assignment.sportId} roster={roster} window={window} />
    </div>
  );
}
