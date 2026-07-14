import Link from "next/link";
import { requirePageRole } from "@/lib/permissions";
import { getRosterAttendance } from "@/lib/data/coach";
import { getTimingForDate } from "@/lib/data/sport";
import { getAttendanceDay, getAttendanceDayHistory } from "@/lib/data/attendance";
import { getAttendanceWindow } from "@/lib/attendance";
import { closeAttendanceDayAction } from "@/lib/actions/coordinator-actions";
import { EditableRoster } from "@/components/attendance/EditableRoster";
import { AttendanceDatePicker } from "@/components/attendance/AttendanceDatePicker";
import { ConfirmSubmitButton } from "@/components/ui/ConfirmSubmitButton";
import { parseDateOnly, todayDateOnly, formatDate, toDateInputValue } from "@/lib/date";
import { heading, mutedText, glassCard, glassPanelPad, statusBadge, pillDanger, tableWrap, tableHeadRow, tableHeadCell, tableRow, tableCell } from "@/lib/ui";

export default async function HodAttendancePage({
  params,
  searchParams,
}: {
  params: Promise<{ sportId: string }>;
  searchParams: Promise<{ date?: string }>;
}) {
  await requirePageRole(["HOD"]);
  const { sportId } = await params;
  const { date: dateParam } = await searchParams;
  const date = dateParam ? parseDateOnly(dateParam) : todayDateOnly();

  const [roster, timing, attendanceDay, history] = await Promise.all([
    getRosterAttendance(sportId, date),
    getTimingForDate(sportId, date),
    getAttendanceDay(sportId, date),
    getAttendanceDayHistory(sportId),
  ]);
  const window = getAttendanceWindow(timing);
  const presentCount = roster.filter((r) => r.attendance?.status === "PRESENT").length;
  const isClosed = !!attendanceDay?.closedAt;

  return (
    <div className="space-y-6">
      <div className={`${glassCard} ${glassPanelPad}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className={heading}>Attendance for {formatDate(date)}</h2>
            <p className={mutedText}>
              {presentCount} of {roster.length} present
              {isClosed && <span className={`ml-2 ${statusBadge("neutral")}`}>Closed</span>}
            </p>
          </div>
          <AttendanceDatePicker date={date} basePath={`/hod/${sportId}/attendance`} />
        </div>
      </div>

      <EditableRoster sportId={sportId} date={date} roster={roster} window={window} />

      <div className={`${glassCard} ${glassPanelPad}`}>
        {isClosed ? (
          <p className={mutedText}>This day is closed to student self-marking. You can still edit it above.</p>
        ) : (
          <form action={closeAttendanceDayAction}>
            <input type="hidden" name="sportId" value={sportId} />
            <input type="hidden" name="date" value={toDateInputValue(date)} />
            <ConfirmSubmitButton
              className={pillDanger}
              confirmMessage={`Close attendance for ${formatDate(date)}? Students will no longer be able to mark themselves present for this day.`}
            >
              Close attendance for this day
            </ConfirmSubmitButton>
          </form>
        )}
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
                      href={`/hod/${sportId}/attendance?date=${toDateInputValue(day.date)}`}
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
