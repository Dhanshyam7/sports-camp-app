"use client";

import { useActionState } from "react";
import { changeOwnPasswordAction } from "@/lib/actions/auth-actions";
import { inputClass, label, pillPrimary } from "@/lib/ui";

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState(changeOwnPasswordAction, undefined);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className={label}>Current password</label>
        <input name="currentPassword" type="password" required autoComplete="current-password" className={inputClass} />
      </div>
      <div>
        <label className={label}>New password</label>
        <input name="newPassword" type="password" required autoComplete="new-password" className={inputClass} />
      </div>
      <div>
        <label className={label}>Confirm new password</label>
        <input name="confirmPassword" type="password" required autoComplete="new-password" className={inputClass} />
      </div>

      {state?.error && (
        <p className="rounded-2xl border border-rose-400/30 bg-rose-400/[0.12] px-3 py-2 text-sm text-rose-300">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="rounded-2xl border border-emerald-400/30 bg-emerald-400/[0.12] px-3 py-2 text-sm text-emerald-300">
          Password updated.
        </p>
      )}

      <button disabled={pending} type="submit" className={pillPrimary}>
        {pending ? "Updating..." : "Update password"}
      </button>
    </form>
  );
}
