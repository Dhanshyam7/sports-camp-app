import { requirePageRole } from "@/lib/permissions";
import { getStaffAssignment } from "@/lib/data/staff";
import { getPendingEnrollments } from "@/lib/data/coordinator";
import { decideEnrollmentAction, addStudentDirectlyAction } from "@/lib/actions/coordinator-actions";
import { formatDate } from "@/lib/date";
import { glassCard, glassPanelPad, heading, mutedText, inputClass, pillPrimary, pillSuccess, pillDanger } from "@/lib/ui";

export default async function CoordinatorEnrollmentsPage() {
  const session = await requirePageRole(["COORDINATOR"]);
  const assignment = await getStaffAssignment(session.user.id);
  const pending = await getPendingEnrollments(assignment.sportId);

  return (
    <div className="space-y-6">
      <div className={`${glassCard} ${glassPanelPad}`}>
        <h2 className={`mb-3 ${heading}`}>Add a Student Directly</h2>
        <form action={addStudentDirectlyAction} className="flex flex-wrap gap-3">
          <input type="hidden" name="sportId" value={assignment.sportId} />
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

      <div>
        <h2 className={`mb-3 ${heading}`}>Pending Requests</h2>
        <div className="space-y-3">
          {pending.map((enrollment) => (
            <div key={enrollment.id} className={`flex items-center justify-between ${glassCard} ${glassPanelPad}`}>
              <div>
                <p className="font-medium text-white">{enrollment.studentProfile.user.name}</p>
                <p className="text-xs text-slate-400">
                  {enrollment.studentProfile.ktuId} &middot; requested {formatDate(enrollment.appliedAt)}
                </p>
              </div>
              <div className="flex gap-2">
                <form action={decideEnrollmentAction}>
                  <input type="hidden" name="sportId" value={assignment.sportId} />
                  <input type="hidden" name="enrollmentId" value={enrollment.id} />
                  <input type="hidden" name="decision" value="APPROVED" />
                  <button type="submit" className={pillSuccess}>
                    Approve
                  </button>
                </form>
                <form action={decideEnrollmentAction}>
                  <input type="hidden" name="sportId" value={assignment.sportId} />
                  <input type="hidden" name="enrollmentId" value={enrollment.id} />
                  <input type="hidden" name="decision" value="REJECTED" />
                  <button type="submit" className={pillDanger}>
                    Reject
                  </button>
                </form>
              </div>
            </div>
          ))}
          {pending.length === 0 && <p className={mutedText}>No pending requests.</p>}
        </div>
      </div>
    </div>
  );
}
