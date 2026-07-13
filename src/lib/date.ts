const IST_TIME_ZONE = "Asia/Kolkata";
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

/** Current instant, shifted so UTC getters read as IST wall-clock values. */
function nowShiftedToIST() {
  return new Date(Date.now() + IST_OFFSET_MS);
}

/** Today's calendar date in India (IST), as a UTC-midnight Date — matches how `@db.Date` columns are stored. */
export function todayDateOnly() {
  const shifted = nowShiftedToIST();
  return new Date(Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate()));
}

/** Minutes since midnight IST, right now. E.g. 4:30 PM IST -> 990. */
export function nowISTMinutesOfDay() {
  const shifted = nowShiftedToIST();
  return shifted.getUTCHours() * 60 + shifted.getUTCMinutes();
}

/** Parses "HH:MM" into minutes since midnight. */
export function timeStringToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
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
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: IST_TIME_ZONE,
  });
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
    timeZone: IST_TIME_ZONE,
  });
}
