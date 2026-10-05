import { QuickAction } from "@/features/dashboard/data/quick-actions";
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function QuickActionCard({
  title,
  description,
  href,
}: QuickAction) {
  return (
    <Link
      href={href}
      className="
        group
        relative
        flex flex-col
        justify-between
        rounded-2xl
        border border-slate-200/60
        bg-white
        p-5
        transition-all
        duration-300
        hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]
        hover:-translate-y-0.5
        hover:border-indigo-200
        overflow-hidden
      "
    >
      <div className="relative flex items-start justify-between">
        <div className="space-y-1.5 mb-6">
          <h3 className="text-sm font-semibold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
            {title}
          </h3>
          <p className="text-[13px] leading-relaxed text-slate-500 line-clamp-2 pr-4">
            {description}
          </p>
        </div>
      </div>

      <div className="flex items-center text-xs font-semibold uppercase tracking-wider text-slate-400 transition-colors group-hover:text-indigo-600 mt-auto">
        <span className="transition-transform duration-300 group-hover:translate-x-1">Try now</span>
      </div>
    </Link>
  );
}