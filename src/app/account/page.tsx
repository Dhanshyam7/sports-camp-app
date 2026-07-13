import Link from "next/link";
import { requireSession, roleHome } from "@/lib/permissions";
import { Topbar } from "@/components/layout/Topbar";
import { ChangePasswordForm } from "@/components/account/ChangePasswordForm";
import { glassCard, glassPanelPad, heading, mutedText } from "@/lib/ui";

export default async function AccountPage() {
  const session = await requireSession();

  return (
    <div className="min-h-screen">
      <Topbar name={session.user.name} role={session.user.role} />
      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <Link href={roleHome(session.user.role)} className="mb-4 inline-block text-sm text-slate-400 underline underline-offset-4">
          &larr; Back to dashboard
        </Link>

        <div className={`${glassCard} ${glassPanelPad}`}>
          <h1 className={heading}>Change Password</h1>
          <p className={`mb-4 ${mutedText}`}>Update the password for your own account.</p>
          <ChangePasswordForm />
        </div>
      </main>
    </div>
  );
}
