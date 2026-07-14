"use client";

import { useActionState } from "react";
import { resetDatabaseAction } from "@/lib/actions/admin-actions";
import { RESET_DATABASE_PHRASE } from "@/lib/constants";
import { TypeToConfirmField } from "@/components/ui/TypeToConfirmField";
import { pillDanger } from "@/lib/ui";

export function DangerZoneForm() {
  const [state, action, pending] = useActionState(resetDatabaseAction, undefined);

  return (
    <form action={action} className="space-y-3">
      <TypeToConfirmField
        phrase={RESET_DATABASE_PHRASE}
        buttonClassName={pillDanger}
        buttonLabel="Reset database now"
        pendingLabel="Resetting..."
        pending={pending}
      />

      {state?.error && (
        <p className="rounded-2xl border border-rose-400/30 bg-rose-400/[0.12] px-3 py-2 text-sm text-rose-300">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="rounded-2xl border border-emerald-400/30 bg-emerald-400/[0.12] px-3 py-2 text-sm text-emerald-300">
          Database reset. All students, coaches, and coordinators have been removed.
        </p>
      )}
    </form>
  );
}
