import { requirePageRole } from "@/lib/permissions";
import { Topbar } from "@/components/layout/Topbar";
import { TabNav } from "@/components/layout/TabNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requirePageRole(["ADMIN"]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Topbar name={session.user.name} role={session.user.role} />
      <TabNav
        items={[
          { href: "/admin/stats", label: "Login Stats" },
          { href: "/admin/staff", label: "Staff Accounts" },
        ]}
      />
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
