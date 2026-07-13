import { getApprovedEnrollment } from "@/lib/data/student";
import { getDrills } from "@/lib/data/sport";
import { requirePageRole } from "@/lib/permissions";
import { formatDate } from "@/lib/date";

export default async function StudentDrillsPage({ params }: { params: Promise<{ sportId: string }> }) {
  const { sportId } = await params;
  const session = await requirePageRole(["STUDENT"]);
  const enrollment = await getApprovedEnrollment(session.user.id, sportId);
  if (!enrollment) return null;

  const drills = await getDrills(sportId);

  return (
    <div className="space-y-3">
      {drills.length === 0 && <p className="text-sm text-slate-500">No drills posted yet.</p>}
      {drills.map((drill) => (
        <div key={drill.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-slate-900">{drill.title}</h3>
            <span className="text-xs text-slate-500">{formatDate(drill.createdAt)}</span>
          </div>
          <p className="mt-1 text-sm text-slate-600">{drill.description}</p>
          <p className="mt-2 text-xs text-slate-400">Assigned by {drill.coach.name}</p>
        </div>
      ))}
    </div>
  );
}
