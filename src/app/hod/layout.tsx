import { requirePageRole } from "@/lib/permissions";
import { Topbar } from "@/components/layout/Topbar";
import { TabNav } from "@/components/layout/TabNav";

export default async function HodLayout({ children }: { children: React.ReactNode }) {
  const session = await requirePageRole(["HOD"]);

  return (
    <div className="min-h-screen">
      <Topbar name={session.user.name} role={session.user.role} subtitle="All sports" />
      <TabNav
        items={[
          { href: "/hod", label: "Sports Overview" },
          { href: "/hod/sports", label: "Manage Sports" },
          { href: "/hod/players", label: "Manage Players" },
          { href: "/hod/staff", label: "Manage Staff" },
        ]}
      />
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
