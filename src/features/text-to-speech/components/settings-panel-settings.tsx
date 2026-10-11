"use client";

import { Info } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTypedAppFormContext } from "@/hooks/use-app-form";
import { sliders } from "@/features/text-to-speech/data/sliders";
import { ttsFormOptions } from "@/features/text-to-speech/components/text-to-speech-form";
import { VoiceSelector } from "./voice-selector";

const PARAMETER_TOOLTIPS: Record<string, string> = {
  temperature:
    "Controls how expressive the voice sounds. Higher values sound livelier and more emotional. Lower values sound steadier and more consistent.",
  topP:
    "Controls tone variation. Higher values sound dynamic and natural. Lower values keep pronunciation stable.",
  topK:
    "Controls dramatic energy. Higher values sound more dramatic and animated. Lower values sound calm and subtle.",
  repetitionPenalty:
    "Prevents repetitive patterns. Higher values help sentences flow naturally without sounding robotic.",
};

export function SettingsPanelSettings() {
  const form = useTypedAppFormContext(ttsFormOptions);

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <div className="flex flex-col flex-1 divide-y divide-slate-100">
          {/* Voice Style Selector Section */}
          <div className="p-4 lg:p-5 bg-white">
            <VoiceSelector />
          </div>

          {/* Voice Adjustments Section */}
          <div className="p-4 lg:p-5 flex-1 bg-white space-y-5">
            <div className="flex items-center justify-between pb-0.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Voice Parameters
              </span>
            </div>

            <div className="space-y-4.5">
              {sliders.map((slider) => (
                <form.Field key={slider.id} name={slider.id}>
                  {(field) => {
                    const formattedValue =
                      typeof field.state.value === "number"
                        ? slider.step < 1
                          ? Number(field.state.value.toFixed(2))
                          : field.state.value
                        : field.state.value;

                    return (
                      <div key={slider.id} className="space-y-1.5">
                        {/* 1. Label on left, Value badge on right */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-slate-800 tracking-tight">
                              {slider.label}
                            </span>
                            {PARAMETER_TOOLTIPS[slider.id] && (
                              <TooltipProvider delayDuration={100}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      type="button"
                                      className="inline-flex items-center justify-center -m-1.5 p-1.5 text-slate-400 hover:text-slate-700 transition-colors cursor-help focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-slate-400 rounded-full select-none touch-manipulation"
                                      aria-label={`About ${slider.label}`}
                                    >
                                      <Info className="size-3" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="top"
                                    sideOffset={6}
                                    align="start"
                                    arrowPadding={10}
                                    collisionPadding={12}
                                    className="w-65 max-w-[calc(100vw-32px)]"
                                  >
                                    {PARAMETER_TOOLTIPS[slider.id]}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                          <span className="tabular-nums font-mono text-[11px] font-semibold text-slate-600 bg-slate-100/90 border border-slate-200/60 px-2 py-0.5 rounded-md shadow-2xs">
                            {formattedValue}
                          </span>
                        </div>

                        {/* 2. Minimum and maximum descriptions beneath label row */}
                        <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 select-none">
                          <span>{slider.leftLabel}</span>
                          <span>{slider.rightLabel}</span>
                        </div>

                        {/* 3. Slider directly underneath */}
                        <div className="pt-1 pb-0.5">
                          <Slider
                            value={[field.state.value]}
                            aria-label={slider.label}
                            onValueChange={(val) => field.handleChange(val[0])}
                            min={slider.min}
                            max={slider.max}
                            step={slider.step}
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                    );
                  }}
                </form.Field>
              ))}
            </div>
          </div>
        </div>
      )}
    </form.Subscribe>
  );
}