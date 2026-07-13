import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
      <h1 className="mb-1 text-2xl font-semibold text-slate-900">Student Registration</h1>
      <p className="mb-6 text-sm text-slate-500">
        Create your account, then request to join a sport from your dashboard. A sport coordinator will approve
        your enrollment.
      </p>

      <RegisterForm />

      <p className="mt-6 text-sm text-slate-500">
        Already have an account?{" "}
        <Link className="font-medium text-slate-900 underline" href="/login">
          Sign in
        </Link>
      </p>
    </main>
  );
}
