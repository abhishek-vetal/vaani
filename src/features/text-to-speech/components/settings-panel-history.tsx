import { AudioLines, AudioWaveform, Clock } from "lucide-react";

export function SettingsPanelHistory() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8">
      <div className="flex w-25 items-center justify-center">

        <div className=" rounded-full bg-cyan-50 text-cyan-600 p-3">
          <AudioLines className="size-4 -rotate-30" />
        </div>

        <div className="rounded-full bg-foreground p-3">
          <AudioWaveform className="size-4 text-background" />
        </div>

        <div className="rounded-full bg-violet-50 p-3 text-violet-600">
          <Clock className="size-4 rotate-30" />
        </div>

      </div>
      <p className="font-semibold tracking-tight text-foreground">
        No generations yet
      </p>
      <p className="max-w-48 text-center text-xs text-muted-foreground">
        Generate some audio and it will appear here
      </p>
    </div>
  );
}
