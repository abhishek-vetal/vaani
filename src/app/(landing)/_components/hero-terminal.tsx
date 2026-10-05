"use client";

import { useState } from "react";
import Link from "next/link";
import { Play, Settings2, Volume2 } from "lucide-react";

export function HeroTerminal() {
  const [text, setText] = useState(
    "The future of voice technology is here. Generate highly realistic, human-like speech in seconds. Whether you're producing an audiobook, a podcast, or a video game, Vaani delivers unmatched audio quality."
  );

  const MAX_CHARS = 333;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (newText.length <= MAX_CHARS) {
      setText(newText);
    }
  };

  return (
    <div className="mt-16 w-full max-w-4xl overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
      {/* Top Bar - Voice Selection */}
      <div className="flex items-center justify-between border-b border-slate-200/50 bg-white/50 px-4 py-3">
        <button className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100">
          <div className="flex size-5 items-center justify-center rounded-full bg-rose-100">
            <Volume2 className="size-3 text-rose-600" />
          </div>
          Adam (Narrative)
        </button>

        <button className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900">
          <Settings2 className="size-4" />
          Voice Settings
        </button>
      </div>

      {/* Text Area */}
      <div className="relative">
        <textarea
          value={text}
          onChange={handleChange}
          className="h-64 w-full resize-none bg-transparent p-6 text-lg text-slate-800 placeholder:text-slate-400 focus:outline-none sm:text-xl sm:leading-relaxed"
          placeholder="Type your text here..."
        />
      </div>

      {/* Bottom Bar - Controls */}
      <div className="flex items-center justify-between border-t border-slate-200/50 bg-white/30 px-6 py-4">
        <div className="text-sm font-medium text-slate-400">
          {text.length} / {MAX_CHARS}
        </div>
        
        <Link href="/sign-up">
          <button className="flex items-center gap-2 rounded-full bg-rose-600 py-2.5 pl-5 pr-6 text-sm font-medium text-white shadow-md shadow-rose-500/20 transition-transform hover:scale-105 hover:bg-rose-700 active:scale-95">
            <div className="flex size-6 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm">
              <Play className="size-3 ml-0.5" fill="currentColor" />
            </div>
            Generate Audio
          </button>
        </Link>
      </div>
    </div>
  );
}
