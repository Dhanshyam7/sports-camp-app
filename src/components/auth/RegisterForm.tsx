"use client";

import { useActionState } from "react";
import { registerAction } from "@/lib/actions/auth-actions";

const inputClass =
  "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none";
const labelClass = "block text-sm font-medium text-slate-700";

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, undefined);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className={labelClass} htmlFor="name">
          Full name
        </label>
        <input id="name" name="name" required className={inputClass} />
        {state?.fieldErrors?.name && <p className="mt-1 text-xs text-red-600">{state.fieldErrors.name[0]}</p>}
      </div>

      <div>
        <label className={labelClass} htmlFor="username">
          Username
        </label>
        <input id="username" name="username" required className={inputClass} />
        {state?.fieldErrors?.username && (
          <p className="mt-1 text-xs text-red-600">{state.fieldErrors.username[0]}</p>
        )}
      </div>

      <div>
        <label className={labelClass} htmlFor="email">
          Email
        </label>
        <input id="email" name="email" type="email" required className={inputClass} />
        {state?.fieldErrors?.email && <p className="mt-1 text-xs text-red-600">{state.fieldErrors.email[0]}</p>}
      </div>

      <div>
        <label className={labelClass} htmlFor="password">
          Password
        </label>
        <input id="password" name="password" type="password" required className={inputClass} />
        {state?.fieldErrors?.password && (
          <p className="mt-1 text-xs text-red-600">{state.fieldErrors.password[0]}</p>
        )}
      </div>

      <div>
        <label className={labelClass} htmlFor="ktuId">
          KTU ID
        </label>
        <input id="ktuId" name="ktuId" required className={inputClass} />
        {state?.fieldErrors?.ktuId && <p className="mt-1 text-xs text-red-600">{state.fieldErrors.ktuId[0]}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="semester">
            Semester
          </label>
          <input id="semester" name="semester" type="number" min={1} max={12} required className={inputClass} />
          {state?.fieldErrors?.semester && (
            <p className="mt-1 text-xs text-red-600">{state.fieldErrors.semester[0]}</p>
          )}
        </div>
        <div>
          <label className={labelClass} htmlFor="dob">
            Date of birth
          </label>
          <input id="dob" name="dob" type="date" required className={inputClass} />
          {state?.fieldErrors?.dob && <p className="mt-1 text-xs text-red-600">{state.fieldErrors.dob[0]}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="department">
          Department
        </label>
        <input id="department" name="department" required className={inputClass} />
        {state?.fieldErrors?.department && (
          <p className="mt-1 text-xs text-red-600">{state.fieldErrors.department[0]}</p>
        )}
      </div>

      <div>
        <label className={labelClass} htmlFor="phone">
          Phone number
        </label>
        <input id="phone" name="phone" required className={inputClass} />
        {state?.fieldErrors?.phone && <p className="mt-1 text-xs text-red-600">{state.fieldErrors.phone[0]}</p>}
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        disabled={pending}
        type="submit"
        className="w-full rounded-md bg-slate-900 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-50"
      >
        {pending ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
