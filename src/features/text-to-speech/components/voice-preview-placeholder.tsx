import { AudioLines, Mic, Volume2 } from "lucide-react";

export function VoicePreviewPlaceholder() {
  return (
    <div className="hidden flex-1 lg:flex h-full flex-col items-center justify-center border-t border-slate-100 bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center -space-x-1.5">
          <div className="rounded-full bg-slate-100 p-2.5 text-slate-400 shadow-2xs">
            <Volume2 className="size-4 -rotate-12" />
          </div>

          <div className="z-10 rounded-full bg-slate-900 p-2.5 text-white shadow-xs">
            <AudioLines className="size-4" />
          </div>

          <div className="rounded-full bg-slate-100 p-2.5 text-slate-400 shadow-2xs">
            <Mic className="size-4 rotate-12" />
          </div>
        </div>

        <p className="text-xs font-medium text-slate-400">
          Audio preview will appear here
        </p>
      </div>
    </div>
  );
}