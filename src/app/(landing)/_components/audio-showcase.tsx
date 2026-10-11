"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

interface AudioExample {
  id: string;
  title: string;
  description: string;
  src: string;
  record: string;
  label: string;
  reflection: string;
  control: string;
  controlHover: string;
  controlFocus: string;
  icon: string;
}

const examples: AudioExample[] = [
  {
    id: "conversational",
    title: "Conversational",
    description: "Warm, natural delivery for everyday narration.",
    src: "/audio/example1.wav",
    record: "repeating-radial-gradient(circle at center, rgba(255,255,255,.16) 0 1px, rgba(255,255,255,0) 1px 4px), radial-gradient(circle at 35% 28%, #3d3540 0%, #1d1820 45%, #0e0d12 100%)",
    label: "radial-gradient(circle at 34% 28%, #ffb46c 0%, #ed3e59 48%, #7d173b 100%)",
    reflection: "linear-gradient(122deg, transparent 28%, rgba(255,193,133,.28) 39%, rgba(255,255,255,.08) 43%, transparent 52%)",
    control: "bg-brand",
    controlHover: "hover:bg-brand-hover",
    controlFocus: "focus-visible:ring-rose-300",
    icon: "text-white",
  },
  {
    id: "gaming",
    title: "Gaming",
    description: "Expressive delivery for character dialogue and scenes.",
    src: "/audio/example3.wav",
    record: "repeating-radial-gradient(circle at center, rgba(224,208,255,.13) 0 1px, rgba(255,255,255,0) 1px 4px), radial-gradient(circle at 38% 25%, #3d344b 0%, #1d1726 48%, #0d0b12 100%)",
    label: "radial-gradient(circle at 34% 28%, #c9b6ff 0%, #7b4dd0 50%, #402078 100%)",
    reflection: "linear-gradient(122deg, transparent 28%, rgba(202,177,255,.25) 39%, rgba(255,255,255,.07) 43%, transparent 52%)",
    control: "bg-[#8050d5]",
    controlHover: "hover:bg-[#6d3fc0]",
    controlFocus: "focus-visible:ring-violet-300",
    icon: "text-white",
  },
  {
    id: "cinematic",
    title: "Cinematic",
    description: "Dramatic tones for storytelling and immersive moments.",
    src: "/audio/example2.wav",
    record: "repeating-radial-gradient(circle at center, rgba(183,255,226,.13) 0 1px, rgba(255,255,255,0) 1px 4px), radial-gradient(circle at 38% 25%, #354b4a 0%, #172a2d 48%, #0a1118 100%)",
    label: "radial-gradient(circle at 34% 28%, #c7ffe0 0%, #36c7ad 48%, #11706d 100%)",
    reflection: "linear-gradient(122deg, transparent 28%, rgba(179,255,224,.24) 39%, rgba(255,255,255,.06) 43%, transparent 52%)",
    control: "bg-[#9debd1]",
    controlHover: "hover:bg-[#83ddc0]",
    controlFocus: "focus-visible:ring-teal-300",
    icon: "text-[#124b4c]",
  },
];

export function AudioShowcase() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});
  const recordRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const angles = useRef<Record<string, number>>({});
  const animationFrame = useRef<number | null>(null);
  const spinningId = useRef<string | null>(null);
  const lastFrame = useRef<number | null>(null);

  const stopRotation = () => {
    spinningId.current = null;
    lastFrame.current = null;
    if (animationFrame.current !== null) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
  };

  const spin = (now: number) => {
    const id = spinningId.current;
    if (!id) return;
    const last = lastFrame.current ?? now;
    const nextAngle = (angles.current[id] ?? 0) + ((now - last) * 360) / 2200;
    angles.current[id] = nextAngle % 360;
    recordRefs.current[id]?.style.setProperty("--record-rotation", `${angles.current[id]}deg`);
    lastFrame.current = now;
    animationFrame.current = requestAnimationFrame(spin);
  };

  const startRotation = (id: string) => {
    stopRotation();
    spinningId.current = id;
    animationFrame.current = requestAnimationFrame(spin);
  };

  const handlePlaying = (id: string) => {
    setPlayingId(id);
    startRotation(id);
  };

  const handleStopped = (id: string) => {
    if (playingId === id || spinningId.current === id) setPlayingId(null);
    if (spinningId.current === id) stopRotation();
  };

  const togglePlay = async (id: string) => {
    const audio = audioRefs.current[id];
    if (!audio) return;

    if (playingId === id) {
      audio.pause();
      return;
    }

    Object.entries(audioRefs.current).forEach(([key, element]) => {
      if (key !== id && element) {
        element.pause();
        element.currentTime = 0;
      }
    });

    try {
      await audio.play();
    } catch {
      handleStopped(id);
    }
  };

  useEffect(() => () => stopRotation(), []);

  return (
    <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
      {examples.map((example) => (
        <audio
          key={example.id}
          ref={(element) => { audioRefs.current[example.id] = element; }}
          src={`${example.src}?v=2`}
          preload="metadata"
          onPlaying={() => handlePlaying(example.id)}
          onPause={() => handleStopped(example.id)}
          onEnded={() => handleStopped(example.id)}
          onError={() => handleStopped(example.id)}
        />
      ))}

      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="text-3xl font-black uppercase leading-[1.05] tracking-[-0.04em] text-[#4b0018] sm:text-4xl"><span className="inline-block bg-[#ffd8df] px-1.5 py-1">VAANI · AUDIO EXAMPLES</span></h2>
        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">Hear what Vaani can create.</p>
      </div>

      <div className="grid gap-10 md:grid-cols-3 md:gap-8">
        {examples.map((example) => {
          const isPlaying = playingId === example.id;
          return (
            <div key={example.id} className="flex min-w-0 flex-col items-center text-center">
              <div className="relative flex h-64 w-full items-center justify-center">
                <div className="relative size-56 sm:size-60">
                  <span
                    ref={(element) => { recordRefs.current[example.id] = element; }}
                    className="absolute inset-0 rounded-full shadow-[0_22px_50px_rgba(15,23,42,0.2)] motion-safe:transition-[filter] motion-safe:duration-500 hover:brightness-110"
                    style={{ background: example.record, transform: "rotate(var(--record-rotation, 0deg))" }}
                    aria-hidden="true"
                  >
                    <span className="absolute inset-0 rounded-full" style={{ background: example.reflection }} aria-hidden="true" />
                    <span className="absolute inset-[39%] rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.14),0_5px_12px_rgba(0,0,0,0.4)]" style={{ background: example.label }} aria-hidden="true" />
                    <span className="absolute inset-[48%] rounded-full bg-[#17131b] shadow-inner" aria-hidden="true" />
                  </span>

                  <svg
                    viewBox="0 0 240 240"
                    className="pointer-events-none absolute inset-0 z-20 size-full overflow-visible"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient id={`tonearm-${example.id}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#0f1720" />
                        <stop offset="0.5" stopColor="#3d4650" />
                        <stop offset="1" stopColor="#0a0d12" />
                      </linearGradient>
                    </defs>
                    <circle cx="207" cy="28" r="7" fill="#111820" opacity="0.9" />
                    <circle cx="207" cy="28" r="3" fill="#66717b" />
                    <path d="M207 34 C207 48 197 54 181 64 L157 80" fill="none" stroke={`url(#tonearm-${example.id})`} strokeLinecap="round" strokeWidth="5" />
                    <path d="M158 79 L146 88" fill="none" stroke="#131a21" strokeLinecap="round" strokeWidth="7" />
                    <path d="M148 86 L141 94 L152 94 Z" fill="#0b1015" />
                    <path d="M146 86 L150 91" fill="none" stroke="#99a3aa" strokeLinecap="round" strokeWidth="1.5" />
                  </svg>

                  <button
                    type="button"
                    onClick={() => void togglePlay(example.id)}
                    aria-label={`${isPlaying ? "Pause" : "Play"} ${example.title} voice preview`}
                    aria-pressed={isPlaying}
                    className={`absolute left-1/2 top-1/2 z-30 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-[0_8px_18px_rgba(15,23,42,0.24)] outline-none transition duration-200 hover:scale-105 active:scale-95 focus-visible:ring-4 focus-visible:ring-offset-4 focus-visible:ring-offset-[#fbfaf8] ${example.controlFocus} ${example.control} ${example.controlHover}`}
                  >
                    {isPlaying ? <Pause className={`size-6 ${example.icon}`} fill="currentColor" /> : <Play className={`ml-0.5 size-6 ${example.icon}`} fill="currentColor" />}
                  </button>
                </div>
              </div>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">{example.title}</h3>
              <p className="mt-2 min-h-12 max-w-55 text-sm leading-6 text-slate-500">{example.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
