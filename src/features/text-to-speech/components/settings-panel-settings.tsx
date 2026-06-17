"use client";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";
import { useTypedAppFormContext } from "@/hooks/use-app-form";

import { sliders } from "@/features/text-to-speech/data/sliders";
import { ttsFormOptions } from "@/features/text-to-speech/components/text-to-speech-form";

export function SettingsPanelSettings() {
  const form = useTypedAppFormContext(ttsFormOptions);

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {
        (isSubmitting) => (
          <>
            {/* Voice Style Dropdown Section */}
            <div className="border-b border-dashed p-4">
              <div className="text-muted-foreground">
                Voice selector coming soon
              </div>
            </div>

            {/* Voice Adjustments Section */}
            <div className="p-4 flex-1">
              <FieldGroup>
                {sliders.map((slider) => (
                  <form.Field key={slider.id} name={slider.id}>
                    {(field) => (
                      <Field>
                        <FieldLabel>{slider.label}</FieldLabel>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {slider.leftLabel}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {slider.rightLabel}
                          </span>
                        </div>

                        <Slider
                          value={[field.state.value]}
                          onValueChange={(value) => field.handleChange(value[0])}
                          min={slider.min}
                          max={slider.max}
                          step={slider.step}
                          disabled={isSubmitting}
                          className="**:data-[slot=slider-thumb]:size-3 **:data-[slot=slider-thumb]:bg-foreground **:data-[slot=slider-track]:h-1"
                        />
                      </Field>
                    )}
                  </form.Field>
                ))}
              </FieldGroup>
            </div>
          </>
        )
      }
    </form.Subscribe>
  )
}