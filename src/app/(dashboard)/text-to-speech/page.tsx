import { Metadata } from "next";
import { TextToSpeechView } from "@/features/text-to-speech/views/text-to-speech-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Text to Speech",
};

export default async function TextToSpeechPage({
  searchParams,
}: {
  searchParams: Promise<{ text?: string; voiceId?: string }>;
}) {

  const { text, voiceId } = await searchParams

  // we use prefetch inorder to get the data before rendering
  // HydrateClient → make that prefetched data available to client-side code
  // client access this prefetch data using useSuspenseQuery()

  // trpc → identifies which backend procedures to fetch
  prefetch(trpc.voices.getAll.queryOptions())
  prefetch(trpc.generations.getAll.queryOptions())

  return (
    <HydrateClient>
      <TextToSpeechView initialValues={{ text, voiceId }} />
    </HydrateClient>
  );
}