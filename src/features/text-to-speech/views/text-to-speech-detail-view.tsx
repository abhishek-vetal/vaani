"use client";

import { useSuspenseQueries } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { TextInputPanel } from "@/features/text-to-speech/components/text-input-panel";
import { SettingsPanel } from "@/features/text-to-speech/components/settings-panel";
import {
  TextToSpeechForm,
  type TTSFormValues
} from "@/features/text-to-speech/components/text-to-speech-form";
import { TTSVoicesProvider } from "../contexts/tts-voices-context";
import { VoicePreviewPanel } from "../components/voice-preview-panel";
import { VoicePreviewMobile } from "../components/voice-preview-mobile";

export function TextToSpeechDetailView({
  generationId,
}: {
  generationId: string;
}) {
  const trpc = useTRPC();
  const [ 
    generationQuery,
    voicesQuery,
  ] = useSuspenseQueries({
    queries: [
      trpc.generations.getById.queryOptions({ id: generationId }),
      trpc.voices.getAll.queryOptions()
    ],
  });

  const generation = generationQuery.data;
  const { custom: customVoices, system: systemVoices } = voicesQuery.data;
  const allVoices = [...customVoices, ...systemVoices];

  const fallbackVoiceId = allVoices[0]?.id ?? "";

  // Requested voice may no longer exist (deleted); fall back to first available
  const resolvedVoiceId =
    generation?.voiceId &&
    allVoices.some((v) => v.id === generation.voiceId)
      ? generation.voiceId      
      : fallbackVoiceId;

  // fill the generation values inside the default values
  const defaultValues: TTSFormValues = {
    text: generation.text,
    voiceId: resolvedVoiceId,
    temperature: generation.temperature,
    topP: generation.topP,
    topK: generation.topK,
    repetitionPenalty: generation.repetitionPenalty,
  };
  
  // this is used to provide to the user avatar
  const generationVoice = {
    id: generation.voiceId ?? undefined,
    name: generation.voiceName,
  };

  return (
    <TTSVoicesProvider value={{ customVoices, systemVoices, allVoices }}>
      <TextToSpeechForm key={generationId} defaultValuesFromView={defaultValues}>
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <div className="flex min-h-0 flex-1 flex-col">
            <TextInputPanel />
            <VoicePreviewMobile
              audioUrl={generation.audioUrl}
              voice={generationVoice}
              text={generation.text}
            />
            <VoicePreviewPanel
              audioUrl={generation.audioUrl}
              voice={generationVoice}
              text={generation.text}
            />
          </div>
          <SettingsPanel />
        </div>
      </TextToSpeechForm>
    </TTSVoicesProvider>
  );
};