"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  TEXT_MAX_LENGTH,
  COST_PER_UNIT,
} from "@/features/text-to-speech/data/constants"
import { Coins } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function TextInputPanel() {
  const [text, setText] = useState("")
  const router = useRouter()

  const handleGenerate = () => {
    const trimmed = text.trim()
    if (!trimmed) return

    router.push(
      `/text-to-speech?text=${encodeURIComponent(trimmed)}`
    )
  }

  return (
    <div
      className="
      rounded-[28px]
      bg-linear-to-br
      from-cyan-400
      via-fuchsia-300
      to-cyan-100
      p-px
      shadow-md
    "
    >
      <div
        className="
        rounded-[27px]
        bg-background/90
        backdrop-blur-xl
      "
      >
        {/* Input Area */}
        <div
          className="rounded-t-[27px] bg-card p-5" 
        >
          <Textarea
            placeholder="Start typing or paste your text here..."
            maxLength={TEXT_MAX_LENGTH}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="
              h-41
              resize-none
              overflow-y-auto
              border-0
              bg-transparent
              p-1
              text-base
              leading-7
              shadow-none
              placeholder:text-muted-foreground/70
              focus-visible:ring-0
              wrap-anywhere
            "
          />

          {/* Bottom Info */}
          <div className="mt-5 flex items-center justify-between">
            <Badge
              variant="outline"
              className="flex gap-2 bg-white/30"
            >
              <Coins className="text-chart-5" />

              <span className="text-xs">
                {text.length === 0 ? (
                  "Start typing to estimate"
                ) : (
                  <>
                    <span className="tabular-nums font-medium">
                      ₹{(text.length * COST_PER_UNIT).toFixed(4)}
                    </span>{" "}
                    estimated
                  </>
                )}
              </span>
            </Badge>

            <span className="text-xs text-muted-foreground tabular-nums">
              {text.length.toLocaleString()} / {TEXT_MAX_LENGTH.toLocaleString()} characters
            </span>
          </div>
        </div>

        {/* Action Bar */}
        <div
          className="
          flex
          items-center
          justify-end
          border-t
          px-5
          py-3
        "
        >
          <Button
            size="sm"
            disabled={!text.trim()}
            className="
              h-10
              rounded-xl
              px-5
              font-medium
              w-full
              lg:w-auto
            "
            onClick={handleGenerate}
          >
            Generate speech
          </Button>
        </div>
      </div>
    </div>
  )
}