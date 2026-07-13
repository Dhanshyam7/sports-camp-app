import Link from "next/link";
import { requirePageRole } from "@/lib/permissions";
import { getAllSports } from "@/lib/data/hod";

export default async function HodOverviewPage() {
  await requirePageRole(["HOD"]);
  const sports = await getAllSports();

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-slate-900">Sports Overview</h1>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sports.map((sport) => (
          <Link
            key={sport.id}
            href={`/hod/${sport.id}/attendance`}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:border-slate-400"
          >
            <h2 className="font-medium text-slate-900">{sport.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{sport._count.enrollments} players</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
