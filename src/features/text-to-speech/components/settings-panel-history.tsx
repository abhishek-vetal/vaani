"use client";

import { useState } from "react";
import { VoiceAvatar } from "@/components/voice-avatar/voice-avatar";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  AudioLines,
  AudioWaveform,
  Clock,
  RotateCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function formatRelativeTime(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const now = new Date();
  const diffInSeconds = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000));

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  const isCurrentYear = date.getFullYear() === now.getFullYear();
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(isCurrentYear ? {} : { year: "numeric" }),
  });
}

export function SettingsPanelHistory() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const params = useParams();
  const currentGenerationId = params?.generationId as string | undefined;

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: generations,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(trpc.generations.getAll.queryOptions());

  const deleteMutation = useMutation(
    trpc.generations.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Generation deleted successfully");
        queryClient.invalidateQueries({
          queryKey: trpc.generations.getAll.queryKey(),
        });
        if (deletingId && currentGenerationId === deletingId) {
          router.push("/text-to-speech");
        }
        setDeletingId(null);
      },
      onError: (error) => {
        toast.error(error.message ?? "Failed to delete generation");
      },
    }),
  );

  // Loading state
  if (isLoading && !generations) {
    return (
      <div className="flex flex-col gap-3 p-3.5 sm:p-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col rounded-2xl border border-slate-200/60 bg-white p-4 shadow-2xs"
          >
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-4/5 rounded bg-slate-100" />
              <Skeleton className="h-3 w-3/5 rounded bg-slate-100" />
            </div>
            <div className="mt-3.5 flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Skeleton className="size-5 rounded-full bg-slate-100" />
                <Skeleton className="h-3.5 w-16 rounded bg-slate-100" />
                <Skeleton className="h-3 w-10 rounded bg-slate-100" />
              </div>
              <Skeleton className="h-6 w-12 rounded-full bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (isError && !generations) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <div className="rounded-full bg-rose-50 p-2.5 text-rose-500 ring-1 ring-rose-100 shadow-2xs">
          <AlertCircle className="size-4" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-800">
            Failed to load history
          </p>
          <p className="max-w-48 text-xs text-slate-400 leading-relaxed">
            {error?.message || "Could not retrieve your audio generations."}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="h-7 rounded-lg px-3 text-xs border-slate-200 hover:bg-slate-50 text-slate-700"
        >
          <RotateCw className="size-3 mr-1" />
          Try again
        </Button>
      </div>
    );
  }

  // Empty state
  if (!generations || generations.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8">
        <div className="flex items-center -space-x-1.5" aria-hidden="true">
          <div className="rounded-full bg-slate-100 p-2.5 text-slate-400 shadow-2xs">
            <AudioLines className="size-4 -rotate-12" />
          </div>

          <div className="z-10 rounded-full bg-slate-900 p-2.5 text-white shadow-xs">
            <AudioWaveform className="size-4" />
          </div>

          <div className="rounded-full bg-slate-100 p-2.5 text-slate-400 shadow-2xs">
            <Clock className="size-4 rotate-12" />
          </div>
        </div>

        <div className="space-y-1 text-center">
          <p className="text-xs font-semibold text-slate-900 tracking-tight">
            No generations yet
          </p>
          <p className="max-w-44 text-xs text-slate-400 leading-relaxed">
            Generate audio to see your history here.
          </p>
        </div>
      </div>
    );
  }

  const filteredGenerations = generations.filter((generation) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return (
      generation.text.toLowerCase().includes(query) ||
      generation.voiceName.toLowerCase().includes(query)
    );
  });

  return (
    <>
      {/* Compact search if history has more than 5 items */}
      {generations.length > 5 && (
        <div className="sticky top-0 z-20 border-b border-slate-100 bg-white p-2.5">
          <div className="relative flex items-center">
            <Search className="pointer-events-none absolute left-2.5 size-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-7 w-full rounded-lg border border-slate-200/80 bg-slate-50/80 pl-8 pr-7 text-xs text-slate-800 placeholder:text-slate-400 transition-colors focus:border-slate-300 focus:bg-white focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="size-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Search empty state */}
      {filteredGenerations.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 p-8 text-center">
          <p className="text-xs font-semibold text-slate-800">No matching generations</p>
          <p className="max-w-48 text-xs text-slate-400 leading-relaxed">
            No history items match &ldquo;{searchQuery}&rdquo;
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchQuery("")}
            className="h-7 text-xs text-rose-500 hover:bg-rose-50 hover:text-rose-600"
          >
            Clear search
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 p-3.5 sm:p-4">
          {filteredGenerations.map((generation) => {
            const isActive = currentGenerationId === generation.id;
            return (
              <div
                key={generation.id}
                className={cn(
                  "group relative flex flex-col rounded-2xl border p-4 transition-all duration-150",
                  isActive
                    ? "border-rose-200/90 bg-[#FFF8F8] shadow-2xs"
                    : "border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-2xs"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/text-to-speech/${generation.id}`}
                    className="min-w-0 flex-1 focus:outline-hidden after:absolute after:inset-0 after:rounded-2xl"
                    aria-label={`Open generation: ${generation.text.slice(0, 50)}`}
                  >
                    <p
                      className={cn(
                        "line-clamp-2 text-xs leading-relaxed transition-colors break-words [overflow-wrap:anywhere]",
                        isActive
                          ? "font-medium text-slate-900"
                          : "font-medium text-slate-700 group-hover:text-slate-900"
                      )}
                      title={generation.text}
                    >
                      {generation.text}
                    </p>
                  </Link>

                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="relative z-10 size-6 shrink-0 rounded-md text-slate-400 opacity-60 transition-all hover:bg-rose-50 hover:text-rose-600 sm:opacity-0 sm:group-hover:opacity-100"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDeletingId(generation.id);
                    }}
                    title="Delete generation"
                    aria-label="Delete generation"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>

                <div
                  className={cn(
                    "mt-3.5 flex items-center justify-between gap-3 pt-3 border-t pointer-events-none",
                    isActive ? "border-rose-100/80" : "border-slate-100"
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <VoiceAvatar
                      seed={generation.voiceId ?? generation.voiceName}
                      name={generation.voiceName}
                      className="size-5 shrink-0 rounded-full border border-slate-200/80 shadow-2xs"
                    />
                    <span
                      className="truncate text-xs font-semibold text-slate-700 max-w-30"
                      title={generation.voiceName}
                    >
                      {generation.voiceName}
                    </span>
                    <span className="text-slate-300 shrink-0">·</span>
                    <span
                      className="shrink-0 text-[11px] text-slate-400 font-normal"
                      title={new Date(generation.createdAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    >
                      {formatRelativeTime(generation.createdAt)}
                    </span>
                  </div>

                  {isActive ? (
                    <span className="inline-flex h-6 items-center justify-center rounded-full bg-rose-50 border border-rose-200/60 px-3 text-[11px] font-semibold text-brand shrink-0">
                      Playing
                    </span>
                  ) : (
                    <span className="inline-flex h-6 items-center justify-center rounded-full bg-slate-100 px-3 text-[11px] font-medium text-slate-700 transition-colors shrink-0 hover:bg-slate-200 hover:text-slate-900 group-hover:bg-slate-200 group-hover:text-slate-900">
                      Play
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AlertDialog
        open={Boolean(deletingId)}
        onOpenChange={(open) => {
          if (!open && !deleteMutation.isPending) {
            setDeletingId(null);
          }
        }}
      >
        <AlertDialogContent className="rounded-2xl border-slate-200 p-6 shadow-xl sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-slate-900">
              Delete generation
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to delete this generation from your history? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel
              disabled={deleteMutation.isPending}
              className="rounded-full border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteMutation.isPending}
              className="rounded-full bg-rose-600 text-xs font-medium text-white hover:bg-rose-700 shadow-xs"
              onClick={(e) => {
                e.preventDefault();
                if (deletingId) {
                  deleteMutation.mutate({ id: deletingId });
                }
              }}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}