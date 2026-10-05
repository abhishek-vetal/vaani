"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  TEXT_MAX_LENGTH,
  COST_PER_UNIT,
} from "@/features/text-to-speech/data/constants"
import { Coins, AudioLines } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function TextInputPanel() {
  const [text, setText] = useState("")
  const router = useRouter()

  const handleGenerate = () => {
    const trimmed = text.trim()
    if (!trimmed) return

    router.push(
      // encodeURIComponent is used so that dealing with special character will be easy for url 
      // space to %20 
      `/text-to-speech?text=${encodeURIComponent(trimmed)}`
    )
  }

  return (
    <div className="relative rounded-3xl border border-slate-200 bg-white shadow-sm transition-all focus-within:border-indigo-300 focus-within:ring-[3px] focus-within:ring-indigo-500/10 focus-within:shadow-md overflow-hidden">
      <div className="flex flex-col p-2">
        {/* Input Area */}
        <Textarea
          placeholder="Start typing or paste your text here..."
          maxLength={TEXT_MAX_LENGTH}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="
            min-h-[160px]
            resize-none
            border-0
            bg-transparent
            p-4
            text-lg
            leading-relaxed
            shadow-none
            text-slate-900
            placeholder:text-slate-400
            focus-visible:ring-0
            wrap-anywhere
          "
        />

        {/* Unified Bottom Control Bar */}
        <div className="mt-1 flex flex-col sm:flex-row items-center justify-between gap-4 p-2 rounded-2xl bg-slate-50/80 border border-slate-100/50">
          
          {/* Info Section */}
          <div className="flex items-center gap-4 px-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Coins className="size-3.5 text-indigo-400/80" />
              {text.length === 0 ? (
                <span>Start typing to estimate</span>
              ) : (
                <span>
                  <span className="text-slate-900 font-semibold">
                    ₹{(text.length * COST_PER_UNIT).toFixed(3)}
                  </span>{" "}
                  estimated
                </span>
              )}
            </div>
            
            <div className="h-3 w-px bg-slate-200" />
            
            <span className="text-xs font-medium text-slate-400 tabular-nums">
              {text.length.toLocaleString()} / {TEXT_MAX_LENGTH.toLocaleString()}
            </span>
          </div>

          {/* Action Button */}
          <Button
            size="sm"
            disabled={!text.trim()}
            className="
              group
              h-10 rounded-xl px-6 font-semibold w-full sm:w-auto
              bg-slate-900 text-white
              shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.15)]
              hover:bg-slate-800
              transition-all
              active:scale-[0.98]
              disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none disabled:border disabled:border-slate-200 disabled:transform-none
            "
            onClick={handleGenerate}
          >
            <AudioLines className="mr-2 size-4 opacity-70 transition-opacity group-hover:opacity-100" />
            Generate speech
          </Button>
        </div>
      </div>
    </div>
  )
}