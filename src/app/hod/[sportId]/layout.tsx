import { notFound } from "next/navigation";
import { requirePageRole } from "@/lib/permissions";
import { getSportById } from "@/lib/data/sport";
import { TabNav } from "@/components/layout/TabNav";

export default async function HodSportLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ sportId: string }>;
}) {
  await requirePageRole(["HOD"]);
  const { sportId } = await params;
  const sport = await getSportById(sportId);
  if (!sport) notFound();

  return (
    <div>
      <h1 className="mb-4 text-lg font-semibold tracking-tight text-white">{sport.name}</h1>
      <TabNav
        items={[
          { href: `/hod/${sportId}/attendance`, label: "Attendance" },
          { href: `/hod/${sportId}/enrollments`, label: "Enrollments" },
          { href: `/hod/${sportId}/drills`, label: "Drills" },
          { href: `/hod/${sportId}/matches`, label: "Matches" },
          { href: `/hod/${sportId}/timings`, label: "Camp Timing" },
        ]}
      />
      <div className="mt-4">{children}</div>
    </div>
  );
}
