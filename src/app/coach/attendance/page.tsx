import { requirePageRole } from "@/lib/permissions";
import { getStaffAssignment, getRosterAttendance } from "@/lib/data/coach";
import { formatDateTime } from "@/lib/date";
import {
  heading,
  tableWrap,
  tableHeadRow,
  tableHeadCell,
  tableRow,
  tableCell,
  statusBadge,
} from "@/lib/ui";

export default async function CoachAttendancePage() {
  const session = await requirePageRole(["COACH"]);
  const assignment = await getStaffAssignment(session.user.id);
  const roster = await getRosterAttendance(assignment.sportId);

  return (
    <div>
      <h2 className={`mb-3 ${heading}`}>Today&apos;s Roster</h2>
      <div className={tableWrap}>
        <table className="w-full text-left text-sm">
          <thead className={tableHeadRow}>
            <tr>
              <th className={tableHeadCell}>Student</th>
              <th className={tableHeadCell}>KTU ID</th>
              <th className={tableHeadCell}>Status</th>
              <th className={tableHeadCell}>Marked At</th>
            </tr>
          </thead>
          <tbody>
            {roster.map((row) => (
              <tr key={row.enrollmentId} className={tableRow}>
                <td className={tableCell}>{row.studentName}</td>
                <td className={tableCell}>{row.ktuId}</td>
                <td className={tableCell}>
                  {row.attendance ? (
                    <span className={statusBadge(row.attendance.status === "PRESENT" ? "success" : "danger")}>
                      {row.attendance.status}
                    </span>
                  ) : (
                    <span className={statusBadge("neutral")}>Not marked</span>
                  )}
                </td>
                <td className={tableCell}>{row.attendance ? formatDateTime(row.attendance.markedAt) : "-"}</td>
              </tr>
            ))}
            {roster.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-sm text-slate-400" colSpan={4}>
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
