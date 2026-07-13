import { requirePageRole } from "@/lib/permissions";
import { getStaffAssignment, getRosterAttendance } from "@/lib/data/coach";
import { formatDateTime } from "@/lib/date";

export default async function CoachAttendancePage() {
  const session = await requirePageRole(["COACH"]);
  const assignment = await getStaffAssignment(session.user.id);
  const roster = await getRosterAttendance(assignment.sportId);

  return (
    <div>
      <h2 className="mb-3 font-medium text-slate-900">Today&apos;s Roster</h2>
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-2">Student</th>
              <th className="px-4 py-2">KTU ID</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Marked At</th>
            </tr>
          </thead>
          <tbody>
            {roster.map((row) => (
              <tr key={row.enrollmentId} className="border-t border-slate-100">
                <td className="px-4 py-2">{row.studentName}</td>
                <td className="px-4 py-2">{row.ktuId}</td>
                <td className="px-4 py-2">
                  {row.attendance ? (
                    <span
                      className={
                        row.attendance.status === "PRESENT"
                          ? "text-green-700"
                          : "text-red-700"
                      }
                    >
                      {row.attendance.status}
                    </span>
                  ) : (
                    <span className="text-slate-400">Not marked</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  {row.attendance ? formatDateTime(row.attendance.markedAt) : "-"}
                </td>
              </tr>
            ))}
            {roster.length === 0 && (
              <tr>
                <td className="px-4 py-3 text-slate-500" colSpan={4}>
                  No approved players yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
