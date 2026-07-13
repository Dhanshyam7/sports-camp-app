import { requirePageRole } from "@/lib/permissions";
import { getJoinableSports } from "@/lib/data/student";
import { requestEnrollmentAction } from "@/lib/actions/student-actions";

export default async function JoinSportPage() {
  const session = await requirePageRole(["STUDENT"]);
  const sports = await getJoinableSports(session.user.id);

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-slate-900">Join a Sport</h1>

      {sports.length === 0 ? (
        <p className="text-sm text-slate-500">You&apos;ve already requested every available sport.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {sports.map((sport) => (
            <form
              key={sport.id}
              action={requestEnrollmentAction}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            >
              <input type="hidden" name="sportId" value={sport.id} />
              <span className="font-medium text-slate-900">{sport.name}</span>
              <button
                type="submit"
                className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
              >
                Request to join
              </button>
            </form>
          ))}
        </div>
      )}
    </div>
  );
}
