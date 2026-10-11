"use client";

import { useState } from "react";
import {
  Mic,
  MicOff,
  Square,
  RotateCcw,
  X,
  FileAudio,
  Play,
  Pause,
} from "lucide-react";

import { cn, formatFileSize } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAudioPlayback } from "@/hooks/use-audio-playback";
import { useAudioRecorder } from "@/features/voices/hooks/use-audio-recorder";

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function VoiceRecorder({
  file,
  onFileChange,
  isInvalid,
}: {
  file: File | null;
  onFileChange: (file: File | null) => void;
  isInvalid?: boolean;
}) {
  const { isPlaying, togglePlay } = useAudioPlayback(file);
  const [localError, setLocalError] = useState<string | null>(null);

  const {
    isRecording,
    elapsedTime,
    audioBlob,
    containerRef,
    error,
    startRecording,
    stopRecording,
    resetRecording,
  } = useAudioRecorder();

  const handleStop = () => {
    if (elapsedTime < 1) {
      setLocalError("Recording was too short or empty. Please record at least 10 seconds.");
      resetRecording();
      return;
    }
    setLocalError(null);
    stopRecording((blob) => {
      if (!blob || blob.size === 0) {
        setLocalError("Recording was empty. Please try recording again.");
        return;
      }
      const recordedFile = new File([blob], "recording.wav", {
        type: "audio/wav",
      });
      onFileChange(recordedFile);
    });
  };

  const handleReRecord = () => {
    setLocalError(null);
    onFileChange(null);
    resetRecording();
  };

  const displayError = error || localError;

  if (displayError) {
    return (
      <div className="flex flex-col items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-4 text-center">
        <div className="flex size-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
          <MicOff className="size-4.5" />
        </div>
        <div className="space-y-0.5">
          <p className="text-xs font-semibold text-destructive">Microphone Error</p>
          <p className="max-w-xs text-[11px] text-muted-foreground">{displayError}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            setLocalError(null);
            resetRecording();
          }}
          className="h-7 px-3 rounded-lg text-xs shadow-none mt-1"
        >
          Try again
        </Button>
      </div>
    );
  }

  if (file) {
    return (
      <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
        <div className="flex w-full items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
            <FileAudio className="size-4.5" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-slate-900">{file.name}</p>
            <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span>{formatFileSize(file.size)}</span>
              {audioBlob && elapsedTime > 0 && (
                <>
                  <span>&middot;</span>
                  <span>{formatTime(elapsedTime)}</span>
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="size-7 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              onClick={togglePlay}
              title={isPlaying ? "Pause audio preview" : "Play audio preview"}
              aria-label={isPlaying ? "Pause audio preview" : "Play audio preview"}
            >
              {isPlaying ? (
                <Pause className="size-3.5" />
              ) : (
                <Play className="size-3.5" />
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="size-7 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              onClick={handleReRecord}
              title="Re-record"
              aria-label="Re-record voice"
            >
              <RotateCcw className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="size-7 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              onClick={handleReRecord}
              title="Remove recording"
              aria-label="Remove recording"
            >
              <X className="size-3.5" />
            </Button>
          </div>
        </div>

        {elapsedTime > 0 && elapsedTime < 10 && (
          <p className="text-[11px] font-medium text-amber-700 bg-amber-50 rounded-lg px-2.5 py-1 border border-amber-200/60">
            ⚠️ Recording is under 10 seconds. Voice cloning requires at least 10s of audio.
          </p>
        )}
      </div>
    );
  }

  if (isRecording) {
    return (
      <div className="flex flex-col overflow-hidden rounded-xl border border-rose-200 bg-rose-50/15">
        <div ref={containerRef} className="w-full" />
        <div className="flex items-center justify-between border-t border-slate-100 bg-white px-3.5 py-2">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-rose-500" />
            </span>
            <p className="text-base font-semibold leading-none tracking-tight text-slate-900">
              {formatTime(elapsedTime)}
            </p>
            {elapsedTime < 10 ? (
              <span className="text-[11px] text-muted-foreground">
                (need min. 10s)
              </span>
            ) : (
              <span className="text-[11px] font-medium text-emerald-600">
                Ready to stop
              </span>
            )}
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleStop}
            className="h-7 px-2.5 rounded-lg text-xs shadow-xs"
          >
            <Square className="size-2.5 fill-current mr-1" />
            Stop
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-dashed px-4 py-5 transition-colors",
        isInvalid
          ? "border-destructive bg-destructive/5"
          : "border-slate-200 bg-slate-50/30 hover:border-slate-300 hover:bg-slate-50/60",
      )}
      onClick={startRecording}
    >
      <div className="flex size-9 items-center justify-center rounded-lg bg-white border border-slate-200/70 shadow-2xs">
        <Mic className="size-4.5 text-slate-600" />
      </div>

      <p className="text-[11px] text-muted-foreground text-center">
        Speak clearly for at least 10 seconds
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          startRecording();
        }}
        className="h-7 px-3 rounded-lg border-slate-200 text-xs font-medium mt-0.5 shadow-none hover:bg-white"
      >
        <Mic className="size-3 mr-1 text-slate-500" />
        Start recording
      </Button>
    </div>
  );
}