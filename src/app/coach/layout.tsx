import { requirePageRole } from "@/lib/permissions";
import { getStaffAssignment } from "@/lib/data/coach";
import { Topbar } from "@/components/layout/Topbar";
import { TabNav } from "@/components/layout/TabNav";

export default async function CoachLayout({ children }: { children: React.ReactNode }) {
  const session = await requirePageRole(["COACH"]);
  const assignment = await getStaffAssignment(session.user.id);

  return (
    <div className="min-h-screen">
      <Topbar name={session.user.name} role={session.user.role} subtitle={assignment.sport.name} />
      <TabNav
        items={[
          { href: "/coach/attendance", label: "Player Attendance" },
          { href: "/coach/drills", label: "Drills" },
          { href: "/coach/matches", label: "Matches" },
          { href: "/coach/timings", label: "Camp Timing" },
          { href: "/coach/my-attendance", label: "My Attendance" },
        ]}
      />
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
