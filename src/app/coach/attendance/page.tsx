import Link from "next/link";
import { requirePageRole } from "@/lib/permissions";
import { getStaffAssignment, getRosterAttendance } from "@/lib/data/coach";
import { getAttendanceDay, getAttendanceDayHistory } from "@/lib/data/attendance";
import { AttendanceDatePicker } from "@/components/attendance/AttendanceDatePicker";
import { parseDateOnly, todayDateOnly, formatDate, formatDateTime, toDateInputValue } from "@/lib/date";
import {
  heading,
  mutedText,
  glassCard,
  glassPanelPad,
  statusBadge,
  tableWrap,
  tableHeadRow,
  tableHeadCell,
  tableRow,
  tableCell,
} from "@/lib/ui";

export default async function CoachAttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const session = await requirePageRole(["COACH"]);
  const { date: dateParam } = await searchParams;
  const assignment = await getStaffAssignment(session.user.id);
  const date = dateParam ? parseDateOnly(dateParam) : todayDateOnly();

  const [roster, attendanceDay, history] = await Promise.all([
    getRosterAttendance(assignment.sportId, date),
    getAttendanceDay(assignment.sportId, date),
    getAttendanceDayHistory(assignment.sportId),
  ]);
  const presentCount = roster.filter((r) => r.attendance?.status === "PRESENT").length;
  const isClosed = !!attendanceDay?.closedAt;

  return (
    <div className="space-y-6">
      <div className={`${glassCard} ${glassPanelPad}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className={heading}>Roster for {formatDate(date)}</h2>
            <p className={mutedText}>
              {presentCount} of {roster.length} present
              {isClosed && <span className={`ml-2 ${statusBadge("neutral")}`}>Closed</span>}
            </p>
          </div>
          <AttendanceDatePicker date={date} basePath="/coach/attendance" />
        </div>
      </div>

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

      <div>
        <h2 className={`mb-2 ${heading}`}>Recent Days</h2>
        <div className={tableWrap}>
          <table className="w-full text-left text-sm">
            <thead className={tableHeadRow}>
              <tr>
                <th className={tableHeadCell}>Date</th>
                <th className={tableHeadCell}>Present</th>
                <th className={tableHeadCell}>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((day) => (
                <tr key={day.date.toISOString()} className={tableRow}>
                  <td className={tableCell}>
                    <Link
                      href={`/coach/attendance?date=${toDateInputValue(day.date)}`}
                      className="underline underline-offset-4 hover:text-white"
                    >
                      {formatDate(day.date)}
                    </Link>
                  </td>
                  <td className={tableCell}>
                    {day.present} of {day.total}
                  </td>
                  <td className={tableCell}>
                    <span className={statusBadge(day.closedAt ? "neutral" : "success")}>
                      {day.closedAt ? "Closed" : "Open"}
                    </span>
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td className="px-4 py-4 text-sm text-slate-400" colSpan={3}>
                    No camp days recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
