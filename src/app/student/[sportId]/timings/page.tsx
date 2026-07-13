import { getApprovedEnrollment } from "@/lib/data/student";
import { getTodayTiming } from "@/lib/data/sport";
import { requirePageRole } from "@/lib/permissions";
import { formatDate } from "@/lib/date";
import { glassCard, glassPanelPad, mutedText } from "@/lib/ui";

export default async function StudentTimingsPage({ params }: { params: Promise<{ sportId: string }> }) {
  const { sportId } = await params;
  const session = await requirePageRole(["STUDENT"]);
  const enrollment = await getApprovedEnrollment(session.user.id, sportId);
  if (!enrollment) return null;

  const timing = await getTodayTiming(sportId);

  return (
    <div className={`${glassCard} ${glassPanelPad}`}>
      {timing ? (
        <>
          <p className={mutedText}>As of {formatDate(timing.date)}</p>
          <p className="mt-1 text-2xl font-semibold text-white">
            {timing.startTime} &ndash; {timing.endTime}
          </p>
        </>
      ) : (
        <p className={mutedText}>The coach hasn&apos;t set a camp timing yet.</p>
      )}
    </div>
  );
}
