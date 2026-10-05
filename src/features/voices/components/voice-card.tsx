import Link from "next/link";
import { Mic, MoreHorizontal, Pause, Play, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { VoiceAvatar } from "@/components/voice-avatar/voice-avatar";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/trpc/routers/_app";
import { VOICE_CATEGORY_LABELS } from "@/features/voices/data/voice-categories";
import { useAudioPlayback } from "@/hooks/use-audio-playback";
import { useTRPC } from "@/trpc/client";
import { useState } from "react";

export type VoiceItem =
  inferRouterOutputs<AppRouter>["voices"]["getAll"]["custom"][number];

interface VoiceCardProps {
  voice: VoiceItem;
};

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

function parseLanguage(locale: string) {
  const [, country] = locale.split("-");
  if (!country) return { region: locale };

  const region = regionNames.of(country) ?? country;
  return { region };
};

export function VoiceCard({ voice }: VoiceCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { region } = parseLanguage(voice.language);

  const audioSrc = `/api/voices/${encodeURIComponent(voice.id)}`;
  const { isPlaying, isLoading, togglePlay } = useAudioPlayback(audioSrc);

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const deleteMutation = useMutation(
    trpc.voices.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Voice deleted successfully");
        queryClient.invalidateQueries({
          queryKey: trpc.voices.getAll.queryKey(),
        });
      },
      onError: (error) => {
        toast.error(error.message ?? "Failed to delete voice");
      },
    }),
  );

  return (
    <div className="group flex items-center justify-between gap-3 sm:gap-4 rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-xs">
      <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
        {/* Proportional circular avatar */}
        <VoiceAvatar
          seed={voice.id}
          name={voice.name}
          className="size-11 sm:size-12 shrink-0 rounded-full border border-slate-200/80 shadow-2xs"
        />

        {/* Voice Details */}
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
          <div className="flex items-center gap-2 min-w-0">
            <span className="truncate text-sm sm:text-base font-semibold text-slate-900 tracking-tight">
              {voice.name}
            </span>
            <span className="text-xs text-slate-400 font-normal shrink-0">
              · {VOICE_CATEGORY_LABELS[voice.category]}
            </span>
          </div>

          <p className="line-clamp-1 text-xs text-slate-500 leading-relaxed">
            {voice.description}
          </p>

          <p className="text-[11px] text-slate-400 font-medium">
            {region}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
        <Button
          variant="outline"
          size="icon-sm"
          className={cn(
            "rounded-full transition-all size-9",
            isPlaying
              ? "bg-slate-900 text-white border-slate-900 hover:bg-slate-800 shadow-xs"
              : "border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 shadow-2xs"
          )}
          onClick={togglePlay}
          disabled={isLoading}
          aria-label={isPlaying ? "Pause voice preview" : "Play voice preview"}
        >
          {isLoading ? (
            <Spinner className="size-3.5" />
          ) : isPlaying ? (
            <Pause className="size-3.5 fill-current" />
          ) : (
            <Play className="size-3.5 fill-current ml-0.5" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon-sm" 
              className="rounded-full size-9 text-slate-400 hover:text-slate-900 hover:bg-slate-100"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl shadow-lg border-slate-200">
            <DropdownMenuItem asChild className="rounded-lg">
              <Link href={`/text-to-speech?voiceId=${voice.id}`}>
                <Mic className="size-4 text-slate-700" />
                <span className="font-semibold text-slate-800">Use this voice</span>
              </Link>
            </DropdownMenuItem>
            {voice.variant === "CUSTOM" && (
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="size-4 text-destructive" />
                <span className="font-medium">Delete voice</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {voice.variant === "CUSTOM" && (
          <AlertDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete voice</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &quot;{voice.name}&quot;? This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleteMutation.isPending}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  disabled={deleteMutation.isPending}
                  onClick={(e) => {
                    e.preventDefault();
                    deleteMutation.mutate(
                      { id: voice.id },
                      { onSuccess: () => setShowDeleteDialog(false) },
                    );
                  }}
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
};