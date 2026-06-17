"use client"

import { useAppForm } from "@/hooks/use-app-form"
import { formOptions } from "@tanstack/react-form"
import z from "zod"

const ttsFormSchema = z.object({
  text: z.string().min(1, "Please enter some text"),
  voiceId: z.string().min(1, "Please select a voice"),
  temperature: z.number(),
  topP: z.number(),
  topK: z.number(),
  repetitionPenalty: z.number(),
})

// converting the ttsFormSchema schemas to ty type
export type TTSFormValues = z.infer<typeof ttsFormSchema>

export const defaultTTSValues: TTSFormValues = {
  text: "",
  voiceId: "",
  temperature: 0.8,
  topP: 0.95,
  topK: 1000,
  repetitionPenalty: 1.2,
}

// getting the default values in the other forms
export const ttsFormOptions = formOptions({
  defaultValues: defaultTTSValues,
})

export function TextToSpeechForm({
  children,
  defaultValues
}: {
  children: React.ReactNode,
  defaultValues?: TTSFormValues
}) {

  const form = useAppForm({
    ...ttsFormOptions,
    defaultValues: defaultValues ?? defaultTTSValues,
    validators: {
      onSubmit: ttsFormSchema,
    },
    onSubmit: async () => {
      // will added later on 
    }
  })

  // creates react context so we need to use context.provider to page.tsx which is TextToSpeechForm
  return <form.AppForm>{children}</form.AppForm>
}