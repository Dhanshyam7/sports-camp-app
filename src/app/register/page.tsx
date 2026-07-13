import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { glassCard } from "@/lib/ui";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/20 text-lg">
          🏆
        </span>
        <span className="text-lg font-semibold tracking-tight text-white">Sports Camp</span>
      </div>

      <div className={`w-full max-w-md ${glassCard} p-6 sm:p-8`}>
        <h1 className="mb-1 text-2xl font-semibold tracking-tight text-white">Student Registration</h1>
        <p className="mb-6 text-sm text-slate-300">
          Create your account, then request to join a sport from your dashboard. A sport coordinator will
          approve your enrollment.
        </p>

        <RegisterForm />

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link className="font-medium text-white underline underline-offset-4" href="/login">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
