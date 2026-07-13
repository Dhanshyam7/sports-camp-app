import { setTimingAction } from "@/lib/actions/coach-actions";
import { formatDate, toDateInputValue, todayDateOnly } from "@/lib/date";

type Timing = { id: string; date: Date; startTime: string; endTime: string };

export function TimingPanel({
  sportId,
  currentTiming,
  history,
}: {
  sportId: string;
  currentTiming: Timing | null;
  history: Timing[];
}) {
  const today = todayDateOnly();

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-1 font-medium text-slate-900">Current Timing</h2>
        {currentTiming ? (
          <>
            <p className="text-sm text-slate-500">As of {formatDate(currentTiming.date)}</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {currentTiming.startTime} &ndash; {currentTiming.endTime}
            </p>
          </>
        ) : (
          <p className="text-sm text-slate-500">No timing set yet.</p>
        )}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-medium text-slate-900">Set a Camp Timing</h2>
        <p className="mb-3 text-xs text-slate-500">
          Pick any date &mdash; today, a past date to correct it, or a future date to schedule ahead.
        </p>
        <form action={setTimingAction} className="flex flex-wrap items-end gap-3">
          <input type="hidden" name="sportId" value={sportId} />
          <div>
            <label className="block text-xs font-medium text-slate-500">Date</label>
            <input
              name="date"
              type="date"
              required
              defaultValue={toDateInputValue(today)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500">Start</label>
            <input name="startTime" type="time" required className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500">End</label>
            <input name="endTime" type="time" required className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <button
            type="submit"
            className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Save
          </button>
        </form>
      </div>

      <div>
        <h2 className="mb-2 font-medium text-slate-900">Timing History</h2>
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Start</th>
                <th className="px-4 py-2">End</th>
              </tr>
            </thead>
            <tbody>
              {history.map((t) => (
                <tr key={t.id} className="border-t border-slate-100">
                  <td className="px-4 py-2">
                    {formatDate(t.date)}
                    {t.date.getTime() === today.getTime() && (
                      <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                        Today
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2">{t.startTime}</td>
                  <td className="px-4 py-2">{t.endTime}</td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td className="px-4 py-3 text-slate-500" colSpan={3}>
                    No timings set yet.
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
