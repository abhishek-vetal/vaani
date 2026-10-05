"use client";

import { useState } from "react";
import { Pause, Play, Download, Redo, Undo } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VoiceAvatar } from "@/components/voice-avatar/voice-avatar";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useWaveSurfer } from './../hooks/use-wavesurfer';

// here id is optional since voice can be deleted 
// so we should see at least the name of the voice on at the generated audio preview
type VoicePreviewPanelVoice = {
  id?: string;
  name: string;
};

// this is helper which converts the seconds into the mm:ss format 
// 85 seconds -> 01:25
function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "00:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  // provided padStart turns 5 into 05 
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function VoicePreviewPanel({
  audioUrl,
  voice,
  text,
}: {
  audioUrl: string;
  voice: VoicePreviewPanelVoice | null;
  text: string;
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const selectedVoiceId = voice?.id ?? null;
  const selectedVoiceName = voice?.name ?? null;

  // here I am getting the audio controls
  const {
    containerRef, // WaveSurfer referes this container to render waveform here
    isPlaying,
    isReady, // tell whether the waveform is ready if not then provide the spinner
    // 00:42 / 01:35 -> current time is left one and duration is right one both provided in seconds
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

    // filename generation
    const safeName =
      text
        .slice(0, 50)
        .trim()
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase() || "speech";

    // creating a download link
    const link = document.createElement("a");
    // url of the file which we want to download
    link.href = audioUrl;
    link.download = `${safeName}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setIsDownloading(false), 1000);
  };

  return (
    <div className="h-full gap-8 flex-col border-t border-slate-100 bg-white hidden flex-1 lg:flex">
      {/* Header */}
      <div className="p-6 pb-0">
        <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">Voice Preview</h3>
      </div>

      {/* Content */}
      <div className="relative flex flex-1 items-center justify-center px-8">
        {!isReady && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <Badge
              variant="outline"
              className="gap-2 bg-white/90 px-3 py-1.5 text-xs text-slate-500 shadow-sm border-slate-200"
            >
              <Spinner className="size-3.5" />
              <span>Loading audio...</span>
            </Badge>
          </div>
        )}
        
        <div
          ref={containerRef}
          className={cn(
            "w-full cursor-pointer transition-opacity duration-200",
            !isReady && "opacity-0",
          )}
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
      <div className="flex flex-col items-center justify-center p-6 border-t border-slate-50">
        <div className="grid w-full grid-cols-3 items-center">
          {/* Metadata */}
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="truncate text-sm font-semibold text-slate-900">
              {text}
            </p>
            {selectedVoiceName && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <VoiceAvatar
                  seed={selectedVoiceId ?? selectedVoiceName}
                  name={selectedVoiceName}
                  className="size-4 shrink-0 rounded-full"
                />
                <span className="truncate">{selectedVoiceName}</span>
              </div>
            )}
          </div>

          {/* Player controls */}
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="ghost"
              size="icon-lg"
              className="flex-col text-slate-400 hover:text-slate-900 size-9"
              onClick={() => seekBackward(10)}
              disabled={!isReady}
              aria-label="Seek backward 10s"
            >
              <Undo className="size-4 -mb-1" />
              <span className="text-[10px] font-medium">10</span>
            </Button>

            <Button
              size="icon-lg"
              className="rounded-full size-12 bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all active:scale-95"
              onClick={togglePlayPause}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="size-5 fill-current" />
              ) : (
                <Play className="size-5 fill-current ml-0.5" />
              )}
            </Button>

            <Button
              variant="ghost" 
              size="icon-lg"
              className="flex-col text-slate-400 hover:text-slate-900 size-9"
              onClick={() => seekForward(10)}
              disabled={!isReady}
              aria-label="Seek forward 10s"
            >
              <Redo className="size-4 -mb-1" />
              <span className="text-[10px] font-medium">10</span>
            </Button>
          </div>

          {/* Download */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-4 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-colors shadow-2xs font-semibold"
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
  );
}