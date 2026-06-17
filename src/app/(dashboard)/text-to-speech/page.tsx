import { TextInputPanel } from "@/features/text-to-speech/components/text-input-panel";
import { VoicePreviewPlaceholder } from "@/features/text-to-speech/components/voice-preview-placeholder";
import type { Metadata } from "next";
import { SettingPanel } from '@/features/text-to-speech/components/settings-panel';
import { defaultTTSValues, TextToSpeechForm } from "@/features/text-to-speech/components/text-to-speech-form";

export const metadata: Metadata = {
  title: "Text to Speech",
};

export default function TextToSpeechPage() {
  return (
    <TextToSpeechForm defaultValues={defaultTTSValues}>
      <div className="flex">
        <div className="flex-1 flex flex-col min-h-screen">
          <TextInputPanel />
          <VoicePreviewPlaceholder />
        </div>

        <SettingPanel />
      </div>
    </TextToSpeechForm>
  );
}