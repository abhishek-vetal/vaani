"use client";

import { Textarea } from "@/components/ui/textarea";
import { COST_PER_UNIT, TEXT_MAX_LENGTH } from "../data/constants";
import { Coins } from "lucide-react";
import { useTypedAppFormContext } from "@/hooks/use-app-form";
import { ttsFormOptions } from "./text-to-speech-form";
import { GenerateButton } from "./generate-button";
import { PromptSuggestions } from "./prompt-suggestions";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatEstimatedCost(characterCount: number): string {
  if (characterCount === 0) return "₹ 0.00";
  const cost = characterCount * COST_PER_UNIT;
  if (cost < 0.01) return "< ₹ 0.01";
  return currency.format(cost).replace("₹", "₹ ");
}

export function TextInputPanel() {
  const form = useTypedAppFormContext(ttsFormOptions);

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <form.Field name="text">
          {(field) => {
            const characterCount = field.state.value.length;
            const estimatedCost = formatEstimatedCost(characterCount);
            const hasText = Boolean(field.state.value.trim());

            return (
              <div className="flex min-h-0 flex-1 flex-col gap-3">
                <div className="relative min-h-0 flex-1">
                  <Textarea
                    aria-label="Text to convert to speech"
                    placeholder="Start typing or paste your text here..."
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    maxLength={TEXT_MAX_LENGTH}
                    disabled={isSubmitting}
                    className="absolute inset-0 resize-none overflow-y-auto border-0 p-4 pb-6 text-lg! leading-relaxed tracking-normal shadow-none [field-sizing:fixed] wrap-break-word focus-visible:ring-0 text-slate-900 placeholder:text-slate-400 lg:p-6 lg:pb-8"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-linear-to-t from-background to-transparent" />
                </div>

                {!hasText && (
                  <div className="shrink-0 px-4 lg:px-6">
                    <PromptSuggestions promptFunction={(prompt) => field.handleChange(prompt)} />
                  </div>
                )}

                <div className="shrink-0 border-t border-slate-100 p-4 lg:p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Coins className="size-3.5 shrink-0 text-brand" aria-hidden="true" />
                        {characterCount === 0 ? (
                          <span className="text-slate-400">Estimated cost</span>
                        ) : (
                          <>
                            <span className="tabular-nums font-semibold text-slate-900">{estimatedCost}</span>
                            <span className="font-normal text-slate-500">estimated</span>
                          </>
                        )}
                      </div>
                      <div className="h-3 w-px shrink-0 bg-slate-200" />
                      <span className="shrink-0 text-xs font-normal tabular-nums text-slate-400">
                        <span className="font-medium text-slate-600">{characterCount.toLocaleString()}</span> / {TEXT_MAX_LENGTH.toLocaleString()} characters
                      </span>
                    </div>

                    <GenerateButton
                      className="w-full sm:w-auto"
                      disabled={!hasText || isSubmitting}
                      isSubmitting={isSubmitting}
                      onSubmit={() => form.handleSubmit()}
                    />
                  </div>
                </div>
              </div>
            );
          }}
        </form.Field>
      )}
    </form.Subscribe>
  );
}