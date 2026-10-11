import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { AudioLines } from "lucide-react";
import { cn } from "@/lib/utils";

export function GenerateButton({
  size,
  disabled,
  isSubmitting,
  onSubmit,
  className,
}: {
  size?: "default" | "sm";
  disabled: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
  className?: string;
}) {
  const isGenerating = isSubmitting;
  const isInactive = disabled && !isSubmitting;

  return (
    <Button
      size={size}
      disabled={isInactive || isGenerating}
      onClick={onSubmit}
      aria-busy={isGenerating}
      className={cn(
        "group inline-flex items-center justify-center gap-2 rounded-xl text-white shadow-xs transition-all duration-150 ease-out select-none",
        "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-rose-500/30 focus-visible:ring-offset-2",
        "font-medium tracking-tight",
        size === "sm" ? "h-9 px-3.5 text-xs" : "h-11 px-5 text-sm",
        isGenerating
          ? "bg-brand-hover cursor-wait pointer-events-none disabled:opacity-100"
          : isInactive
            ? "border border-slate-200/80 bg-slate-100 text-slate-400 shadow-none cursor-not-allowed pointer-events-none disabled:opacity-100"
            : "bg-brand hover:bg-brand-hover active:bg-brand-active active:scale-[0.99] cursor-pointer",
        className,
      )}
      type="button"
    >
      {isGenerating ? (
        <span className="flex items-center gap-2">
          <Spinner className="size-3.5 text-white" />
          <span>Generating...</span>
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <AudioLines
            className={cn(
              "size-4 shrink-0 transition-opacity",
              isInactive ? "text-slate-400" : "text-white/90 group-hover:text-white",
            )}
            aria-hidden="true"
          />
          <span>Generate speech</span>
        </span>
      )}
    </Button>
  );
}