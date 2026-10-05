"use client";

import { useState } from "react";
import { VoiceAvatar } from "@/components/voice-avatar/voice-avatar";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { AudioLines, AudioWaveform, Clock, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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

export function SettingsPanelHistory() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const params = useParams();
  const currentGenerationId = params?.generationId as string | undefined;

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: generations } = useSuspenseQuery(
    trpc.generations.getAll.queryOptions(),
  );

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

  if (!generations.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8">
        <div className="flex items-center -space-x-1.5">
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

  return (
    <>
      <div className="flex flex-col gap-2 p-3">
        {generations.map((generation) => {
          const isActive = currentGenerationId === generation.id;
          return (
            <div
              key={generation.id}
              className={cn(
                "group relative flex flex-col gap-2.5 rounded-xl border p-3 transition-all duration-150",
                isActive
                  ? "border-slate-900 bg-slate-50/70 shadow-2xs ring-1 ring-slate-900/10"
                  : "border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-2xs"
              )}
            >
              <div className="flex items-start justify-between gap-2.5">
                <Link
                  href={`/text-to-speech/${generation.id}`}
                  className="min-w-0 flex-1 focus:outline-hidden"
                >
                  <p
                    className={cn(
                      "line-clamp-2 text-xs leading-relaxed transition-colors",
                      isActive
                        ? "font-semibold text-slate-900"
                        : "font-medium text-slate-700 group-hover:text-slate-900"
                    )}
                  >
                    {generation.text}
                  </p>
                </Link>

                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="size-6 shrink-0 rounded-md text-slate-400 opacity-60 transition-all hover:bg-rose-50 hover:text-rose-600 sm:opacity-0 sm:group-hover:opacity-100 -mr-1 -mt-0.5"
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

              <Link
                href={`/text-to-speech/${generation.id}`}
                className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 focus:outline-hidden"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <VoiceAvatar
                    seed={generation.voiceId ?? generation.voiceName}
                    name={generation.voiceName}
                    className="size-5 shrink-0 rounded-full border border-slate-200/80 shadow-2xs"
                  />
                  <span className="truncate text-xs font-semibold text-slate-700">
                    {generation.voiceName}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="shrink-0 text-[11px] text-slate-400 font-normal">
                    {formatDistanceToNow(new Date(generation.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>

                {isActive ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-white shadow-2xs shrink-0">
                    <AudioLines className="size-2.5" />
                    Active
                  </span>
                ) : (
                  <span className="text-[11px] font-medium text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    Play &rarr;
                  </span>
                )}
              </Link>
            </div>
          );
        })}
      </div>

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
};