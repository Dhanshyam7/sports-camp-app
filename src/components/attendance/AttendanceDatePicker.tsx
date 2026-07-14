import { toDateInputValue } from "@/lib/date";
import { inputClass, pillSecondary } from "@/lib/ui";

export function AttendanceDatePicker({ date, basePath }: { date: Date; basePath: string }) {
  return (
    <form method="GET" action={basePath} className="flex flex-wrap items-end gap-3">
      <div>
        <label className="block text-xs font-medium uppercase tracking-wide text-slate-300">Date</label>
        <input name="date" type="date" defaultValue={toDateInputValue(date)} className={inputClass} />
      </div>
      <button type="submit" className={pillSecondary}>
        View
      </button>
    </form>
  );
}
