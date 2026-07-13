import { requirePageRole } from "@/lib/permissions";
import { getRosterAttendance } from "@/lib/data/coach";
import { EditableRoster } from "@/components/attendance/EditableRoster";
import { heading } from "@/lib/ui";

export default async function HodAttendancePage({ params }: { params: Promise<{ sportId: string }> }) {
  await requirePageRole(["HOD"]);
  const { sportId } = await params;
  const roster = await getRosterAttendance(sportId);

  return (
    <div>
      <h2 className={`mb-3 ${heading}`}>Today&apos;s Attendance</h2>
      <EditableRoster sportId={sportId} roster={roster} />
    </div>
  );
}
