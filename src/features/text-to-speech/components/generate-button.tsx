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
  size?: "default" | "sm",
  disabled: boolean, 
  isSubmitting: boolean,
  onSubmit: () => void, 
  className?: string,
}) {
  return (
    <Button
      size={size}
      disabled={disabled}
      onClick={onSubmit}
      className={cn(
        "rounded-xl font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all active:scale-[0.98] disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none disabled:border disabled:border-slate-200",
        size === "sm" ? "h-9 px-4 text-xs" : "h-11 px-6 text-sm",
        className
      )}
      type="button"
    >
      {isSubmitting ? (
        <span className="flex items-center gap-2">
          <Spinner className="size-3.5" />
          <span>Generating...</span>
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <AudioLines className="size-3.5 opacity-70" />
          <span>Generate Speech</span>
        </span>
      )}
    </Button>
  );
}