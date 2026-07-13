import { getApprovedEnrollment } from "@/lib/data/student";
import { getAllMatches } from "@/lib/data/sport";
import { requirePageRole } from "@/lib/permissions";
import { formatDateTime, isUpcoming } from "@/lib/date";
import { glassCard, glassPanelPad, mutedText, statusBadge } from "@/lib/ui";

export default async function StudentMatchesPage({ params }: { params: Promise<{ sportId: string }> }) {
  const { sportId } = await params;
  const session = await requirePageRole(["STUDENT"]);
  const enrollment = await getApprovedEnrollment(session.user.id, sportId);
  if (!enrollment) return null;

  const matches = await getAllMatches(sportId);

  return (
    <div className="space-y-3">
      {matches.length === 0 && <p className={mutedText}>No match schedules yet.</p>}
      {matches.map((match) => (
        <div key={match.id} className={`${glassCard} ${glassPanelPad}`}>
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-white">vs {match.opponent}</h3>
            {isUpcoming(match.matchDate) && <span className={statusBadge("success")}>Upcoming</span>}
          </div>
          <p className="mt-1 text-sm text-slate-300">{formatDateTime(match.matchDate)}</p>
          <p className="text-sm text-slate-400">Venue: {match.venue}</p>
        </div>
      ))}
    </div>
  );
}
