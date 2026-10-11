"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Pause, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { VoiceAvatar } from "@/components/voice-avatar/voice-avatar";
import { useIsMobile } from "@/hooks/use-mobile";

type VoicePreviewMobileVoice = {
  id?: string;
  name: string;
};

export function VoicePreviewMobile({
  audioUrl,
  voice,
  text,
}: {
  audioUrl: string;
  voice: VoicePreviewMobileVoice | null;
  text: string;
}) {
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) {
      audioRef.current?.pause();
    }
  }, [isMobile]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
  }, [audioUrl]);

  const togglePlayPause = () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
  };

  const handleDownload = () => {
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
    link.click();
  };

  if (!audioUrl) return null;

  return (
    <div className="border-t p-4 lg:hidden">
      <audio
        ref={audioRef}
        src={audioUrl}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="grid grid-cols-[1fr_auto] items-center gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-900" title={text}>{text}</p>

          {voice && (
            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
              <VoiceAvatar
                seed={voice.id ?? voice.name}
                name={voice.name}
                className="size-3.5 shrink-0 rounded-full border border-slate-200/60"
              />
              <span className="truncate font-medium text-slate-700">{voice.name}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleDownload} aria-label="Download generated audio" className="text-slate-500 hover:text-slate-900 size-9 rounded-full">
            <Download className="size-4" />
          </Button>

          <Button
            size="icon"
            className="rounded-full size-10 bg-slate-900 text-white shadow-xs transition-all hover:bg-slate-800 hover:ring-2 hover:ring-rose-500/25 active:scale-95 focus-visible:ring-2 focus-visible:ring-rose-500/40 focus-visible:ring-offset-1 focus-visible:outline-hidden"
            onClick={togglePlayPause}
            aria-label={isPlaying ? "Pause generated audio" : "Play generated audio"}
            aria-pressed={isPlaying}
          >
            {isPlaying ? (
              <Pause className="size-4 fill-current" />
            ) : (
              <Play className="size-4 fill-current ml-0.5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
