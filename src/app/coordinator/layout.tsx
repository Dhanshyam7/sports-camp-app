import { requirePageRole } from "@/lib/permissions";
import { getStaffAssignment } from "@/lib/data/staff";
import { Topbar } from "@/components/layout/Topbar";
import { TabNav } from "@/components/layout/TabNav";

export default async function CoordinatorLayout({ children }: { children: React.ReactNode }) {
  const session = await requirePageRole(["COORDINATOR"]);
  const assignment = await getStaffAssignment(session.user.id);

  return (
    <div className="min-h-screen bg-slate-50">
      <Topbar name={session.user.name} role={session.user.role} subtitle={assignment.sport.name} />
      <TabNav
        items={[
          { href: "/coordinator/attendance", label: "Today's Attendance" },
          { href: "/coordinator/enrollments", label: "Enrollment Requests" },
        ]}
      />
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
