import Link from "next/link";
import { requirePageRole } from "@/lib/permissions";
import { getAllSports, getSportRoster } from "@/lib/data/hod";
import { addStudentDirectlyAction } from "@/lib/actions/coordinator-actions";
import { removeEnrollmentAction } from "@/lib/actions/hod-actions";
import { deletePlayerAccountAction } from "@/lib/actions/admin-actions";
import { ConfirmSubmitButton } from "@/components/ui/ConfirmSubmitButton";
import { glassCard, glassPanelPad, heading, mutedText, inputClass, pillPrimary, pillSecondary, pillDanger, tabActive, tabInactive } from "@/lib/ui";

export default async function HodPlayersPage({
  searchParams,
}: {
  searchParams: Promise<{ sportId?: string }>;
}) {
  await requirePageRole(["HOD"]);
  const sports = await getAllSports();
  const { sportId: requestedSportId } = await searchParams;
  const activeSportId = requestedSportId ?? sports[0]?.id;
  const roster = activeSportId ? await getSportRoster(activeSportId) : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-1.5">
        {sports.map((sport) => (
          <Link
            key={sport.id}
            href={`/hod/players?sportId=${sport.id}`}
            className={sport.id === activeSportId ? tabActive : tabInactive}
          >
            {sport.name}
          </Link>
        ))}
      </div>

      {activeSportId && (
        <>
          <div className={`${glassCard} ${glassPanelPad}`}>
            <h2 className={`mb-3 ${heading}`}>Add a Player to This Sport</h2>
            <form action={addStudentDirectlyAction} className="flex flex-wrap gap-3">
              <input type="hidden" name="sportId" value={activeSportId} />
              <input
                name="identifier"
                placeholder="KTU ID or email"
                required
                className={`flex-1 ${inputClass} !mt-0`}
              />
              <button type="submit" className={pillPrimary}>
                Add & approve
              </button>
            </form>
          </div>

          <div className="space-y-2">
            {roster.map((enrollment) => (
              <div key={enrollment.id} className={`flex items-center justify-between ${glassCard} ${glassPanelPad}`}>
                <div>
                  <p className="font-medium text-white">{enrollment.studentProfile.user.name}</p>
                  <p className="text-xs text-slate-400">{enrollment.studentProfile.ktuId}</p>
                </div>
                <div className="flex gap-2">
                  <form action={removeEnrollmentAction}>
                    <input type="hidden" name="sportId" value={activeSportId} />
                    <input type="hidden" name="enrollmentId" value={enrollment.id} />
                    <ConfirmSubmitButton
                      className={pillSecondary}
                      confirmMessage={`Remove ${enrollment.studentProfile.user.name} from this sport only? They'll keep their account and other sports.`}
                    >
                      Remove from sport
                    </ConfirmSubmitButton>
                  </form>
                  <form action={deletePlayerAccountAction}>
                    <input type="hidden" name="userId" value={enrollment.studentProfile.user.id} />
                    <ConfirmSubmitButton
                      className={pillDanger}
                      confirmMessage={`Permanently delete ${enrollment.studentProfile.user.name}'s entire account, including every sport and attendance record? This cannot be undone.`}
                    >
                      Delete account
                    </ConfirmSubmitButton>
                  </form>
                </div>
              </div>
            ))}
            {roster.length === 0 && <p className={mutedText}>No players in this sport yet.</p>}
          </div>
        </>
      )}
    </div>
  );
}
