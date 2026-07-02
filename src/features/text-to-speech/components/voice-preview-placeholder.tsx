import Link from "next/link";
import { AudioLines, BookOpen, Sparkles, Volume2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function VoicePreviewPlaceholder() {
  return (
    <div className="hidden flex-1 lg:flex h-full flex-col items-center justify-center gap-6 border-t">
      <div className="flex flex-col items-center gap-2.5">
        <div className="flex items-center -space-x-2">
          <div className="rounded-full bg-cyan-50 p-3 text-cyan-600">
            <Volume2 className="size-5 -rotate-12" />
          </div>

          <div className="z-10 rounded-full bg-foreground p-3 text-background shadow-md">
            <Sparkles className="size-5" />
          </div>

          <div className="rounded-full bg-violet-50 p-3 text-violet-600">
            <AudioLines className="size-5 rotate-12" />
          </div>
        </div>

        <div className="space-y-1 text-center">
          <p className="text-base font-semibold tracking-tight">
            Preview will appear here
          </p>

          <p className="max-w-56 text-sm text-muted-foreground">
            Generate speech and your audio will appear here.
          </p>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="h-8 px-3"
        asChild
      >
        <Link href="mailto:business@vaani.com">
          <BookOpen className="size-4" />
          Need help Getting Started?
        </Link>
      </Button>
    </div>
  );
}