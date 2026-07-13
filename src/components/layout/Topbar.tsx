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
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Sports Camp Management</p>
          <p className="text-xs text-slate-500">
            {ROLE_LABELS[role] ?? role}
            {subtitle ? ` · ${subtitle}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600">{name}</span>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
