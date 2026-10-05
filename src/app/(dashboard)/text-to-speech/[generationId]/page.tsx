import { redirect } from "next/navigation";
import { TextToSpeechDetailView } from "@/features/text-to-speech/views/text-to-speech-detail-view";
import { trpc, HydrateClient, prefetch, getQueryClient } from "@/trpc/server";

// params is used for dynamic route parameters 
// searchParams is used for search parameters like ?text=hello&voiceId=lsdkjflj
export default async function TextToSpeechDetailPage({
  params,
}: {
  params: Promise<{ generationId: string }>;
}) {
  const { generationId } = await params;
  const queryClient = getQueryClient();

  let exists = true;
  try {
    await queryClient.fetchQuery(
      trpc.generations.getById.queryOptions({ id: generationId }),
    );
  } catch {
    exists = false;
  }

  if (!exists) {
    redirect("/text-to-speech");
  }

  prefetch(trpc.voices.getAll.queryOptions());
  prefetch(trpc.generations.getAll.queryOptions());

  return (
    <HydrateClient>
      <TextToSpeechDetailView generationId={generationId} />
    </HydrateClient>
  );
};