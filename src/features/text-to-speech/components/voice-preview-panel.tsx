"use client";

import { useState } from "react";
import { Pause, Play, Download, Redo, Undo } from "lucide-react";

import { Button } from "@/components/ui/button";
import { VoiceAvatar } from "@/components/voice-avatar/voice-avatar";
import { cn } from "@/lib/utils";
import { useWaveSurfer } from './../hooks/use-wavesurfer';
import { VoicePreviewSkeleton } from "./voice-preview-skeleton";

type VoicePreviewPanelVoice = {
  id?: string;
  name: string;
};

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "00:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function VoicePreviewPanel({
  audioUrl,
  voice,
  text,
  title = "Generated Audio",
}: {
  audioUrl: string;
  voice: VoicePreviewPanelVoice | null;
  text: string;
  title?: string;
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const selectedVoiceId = voice?.id ?? null;
  const selectedVoiceName = voice?.name ?? null;

  const {
    containerRef,
    isPlaying,
    isReady,
    currentTime,
    duration,
    togglePlayPause,
    seekBackward,
    seekForward,
  } = useWaveSurfer({
    url: audioUrl,
    autoplay: true,
  });

  const handleDownload = () => {
    setIsDownloading(true);

    const safeName =
      text
        .slice(0, 50)
        .trim()
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase() || "speech";

    const link = document.createElement("a");
    link.href = audioUrl;
    link.download = `${safeName}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setIsDownloading(false), 1000);
  };

  return (
    <div className="relative h-full flex-col border-t border-slate-100 bg-white hidden flex-1 lg:flex">
      {/* Skeleton overlay while audio is loading / preparing waveform */}
      {!isReady && (
        <div className="absolute inset-0 z-20 bg-white">
          <VoicePreviewSkeleton title={title} />
        </div>
      )}

      {/* Real audio player */}
      <div
        className={cn(
          "flex h-full flex-col gap-8 flex-1 transition-opacity duration-200",
          !isReady ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
      >
        {/* Header */}
        <div className="p-6 pb-0">
          <h3 className="font-semibold text-xs text-slate-400 uppercase tracking-wider">
            {title}
          </h3>
        </div>

        {/* Content */}
        <div className="relative flex flex-1 items-center justify-center px-8">
          <div
            ref={containerRef}
            className="w-full cursor-pointer"
          />
        </div>
      {/* Time display */}
      <div className="flex items-center justify-center">
        <p className="text-3xl font-bold tabular-nums tracking-tight text-slate-900">
          {formatTime(currentTime)}&nbsp;
          <span className="text-slate-400 font-medium">
            /&nbsp;{formatTime(duration)}
          </span>
        </p>
      </div>

      {/* Footer */}
      <div className="flex flex-col items-center justify-center p-6 border-t border-slate-100">
        <div className="grid w-full grid-cols-3 items-center">
          {/* Metadata */}
          <div className="flex min-w-0 flex-col gap-1 pr-4">
            <p
              className="truncate text-sm font-medium text-slate-900 leading-snug"
              title={text}
            >
              {text}
            </p>
            {selectedVoiceName && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <VoiceAvatar
                  seed={selectedVoiceId ?? selectedVoiceName}
                  name={selectedVoiceName}
                  className="size-4 shrink-0 rounded-full border border-slate-200/70 shadow-2xs"
                />
                <span className="truncate font-semibold text-slate-700">
                  {selectedVoiceName}
                </span>
                <span className="text-[11px] text-slate-400 font-normal shrink-0">
                  · Voice
                </span>
              </div>
            )}
          </div>

          {/* Player controls */}
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="ghost"
              size="icon-lg"
              className="flex-col text-slate-400 hover:text-slate-900 hover:bg-slate-100/80 size-9 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-rose-500/30 focus-visible:outline-hidden"
              onClick={() => seekBackward(10)}
              disabled={!isReady}
              aria-label="Seek backward 10s"
            >
              <Undo className="size-3.5 -mb-0.5" />
              <span className="text-[10px] font-medium tabular-nums">10</span>
            </Button>

            <Button
              size="icon-lg"
              className="rounded-full size-11 bg-slate-900 text-white shadow-xs transition-all duration-150 hover:bg-slate-800 hover:ring-2 hover:ring-rose-500/25 active:scale-95 focus-visible:ring-2 focus-visible:ring-rose-500/40 focus-visible:ring-offset-2 focus-visible:outline-hidden"
              onClick={togglePlayPause}
              aria-label={isPlaying ? "Pause generated audio" : "Play generated audio"}
              aria-pressed={isPlaying}
            >
              {isPlaying ? (
                <Pause className="size-4.5 fill-current" />
              ) : (
                <Play className="size-4.5 fill-current ml-0.5" />
              )}
            </Button>

            <Button
              variant="ghost" 
              size="icon-lg"
              className="flex-col text-slate-400 hover:text-slate-900 hover:bg-slate-100/80 size-9 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-rose-500/30 focus-visible:outline-hidden"
              onClick={() => seekForward(10)}
              disabled={!isReady}
              aria-label="Seek forward 10s"
            >
              <Redo className="size-3.5 -mb-0.5" />
              <span className="text-[10px] font-medium tabular-nums">10</span>
            </Button>
          </div>

          {/* Download */}
          <div className="flex justify-end pl-4">
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3.5 rounded-xl border border-slate-200/80 bg-white text-slate-700 text-xs font-semibold shadow-2xs transition-colors hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 focus-visible:ring-2 focus-visible:ring-rose-500/30 focus-visible:outline-hidden"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              <Download className="size-3.5 mr-1.5" />
              Download
            </Button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}