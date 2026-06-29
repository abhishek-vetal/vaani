"use client"

import { useTRPC } from "@/trpc/client";
import { SettingPanel } from "../components/settings-panel";
import { TextInputPanel } from "../components/text-input-panel";
import { defaultTTSValues, TextToSpeechForm, TTSFormValues } from "../components/text-to-speech-form";
import { VoicePreviewPlaceholder } from "../components/voice-preview-placeholder";
import { useSuspenseQuery } from "@tanstack/react-query";
import { TTSVoicesProvider } from "../contexts/tts-voices-context";

export function TextToSpeechView({
  initialValues,
}: {
  initialValues?: Partial<TTSFormValues>;
}) {

  const trpc = useTRPC()
  const {
    data: voices,
  } = useSuspenseQuery(trpc.voices.getAll.queryOptions());

  const { custom: customVoices, system: systemVoices } = voices;

  const allVoices = [...customVoices, ...systemVoices];

  const fallbackVoiceId = allVoices[0]?.id ?? "";

  // Requested voice may no longer exist (deleted); fall back to first available
  const resolvedVoiceId =
    initialValues?.voiceId &&
      allVoices.some((v) => v.id === initialValues.voiceId)
      ? initialValues.voiceId
      : fallbackVoiceId;

  const defaultValues: TTSFormValues = {
    ...defaultTTSValues,
    ...initialValues,
    voiceId: resolvedVoiceId,
  };

  return (
    <TTSVoicesProvider value={{ customVoices, systemVoices, allVoices }}>
      <TextToSpeechForm defaultValues={defaultValues}>
        <div className="flex">
          <div className="flex-1 flex flex-col min-h-screen">
            <TextInputPanel />
            <VoicePreviewPlaceholder />
          </div>

          <SettingPanel />
        </div>
      </TextToSpeechForm>
    </TTSVoicesProvider>
  )
}