"use client";

import { logoutAction } from "@/lib/actions/auth-actions";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/[0.08] px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md transition hover:bg-white/[0.16]"
      >
        Sign out
      </button>
    </form>
  );
}
