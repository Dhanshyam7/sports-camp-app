"use client";

import { useActionState } from "react";
import { registerAction } from "@/lib/actions/auth-actions";
import { inputClass, label as labelClass, pillPrimary } from "@/lib/ui";

const errorText = "mt-1 text-xs text-rose-300";

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, undefined);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className={labelClass} htmlFor="name">
          Full name
        </label>
        <input id="name" name="name" required className={inputClass} />
        {state?.fieldErrors?.name && <p className={errorText}>{state.fieldErrors.name[0]}</p>}
      </div>

      <div>
        <label className={labelClass} htmlFor="username">
          Username
        </label>
        <input id="username" name="username" required className={inputClass} />
        {state?.fieldErrors?.username && <p className={errorText}>{state.fieldErrors.username[0]}</p>}
      </div>

      <div>
        <label className={labelClass} htmlFor="email">
          Email
        </label>
        <input id="email" name="email" type="email" required className={inputClass} />
        {state?.fieldErrors?.email && <p className={errorText}>{state.fieldErrors.email[0]}</p>}
      </div>

      <div>
        <label className={labelClass} htmlFor="password">
          Password
        </label>
        <input id="password" name="password" type="password" required className={inputClass} />
        {state?.fieldErrors?.password && <p className={errorText}>{state.fieldErrors.password[0]}</p>}
      </div>

      <div>
        <label className={labelClass} htmlFor="ktuId">
          KTU ID
        </label>
        <input id="ktuId" name="ktuId" required className={inputClass} />
        {state?.fieldErrors?.ktuId && <p className={errorText}>{state.fieldErrors.ktuId[0]}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="semester">
            Semester
          </label>
          <input id="semester" name="semester" type="number" min={1} max={12} required className={inputClass} />
          {state?.fieldErrors?.semester && <p className={errorText}>{state.fieldErrors.semester[0]}</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="dob">
            Date of birth
          </label>
          <input id="dob" name="dob" type="date" required className={inputClass} />
          {state?.fieldErrors?.dob && <p className={errorText}>{state.fieldErrors.dob[0]}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="department">
          Department
        </label>
        <input id="department" name="department" required className={inputClass} />
        {state?.fieldErrors?.department && <p className={errorText}>{state.fieldErrors.department[0]}</p>}
      </div>

      <div>
        <label className={labelClass} htmlFor="phone">
          Phone number
        </label>
        <input id="phone" name="phone" required className={inputClass} />
        {state?.fieldErrors?.phone && <p className={errorText}>{state.fieldErrors.phone[0]}</p>}
      </div>

      {state?.error && (
        <p className="rounded-2xl border border-rose-400/30 bg-rose-400/[0.12] px-3 py-2 text-sm text-rose-300">
          {state.error}
        </p>
      )}

      <button disabled={pending} type="submit" className={`w-full ${pillPrimary}`}>
        {pending ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
