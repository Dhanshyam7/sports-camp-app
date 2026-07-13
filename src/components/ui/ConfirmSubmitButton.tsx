"use client";

import { useState } from "react";
import type { ReactNode } from "react";

/**
 * Two-step inline confirmation instead of window.confirm() — native confirm()
 * dialogs can't be styled and block automated testing/browser tooling.
 */
export function ConfirmSubmitButton({
  confirmMessage,
  className,
  children,
}: {
  confirmMessage: string;
  className?: string;
  children: ReactNode;
}) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button type="button" className={className} title={confirmMessage} onClick={() => setConfirming(true)}>
        {children}
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <button type="submit" className={className}>
        Confirm
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="rounded-full border border-white/20 bg-white/[0.06] px-3 py-2 text-xs font-medium text-white backdrop-blur-md hover:bg-white/[0.12]"
      >
        Cancel
      </button>
    </span>
  );
}
