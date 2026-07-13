"use client";

import { useActionState, useState } from "react";
import { createStaffAccountAction } from "@/lib/actions/admin-actions";

const inputClass = "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm";

export function CreateStaffForm({ sports }: { sports: { id: string; name: string }[] }) {
  const [state, action, pending] = useActionState(createStaffAccountAction, undefined);
  const [role, setRole] = useState<"COACH" | "COORDINATOR" | "HOD">("COACH");

  return (
    <form action={action} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700">Name</label>
          <input name="name" required className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Username</label>
          <input name="username" required className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input name="email" type="email" required className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Password</label>
          <input name="password" type="password" required className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Role</label>
          <select
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value as typeof role)}
            className={inputClass}
          >
            <option value="COACH">Coach</option>
            <option value="COORDINATOR">Coordinator</option>
            <option value="HOD">HOD</option>
          </select>
        </div>
        {role !== "HOD" && (
          <div>
            <label className="block text-sm font-medium text-slate-700">Sport</label>
            <select name="sportId" required className={inputClass}>
              {sports.map((sport) => (
                <option key={sport.id} value={sport.id}>
                  {sport.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-700">Account created.</p>}

      <button
        disabled={pending}
        type="submit"
        className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
      >
        {pending ? "Creating..." : "Create account"}
      </button>
    </form>
  );
}
