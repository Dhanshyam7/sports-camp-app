import { requirePageRole } from "@/lib/permissions";
import { getStaffAssignment, getCoachAttendanceHistory } from "@/lib/data/coach";
import { markCoachAttendanceAction } from "@/lib/actions/coach-actions";
import { formatDate, formatDateTime, todayDateOnly } from "@/lib/date";

export default async function CoachMyAttendancePage() {
  const session = await requirePageRole(["COACH"]);
  const assignment = await getStaffAssignment(session.user.id);
  const history = await getCoachAttendanceHistory(assignment.id);
  const today = todayDateOnly();
  const markedToday = history.find((a) => a.date.getTime() === today.getTime());

  return (
    <div>
      <div className="mb-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="font-medium text-slate-900">Today</h2>
        {markedToday ? (
          <p className="mt-2 text-sm text-green-700">Marked present at {formatDateTime(markedToday.markedAt)}</p>
        ) : (
          <form action={markCoachAttendanceAction} className="mt-2">
            <button
              type="submit"
              className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
            >
              Mark myself present
            </button>
          </form>
        )}
      </div>

      <h2 className="mb-2 font-medium text-slate-900">History</h2>
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Marked At</th>
            </tr>
          </thead>
          <tbody>
            {history.map((a) => (
              <tr key={a.id} className="border-t border-slate-100">
                <td className="px-4 py-2">{formatDate(a.date)}</td>
                <td className="px-4 py-2">{formatDateTime(a.markedAt)}</td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td className="px-4 py-3 text-slate-500" colSpan={2}>
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
