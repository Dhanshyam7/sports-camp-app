import { requirePageRole } from "@/lib/permissions";
import { DangerZoneForm } from "@/components/admin/DangerZoneForm";
import { glassCard, glassPanelPad, heading, mutedText } from "@/lib/ui";

export default async function AdminDangerPage() {
  await requirePageRole(["ADMIN"]);

  return (
    <div className={`${glassCard} ${glassPanelPad} border-rose-400/30`}>
      <h2 className={`mb-1 ${heading}`}>Reset Database</h2>
      <p className={`mb-1 ${mutedText}`}>
        Permanently deletes every student, coach, and coordinator account, along with all enrollments,
        attendance, drills, matches, camp timings, and login records.
      </p>
      <p className={`mb-4 ${mutedText}`}>
        HOD and Admin accounts, and the list of sports, are kept. This cannot be undone.
      </p>
      <DangerZoneForm />
    </div>
  );
}
