import { Activity, ArrowUpRight, AudioLines, Clapperboard, Gamepad, Headphones, Megaphone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type { QuickAction } from "@/features/dashboard/data/quick-actions";

const accents: Record<string, { icon: string; hover: string; Icon: LucideIcon }> = {
  "Narrate a Story": { icon: "bg-rose-50 text-rose-600", hover: "group-hover:text-rose-700", Icon: AudioLines },
  "Record an Ad": { icon: "bg-orange-50 text-orange-600", hover: "group-hover:text-orange-700", Icon: Megaphone },
  "Direct a Movie Scene": { icon: "bg-violet-50 text-violet-600", hover: "group-hover:text-violet-700", Icon: Clapperboard },
  "Voice a Game Character": { icon: "bg-amber-100 text-amber-600", hover: "group-hover:text-amber-700", Icon: Gamepad },
  "Introduce Your Podcast": { icon: "bg-emerald-50 text-emerald-600", hover: "group-hover:text-emerald-700", Icon: Headphones },
  "Guide a Meditation": { icon: "bg-sky-50 text-sky-600", hover: "group-hover:text-sky-700", Icon: Activity },
};

export function QuickActionCard({ title, description, href }: QuickAction) {
  const accent = accents[title] ?? { icon: "bg-slate-100 text-slate-600", hover: "group-hover:text-slate-800", Icon: AudioLines };
  const Icon = accent.Icon;

  return (
    <Link
      href={href}
      aria-label={`Use template: ${title}`}
      className="group flex min-h-[145px] flex-col justify-between rounded-[1.35rem] border border-slate-200/90 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_12px_30px_rgba(23,23,25,0.06)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-100"
    >
      <div className="flex items-start justify-between gap-4">
        <div className={`flex size-10 items-center justify-center rounded-xl ${accent.icon}`}>
          <Icon className="size-4" strokeWidth={1.8} aria-hidden="true" />
        </div>
      </div>
      <div className="mt-5">
        <h3 className="text-sm font-semibold tracking-tight text-slate-900">{title}</h3>
        <p className="mt-2 line-clamp-2 text-[13px] leading-5 text-slate-500">{description}</p>
      </div>
      <div className={`mt-7 flex items-center text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 transition-colors ${accent.hover}`}>
        <span>Use template</span>
        <ArrowUpRight aria-hidden="true" className="ml-2 size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </Link>
  );
}