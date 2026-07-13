import { requirePageRole } from "@/lib/permissions";
import { getRosterAttendance } from "@/lib/data/coach";
import { EditableRoster } from "@/components/attendance/EditableRoster";

export default async function HodAttendancePage({ params }: { params: Promise<{ sportId: string }> }) {
  await requirePageRole(["HOD"]);
  const { sportId } = await params;
  const roster = await getRosterAttendance(sportId);

  return (
    <div>
      <h2 className="mb-3 font-medium text-slate-900">Today&apos;s Attendance</h2>
      <EditableRoster sportId={sportId} roster={roster} />
    </div>
  );
}
