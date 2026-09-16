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
        "flex items-center justify-between border-b px-4 py-4",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm">
          <Link href="mailto:business@vaani.com">
            <ThumbsUp />
          </Link>
        </Button>
        <Button variant="outline" size="sm">
          <Link href="mailto:business@vaani.com">
            <Headphones />
          </Link>
        </Button>
      </div>
    </div>
  )
}