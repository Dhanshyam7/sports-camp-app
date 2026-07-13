export function todayDateOnly() {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

/** Parses a "YYYY-MM-DD" (e.g. from <input type="date">) into a UTC date-only value. */
export function parseDateOnly(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

/** Formats a UTC date-only value back into "YYYY-MM-DD" for an <input type="date"> defaultValue. */
export function toDateInputValue(date: Date) {
  return new Date(date).toISOString().slice(0, 10);
}

export function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function isUpcoming(date: Date) {
  return new Date(date).getTime() >= Date.now();
}

export function formatDateTime(date: Date) {
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
