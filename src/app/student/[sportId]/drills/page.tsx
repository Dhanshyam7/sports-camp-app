import { getApprovedEnrollment } from "@/lib/data/student";
import { getDrills } from "@/lib/data/sport";
import { requirePageRole } from "@/lib/permissions";
import { formatDate } from "@/lib/date";
import { glassCard, glassPanelPad, mutedText } from "@/lib/ui";

export default async function StudentDrillsPage({ params }: { params: Promise<{ sportId: string }> }) {
  const { sportId } = await params;
  const session = await requirePageRole(["STUDENT"]);
  const enrollment = await getApprovedEnrollment(session.user.id, sportId);
  if (!enrollment) return null;

  const drills = await getDrills(sportId);

  return (
    <div className="space-y-3">
      {drills.length === 0 && <p className={mutedText}>No drills posted yet.</p>}
      {drills.map((drill) => (
        <div key={drill.id} className={`${glassCard} ${glassPanelPad}`}>
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-white">{drill.title}</h3>
            <span className="text-xs text-slate-400">{formatDate(drill.createdAt)}</span>
          </div>
          <p className="mt-1 text-sm text-slate-300">{drill.description}</p>
          <p className="mt-2 text-xs text-slate-500">Assigned by {drill.coach.name}</p>
        </div>
      ))}
    </div>
  );
}
