import { requirePageRole } from "@/lib/permissions";
import { getDrills } from "@/lib/data/sport";
import { createDrillAction } from "@/lib/actions/coach-actions";
import { formatDate } from "@/lib/date";

export default async function HodDrillsPage({ params }: { params: Promise<{ sportId: string }> }) {
  await requirePageRole(["HOD"]);
  const { sportId } = await params;
  const drills = await getDrills(sportId);

  return (
    <div>
      <div className="mb-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-medium text-slate-900">Assign a New Drill</h2>
        <form action={createDrillAction} className="space-y-3">
          <input type="hidden" name="sportId" value={sportId} />
          <input
            name="title"
            placeholder="Drill title"
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <textarea
            name="description"
            placeholder="Description"
            required
            rows={3}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
          >
            Post drill
          </button>
        </form>
      </div>

      <div className="space-y-3">
        {drills.map((drill) => (
          <div key={drill.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-slate-900">{drill.title}</h3>
              <span className="text-xs text-slate-500">{formatDate(drill.createdAt)}</span>
            </div>
            <p className="mt-1 text-sm text-slate-600">{drill.description}</p>
            <p className="mt-2 text-xs text-slate-400">Posted by {drill.coach.name}</p>
          </div>
        ))}
        {drills.length === 0 && <p className="text-sm text-slate-500">No drills posted yet.</p>}
      </div>
    </div>
  );
}
