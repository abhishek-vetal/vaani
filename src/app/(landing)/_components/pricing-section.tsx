"use client";

import { AudioLines, Check, Mic2 } from "lucide-react";
import { useMemo, useState } from "react";

const MAX_CALCULATOR_CHARACTERS = 10_000_000;
const TTS_RATE_PER_CHARACTER = 0.002;

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function getSafeCharacterCount(value: string) {
  const parsed = Number(value);

  if (!value.trim() || !Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }

  return Math.min(Math.floor(parsed), MAX_CALCULATOR_CHARACTERS);
}

export function PricingSection() {
  const [characters, setCharacters] = useState("2500");
  const safeCharacterCount = useMemo(() => getSafeCharacterCount(characters), [characters]);
  const estimatedCost = safeCharacterCount * TTS_RATE_PER_CHARACTER;
  const isCapped = Number(characters) > MAX_CALCULATOR_CHARACTERS;

  return (
    <section id="pricing" className="relative z-10 w-full border-y border-slate-200/80 bg-white/65 px-6 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-600">Simple, usage-based pricing</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-charcoal sm:text-5xl">Pay for what you create.</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">No complicated plans. Just transparent pricing for every generation.</p>
        </div>

        <div className="mt-14 grid items-stretch gap-5 md:grid-cols-2">
          <article className="group flex h-full flex-col rounded-[2rem] border border-emerald-200/80 bg-white p-7 shadow-[0_16px_45px_rgba(16,185,129,0.07)] transition-transform duration-300 hover:-translate-y-1 sm:p-9" data-meter="Text-to-Speech-Characters">
            <div className="flex items-start justify-between gap-4">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <AudioLines className="size-5" strokeWidth={1.8} />
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Per character</span>
            </div>
            <h3 className="mt-8 text-2xl font-semibold tracking-[-0.03em] text-charcoal">Text-to-speech</h3>
            <p className="mt-3 max-w-md leading-7 text-slate-600">Generate expressive audio from the text you write or paste into Vaani.</p>
            <div className="mt-8 flex items-end gap-3">
              <span className="text-5xl font-semibold tracking-[-0.06em] text-charcoal">₹ 2</span>
              <span className="mb-1.5 text-sm font-medium text-slate-500">per 1,000 characters</span>
            </div>
            <p className="mt-2 text-sm text-slate-500">That is ₹ 0.002 per character.</p>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-[#fbfaf8] p-5">
              <label htmlFor="pricing-character-count" className="text-sm font-semibold text-charcoal">Estimate your generation</label>
              <div className="relative mt-3">
                <input
                  id="pricing-character-count"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  max={MAX_CALCULATOR_CHARACTERS}
                  step="1"
                  value={characters}
                  onChange={(event) => setCharacters(event.target.value)}
                  aria-describedby="pricing-character-help pricing-character-estimate"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 pr-28 text-base font-medium text-charcoal outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                  placeholder="Number of characters"
                />
                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-slate-400">characters</span>
              </div>
              <div id="pricing-character-estimate" className="mt-4 flex items-baseline justify-between gap-4">
                <span className="text-sm text-slate-500">Estimated cost</span>
                <output className="text-xl font-semibold text-emerald-600" aria-live="polite">
                  {inr.format(estimatedCost).replace("₹", "₹ ")}
                </output>
              </div>
              <p id="pricing-character-help" className="mt-2 text-xs leading-5 text-slate-400">
                Estimate only. The final charge depends on the characters generated.{isCapped ? " The estimate is capped at 10,000,000 characters." : ""}
              </p>
            </div>
          </article>

          <article className="group flex h-full flex-col rounded-[2rem] border border-emerald-200/80 bg-white p-7 shadow-[0_16px_45px_rgba(16,185,129,0.07)] transition-transform duration-300 hover:-translate-y-1 sm:p-9" data-meter="Voice-Creation">
            <div className="flex items-start justify-between gap-4">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Mic2 className="size-5" strokeWidth={1.8} />
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Per creation</span>
            </div>
            <h3 className="mt-8 text-2xl font-semibold tracking-[-0.03em] text-charcoal">Custom voice creation</h3>
            <p className="mt-3 max-w-md leading-7 text-slate-600">Create a custom voice when you need a more personal sound for your Vaani projects.</p>
            <div className="mt-8 flex items-end gap-3">
              <span className="text-5xl font-semibold tracking-[-0.06em] text-charcoal">₹ 2</span>
              <span className="mb-1.5 text-sm font-medium text-slate-500">per successful creation</span>
            </div>
            <p className="mt-2 text-sm text-slate-500">Charged separately from text-to-speech usage.</p>

            <div className="mt-8 rounded-2xl bg-charcoal p-5 text-white">
              <p className="text-sm font-semibold text-white">What counts as a creation?</p>
              <p className="mt-2 text-sm leading-6 text-white/65">A completed custom voice creation is counted once. Failed attempts are not presented as successful creations.</p>
            </div>

            <div className="mt-auto border-t border-slate-100 pt-6">
              <p className="flex items-start gap-2 text-sm leading-6 text-slate-500">
                <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                Vaani checks your account access before a custom voice is created.
              </p>
            </div>
          </article>
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">Both meters are usage-based: text-to-speech is measured by characters, while custom voice creation is measured per successful creation.</p>
      </div>
    </section>
  );
}