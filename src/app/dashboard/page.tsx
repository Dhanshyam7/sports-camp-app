import { redirect } from "next/navigation";
import { requireSession, roleHome } from "@/lib/permissions";

export default async function DashboardRedirectPage() {
  const session = await requireSession();
  redirect(roleHome(session.user.role));
}
