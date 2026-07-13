import { requirePageRole } from "@/lib/permissions";
import { getStaffAccounts, getAllSportsForForm } from "@/lib/data/admin";
import { CreateStaffForm } from "@/components/admin/CreateStaffForm";
import { glassCard, glassPanelPad, heading, tableWrap, tableHeadRow, tableHeadCell, tableRow, tableCell } from "@/lib/ui";

export default async function AdminStaffPage() {
  await requirePageRole(["ADMIN"]);
  const [staff, sports] = await Promise.all([getStaffAccounts(), getAllSportsForForm()]);

  return (
    <div className="space-y-6">
      <div className={`${glassCard} ${glassPanelPad}`}>
        <h2 className={`mb-3 ${heading}`}>Create Staff Account</h2>
        <CreateStaffForm sports={sports} />
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
