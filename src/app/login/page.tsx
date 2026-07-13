import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { glassCard } from "@/lib/ui";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string }>;
}) {
  const { registered } = await searchParams;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/20 text-lg">
          🏆
        </span>
        <span className="text-lg font-semibold tracking-tight text-white">Sports Camp</span>
      </div>

      <div className={`w-full max-w-md ${glassCard} p-6 sm:p-8`}>
        <h1 className="mb-1 text-2xl font-semibold tracking-tight text-white">Welcome back</h1>
        <p className="mb-6 text-sm text-slate-300">Sign in with your username and password.</p>

        {registered && (
          <p className="mb-4 rounded-2xl border border-emerald-400/30 bg-emerald-400/[0.12] px-3 py-2 text-sm text-emerald-300">
            Registration successful. You can now sign in.
          </p>
        )}

        <LoginForm />

        <p className="mt-6 text-center text-sm text-slate-400">
          New student?{" "}
          <Link className="font-medium text-white underline underline-offset-4" href="/register">
            Register here
          </Link>
        </p>
      </div>
    </main>
  );
}
