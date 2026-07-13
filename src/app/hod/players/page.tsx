import Link from "next/link";
import { requirePageRole } from "@/lib/permissions";
import { getAllSports, getSportRoster } from "@/lib/data/hod";
import { addStudentDirectlyAction } from "@/lib/actions/coordinator-actions";
import { removeEnrollmentAction } from "@/lib/actions/hod-actions";

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
      <div className="flex flex-wrap gap-2">
        {sports.map((sport) => (
          <Link
            key={sport.id}
            href={`/hod/players?sportId=${sport.id}`}
            className={`rounded-full px-3 py-1 text-sm ${
              sport.id === activeSportId
                ? "bg-slate-900 text-white"
                : "border border-slate-300 text-slate-700 hover:bg-slate-100"
            }`}
          >
            {sport.name}
          </Link>
        ))}
      </div>

      {activeSportId && (
        <>
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 font-medium text-slate-900">Add a Player to This Sport</h2>
            <form action={addStudentDirectlyAction} className="flex flex-wrap gap-3">
              <input type="hidden" name="sportId" value={activeSportId} />
              <input
                name="identifier"
                placeholder="KTU ID or email"
                required
                className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
              <button
                type="submit"
                className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
              >
                Add & approve
              </button>
            </form>
          </div>

          <div className="space-y-2">
            {roster.map((enrollment) => (
              <div
                key={enrollment.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div>
                  <p className="font-medium text-slate-900">{enrollment.studentProfile.user.name}</p>
                  <p className="text-xs text-slate-500">{enrollment.studentProfile.ktuId}</p>
                </div>
                <form action={removeEnrollmentAction}>
                  <input type="hidden" name="sportId" value={activeSportId} />
                  <input type="hidden" name="enrollmentId" value={enrollment.id} />
                  <button
                    type="submit"
                    className="rounded-md border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-800 hover:bg-red-100"
                  >
                    Remove
                  </button>
                </form>
              </div>
            ))}
            {roster.length === 0 && <p className="text-sm text-slate-500">No players in this sport yet.</p>}
          </div>
        </>
      )}
    </div>
  );
}
