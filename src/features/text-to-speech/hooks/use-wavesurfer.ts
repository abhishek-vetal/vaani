"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { useCallback, useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

interface UseWaveSurferOptions {
  url?: string;
  autoplay?: boolean;
}

export function useWaveSurfer({
  url,
  autoplay,
}: UseWaveSurferOptions) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      wavesurferRef.current?.pause();
    }
  }, [isMobile]);

  useEffect(() => {
    if (!containerRef.current || !url) return;

    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
      wavesurferRef.current = null;
    }

    let destroyed = false;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#96999D",
      progressColor: "#4A8A9A",
      cursorColor: "#4A8A9A",
      cursorWidth: 2,
      barWidth: 2,
      barGap: 2,
      barRadius: 2,
      barMinHeight: 4,
      height: "auto",
      normalize: true,
    });

    wavesurferRef.current = ws;

    ws.on("ready", () => {
      setIsReady(true);
      setDuration(ws.getDuration());

      if (autoplay) {
        ws.play().catch(() => {});
      }
    });

    ws.on("play", () => setIsPlaying(true));
    ws.on("pause", () => setIsPlaying(false));
    ws.on("finish", () => setIsPlaying(false));
    ws.on("timeupdate", (time) => setCurrentTime(time));

    ws.on("error", (error) => {
      if (destroyed) return;
      console.error("WaveSurfer error:", error);
    });

    ws.load(url).catch((error) => {
      if (destroyed) return;
      console.error("WaveSurfer load error:", error);
    });

    return () => {
      destroyed = true;
      ws.destroy();
      wavesurferRef.current = null;
    };
  }, [url, autoplay]);

  const togglePlayPause = useCallback(() => {
    wavesurferRef.current?.playPause();
  }, []);

  const seekForward = useCallback((seconds = 5) => {
    const ws = wavesurferRef.current;
    if (!ws) return;

    const duration = ws.getDuration();
    if (!duration) return;

    const newTime = Math.min(ws.getCurrentTime() + seconds, duration);
    ws.seekTo(newTime / duration);
  }, []);

  const seekBackward = useCallback((seconds = 5) => {
    const ws = wavesurferRef.current;
    if (!ws) return;

    const duration = ws.getDuration();
    if (!duration) return;

    const newTime = Math.max(ws.getCurrentTime() - seconds, 0);
    ws.seekTo(newTime / duration);
  }, []);

  return {
    containerRef,
    isPlaying,
    isReady,
    currentTime,
    duration,
    togglePlayPause,
    seekForward,
    seekBackward,
  };
}