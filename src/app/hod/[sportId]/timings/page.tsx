import { requirePageRole } from "@/lib/permissions";
import { getTodayTiming, getTimingHistory } from "@/lib/data/sport";
import { TimingPanel } from "@/components/timing/TimingPanel";

export default async function HodTimingsPage({ params }: { params: Promise<{ sportId: string }> }) {
  await requirePageRole(["HOD"]);
  const { sportId } = await params;
  const [timing, history] = await Promise.all([getTodayTiming(sportId), getTimingHistory(sportId)]);

  return <TimingPanel sportId={sportId} currentTiming={timing} history={history} />;
}
