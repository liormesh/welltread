import { notFound } from "next/navigation";
import { SAMPLE_SESSIONS } from "@/lib/app/sample-plan";
import { SessionPlayer } from "@/components/app/SessionPlayer";
import { requireUser } from "@/lib/supabase/auth";

export default async function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;
  const session = SAMPLE_SESSIONS[id];
  if (!session) notFound();

  return <SessionPlayer session={session} />;
}
