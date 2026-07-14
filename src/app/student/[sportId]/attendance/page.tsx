import { requirePageRole } from "@/lib/permissions";
import { getApprovedEnrollment, getAttendanceHistory, getPresentDaysCount } from "@/lib/data/student";
import { getExactTodayTiming } from "@/lib/data/sport";
import { getAttendanceDay } from "@/lib/data/attendance";
import { markOwnAttendanceAction } from "@/lib/actions/student-actions";
import { getAttendanceWindow } from "@/lib/attendance";
import { formatDate, formatDateTime, todayDateOnly } from "@/lib/date";
import {
  glassCard,
  glassPanelPad,
  heading,
  mutedText,
  pillPrimarySm,
  tableWrap,
  tableHeadRow,
  tableHeadCell,
  tableRow,
  tableCell,
  statusBadge,
} from "@/lib/ui";

export default async function StudentAttendancePage({ params }: { params: Promise<{ sportId: string }> }) {
  const { sportId } = await params;
  const session = await requirePageRole(["STUDENT"]);
  const enrollment = await getApprovedEnrollment(session.user.id, sportId);
  if (!enrollment) return null;

  const history = await getAttendanceHistory(enrollment.id);
  const today = todayDateOnly();
  const markedToday = history.find((a) => a.date.getTime() === today.getTime());
  const timing = await getExactTodayTiming(sportId);
  const window = getAttendanceWindow(timing);
  const [attendanceDay, presentDays] = await Promise.all([
    getAttendanceDay(sportId, today),
    getPresentDaysCount(enrollment.id),
  ]);
  const isClosed = !!attendanceDay?.closedAt;

  return (
    <div>
      <div className={`mb-4 ${glassCard} ${glassPanelPad}`}>
        <h2 className={heading}>Today&apos;s Attendance</h2>
        {markedToday ? (
          <p className="mt-2 text-sm text-emerald-300">
            Marked {markedToday.status} at {formatDateTime(markedToday.markedAt)}
          </p>
        ) : isClosed ? (
          <p className={`mt-2 ${mutedText}`}>Attendance for today has been closed by the coordinator.</p>
        ) : window.open ? (
          <form action={markOwnAttendanceAction} className="mt-3">
            <input type="hidden" name="sportId" value={sportId} />
            <button type="submit" className={pillPrimarySm}>
              Mark myself present
            </button>
          </form>
        ) : (
          <p className={`mt-2 ${mutedText}`}>{window.reason}</p>
        )}
      </div>

      <div className={`mb-4 ${glassCard} ${glassPanelPad}`}>
        <p className={mutedText}>Days attended</p>
        <p className="mt-1 text-2xl font-semibold text-white">{presentDays}</p>
      </div>

      <h2 className={`mb-2 ${heading}`}>History</h2>
      <div className={tableWrap}>
        <table className="w-full text-left text-sm">
          <thead className={tableHeadRow}>
            <tr>
              <th className={tableHeadCell}>Date</th>
              <th className={tableHeadCell}>Status</th>
              <th className={tableHeadCell}>Marked At</th>
            </tr>
          </thead>
          <tbody>
            {history.map((a) => (
              <tr key={a.id} className={tableRow}>
                <td className={tableCell}>{formatDate(a.date)}</td>
                <td className={tableCell}>
                  <span className={statusBadge(a.status === "PRESENT" ? "success" : "danger")}>{a.status}</span>
                </td>
                <td className={tableCell}>{formatDateTime(a.markedAt)}</td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-sm text-slate-400" colSpan={3}>
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
