import { requirePageRole } from "@/lib/permissions";
import { getStaffAssignment, getCoachAttendanceHistory } from "@/lib/data/coach";
import { markCoachAttendanceAction } from "@/lib/actions/coach-actions";
import { formatDate, formatDateTime, todayDateOnly } from "@/lib/date";
import {
  glassCard,
  glassPanelPad,
  heading,
  pillPrimarySm,
  tableWrap,
  tableHeadRow,
  tableHeadCell,
  tableRow,
  tableCell,
} from "@/lib/ui";

export default async function CoachMyAttendancePage() {
  const session = await requirePageRole(["COACH"]);
  const assignment = await getStaffAssignment(session.user.id);
  const history = await getCoachAttendanceHistory(assignment.id);
  const today = todayDateOnly();
  const markedToday = history.find((a) => a.date.getTime() === today.getTime());

  return (
    <div>
      <div className={`mb-6 ${glassCard} ${glassPanelPad}`}>
        <h2 className={heading}>Today</h2>
        {markedToday ? (
          <p className="mt-2 text-sm text-emerald-300">Marked present at {formatDateTime(markedToday.markedAt)}</p>
        ) : (
          <form action={markCoachAttendanceAction} className="mt-3">
            <button type="submit" className={pillPrimarySm}>
              Mark myself present
            </button>
          </form>
        )}
      </div>

      <h2 className={`mb-2 ${heading}`}>History</h2>
      <div className={tableWrap}>
        <table className="w-full text-left text-sm">
          <thead className={tableHeadRow}>
            <tr>
              <th className={tableHeadCell}>Date</th>
              <th className={tableHeadCell}>Marked At</th>
            </tr>
          </thead>
          <tbody>
            {history.map((a) => (
              <tr key={a.id} className={tableRow}>
                <td className={tableCell}>{formatDate(a.date)}</td>
                <td className={tableCell}>{formatDateTime(a.markedAt)}</td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-sm text-slate-400" colSpan={2}>
                  No attendance recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
