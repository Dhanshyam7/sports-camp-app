import { requirePageRole } from "@/lib/permissions";
import { getAllMatches } from "@/lib/data/sport";
import { createMatchAction } from "@/lib/actions/coach-actions";
import { formatDateTime } from "@/lib/date";

export default async function HodMatchesPage({ params }: { params: Promise<{ sportId: string }> }) {
  await requirePageRole(["HOD"]);
  const { sportId } = await params;
  const matches = await getAllMatches(sportId);

  return (
    <div>
      <div className="mb-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-medium text-slate-900">Schedule a Match</h2>
        <form action={createMatchAction} className="grid gap-3 sm:grid-cols-2">
          <input type="hidden" name="sportId" value={sportId} />
          <input
            name="opponent"
            placeholder="Opponent"
            required
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            name="venue"
            placeholder="Venue"
            required
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            name="matchDate"
            type="datetime-local"
            required
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700 sm:col-span-2"
          >
            Add match
          </button>
        </form>
      </div>

      <div className="space-y-3">
        {matches.map((match) => (
          <div key={match.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="font-medium text-slate-900">vs {match.opponent}</h3>
            <p className="mt-1 text-sm text-slate-600">{formatDateTime(match.matchDate)}</p>
            <p className="text-sm text-slate-500">Venue: {match.venue}</p>
          </div>
        ))}
        {matches.length === 0 && <p className="text-sm text-slate-500">No matches scheduled yet.</p>}
      </div>
    </div>
  );
}
