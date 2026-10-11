import Image from "next/image";
import Link from "next/link";
import { ArrowUp, ArrowUpRight, BookOpen, Clapperboard, Gamepad2, Headphones } from "lucide-react";
import { AudioShowcase } from "./_components/audio-showcase";
import { FeatureTiles } from "./_components/feature-tiles";
import { PricingSection } from "./_components/pricing-section";
import { LandingSectionLink } from "./_components/landing-section-link";

const useCases = [
  { icon: Clapperboard, title: "Video narration", copy: "Give tutorials, reels, and documentaries a clear, consistent voice." },
  { icon: BookOpen, title: "Storytelling", copy: "Bring chapters, character moments, and long-form ideas to life." },
  { icon: Gamepad2, title: "Game dialogue", copy: "Prototype character lines and world-building dialogue with personality." },
  { icon: Headphones, title: "Podcasts & learning", copy: "Turn lessons, articles, and show notes into listenable audio." },
];

export default function LandingPage() {
  return (
    <div id="top" className="relative flex flex-col items-center overflow-hidden bg-[#fbfaf8]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-170 bg-[linear-gradient(to_right,#7f172a0b_1px,transparent_1px),linear-gradient(to_bottom,#7f172a0b_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-rose-200/50 blur-3xl" />
      <section className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-6 py-20 sm:py-24 lg:min-h-[calc(100svh-5rem)] lg:grid-cols-2 lg:gap-16 lg:px-8 xl:gap-20">
        <div className="flex w-full max-w-xl flex-col items-center text-center lg:items-start lg:text-left">
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-0.055em] text-charcoal sm:text-6xl lg:text-7xl">
            <span className="block">Give your words</span>
            <span className="block text-brand">a voice.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-lg text-lg leading-8 text-slate-600 sm:text-xl lg:mx-0">
            Turn text into expressive, natural-sounding speech with AI voice technology built for creators, storytellers, and developers.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-rose-500/20 transition-all hover:bg-brand-hover hover:-translate-y-0.5 active:bg-brand-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
            >
              Sign up <ArrowUpRight className="size-4" />
            </Link>
            <a
              href="#voices"
              className="rounded-full border border-slate-300 bg-white/60 px-6 py-3.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-white"
            >
              Explore voices
            </a>
          </div>
        </div>
        <div className="group relative flex w-full items-center justify-center py-6 sm:py-8 lg:py-0">
          {/* Subtle coral-pink radial-gradient shadow behind the floating cube */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-4 h-14 w-3/4 max-w-95 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(237,62,89,0.18)_0%,rgba(244,114,138,0.05)_50%,transparent_75%)] blur-2xl sm:bottom-6 sm:h-16 lg:bottom-8"
          />
          <div className="sound-cube-float relative aspect-1364/1153 w-full max-w-90 transition-transform duration-700 ease-out group-hover:rotate-[2deg] group-hover:scale-[1.02] motion-reduce:animate-none sm:max-w-110 md:max-w-120 lg:max-w-130 xl:max-w-140">
            <Image
              src="/cube.png"
              alt="A soft coral and ivory Vaani Sound Cube with an embossed audio wave"
              fill
              priority
              sizes="(max-width: 639px) 360px, (max-width: 1023px) 480px, 560px"
              className="object-contain pointer-events-none select-none"
            />
          </div>
        </div>
      </section>

      <section id="voices" className="relative z-10 w-full border-y border-slate-200/80 bg-white/65 py-24 lg:py-28">
        <AudioShowcase />
      </section>

      <section id="why-vaani" className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-600">Why Vaani</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-charcoal sm:text-5xl">
            A quieter way to make audio.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Everything you need to move from an idea in your notes to a voice your audience can hear.
          </p>
        </div>
        <FeatureTiles />
      </section>

      <section id="workflow" className="w-full bg-charcoal px-6 py-24 text-white lg:py-28">
        <div className="mx-auto max-w-7xl lg:px-2">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-300">The workflow</p>
          <h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            From text to audio in three steps.
          </h2>
          <div className="mt-14 grid gap-8 border-t border-white/15 pt-8 md:grid-cols-3">
            {[
              "Write or paste your text.",
              "Choose an available voice and adjust supported settings.",
              "Generate and listen to your audio in the Vaani studio.",
            ].map((step, index) => (
              <div key={step} className="flex gap-5">
                <span className="text-sm font-semibold text-rose-300">0{index + 1}</span>
                <p className="max-w-xs text-lg leading-8 text-white/75">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="use-cases" className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-600">Make it yours</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-charcoal sm:text-5xl">
              One voice, many stories.
            </h2>
          </div>
          <p className="max-w-md text-lg leading-8 text-slate-600">
            Use Vaani wherever your words need a little more presence.
          </p>
        </div>
        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {useCases.map(({ icon: Icon, title, copy }) => (
            <article key={title} className="group rounded-3xl border border-slate-200 bg-white p-7 transition-colors hover:border-rose-200">
              <div className="flex items-start justify-between">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 group-hover:bg-rose-50 group-hover:text-rose-600">
                  <Icon className="size-5" />
                </div>
                <ArrowUpRight className="size-5 text-slate-300 transition-colors group-hover:text-rose-500" />
              </div>
              <h3 className="mt-10 text-xl font-semibold text-charcoal">{title}</h3>
              <p className="mt-3 max-w-sm leading-7 text-slate-600">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <PricingSection />

      <section className="relative z-10 mx-6 mb-24 w-[calc(100%-3rem)] max-w-7xl overflow-hidden rounded-[2rem] bg-brand px-7 py-16 text-white sm:px-12 lg:mb-32 lg:px-20 lg:py-20">
        <div className="absolute -right-20 -top-32 size-96 rounded-full border-15 border-white/10" />
        <div className="relative max-w-2xl">
          <h2 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            Your next story deserves a voice.
          </h2>
          <p className="mt-5 text-lg text-white/80">Turn your text into audio with Vaani.</p>
          <Link
            href="/sign-up"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-brand-active transition-transform hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-white"
          >
            Start creating <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </section>

      <footer className="w-full border-t border-slate-200 bg-white px-6 py-10 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="Vaani logo" width={24} height={24} className="size-6" />
              <span className="text-lg font-bold">Vaani</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500">
              A simple, expressive text-to-speech studio for your next idea.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-slate-600">
            <Link href="/sign-in" className="hover:text-slate-950">Sign in</Link>
            <Link href="/sign-up" className="hover:text-slate-950">Sign up</Link>
            <LandingSectionLink id="pricing" className="hover:text-slate-950">Pricing</LandingSectionLink>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm text-slate-400">© {new Date().getFullYear()} Vaani</p>
            <LandingSectionLink
              id="top"
              aria-label="Back to top"
              className="flex size-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
            >
              <ArrowUp className="size-4" />
            </LandingSectionLink>
          </div>
        </div>
      </footer>
    </div>
  );
}