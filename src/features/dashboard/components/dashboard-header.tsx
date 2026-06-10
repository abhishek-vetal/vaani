"use client"

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { Headphones, ThumbsUp } from "lucide-react";
import Link from "next/link";

export function DashboardHeader() {
  const { isLoaded, user } = useUser()
  return (
    <div className="flex items-center justify-between ">
      <div>
        <p className="text-sm text-muted-foreground">Nice to see you</p>
        <p className="text-2xl lg:text-3xl font-semibold tracking-tight mt-1">
          {isLoaded ? (user?.fullName ?? user?.firstName ?? "there") : "..."}
        </p>
      </div>

      <div className="hidden lg:flex items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link href="mailto:business@vaani.com" className="flex gap-2">
            <ThumbsUp />
            <span>Feedback</span>
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href="mailto:business@vaani.com" className="flex gap-2">
            <Headphones />
            <span>Need help?</span>
          </Link>
        </Button>
      </div>
    </div>
  )
}