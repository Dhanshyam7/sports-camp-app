import { redirect } from "next/navigation";
import { requirePageRole } from "@/lib/permissions";
import { getApprovedEnrollment } from "@/lib/data/student";
import { TabNav } from "@/components/layout/TabNav";

export default async function StudentSportLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ sportId: string }>;
}) {
  const session = await requirePageRole(["STUDENT"]);
  const { sportId } = await params;

  const enrollment = await getApprovedEnrollment(session.user.id, sportId);
  if (!enrollment || enrollment.status !== "APPROVED") {
    redirect("/student");
  }

  return (
    <div>
      <h1 className="mb-4 text-lg font-semibold text-slate-900">{enrollment.sport.name}</h1>
      <TabNav
        items={[
          { href: `/student/${sportId}/attendance`, label: "Attendance" },
          { href: `/student/${sportId}/drills`, label: "Drills" },
          { href: `/student/${sportId}/matches`, label: "Matches" },
          { href: `/student/${sportId}/timings`, label: "Camp Timing" },
        ]}
      />
      <div className="mt-4">{children}</div>
    </div>
  );
}
