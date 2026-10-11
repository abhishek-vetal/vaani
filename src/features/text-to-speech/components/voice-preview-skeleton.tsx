import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

const WAVEFORM_BAR_HEIGHTS = [
  24, 38, 55, 32, 68, 88, 52, 28, 44, 72,
  82, 94, 58, 36, 62, 78, 100, 72, 46, 28,
  50, 76, 88, 62, 34, 48, 72, 84, 66, 42,
  58, 80, 92, 68, 44, 30, 52, 74, 86, 54,
  36, 62, 78, 90, 64, 42, 52, 70, 84, 58,
];

export function VoicePreviewSkeleton({
  title = "Generated Audio",
  className,
}: {
  title?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-full flex-col justify-between gap-8 flex-1 bg-white border-t border-slate-100",
        className
      )}
    >
      {/* Header */}
      <div className="p-6 pb-0">
        <h3 className="font-semibold text-xs text-slate-400 uppercase tracking-wider">
          {title}
        </h3>
      </div>

      {/* Waveform area skeleton */}
      <div className="relative flex flex-1 items-center justify-center px-8 min-h-24">
        <div className="flex h-20 w-full items-center justify-between gap-1 sm:gap-1.5 px-2">
          {WAVEFORM_BAR_HEIGHTS.map((height, i) => (
            <Skeleton
              key={i}
              className="flex-1 rounded-full bg-slate-200/70"
              style={{
                height: `${height}%`,
                minWidth: "2px",
                maxWidth: "4px",
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <Badge
            variant="outline"
            className="gap-2 bg-white/95 px-3 py-1.5 text-xs text-slate-600 shadow-2xs border-slate-200/80"
          >
            <Spinner className="size-3.5" />
            <span>Loading audio...</span>
          </Badge>
        </div>
      </div>

      {/* Time display skeleton */}
      <div className="flex items-center justify-center">
        <Skeleton className="h-9 w-36 rounded-lg bg-slate-100" />
      </div>

      {/* Footer skeleton */}
      <div className="flex flex-col items-center justify-center p-6 border-t border-slate-100">
        <div className="grid w-full grid-cols-3 items-center">
          {/* Metadata */}
          <div className="flex min-w-0 flex-col gap-2 pr-4">
            <Skeleton className="h-4 w-44 max-w-full rounded bg-slate-100" />
            <div className="flex items-center gap-2">
              <Skeleton className="size-4 shrink-0 rounded-full bg-slate-100" />
              <Skeleton className="h-3 w-20 rounded bg-slate-100" />
            </div>
          </div>

          {/* Player controls */}
          <div className="flex items-center justify-center gap-3">
            <Skeleton className="size-9 rounded-full bg-slate-100" />
            <Skeleton className="size-11 rounded-full bg-slate-100" />
            <Skeleton className="size-9 rounded-full bg-slate-100" />
          </div>

          {/* Download */}
          <div className="flex justify-end pl-4">
            <Skeleton className="h-9 w-24 rounded-xl bg-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function VoicePreviewMobileSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={cn("border-t border-slate-100 p-4 lg:hidden bg-white", className)}>
      <div className="grid grid-cols-[1fr_auto] items-center gap-4">
        <div className="min-w-0 space-y-2">
          <Skeleton className="h-4 w-40 max-w-full rounded bg-slate-100" />
          <div className="flex items-center gap-2">
            <Skeleton className="size-3.5 shrink-0 rounded-full bg-slate-100" />
            <Skeleton className="h-3 w-20 rounded bg-slate-100" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="size-9 rounded-full bg-slate-100" />
          <Skeleton className="h-9 w-20 rounded-xl bg-slate-100" />
        </div>
      </div>
    </div>
  );
}
