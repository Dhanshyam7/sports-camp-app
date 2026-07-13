import { requirePageRole } from "@/lib/permissions";
import { getLoginStats, getSportLoginSummary } from "@/lib/data/admin";
import { formatDateTime } from "@/lib/date";

export default async function AdminStatsPage() {
  await requirePageRole(["ADMIN"]);
  const [userStats, sportStats] = await Promise.all([getLoginStats(), getSportLoginSummary()]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-3 font-medium text-slate-900">Logins by Sport</h2>
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-2">Sport</th>
                <th className="px-4 py-2">Players</th>
                <th className="px-4 py-2">Total Logins</th>
              </tr>
            </thead>
            <tbody>
              {sportStats.map((s) => (
                <tr key={s.id} className="border-t border-slate-100">
                  <td className="px-4 py-2">{s.name}</td>
                  <td className="px-4 py-2">{s.players}</td>
                  <td className="px-4 py-2">{s.totalLogins}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="mb-3 font-medium text-slate-900">Logins by User</h2>
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Sport(s)</th>
                <th className="px-4 py-2">Total Logins</th>
                <th className="px-4 py-2">Last Login</th>
              </tr>
            </thead>
            <tbody>
              {userStats.map((u) => (
                <tr key={u.id} className="border-t border-slate-100">
                  <td className="px-4 py-2">
                    {u.name}
                    <span className="block text-xs text-slate-400">
                      @{u.username} &middot; {u.email}
                    </span>
                  </td>
                  <td className="px-4 py-2">{u.role}</td>
                  <td className="px-4 py-2">{u.sportLabel}</td>
                  <td className="px-4 py-2">{u.loginCount}</td>
                  <td className="px-4 py-2">{u.lastLogin ? formatDateTime(u.lastLogin) : "Never"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
