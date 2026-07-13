import Link from "next/link";
import { LogoutButton } from "@/components/layout/LogoutButton";

const ROLE_LABELS: Record<string, string> = {
  STUDENT: "Student",
  COACH: "Coach",
  COORDINATOR: "Coordinator",
  HOD: "HOD",
  ADMIN: "Admin",
};

export function Topbar({
  name,
  role,
  subtitle,
}: {
  name: string | null | undefined;
  role: string;
  subtitle?: string;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#060912]/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <div>
          <p className="text-sm font-semibold tracking-tight text-white">Sports Camp</p>
          <p className="text-xs text-slate-400">
            {ROLE_LABELS[role] ?? role}
            {subtitle ? ` · ${subtitle}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-slate-300 sm:inline">{name}</span>
          <Link
            href="/account"
            className="rounded-full border border-white/20 bg-white/[0.08] px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md transition hover:bg-white/[0.16]"
          >
            Account
          </Link>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
