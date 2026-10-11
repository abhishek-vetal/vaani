"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  TEXT_MAX_LENGTH,
  COST_PER_UNIT,
} from "@/features/text-to-speech/data/constants";
import { AudioLines, Coins } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

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
  const [text, setText] = useState("");
  const router = useRouter();
  const estimatedCost = useMemo(() => formatEstimatedCost(text.length), [text]);

  const handleGenerate = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    router.push(`/text-to-speech?text=${encodeURIComponent(trimmed)}`);
  };

  return (
    <section aria-label="Text to speech editor" className="h-[270px] overflow-hidden rounded-[1.5rem] border border-slate-200/90 bg-white shadow-[0_12px_40px_rgba(23,23,25,0.05)] transition-all focus-within:border-rose-300 focus-within:ring-4 focus-within:ring-rose-100/70 sm:h-[310px] lg:h-[330px]">
      <div className="flex h-full min-h-0 flex-col p-2.5 sm:p-3">
        <Textarea
          aria-label="Text to convert to speech"
          placeholder="Write or paste text to turn into expressive speech..."
          maxLength={TEXT_MAX_LENGTH}
          value={text}
          onChange={(event) => setText(event.target.value)}
          className="min-h-0 flex-1 resize-none overflow-y-auto overscroll-contain border-0 bg-transparent p-3 text-base leading-7 text-slate-900 shadow-none [field-sizing:fixed] placeholder:text-slate-400 focus-visible:ring-0 sm:p-4"
        />

        <div className="shrink-0 flex flex-col gap-3 rounded-2xl border border-slate-100 bg-[#fbfaf8] p-3 sm:flex-row sm:items-center sm:justify-between sm:p-3.5">
          <div className="flex min-w-0 items-center gap-3 px-1 sm:px-2">
            <div className="flex items-center gap-1.5 text-xs">
              <Coins className="size-3.5 shrink-0 text-brand" />
              {text.length === 0 ? (
                <span className="text-slate-400">Estimated cost</span>
              ) : (
                <>
                  <span className="font-semibold text-slate-900 tabular-nums">{estimatedCost}</span>
                  <span className="font-normal text-slate-500">estimated</span>
                </>
              )}
            </div>
            <div className="h-3.5 w-px shrink-0 bg-slate-200" />
            <span className="shrink-0 text-xs font-normal tabular-nums text-slate-400">
              <span className="font-medium text-slate-600">{text.length.toLocaleString()}</span> / {TEXT_MAX_LENGTH.toLocaleString()}
            </span>
          </div>

          <Button
            disabled={!text.trim()}
            className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 font-medium text-sm text-white shadow-xs transition-all duration-150 ease-out select-none hover:bg-brand-hover active:bg-brand-active active:scale-[0.99] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-rose-500/30 focus-visible:ring-offset-2 disabled:border disabled:border-slate-200/80 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed disabled:pointer-events-none sm:w-auto"
            onClick={handleGenerate}
          >
            <AudioLines className="size-4 shrink-0 text-white/90 transition-opacity group-hover:text-white" />
            Generate speech
          </Button>
        </div>
      </div>
    </section>
  );
}