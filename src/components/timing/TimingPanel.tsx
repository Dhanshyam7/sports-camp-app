import { setTimingAction } from "@/lib/actions/coach-actions";
import { formatDate, toDateInputValue, todayDateOnly } from "@/lib/date";
import {
  glassCard,
  glassPanelPad,
  heading,
  mutedText,
  inputClass,
  label,
  pillPrimary,
  statusBadge,
  tableWrap,
  tableHeadRow,
  tableHeadCell,
  tableRow,
  tableCell,
} from "@/lib/ui";

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
      <div className={`${glassCard} ${glassPanelPad}`}>
        <h2 className={`mb-1 ${heading}`}>Current Timing</h2>
        {currentTiming ? (
          <>
            <p className={mutedText}>As of {formatDate(currentTiming.date)}</p>
            <p className="mt-1 text-2xl font-semibold text-white">
              {currentTiming.startTime} &ndash; {currentTiming.endTime}
            </p>
          </>
        ) : (
          <p className={mutedText}>No timing set yet.</p>
        )}
      </div>

      <div className={`${glassCard} ${glassPanelPad}`}>
        <h2 className={`mb-1 ${heading}`}>Set a Camp Timing</h2>
        <p className="mb-4 text-xs text-slate-400">
          Pick any date &mdash; today, a past date to correct it, or a future date to schedule ahead.
        </p>
        <form action={setTimingAction} className="flex flex-wrap items-end gap-3">
          <input type="hidden" name="sportId" value={sportId} />
          <div>
            <label className={label}>Date</label>
            <input
              name="date"
              type="date"
              required
              defaultValue={toDateInputValue(today)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={label}>Start</label>
            <input name="startTime" type="time" required className={inputClass} />
          </div>
          <div>
            <label className={label}>End</label>
            <input name="endTime" type="time" required className={inputClass} />
          </div>
          <button type="submit" className={pillPrimary}>
            Save
          </button>
        </form>
      </div>

      <div>
        <h2 className={`mb-2 ${heading}`}>Timing History</h2>
        <div className={tableWrap}>
          <table className="w-full text-left text-sm">
            <thead className={tableHeadRow}>
              <tr>
                <th className={tableHeadCell}>Date</th>
                <th className={tableHeadCell}>Start</th>
                <th className={tableHeadCell}>End</th>
              </tr>
            </thead>
            <tbody>
              {history.map((t) => (
                <tr key={t.id} className={tableRow}>
                  <td className={tableCell}>
                    {formatDate(t.date)}
                    {t.date.getTime() === today.getTime() && (
                      <span className={`ml-2 ${statusBadge("success")}`}>Today</span>
                    )}
                  </td>
                  <td className={tableCell}>{t.startTime}</td>
                  <td className={tableCell}>{t.endTime}</td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td className="px-4 py-4 text-sm text-slate-400" colSpan={3}>
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
