"use client";

import { useActionState } from "react";
import { adminResetPasswordAction } from "@/lib/actions/admin-actions";
import { inputClass, label, pillPrimary } from "@/lib/ui";

export function ResetPasswordForm() {
  const [state, action, pending] = useActionState(adminResetPasswordAction, undefined);

  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <div>
        <label className={label}>Username or email</label>
        <input name="identifier" required className={inputClass} placeholder="e.g. coach_football" />
      </div>
      <div>
        <label className={label}>New password</label>
        <input name="newPassword" type="password" required className={inputClass} />
      </div>

      {state?.error && (
        <p className="sm:col-span-2 rounded-2xl border border-rose-400/30 bg-rose-400/[0.12] px-3 py-2 text-sm text-rose-300">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="sm:col-span-2 rounded-2xl border border-emerald-400/30 bg-emerald-400/[0.12] px-3 py-2 text-sm text-emerald-300">
          {state.success}
        </p>
      )}

      <button disabled={pending} type="submit" className={`${pillPrimary} sm:col-span-2`}>
        {pending ? "Updating..." : "Set new password"}
      </button>
    </form>
  );
}
