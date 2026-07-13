import { requirePageRole } from "@/lib/permissions";
import { getStaffAssignment, getRosterAttendance } from "@/lib/data/coach";
import { EditableRoster } from "@/components/attendance/EditableRoster";

export default async function CoordinatorAttendancePage() {
  const session = await requirePageRole(["COORDINATOR"]);
  const assignment = await getStaffAssignment(session.user.id);
  const roster = await getRosterAttendance(assignment.sportId);

  return (
    <div>
      <h2 className="mb-3 font-medium text-slate-900">Mark Today&apos;s Attendance</h2>
      <EditableRoster sportId={assignment.sportId} roster={roster} />
    </div>
  );
}
