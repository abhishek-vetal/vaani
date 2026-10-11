"use client"

import { useTypedAppFormContext } from "@/hooks/use-app-form"
import { useTTSVoices } from "../contexts/tts-voices-context"
import { ttsFormOptions } from "./text-to-speech-form"
import { useSelector } from "@tanstack/react-store"
import { Field, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select"
import { VoiceAvatar } from "@/components/voice-avatar/voice-avatar"
import { VOICE_CATEGORY_LABELS } from "@/features/voices/data/voice-categories"

export function VoiceSelector() {
  const {
    customVoices,
    systemVoices,
    allVoices: voices
  } = useTTSVoices()

  const form = useTypedAppFormContext(ttsFormOptions)
  const voiceId = useSelector(form.store, (s) => s.values.voiceId)
  const isSubmitting = useSelector(form.store, (s) => s.isSubmitting)

  const selectedVoice = voices.find((v) => v.id === voiceId)
  const hasMissingSelectedVoice = Boolean(voiceId) && !selectedVoice

  const currentVoice = selectedVoice
    ? selectedVoice
    : hasMissingSelectedVoice
      ? {
        id: voiceId,
        name: "Unavailable voice",
        category: null,
        variant: "SYSTEM" as const,
      }
      : voices[0];

  
  return (
    <Field className="gap-1.5">
      <FieldLabel className="text-xs font-semibold text-slate-800 tracking-tight">
        Voice Style
      </FieldLabel>
      <Select 
        value={voiceId}
        onValueChange={(v) => form.setFieldValue("voiceId", v)}
        disabled={isSubmitting}
      >
        <SelectTrigger className="w-full h-10 data-[size=default]:h-10 px-3 rounded-xl border border-slate-200/80 bg-white shadow-2xs hover:border-slate-300 focus-visible:border-rose-400 focus-visible:ring-2 focus-visible:ring-rose-500/20 transition-all text-slate-800">
          <SelectValue>
            {currentVoice && (
              <span className="flex items-center gap-2.5 min-w-0 flex-1 text-left">
                <VoiceAvatar 
                  seed={currentVoice.id}
                  name={currentVoice.name}
                  className="size-5 shrink-0 rounded-full border border-slate-200/80 shadow-2xs"
                />
                <span className="truncate text-sm font-medium text-slate-900 tracking-tight">
                  {currentVoice.name}
                </span>
                {currentVoice.category && (
                  <span className="shrink-0 text-xs text-slate-400 font-normal">
                    · {VOICE_CATEGORY_LABELS[currentVoice.category]}
                  </span>
                )}
              </span>
            )}
          </SelectValue>
        </SelectTrigger>

        <SelectContent className="max-h-72 rounded-xl border border-slate-200/80 shadow-lg p-1 bg-white">
          {/* This makes the invalid/deleted selection visible */}
          {hasMissingSelectedVoice && currentVoice && (
            <>
              <SelectGroup>
                <SelectLabel className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Selected Voice
                </SelectLabel>
                <SelectItem value={currentVoice.id} className="cursor-pointer rounded-lg px-2.5 py-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <VoiceAvatar
                      seed={currentVoice.id}
                      name={currentVoice.name}
                      className="size-5 shrink-0 rounded-full border border-slate-200/80 shadow-2xs"
                    />
                    <span className="truncate text-sm font-medium text-slate-800">
                      {currentVoice.name}
                    </span>
                    {currentVoice.category && (
                      <span className="shrink-0 text-xs text-slate-400 font-normal">
                        · {VOICE_CATEGORY_LABELS[currentVoice.category]}
                      </span>
                    )}
                  </div>
                </SelectItem>
              </SelectGroup>
              {(customVoices.length > 0 || systemVoices.length > 0) && (
                <SelectSeparator className="my-1 bg-slate-100" />
              )}
            </>
          )}

          {customVoices.length > 0 && (
            <SelectGroup>
              <SelectLabel className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Team Voices
              </SelectLabel>
              {customVoices.map((v) => (
                <SelectItem key={v.id} value={v.id} className="cursor-pointer rounded-lg px-2.5 py-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <VoiceAvatar
                      seed={v.id}
                      name={v.name}
                      className="size-5 shrink-0 rounded-full border border-slate-200/60 shadow-2xs"
                    />
                    <span className="truncate text-sm font-medium text-slate-800">
                      {v.name}
                    </span>
                    {v.category && (
                      <span className="shrink-0 text-xs text-slate-400 font-normal">
                        · {VOICE_CATEGORY_LABELS[v.category]}
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          )}
          
          {customVoices.length > 0 && systemVoices.length > 0 && (
            <SelectSeparator className="my-1 bg-slate-100" />
          )}

          {systemVoices.length > 0 && (
            <SelectGroup>
              <SelectLabel className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Built-in Voices
              </SelectLabel>
              {systemVoices.map((v) => (
                <SelectItem key={v.id} value={v.id} className="cursor-pointer rounded-lg px-2.5 py-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <VoiceAvatar
                      seed={v.id}
                      name={v.name}
                      className="size-5 shrink-0 rounded-full border border-slate-200/60 shadow-2xs"
                    />
                    <span className="truncate text-sm font-medium text-slate-800">
                      {v.name}
                    </span>
                    {v.category && (
                      <span className="shrink-0 text-xs text-slate-400 font-normal">
                        · {VOICE_CATEGORY_LABELS[v.category]}
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          )}
        </SelectContent>

      </Select>
    </Field>
  )
}