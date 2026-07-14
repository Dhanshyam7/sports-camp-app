import "server-only";
import { prisma } from "@/lib/prisma";

export async function getAdminSessions(userId: string) {
  return prisma.adminSession.findMany({
    where: { userId, revokedAt: null },
    orderBy: { lastSeenAt: "desc" },
  });
}

/** Lightweight browser/OS label from a User-Agent string — no dependency needed for this. */
export function parseUserAgent(ua: string | null | undefined): string {
  if (!ua) return "Unknown device";

  let browser = "Unknown browser";
  if (ua.includes("Edg/")) browser = "Edge";
  else if (ua.includes("Chrome/")) browser = "Chrome";
  else if (ua.includes("Firefox/")) browser = "Firefox";
  else if (ua.includes("Safari/")) browser = "Safari";

  let os = "Unknown OS";
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac OS X")) os = "macOS";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
  else if (ua.includes("Linux")) os = "Linux";

  return `${browser} on ${os}`;
}
