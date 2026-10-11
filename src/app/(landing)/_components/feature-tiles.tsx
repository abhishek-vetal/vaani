import { ArrowUpRight, AudioLines, Mic2, SlidersHorizontal } from "lucide-react";

const features = [
  {
    title: "Natural-sounding speech",
    description: "Bring your writing to life with expressive narration for your next idea.",
    icon: AudioLines,
  },
  {
    title: "Voices with character",
    description: "Explore voice styles suited to stories, explainers, dialogue, and more.",
    icon: Mic2,
  },
  {
    title: "A focused workflow",
    description: "Go from written text to generated audio in one simple workspace.",
    icon: SlidersHorizontal,
  },
];

export function FeatureTiles() {
  return (
    <div className="mt-14 grid gap-4 md:grid-cols-3">
      {features.map(({ title, description, icon: Icon }) => (
        <article
          key={title}
          className="group min-h-62 rounded-3xl border border-slate-200 bg-white/70 p-8 transition-colors duration-300 hover:border-rose-200 hover:bg-white"
        >
          <div className="flex items-start justify-between">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition-colors group-hover:bg-rose-50 group-hover:text-rose-600">
              <Icon className="size-5" strokeWidth={1.8} />
            </div>
            <ArrowUpRight className="size-5 text-slate-300 transition-colors group-hover:text-rose-500" />
          </div>
          <h3 className="mt-12 text-xl font-semibold tracking-[-0.02em] text-charcoal">{title}</h3>
          <p className="mt-3 max-w-sm text-[15px] leading-7 text-slate-600">{description}</p>
        </article>
      ))}
    </div>
  );
}
