import { getApprovedEnrollment } from "@/lib/data/student";
import { getTodayTiming } from "@/lib/data/sport";
import { requirePageRole } from "@/lib/permissions";
import { formatDate } from "@/lib/date";

export default async function StudentTimingsPage({ params }: { params: Promise<{ sportId: string }> }) {
  const { sportId } = await params;
  const session = await requirePageRole(["STUDENT"]);
  const enrollment = await getApprovedEnrollment(session.user.id, sportId);
  if (!enrollment) return null;

  const timing = await getTodayTiming(sportId);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      {timing ? (
        <>
          <p className="text-sm text-slate-500">As of {formatDate(timing.date)}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {timing.startTime} &ndash; {timing.endTime}
          </p>
        </>
      ) : (
        <p className="text-sm text-slate-500">The coach hasn&apos;t set a camp timing yet.</p>
      )}
    </div>
  );
}
