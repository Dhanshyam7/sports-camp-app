import { requirePageRole } from "@/lib/permissions";
import { getJoinableSports } from "@/lib/data/student";
import { requestEnrollmentAction } from "@/lib/actions/student-actions";
import { glassCard, glassPanelPad, mutedText, pillPrimarySm } from "@/lib/ui";

export default async function JoinSportPage() {
  const session = await requirePageRole(["STUDENT"]);
  const sports = await getJoinableSports(session.user.id);

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold tracking-tight text-white">Join a Sport</h1>

      {sports.length === 0 ? (
        <p className={mutedText}>You&apos;ve already requested every available sport.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {sports.map((sport) => (
            <form
              key={sport.id}
              action={requestEnrollmentAction}
              className={`flex items-center justify-between ${glassCard} ${glassPanelPad}`}
            >
              <input type="hidden" name="sportId" value={sport.id} />
              <span className="font-medium text-white">{sport.name}</span>
              <button type="submit" className={pillPrimarySm}>
                Request to join
              </button>
            </form>
          ))}
        </div>
      )}
    </div>
  );
}
