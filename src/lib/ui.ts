// Shared glassmorphic design tokens used across the app. Keeping these centralized
// keeps every page/component visually consistent without repeating long class strings.

export const glassCard =
  "rounded-3xl border border-white/12 bg-white/[0.06] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.45)]";

export const glassCardSoft =
  "rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-lg";

export const glassPanelPad = "p-5 sm:p-6";

export const heading = "text-lg font-semibold tracking-tight text-white";
export const subheading = "text-sm text-slate-300";
export const mutedText = "text-sm text-slate-400";
export const label = "block text-xs font-medium uppercase tracking-wide text-slate-300";

export const inputClass =
  "mt-1 w-full rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm text-white placeholder:text-slate-500 backdrop-blur-md outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/25";

export const selectClass = inputClass + " appearance-none";

export const pillPrimary =
  "inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_6px_20px_rgba(255,255,255,0.15)] transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50";

export const pillPrimarySm =
  "inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-950 shadow-[0_6px_20px_rgba(255,255,255,0.15)] transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50";

export const pillSecondary =
  "inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.08] px-5 py-2.5 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/[0.14] disabled:cursor-not-allowed disabled:opacity-50";

export const pillDanger =
  "inline-flex items-center justify-center gap-2 rounded-full border border-rose-400/30 bg-rose-400/[0.12] px-4 py-2 text-xs font-semibold text-rose-300 backdrop-blur-md transition hover:bg-rose-400/[0.2]";

export const pillSuccess =
  "inline-flex items-center justify-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/[0.12] px-4 py-2 text-xs font-semibold text-emerald-300 backdrop-blur-md transition hover:bg-emerald-400/[0.2]";

export const iconButton =
  "flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.08] text-white backdrop-blur-md transition hover:bg-white/[0.16]";

export const tabActive = "rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm";
export const tabInactive =
  "rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white";

export function statusBadge(tone: "success" | "warning" | "danger" | "neutral") {
  const tones: Record<typeof tone, string> = {
    success: "border-emerald-400/30 bg-emerald-400/[0.14] text-emerald-300",
    warning: "border-amber-400/30 bg-amber-400/[0.14] text-amber-300",
    danger: "border-rose-400/30 bg-rose-400/[0.14] text-rose-300",
    neutral: "border-white/15 bg-white/[0.08] text-slate-300",
  };
  return `inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur-md ${tones[tone]}`;
}

export const tableWrap = `overflow-x-auto ${glassCard}`;
export const tableHeadRow = "text-xs font-medium uppercase tracking-wide text-slate-400";
export const tableHeadCell = "px-4 py-3 text-left";
export const tableRow = "border-t border-white/8";
export const tableCell = "px-4 py-3 text-sm text-slate-100";
