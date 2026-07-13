import { redirect } from "next/navigation";

export default async function StudentSportIndexPage({ params }: { params: Promise<{ sportId: string }> }) {
  const { sportId } = await params;
  redirect(`/student/${sportId}/attendance`);
}
