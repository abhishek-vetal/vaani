"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { Headphones, ThumbsUp } from "lucide-react";
import Link from "next/link";

export function DashboardHeader() {
  const { isLoaded, user } = useUser();
  const name = isLoaded ? (user?.firstName ?? user?.fullName ?? "there") : "there";

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">Nice to see you, {name}</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-charcoal sm:text-3xl">
          Create something with Vaani.
        </h1>
      </div>

      <div className="hidden items-center gap-2 lg:flex">
        <Button variant="outline" size="sm" asChild className="rounded-full border-slate-200 bg-white text-slate-600 shadow-none hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700">
          <Link href="mailto:business@vaani-ai.online" className="flex gap-2">
            <ThumbsUp className="size-4" />
            <span>Feedback</span>
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild className="rounded-full border-slate-200 bg-white text-slate-600 shadow-none hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700">
          <Link href="mailto:business@vaani-ai.online" className="flex gap-2">
            <Headphones className="size-4" />
            <span>Need help?</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}