"use client";

import { useState, useRef } from "react";
import { Play, Pause } from "lucide-react";

interface AudioExample {
  id: string;
  title: string;
  description: string;
  src: string;
  gradient: string;
}

const examples: AudioExample[] = [
  {
    id: "ex1",
    title: "Conversational",
    description: "Natural voices perfect for informal scenarios.",
    src: "/audio/example1.wav",
    gradient: "radial-gradient(circle at 40% 35%, #f97316 0%, #dc2626 40%, #1e1b4b 75%, #0f172a 100%)",
  },
  {
    id: "ex3",
    title: "Gaming",
    description: "Intense, character-driven voice acting for NPCs.",
    src: "/audio/example3.wav",
    gradient: "radial-gradient(circle at 60% 40%, #c4b5fd 0%, #a78bfa 40%, #6d28d9 75%, #2e1065 100%)",
  },
  {
    id: "ex2",
    title: "Cinematic",
    description: "Powerful, dramatic voices for storytelling.",
    src: "/audio/example2.wav",
    gradient: "radial-gradient(circle at 55% 40%, #86efac 0%, #34d399 30%, #0891b2 60%, #1e3a5f 100%)",
  },
];

export function AudioShowcase() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string>(examples[0].id);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});

  const togglePlay = (id: string) => {
    const audioElement = audioRefs.current[id];
    if (!audioElement) return;

    if (playingId === id) {
      audioElement.pause();
      setPlayingId(null);
    } else {
      // stop others
      Object.entries(audioRefs.current).forEach(([key, el]) => {
        if (key !== id && el) el.pause();
      });
      setActiveId(id);
      audioElement.play()
        .then(() => setPlayingId(id))
        .catch(() => setPlayingId(null));
    }
  };

  const handleOrbClick = (id: string) => {
    setActiveId(id);
    togglePlay(id);
  };

  return (
    <section className="w-full max-w-7xl px-6 py-12 lg:px-8 overflow-hidden">
      {/* Hidden audio elements */}
      {examples.map((ex) => (
        <audio
          key={ex.id}
          ref={(el) => { if (el) audioRefs.current[ex.id] = el; }}
          src={`${ex.src}?v=2`}
          onEnded={() => setPlayingId(null)}
          preload="metadata"
        />
      ))}

      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Listen to what&apos;s possible
        </h2>
        <p className="mt-4 text-slate-600 text-lg">
          Indistinguishable from human voices. Generated in milliseconds.
        </p>
      </div>

      {/* Multi-orb layout */}
      <div className="flex flex-wrap items-end justify-center gap-8 sm:gap-12">
        {examples.map((example) => {
          const isActive = activeId === example.id;
          const isPlaying = playingId === example.id;

          return (
            <div
              key={example.id}
              className="flex flex-col items-center gap-6 transition-all duration-500"
            >
              {/* Orb */}
              <div className="relative">
                <button
                  onClick={() => handleOrbClick(example.id)}
                  className={`block rounded-full shadow-[0_8px_40px_rgb(0,0,0,0.12)] transition-all duration-500 ${
                    isActive
                      ? "size-48 sm:size-56 opacity-100"
                      : "size-32 sm:size-40 opacity-70 hover:opacity-100 hover:scale-105"
                  }`}
                  style={{ background: example.gradient }}
                >
                  {/* Play button — only on active orb */}
                  {isActive && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full">
                      <div className="flex size-14 items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-xl transition-transform hover:scale-110 active:scale-95">
                        {isPlaying ? (
                          <Pause className="size-6 text-slate-900" fill="currentColor" />
                        ) : (
                          <Play className="size-6 text-slate-900 ml-1" fill="currentColor" />
                        )}
                      </div>
                    </div>
                  )}
                </button>

                {/* Pulse ring while playing */}
                {isPlaying && (
                  <div
                    className="pointer-events-none absolute inset-0 animate-ping rounded-full opacity-20"
                    style={{ background: example.gradient }}
                  />
                )}
              </div>

              {/* Label */}
              <div className="text-center h-16">
                <div className="flex items-center justify-center gap-1">
                  <h3 className={`text-base font-semibold transition-colors duration-300 ${isActive ? "text-slate-900" : "text-slate-500"}`}>
                    {example.title}
                  </h3>
                  {isActive && <span className="text-blue-500">✨</span>}
                </div>
                {isActive && (
                  <p className="mt-1 max-w-[180px] text-sm text-slate-500 leading-snug">
                    {example.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
