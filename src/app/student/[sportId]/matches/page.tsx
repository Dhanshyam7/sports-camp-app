import { getApprovedEnrollment } from "@/lib/data/student";
import { getAllMatches } from "@/lib/data/sport";
import { requirePageRole } from "@/lib/permissions";
import { formatDateTime, isUpcoming } from "@/lib/date";

export default async function StudentMatchesPage({ params }: { params: Promise<{ sportId: string }> }) {
  const { sportId } = await params;
  const session = await requirePageRole(["STUDENT"]);
  const enrollment = await getApprovedEnrollment(session.user.id, sportId);
  if (!enrollment) return null;

  const matches = await getAllMatches(sportId);

  return (
    <div className="space-y-3">
      {matches.length === 0 && <p className="text-sm text-slate-500">No match schedules yet.</p>}
      {matches.map((match) => (
        <div key={match.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-slate-900">vs {match.opponent}</h3>
            {isUpcoming(match.matchDate) && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                Upcoming
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-600">{formatDateTime(match.matchDate)}</p>
          <p className="text-sm text-slate-500">Venue: {match.venue}</p>
        </div>
      ))}
    </div>
  );
}
