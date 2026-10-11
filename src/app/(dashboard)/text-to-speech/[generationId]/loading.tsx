import { Skeleton } from "@/components/ui/skeleton";
import {
  VoicePreviewSkeleton,
  VoicePreviewMobileSkeleton,
} from "@/features/text-to-speech/components/voice-preview-skeleton";

export default function TextToSpeechDetailLoading() {
  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col">
        {/* Top TextInputPanel skeleton */}
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 p-4 lg:p-6">
            <Skeleton className="h-full w-full rounded-xl bg-slate-100/90" />
          </div>

          <div className="shrink-0 p-4 lg:p-6 border-t border-slate-100/80">
            <div className="flex flex-col gap-3 lg:hidden">
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 flex-1 rounded-xl bg-slate-100" />
                <Skeleton className="size-9 rounded-xl bg-slate-100" />
              </div>
              <Skeleton className="h-9 w-full rounded-xl bg-slate-100" />
            </div>

            <div className="hidden items-center justify-between gap-4 lg:flex">
              <Skeleton className="h-6 w-40 rounded-full bg-slate-100" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-48 rounded bg-slate-100" />
                <Skeleton className="h-9 w-32 rounded-xl bg-slate-100" />
              </div>
            </div>
          </div>
        </div>

        {/* Audio part skeletons: mobile & desktop */}
        <VoicePreviewMobileSkeleton />
        <VoicePreviewSkeleton />
      </div>

      {/* Right side settings panel skeleton */}
      <div className="hidden w-96 min-h-0 flex-col border-l border-slate-200/80 bg-white lg:flex">
        <div className="border-b border-slate-100 px-3 py-2">
          <Skeleton className="h-8 w-full rounded-lg bg-slate-100" />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 space-y-6">
          <div className="space-y-3 pb-4 border-b border-slate-100">
            <Skeleton className="h-4 w-24 rounded bg-slate-100" />
            <Skeleton className="h-10 w-full rounded-xl bg-slate-100" />
          </div>

          <div className="space-y-6">
            {["creativity", "variety", "range", "flow"].map((item) => (
              <div key={item} className="space-y-2">
                <Skeleton className="h-4 w-28 rounded bg-slate-100" />
                <Skeleton className="h-3 w-full rounded-full bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
