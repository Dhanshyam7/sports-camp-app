import { markRosterAttendanceAction } from "@/lib/actions/coordinator-actions";
import { formatDateTime } from "@/lib/date";

type RosterRow = {
  enrollmentId: string;
  studentName: string;
  ktuId: string;
  attendance: { status: string; markedAt: Date; editedAt: Date | null } | null;
};

export function EditableRoster({ sportId, roster }: { sportId: string; roster: RosterRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-2">Student</th>
            <th className="px-4 py-2">KTU ID</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Timestamp</th>
            <th className="px-4 py-2">Mark</th>
          </tr>
        </thead>
        <tbody>
          {roster.map((row) => (
            <tr key={row.enrollmentId} className="border-t border-slate-100">
              <td className="px-4 py-2">{row.studentName}</td>
              <td className="px-4 py-2">{row.ktuId}</td>
              <td className="px-4 py-2">
                {row.attendance ? (
                  <span className={row.attendance.status === "PRESENT" ? "text-green-700" : "text-red-700"}>
                    {row.attendance.status}
                  </span>
                ) : (
                  <span className="text-slate-400">Not marked</span>
                )}
              </td>
              <td className="px-4 py-2 text-xs text-slate-500">
                {row.attendance
                  ? `${formatDateTime(row.attendance.editedAt ?? row.attendance.markedAt)}${
                      row.attendance.editedAt ? " (edited)" : ""
                    }`
                  : "-"}
              </td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <form action={markRosterAttendanceAction}>
                    <input type="hidden" name="sportId" value={sportId} />
                    <input type="hidden" name="enrollmentId" value={row.enrollmentId} />
                    <input type="hidden" name="status" value="PRESENT" />
                    <button
                      type="submit"
                      className="rounded-md border border-green-300 bg-green-50 px-2 py-1 text-xs font-medium text-green-800 hover:bg-green-100"
                    >
                      Present
                    </button>
                  </form>
                  <form action={markRosterAttendanceAction}>
                    <input type="hidden" name="sportId" value={sportId} />
                    <input type="hidden" name="enrollmentId" value={row.enrollmentId} />
                    <input type="hidden" name="status" value="ABSENT" />
                    <button
                      type="submit"
                      className="rounded-md border border-red-300 bg-red-50 px-2 py-1 text-xs font-medium text-red-800 hover:bg-red-100"
                    >
                      Absent
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
          {roster.length === 0 && (
            <tr>
              <td className="px-4 py-3 text-slate-500" colSpan={5}>
                No approved players yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
