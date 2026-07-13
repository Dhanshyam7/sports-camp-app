"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions/auth-actions";
import { inputClass, label, pillPrimary } from "@/lib/ui";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className={label} htmlFor="username">
          Username
        </label>
        <input id="username" name="username" type="text" required autoComplete="username" className={inputClass} />
      </div>
      <div>
        <label className={label} htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </div>
      {state?.error && (
        <p className="rounded-2xl border border-rose-400/30 bg-rose-400/[0.12] px-3 py-2 text-sm text-rose-300">
          {state.error}
        </p>
      )}
      <button disabled={pending} type="submit" className={`w-full ${pillPrimary}`}>
        {pending ? "Signing in..." : "Sign in"}
        {!pending && <span aria-hidden>→</span>}
      </button>
    </form>
  );
}
