import { requirePageRole } from "@/lib/permissions";
import { getPendingEnrollments } from "@/lib/data/coordinator";
import { decideEnrollmentAction, addStudentDirectlyAction } from "@/lib/actions/coordinator-actions";
import { formatDate } from "@/lib/date";

export default async function HodEnrollmentsPage({ params }: { params: Promise<{ sportId: string }> }) {
  await requirePageRole(["HOD"]);
  const { sportId } = await params;
  const pending = await getPendingEnrollments(sportId);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-medium text-slate-900">Add a Student Directly</h2>
        <form action={addStudentDirectlyAction} className="flex flex-wrap gap-3">
          <input type="hidden" name="sportId" value={sportId} />
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

      <div>
        <h2 className="mb-3 font-medium text-slate-900">Pending Requests</h2>
        <div className="space-y-3">
          {pending.map((enrollment) => (
            <div
              key={enrollment.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div>
                <p className="font-medium text-slate-900">{enrollment.studentProfile.user.name}</p>
                <p className="text-xs text-slate-500">
                  {enrollment.studentProfile.ktuId} &middot; requested {formatDate(enrollment.appliedAt)}
                </p>
              </div>
              <div className="flex gap-2">
                <form action={decideEnrollmentAction}>
                  <input type="hidden" name="sportId" value={sportId} />
                  <input type="hidden" name="enrollmentId" value={enrollment.id} />
                  <input type="hidden" name="decision" value="APPROVED" />
                  <button
                    type="submit"
                    className="rounded-md border border-green-300 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-800 hover:bg-green-100"
                  >
                    Approve
                  </button>
                </form>
                <form action={decideEnrollmentAction}>
                  <input type="hidden" name="sportId" value={sportId} />
                  <input type="hidden" name="enrollmentId" value={enrollment.id} />
                  <input type="hidden" name="decision" value="REJECTED" />
                  <button
                    type="submit"
                    className="rounded-md border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-800 hover:bg-red-100"
                  >
                    Reject
                  </button>
                </form>
              </div>
            </div>
          ))}
          {pending.length === 0 && <p className="text-sm text-slate-500">No pending requests.</p>}
        </div>
      </div>
    </div>
  );
}
