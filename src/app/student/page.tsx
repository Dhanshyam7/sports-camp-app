import Link from "next/link";
import { requirePageRole } from "@/lib/permissions";
import { getEnrollments } from "@/lib/data/student";
import { glassCard, glassPanelPad, heading, mutedText, statusBadge } from "@/lib/ui";

const STATUS_TONE = {
  APPROVED: "success",
  PENDING: "warning",
  REJECTED: "danger",
} as const;

export default async function StudentOverviewPage() {
  const session = await requirePageRole(["STUDENT"]);
  const enrollments = await getEnrollments(session.user.id);

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold tracking-tight text-white">My Sports</h1>

      {enrollments.length === 0 && (
        <p className={mutedText}>
          You haven&apos;t requested to join any sport yet. Head to the &quot;Join a Sport&quot; tab to get started.
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {enrollments.map((enrollment) => (
          <div key={enrollment.id} className={`${glassCard} ${glassPanelPad}`}>
            <div className="flex items-center justify-between">
              <h2 className={heading}>{enrollment.sport.name}</h2>
              <span className={statusBadge(STATUS_TONE[enrollment.status])}>{enrollment.status}</span>
            </div>
            {enrollment.status === "APPROVED" ? (
              <Link
                href={`/student/${enrollment.sportId}/attendance`}
                className="mt-3 inline-block text-sm font-medium text-emerald-300 underline underline-offset-4"
              >
                Open dashboard
              </Link>
            ) : (
              <p className={`mt-3 ${mutedText}`}>
                {enrollment.status === "PENDING"
                  ? "Waiting for coordinator approval."
                  : "Your request was not approved."}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
