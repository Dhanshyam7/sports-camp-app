import { requirePageRole } from "@/lib/permissions";
import { getLoginStats, getSportLoginSummary } from "@/lib/data/admin";
import { formatDateTime } from "@/lib/date";
import { heading, tableWrap, tableHeadRow, tableHeadCell, tableRow, tableCell } from "@/lib/ui";

export default async function AdminStatsPage() {
  await requirePageRole(["ADMIN"]);
  const [userStats, sportStats] = await Promise.all([getLoginStats(), getSportLoginSummary()]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className={`mb-3 ${heading}`}>Logins by Sport</h2>
        <div className={tableWrap}>
          <table className="w-full text-left text-sm">
            <thead className={tableHeadRow}>
              <tr>
                <th className={tableHeadCell}>Sport</th>
                <th className={tableHeadCell}>Players</th>
                <th className={tableHeadCell}>Total Logins</th>
              </tr>
            </thead>
            <tbody>
              {sportStats.map((s) => (
                <tr key={s.id} className={tableRow}>
                  <td className={tableCell}>{s.name}</td>
                  <td className={tableCell}>{s.players}</td>
                  <td className={tableCell}>{s.totalLogins}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className={`mb-3 ${heading}`}>Logins by User</h2>
        <div className={tableWrap}>
          <table className="w-full text-left text-sm">
            <thead className={tableHeadRow}>
              <tr>
                <th className={tableHeadCell}>Name</th>
                <th className={tableHeadCell}>Role</th>
                <th className={tableHeadCell}>Sport(s)</th>
                <th className={tableHeadCell}>Total Logins</th>
                <th className={tableHeadCell}>Last Login</th>
              </tr>
            </thead>
            <tbody>
              {userStats.map((u) => (
                <tr key={u.id} className={tableRow}>
                  <td className={tableCell}>
                    {u.name}
                    <span className="block text-xs text-slate-500">
                      @{u.username} &middot; {u.email}
                    </span>
                  </td>
                  <td className={tableCell}>{u.role}</td>
                  <td className={tableCell}>{u.sportLabel}</td>
                  <td className={tableCell}>{u.loginCount}</td>
                  <td className={tableCell}>{u.lastLogin ? formatDateTime(u.lastLogin) : "Never"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
