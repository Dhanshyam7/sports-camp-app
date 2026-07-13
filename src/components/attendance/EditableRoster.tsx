import { markRosterAttendanceAction } from "@/lib/actions/coordinator-actions";
import { formatDateTime } from "@/lib/date";
import { tableWrap, tableHeadRow, tableHeadCell, tableRow, tableCell, statusBadge, pillSuccess, pillDanger } from "@/lib/ui";

type RosterRow = {
  enrollmentId: string;
  studentName: string;
  ktuId: string;
  attendance: { status: string; markedAt: Date; editedAt: Date | null } | null;
};

export function EditableRoster({ sportId, roster }: { sportId: string; roster: RosterRow[] }) {
  return (
    <div className={tableWrap}>
      <table className="w-full text-left text-sm">
        <thead className={tableHeadRow}>
          <tr>
            <th className={tableHeadCell}>Student</th>
            <th className={tableHeadCell}>KTU ID</th>
            <th className={tableHeadCell}>Status</th>
            <th className={tableHeadCell}>Timestamp</th>
            <th className={tableHeadCell}>Mark</th>
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
              <td className="px-4 py-3 text-xs text-slate-400">
                {row.attendance
                  ? `${formatDateTime(row.attendance.editedAt ?? row.attendance.markedAt)}${
                      row.attendance.editedAt ? " (edited)" : ""
                    }`
                  : "-"}
              </td>
              <td className={tableCell}>
                <div className="flex gap-2">
                  <form action={markRosterAttendanceAction}>
                    <input type="hidden" name="sportId" value={sportId} />
                    <input type="hidden" name="enrollmentId" value={row.enrollmentId} />
                    <input type="hidden" name="status" value="PRESENT" />
                    <button type="submit" className={pillSuccess}>
                      Present
                    </button>
                  </form>
                  <form action={markRosterAttendanceAction}>
                    <input type="hidden" name="sportId" value={sportId} />
                    <input type="hidden" name="enrollmentId" value={row.enrollmentId} />
                    <input type="hidden" name="status" value="ABSENT" />
                    <button type="submit" className={pillDanger}>
                      Absent
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
          {roster.length === 0 && (
            <tr>
              <td className="px-4 py-4 text-sm text-slate-400" colSpan={5}>
                No approved players yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
