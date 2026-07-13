import { requirePageRole } from "@/lib/permissions";
import { getStaffAccounts, getAllSportsForForm } from "@/lib/data/admin";
import { deleteStaffAccountAction } from "@/lib/actions/admin-actions";
import { CreateStaffForm } from "@/components/admin/CreateStaffForm";
import { ResetPasswordForm } from "@/components/admin/ResetPasswordForm";
import { ConfirmSubmitButton } from "@/components/ui/ConfirmSubmitButton";
import { glassCard, glassPanelPad, heading, mutedText, tableWrap, tableHeadRow, tableHeadCell, tableRow, tableCell, pillDanger } from "@/lib/ui";

export default async function AdminStaffPage() {
  const session = await requirePageRole(["ADMIN"]);
  const [staff, sports] = await Promise.all([getStaffAccounts(), getAllSportsForForm()]);

  return (
    <div className="space-y-6">
      <div className={`${glassCard} ${glassPanelPad}`}>
        <h2 className={`mb-3 ${heading}`}>Create Staff Account</h2>
        <CreateStaffForm sports={sports} />
      </div>

      <div className={`${glassCard} ${glassPanelPad}`}>
        <h2 className={`mb-1 ${heading}`}>Reset a User&apos;s Password</h2>
        <p className={`mb-3 ${mutedText}`}>
          Works for any account &mdash; student, coach, coordinator, HOD, or another admin.
        </p>
        <ResetPasswordForm />
      </div>

      <div>
        <h2 className={`mb-3 ${heading}`}>Existing Staff</h2>
        <div className={tableWrap}>
          <table className="w-full text-left text-sm">
            <thead className={tableHeadRow}>
              <tr>
                <th className={tableHeadCell}>Name</th>
                <th className={tableHeadCell}>Username</th>
                <th className={tableHeadCell}>Email</th>
                <th className={tableHeadCell}>Role</th>
                <th className={tableHeadCell}>Sport</th>
                <th className={tableHeadCell}>Delete</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.id} className={tableRow}>
                  <td className={tableCell}>{s.name}</td>
                  <td className={tableCell}>{s.username}</td>
                  <td className={tableCell}>{s.email}</td>
                  <td className={tableCell}>{s.role}</td>
                  <td className={tableCell}>{s.staffAssignment?.sport.name ?? "-"}</td>
                  <td className={tableCell}>
                    {s.id !== session.user.id && (
                      <form action={deleteStaffAccountAction}>
                        <input type="hidden" name="userId" value={s.id} />
                        <ConfirmSubmitButton
                          className={pillDanger}
                          confirmMessage={`Permanently delete ${s.name} (@${s.username})? This cannot be undone.`}
                        >
                          Delete
                        </ConfirmSubmitButton>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
