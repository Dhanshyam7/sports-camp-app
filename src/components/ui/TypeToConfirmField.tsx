"use client";

import { useState } from "react";
import { inputClass } from "@/lib/ui";

export function TypeToConfirmField({
  phrase,
  buttonClassName,
  buttonLabel,
  pendingLabel,
  pending,
}: {
  phrase: string;
  buttonClassName: string;
  buttonLabel: string;
  pendingLabel: string;
  pending: boolean;
}) {
  const [value, setValue] = useState("");

  return (
    <div className="space-y-3">
      <input
        name="confirmation"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={`Type ${phrase} to confirm`}
        autoComplete="off"
        className={inputClass}
      />
      <button
        type="submit"
        disabled={value !== phrase || pending}
        className={`${buttonClassName} disabled:cursor-not-allowed disabled:opacity-40`}
      >
        {pending ? pendingLabel : buttonLabel}
      </button>
    </div>
  );
}
