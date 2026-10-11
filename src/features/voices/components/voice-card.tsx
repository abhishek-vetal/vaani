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
    <div className="group flex items-center justify-between gap-3 sm:gap-4 rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-xs min-h-23">
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
            <Link
              href={`/text-to-speech?voiceId=${encodeURIComponent(voice.id)}`}
              className="truncate text-sm sm:text-base font-semibold text-slate-900 tracking-tight hover:text-brand transition-colors focus-visible:outline-hidden focus-visible:underline"
              title={`Use ${voice.name}`}
            >
              {voice.name}
            </Link>
            <span className="text-xs text-slate-400 font-normal shrink-0">
              · {VOICE_CATEGORY_LABELS[voice.category] ?? voice.category}
            </span>
          </div>

          <p
            className="line-clamp-1 text-xs text-slate-500 leading-relaxed break-words"
            title={voice.description ?? undefined}
          >
            {voice.description}
          </p>

          <p className="text-[11px] text-slate-400 font-medium">
            {region}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
        {/* Subtle "Use voice" action when hovered or focused */}
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-8.5 px-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-brand hover:bg-rose-50/80 transition-all opacity-0 group-hover:opacity-100 focus-visible:opacity-100 hidden sm:inline-flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-rose-500/30"
        >
          <Link
            href={`/text-to-speech?voiceId=${encodeURIComponent(voice.id)}`}
            title={`Use ${voice.name} for speech generation`}
          >
            <Mic className="size-3.5 text-slate-400 group-hover:text-brand transition-colors" />
            <span>Use voice</span>
          </Link>
        </Button>

        {/* Play/pause preview button */}
        <Button
          variant="outline"
          size="icon-sm"
          className={cn(
            "rounded-full transition-all size-9 focus-visible:ring-2 focus-visible:ring-rose-500/30",
            isPlaying
              ? "bg-brand text-white border-brand hover:bg-brand-hover shadow-xs ring-2 ring-rose-500/20"
              : "border-slate-200/90 bg-slate-50/80 text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 shadow-2xs"
          )}
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          disabled={isLoading}
          aria-label={isPlaying ? `Pause voice preview for ${voice.name}` : `Play voice preview for ${voice.name}`}
        >
          {isLoading ? (
            <Spinner className="size-3.5" />
          ) : isPlaying ? (
            <Pause className="size-3.5 fill-current" />
          ) : (
            <Play className="size-3.5 fill-current ml-0.5" />
          )}
        </Button>

        {/* Overflow menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon-sm" 
              className="rounded-full size-9 text-slate-400 hover:text-slate-900 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-rose-500/30"
              aria-label={`More options for ${voice.name}`}
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl shadow-lg border-slate-200 min-w-40">
            <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
              <Link href={`/text-to-speech?voiceId=${encodeURIComponent(voice.id)}`}>
                <Mic className="size-4 text-slate-700" />
                <span className="font-semibold text-slate-800">Use this voice</span>
              </Link>
            </DropdownMenuItem>
            {voice.variant === "CUSTOM" && (
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive focus:text-destructive cursor-pointer rounded-lg"
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