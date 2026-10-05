"use client"

import { Textarea } from "@/components/ui/textarea"
import { COST_PER_UNIT, TEXT_MAX_LENGTH } from "../data/constants"
import { Coins } from "lucide-react"
import { Badge } from "@/components/ui/badge"
// this component gets access to the parent TTS form
import { useTypedAppFormContext } from "@/hooks/use-app-form"
import { ttsFormOptions } from "./text-to-speech-form"
import { GenerateButton } from "./generate-button"
import { PromptSuggestions } from "./prompt-suggestions"

export function TextInputPanel() {
  // gives me access to that existing parent form.
  const form = useTypedAppFormContext(ttsFormOptions)

  return (
    // Reactivity - provides us the isSubmitting from the form state
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {
        (isSubmitting) => (
          <form.Field name="text">
            {(field) => (
              <div className="flex h-full min-h-0 flex-col flex-1 gap-3">
                <div className="relative flex-1 min-h-0">
                  <Textarea
                    placeholder="Start typing or paste your text here..."
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    maxLength={TEXT_MAX_LENGTH}
                    className="absolute inset-0 resize-none border-0 p-4 pb-6 lg:p-6 lg:pb-8 text-lg! leading-relaxed tracking-normal shadow-none wrap-break-word focus-visible:ring-0 text-slate-900 placeholder:text-slate-400"
                    disabled={isSubmitting}
                  />
                  {/* Bottom fade overlay */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-linear-to-t from-background to-transparent" />
                </div>

                <div className="shrink-0 p-4 lg:p-6">
                  {/* Mobile layout */}
                  <GenerateButton
                    className="w-full lg:hidden"
                    disabled={isSubmitting}
                    isSubmitting={isSubmitting}
                    onSubmit={() => form.handleSubmit()}
                  />

                  {/* Desktop layout */}
                  {
                    field.state.value.length > 0 ? (
                      <div className="hidden lg:flex items-center justify-between border-t border-slate-100 pt-3">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                            <Coins className="size-3.5 text-indigo-400/80" />
                            <span>
                              <span className="tabular-nums font-semibold text-slate-900">
                                ₹{(field.state.value.length * COST_PER_UNIT).toFixed(4)}
                              </span>{" "}
                              estimated
                            </span>
                          </div>

                          <div className="h-3 w-px bg-slate-200" />

                          <span className="text-xs text-slate-400 tabular-nums font-medium">
                            {field.state.value.length.toLocaleString()} / {TEXT_MAX_LENGTH.toLocaleString()} characters
                          </span>
                        </div>

                        <GenerateButton
                          size="sm"
                          disabled={isSubmitting}
                          isSubmitting={isSubmitting}
                          onSubmit={() => form.handleSubmit()}
                        />
                      </div>
                    ) : (
                      <div className="hidden lg:block text-sm text-muted-foreground border-t border-slate-100 pt-3">
                        <PromptSuggestions
                          promptFunction={(prompt) => field.handleChange(prompt)}
                        />
                      </div>
                    )
                  }
                </div>
              </div>
            )}
          </form.Field>
        )
      }
    </form.Subscribe>
  )
}