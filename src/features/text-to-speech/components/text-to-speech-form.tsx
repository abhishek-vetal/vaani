"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formOptions } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { useAppForm } from "@/hooks/use-app-form";
import { useCheckout } from "@/features/billing/hooks/use-checkout";

const ttsFormSchema = z.object({
  text: z.string().min(1, "Please enter some text"),
  voiceId: z.string().min(1, "Please select a voice"),
  // below are voice generation settings 
  temperature: z.number(),
  topP: z.number(),
  topK: z.number(),
  repetitionPenalty: z.number(),
});

// we tell zod take the schema and generate the TypeScript type from it
// when using useTypedAppFormContext(ttsFormOptions)
export type TTSFormValues = z.infer<typeof ttsFormSchema>;

export const defaultTTSValues: TTSFormValues = {
  text: "",
  voiceId: "",
  temperature: 0.8,
  topP: 0.95,
  topK: 1000,
  repetitionPenalty: 1.2,
};

// these are the defualt values for my TTS form which I will use in the child components
export const ttsFormOptions = formOptions({
  defaultValues: defaultTTSValues,
});

export function TextToSpeechForm({
  children,
  defaultValuesFromView,
}: {
  children: React.ReactNode;
  defaultValuesFromView?: TTSFormValues;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

//   Query
// → get data

//   Mutation
// → create / update / delete / perform action
// we are performing these to generate audio
  const createMutation = useMutation(
    trpc.generations.create.mutationOptions({}),
  );

  const { checkout } = useCheckout();

  // this is used to create the form
  const form = useAppForm({
    ...ttsFormOptions,
    defaultValues: defaultValuesFromView ?? defaultTTSValues,
    validators: {
      onSubmit: ttsFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const data = await createMutation.mutateAsync({
          text: value.text.trim(),
          voiceId: value.voiceId,
          temperature: value.temperature,
          topP: value.topP,
          topK: value.topK,
          repetitionPenalty: value.repetitionPenalty,
        });

        toast.success("Audio generated successfully!");
        queryClient.invalidateQueries(trpc.billing.getStatus.queryFilter());
        setTimeout(() => {
          queryClient.invalidateQueries(trpc.billing.getStatus.queryFilter());
        }, 1500);
        router.push(`/text-to-speech/${data.id}`);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to generate audio";

        if (message === "SUBSCRIPTION_REQUIRED") {
          toast.error("Subscription required", {
            action: {
              label: "Subscribe",
              onClick: () => checkout(),
            },
          });
        } else {
          toast.error(message);
        }
      }
    },
  });

  // This makes the form available to the components inside it
  return <form.AppForm>{children}</form.AppForm>;
};