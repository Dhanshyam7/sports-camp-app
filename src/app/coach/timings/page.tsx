import { requirePageRole } from "@/lib/permissions";
import { getStaffAssignment } from "@/lib/data/coach";
import { getTodayTiming, getTimingHistory } from "@/lib/data/sport";
import { TimingPanel } from "@/components/timing/TimingPanel";

export default async function CoachTimingsPage() {
  const session = await requirePageRole(["COACH"]);
  const assignment = await getStaffAssignment(session.user.id);
  const [timing, history] = await Promise.all([
    getTodayTiming(assignment.sportId),
    getTimingHistory(assignment.sportId),
  ]);

  return <TimingPanel sportId={assignment.sportId} currentTiming={timing} history={history} />;
}
