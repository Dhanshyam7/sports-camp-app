import Link from "next/link";
import { requirePageRole } from "@/lib/permissions";
import { getAllSports } from "@/lib/data/hod";
import { glassCard, glassPanelPad } from "@/lib/ui";

export default async function HodOverviewPage() {
  await requirePageRole(["HOD"]);
  const sports = await getAllSports();

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold tracking-tight text-white">Sports Overview</h1>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sports.map((sport) => (
          <Link
            key={sport.id}
            href={`/hod/${sport.id}/attendance`}
            className={`${glassCard} ${glassPanelPad} transition hover:border-white/25 hover:bg-white/[0.09]`}
          >
            <h2 className="font-medium text-white">{sport.name}</h2>
            <p className="mt-1 text-sm text-slate-400">{sport._count.enrollments} players</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
