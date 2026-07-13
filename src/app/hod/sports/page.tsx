import { requirePageRole } from "@/lib/permissions";
import { getAllSports } from "@/lib/data/hod";
import { createSportAction, deleteSportAction } from "@/lib/actions/hod-actions";

export default async function HodSportsPage() {
  await requirePageRole(["HOD"]);
  const sports = await getAllSports();

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-medium text-slate-900">Add a Sport</h2>
        <form action={createSportAction} className="flex gap-3">
          <input
            name="name"
            placeholder="Sport name"
            required
            className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Add
          </button>
        </form>
      </div>

      <div className="space-y-2">
        {sports.map((sport) => (
          <div
            key={sport.id}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div>
              <p className="font-medium text-slate-900">{sport.name}</p>
              <p className="text-xs text-slate-500">{sport._count.enrollments} players</p>
            </div>
            <form action={deleteSportAction}>
              <input type="hidden" name="sportId" value={sport.id} />
              <button
                type="submit"
                className="rounded-md border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-800 hover:bg-red-100"
              >
                Delete
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
