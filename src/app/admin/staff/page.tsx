import { requirePageRole } from "@/lib/permissions";
import { getStaffAccounts, getAllSportsForForm } from "@/lib/data/admin";
import { CreateStaffForm } from "@/components/admin/CreateStaffForm";

export default async function AdminStaffPage() {
  await requirePageRole(["ADMIN"]);
  const [staff, sports] = await Promise.all([getStaffAccounts(), getAllSportsForForm()]);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-medium text-slate-900">Create Staff Account</h2>
        <CreateStaffForm sports={sports} />
      </div>

      <div>
        <h2 className="mb-3 font-medium text-slate-900">Existing Staff</h2>
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Username</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Sport</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.id} className="border-t border-slate-100">
                  <td className="px-4 py-2">{s.name}</td>
                  <td className="px-4 py-2">{s.username}</td>
                  <td className="px-4 py-2">{s.email}</td>
                  <td className="px-4 py-2">{s.role}</td>
                  <td className="px-4 py-2">{s.staffAssignment?.sport.name ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
