import Link from "next/link";
import { requirePageRole } from "@/lib/permissions";
import { getEnrollments } from "@/lib/data/student";

const STATUS_STYLES: Record<string, string> = {
  APPROVED: "bg-green-100 text-green-800",
  PENDING: "bg-amber-100 text-amber-800",
  REJECTED: "bg-red-100 text-red-800",
};

export default async function StudentOverviewPage() {
  const session = await requirePageRole(["STUDENT"]);
  const enrollments = await getEnrollments(session.user.id);

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-slate-900">My Sports</h1>

      {enrollments.length === 0 && (
        <p className="text-sm text-slate-500">
          You haven&apos;t requested to join any sport yet. Head to the &quot;Join a Sport&quot; tab to get started.
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {enrollments.map((enrollment) => (
          <div key={enrollment.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-slate-900">{enrollment.sport.name}</h2>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[enrollment.status]}`}
              >
                {enrollment.status}
              </span>
            </div>
            {enrollment.status === "APPROVED" ? (
              <Link
                href={`/student/${enrollment.sportId}/attendance`}
                className="mt-3 inline-block text-sm font-medium text-slate-900 underline"
              >
                Open dashboard
              </Link>
            ) : (
              <p className="mt-3 text-sm text-slate-500">
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
