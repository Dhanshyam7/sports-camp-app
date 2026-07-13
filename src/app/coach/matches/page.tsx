import { requirePageRole } from "@/lib/permissions";
import { getStaffAssignment } from "@/lib/data/coach";
import { getAllMatches } from "@/lib/data/sport";
import { createMatchAction } from "@/lib/actions/coach-actions";
import { formatDateTime } from "@/lib/date";
import { glassCard, glassPanelPad, heading, mutedText, inputClass, pillPrimary } from "@/lib/ui";

export default async function CoachMatchesPage() {
  const session = await requirePageRole(["COACH"]);
  const assignment = await getStaffAssignment(session.user.id);
  const matches = await getAllMatches(assignment.sportId);

  return (
    <div>
      <div className={`mb-6 ${glassCard} ${glassPanelPad}`}>
        <h2 className={`mb-3 ${heading}`}>Schedule a Match</h2>
        <form action={createMatchAction} className="grid gap-3 sm:grid-cols-2">
          <input type="hidden" name="sportId" value={assignment.sportId} />
          <input name="opponent" placeholder="Opponent" required className={inputClass} />
          <input name="venue" placeholder="Venue" required className={inputClass} />
          <input name="matchDate" type="datetime-local" required className={inputClass} />
          <button type="submit" className={`${pillPrimary} sm:col-span-2`}>
            Add match
          </button>
        </form>
      </div>

      <div className="space-y-3">
        {matches.map((match) => (
          <div key={match.id} className={`${glassCard} ${glassPanelPad}`}>
            <h3 className="font-medium text-white">vs {match.opponent}</h3>
            <p className="mt-1 text-sm text-slate-300">{formatDateTime(match.matchDate)}</p>
            <p className="text-sm text-slate-400">Venue: {match.venue}</p>
          </div>
        ))}
        {matches.length === 0 && <p className={mutedText}>No matches scheduled yet.</p>}
      </div>
    </div>
  );
}
