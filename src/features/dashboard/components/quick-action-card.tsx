import { Button } from "@/components/ui/button";
import { QuickAction } from "@/features/dashboard/data/quick-actions";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function QuickActionCard({
  title,
  description,
  gradient,
  href,
}: QuickAction) {
  return (
    <div
      className="
        flex gap-4
        rounded-2xl
        border
        bg-card/70
        p-3
        transition-all
        hover:-translate-y-0.5
        hover:shadow-md
        hover:border-border
        cursor-pointer
      "
    >
      {/* Gradient Preview */}
      <div
        className={cn(
          "relative h-33 w-36 shrink-0 overflow-hidden rounded-2xl bg-linear-to-br",
          gradient
        )}
      >

        {/* Frame */}
        <div className="absolute inset-2 rounded-xl border border-white/30" />

        {/* Center Accent */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="size-14 rounded-full bg-white/20 backdrop-blur-md" />
        </div>
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
        <div className="space-y-0.5">
          <h3 className="text-sm font-semibold tracking-tight">
            {title}
          </h3>

          <p className="text-xs leading-5 text-muted-foreground">
            {description}
          </p>
        </div>

        <Button
          variant="outline"
          size="xs"
          className="
            w-fit
            rounded-lg
            border-white/40
            bg-white/70
            backdrop-blur-md
            shadow-sm
            hover:bg-white
            hover:shadow-md
            transition-all
            group
          "
          asChild
        >
          <Link href={href}>
            Try now
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}