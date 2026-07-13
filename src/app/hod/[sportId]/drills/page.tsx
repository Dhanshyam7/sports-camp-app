import { requirePageRole } from "@/lib/permissions";
import { getDrills } from "@/lib/data/sport";
import { createDrillAction } from "@/lib/actions/coach-actions";
import { formatDate } from "@/lib/date";
import { glassCard, glassPanelPad, heading, mutedText, inputClass, pillPrimary } from "@/lib/ui";

export default async function HodDrillsPage({ params }: { params: Promise<{ sportId: string }> }) {
  await requirePageRole(["HOD"]);
  const { sportId } = await params;
  const drills = await getDrills(sportId);

  return (
    <div>
      <div className={`mb-6 ${glassCard} ${glassPanelPad}`}>
        <h2 className={`mb-3 ${heading}`}>Assign a New Drill</h2>
        <form action={createDrillAction} className="space-y-3">
          <input type="hidden" name="sportId" value={sportId} />
          <input name="title" placeholder="Drill title" required className={inputClass} />
          <textarea name="description" placeholder="Description" required rows={3} className={inputClass} />
          <button type="submit" className={pillPrimary}>
            Post drill
          </button>
        </form>
      </div>

      <div className="space-y-3">
        {drills.map((drill) => (
          <div key={drill.id} className={`${glassCard} ${glassPanelPad}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-white">{drill.title}</h3>
              <span className="text-xs text-slate-400">{formatDate(drill.createdAt)}</span>
            </div>
            <p className="mt-1 text-sm text-slate-300">{drill.description}</p>
            <p className="mt-2 text-xs text-slate-500">Posted by {drill.coach?.name ?? "a former staff member"}</p>
          </div>
        ))}
        {drills.length === 0 && <p className={mutedText}>No drills posted yet.</p>}
      </div>
    </div>
  );
}
