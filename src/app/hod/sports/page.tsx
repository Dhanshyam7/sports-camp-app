import { requirePageRole } from "@/lib/permissions";
import { getAllSports } from "@/lib/data/hod";
import { createSportAction, deleteSportAction } from "@/lib/actions/hod-actions";
import { glassCard, glassPanelPad, heading, inputClass, pillPrimary, pillDanger } from "@/lib/ui";

export default async function HodSportsPage() {
  await requirePageRole(["HOD"]);
  const sports = await getAllSports();

  return (
    <div className="space-y-6">
      <div className={`${glassCard} ${glassPanelPad}`}>
        <h2 className={`mb-3 ${heading}`}>Add a Sport</h2>
        <form action={createSportAction} className="flex gap-3">
          <input name="name" placeholder="Sport name" required className={`flex-1 ${inputClass} !mt-0`} />
          <button type="submit" className={pillPrimary}>
            Add
          </button>
        </form>
      </div>

      <div className="space-y-2">
        {sports.map((sport) => (
          <div key={sport.id} className={`flex items-center justify-between ${glassCard} ${glassPanelPad}`}>
            <div>
              <p className="font-medium text-white">{sport.name}</p>
              <p className="text-xs text-slate-400">{sport._count.enrollments} players</p>
            </div>
            <form action={deleteSportAction}>
              <input type="hidden" name="sportId" value={sport.id} />
              <button type="submit" className={pillDanger}>
                Delete
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
