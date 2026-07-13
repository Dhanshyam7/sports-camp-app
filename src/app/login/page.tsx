import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string }>;
}) {
  const { registered } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <h1 className="mb-1 text-2xl font-semibold text-slate-900">Sports Camp Login</h1>
      <p className="mb-6 text-sm text-slate-500">Sign in with your username and password.</p>

      {registered && (
        <p className="mb-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
          Registration successful. You can now sign in.
        </p>
      )}

      <LoginForm />

      <p className="mt-6 text-sm text-slate-500">
        New student?{" "}
        <Link className="font-medium text-slate-900 underline" href="/register">
          Register here
        </Link>
      </p>
    </main>
  );
}
