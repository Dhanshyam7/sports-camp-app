import { requirePageRole } from "@/lib/permissions";
import { deletePlayerAccountAction } from "@/lib/actions/admin-actions";
import { ConfirmSubmitButton } from "@/components/ui/ConfirmSubmitButton";
import { glassCard, glassPanelPad, heading, mutedText, inputClass, pillDanger } from "@/lib/ui";

export default async function AdminPlayersPage() {
  await requirePageRole(["ADMIN"]);

  return (
    <div className={`${glassCard} ${glassPanelPad}`}>
      <h2 className={`mb-1 ${heading}`}>Delete a Player Account</h2>
      <p className={`mb-3 ${mutedText}`}>
        Permanently deletes the student&apos;s account, including every sport they&apos;re enrolled in and
        their attendance history. This cannot be undone.
      </p>
      <form action={deletePlayerAccountAction} className="flex flex-wrap gap-3">
        <input name="identifier" placeholder="KTU ID, username, or email" required className={`flex-1 ${inputClass} !mt-0`} />
        <ConfirmSubmitButton
          className={pillDanger}
          confirmMessage="Permanently delete this student's account and all their data? This cannot be undone."
        >
          Delete account
        </ConfirmSubmitButton>
      </form>
    </div>
  );
}
