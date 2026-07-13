"use client";

import { useActionState, useState } from "react";
import { createStaffAccountAction } from "@/lib/actions/admin-actions";
import { inputClass, selectClass, label, pillPrimary } from "@/lib/ui";

const ROLE_LABELS = { COACH: "Coach", COORDINATOR: "Coordinator", HOD: "HOD" } as const;
type StaffRole = keyof typeof ROLE_LABELS;

export function CreateStaffForm({
  sports,
  allowedRoles = ["COACH", "COORDINATOR", "HOD"],
}: {
  sports: { id: string; name: string }[];
  allowedRoles?: StaffRole[];
}) {
  const [state, action, pending] = useActionState(createStaffAccountAction, undefined);
  const [role, setRole] = useState<StaffRole>(allowedRoles[0]);

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Name</label>
          <input name="name" required className={inputClass} />
        </div>
        <div>
          <label className={label}>Username</label>
          <input name="username" required className={inputClass} />
        </div>
        <div>
          <label className={label}>Email</label>
          <input name="email" type="email" required className={inputClass} />
        </div>
        <div>
          <label className={label}>Password</label>
          <input name="password" type="password" required className={inputClass} />
        </div>
        <div>
          <label className={label}>Role</label>
          <select
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value as StaffRole)}
            className={selectClass}
          >
            {allowedRoles.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
        </div>
        {role !== "HOD" && (
          <div>
            <label className={label}>Sport</label>
            <select name="sportId" required className={selectClass}>
              {sports.map((sport) => (
                <option key={sport.id} value={sport.id}>
                  {sport.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {state?.error && (
        <p className="rounded-2xl border border-rose-400/30 bg-rose-400/[0.12] px-3 py-2 text-sm text-rose-300">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="rounded-2xl border border-emerald-400/30 bg-emerald-400/[0.12] px-3 py-2 text-sm text-emerald-300">
          Account created.
        </p>
      )}

      <button disabled={pending} type="submit" className={pillPrimary}>
        {pending ? "Creating..." : "Create account"}
      </button>
    </form>
  );
}
