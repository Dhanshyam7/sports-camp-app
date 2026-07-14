import { requirePageRole } from "@/lib/permissions";
import { auth } from "@/lib/auth";
import { getAdminSessions, parseUserAgent } from "@/lib/data/admin-sessions";
import { forceLogoutSessionAction } from "@/lib/actions/session-actions";
import { ConfirmSubmitButton } from "@/components/ui/ConfirmSubmitButton";
import { formatDateTime } from "@/lib/date";
import {
  heading,
  mutedText,
  statusBadge,
  pillDanger,
  tableWrap,
  tableHeadRow,
  tableHeadCell,
  tableRow,
  tableCell,
} from "@/lib/ui";

export default async function AdminSessionsPage() {
  const session = await requirePageRole(["ADMIN"]);
  const sessions = await getAdminSessions(session.user.id);
  const currentToken = (await auth())?.adminSessionToken;

  return (
    <div>
      <h2 className={`mb-1 ${heading}`}>Active Sessions</h2>
      <p className={`mb-4 ${mutedText}`}>
        Every device currently signed in to your admin account. Force-logging out a device signs it out on
        its next page load.
      </p>
      <div className={tableWrap}>
        <table className="w-full text-left text-sm">
          <thead className={tableHeadRow}>
            <tr>
              <th className={tableHeadCell}>Device</th>
              <th className={tableHeadCell}>IP Address</th>
              <th className={tableHeadCell}>First Seen</th>
              <th className={tableHeadCell}>Last Seen</th>
              <th className={tableHeadCell}>Action</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.id} className={tableRow}>
                <td className={tableCell}>
                  {parseUserAgent(s.userAgent)}
                  {s.sessionToken === currentToken && (
                    <span className={`ml-2 ${statusBadge("success")}`}>This device</span>
                  )}
                </td>
                <td className={tableCell}>{s.ipAddress ?? "-"}</td>
                <td className={tableCell}>{formatDateTime(s.createdAt)}</td>
                <td className={tableCell}>{formatDateTime(s.lastSeenAt)}</td>
                <td className={tableCell}>
                  <form action={forceLogoutSessionAction}>
                    <input type="hidden" name="sessionId" value={s.id} />
                    <ConfirmSubmitButton
                      className={pillDanger}
                      confirmMessage="Force log out this session? It will be signed out on its next page load."
                    >
                      Force logout
                    </ConfirmSubmitButton>
                  </form>
                </td>
              </tr>
            ))}
            {sessions.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-sm text-slate-400" colSpan={5}>
                  No active sessions.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
