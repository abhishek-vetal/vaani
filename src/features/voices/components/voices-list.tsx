import { AudioLines, Mic, Volume2 } from "lucide-react";

import { VoiceCard } from "./voice-card";
import type { VoiceItem } from "./voice-card";

interface VoicesListProps {
  title: string;
  voices: VoiceItem[];
}

export function VoicesList({ title, voices }: VoicesListProps) {
  if (!voices.length) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2.5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
            {title}
          </h3>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
            0
          </span>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 py-12 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
          <div className="relative flex h-14 w-32 items-center justify-center">
            <div className="absolute left-0 -rotate-30 rounded-full bg-slate-100 p-3.5 shadow-xs">
              <Volume2 className="size-4 text-slate-400" />
            </div>

            <div className="relative z-10 rounded-full bg-slate-900 p-3.5 shadow-xs">
              <Mic className="size-4 text-white" />
            </div>

            <div className="absolute right-0 rotate-30 rounded-full bg-slate-100 p-3.5 shadow-xs">
              <AudioLines className="size-4 text-slate-400" />
            </div>
          </div>

          <p className="text-sm font-semibold tracking-tight text-slate-800">
            No voices found
          </p>

          <p className="max-w-md text-center text-xs text-slate-400">
            {title} will appear here once created or matched
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
          {title}
        </h3>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
          {voices.length}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {voices.map((voice) => (
          <VoiceCard key={voice.id} voice={voice} />
        ))}
      </div>
    </div>
  );
}