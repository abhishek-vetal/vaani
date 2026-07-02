"use client"

import { Textarea } from "@/components/ui/textarea"
import { COST_PER_UNIT, TEXT_MAX_LENGTH } from "../data/constants"
import { Coins } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useTypedAppFormContext } from "@/hooks/use-app-form"
import { ttsFormOptions } from "./text-to-speech-form"
import { GenerateButton } from "./generate-button"

export function TextInputPanel() {
  const form = useTypedAppFormContext(ttsFormOptions)

  return (
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
                    className="absolute inset-0 resize-none border-0 p-4 pb-6 lg:p-6 lg:pb-8 text-base! leading-6 tracking-tight shadow-none wrap-break-word focus-visible:ring-0"
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
                      <div className="hidden lg:flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className="flex gap-2 bg-white/30"
                        >
                          <Coins className="text-chart-5" />

                          <span className="text-xs">
                            <span className="tabular-nums font-medium">
                              ₹{(field.state.value.length * COST_PER_UNIT).toFixed(4)}
                            </span>{" "}
                            estimated
                          </span>
                        </Badge>


                        <div className="flex gap-3 items-center">
                          <span className="text-xs text-muted-foreground tabular-nums">
                            {field.state.value.length.toLocaleString()} / {TEXT_MAX_LENGTH.toLocaleString()} characters
                          </span>
                          <GenerateButton
                            size="sm"
                            disabled={isSubmitting}
                            isSubmitting={isSubmitting}
                            onSubmit={() => form.handleSubmit()}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="hidden lg:block text-sm text-muted-foreground">Get started by typing or pasting the text above</div>
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