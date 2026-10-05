import { Headphones, ThumbsUp } from "lucide-react";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";

// this will only be avaialable to the screen size != lg if classname contains the lg:hidden
export function DashboardMobileHeader({ title, className }: { title: string, className?: string }) {
  return (
    <div
      className={cn(
        "lg:hidden sticky top-0 z-30 flex items-center justify-between border-b border-slate-100 bg-white/90 backdrop-blur-md px-4 py-3 shrink-0",
        className,
      )}
    >
      <div className="flex items-center gap-2.5">
        <SidebarTrigger className="text-slate-600 hover:text-slate-900" />
        <h1 className="text-base font-bold tracking-tight text-slate-900">{title}</h1>
      </div>

      <div className="flex items-center gap-1.5">
        <Button variant="ghost" size="icon-sm" className="rounded-full text-slate-500 hover:text-slate-900 size-8" asChild>
          <Link href="mailto:business@vaani.com" aria-label="Feedback">
            <ThumbsUp className="size-4" />
          </Link>
        </Button>
        <Button variant="ghost" size="icon-sm" className="rounded-full text-slate-500 hover:text-slate-900 size-8" asChild>
          <Link href="mailto:business@vaani.com" aria-label="Help & Support">
            <Headphones className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}