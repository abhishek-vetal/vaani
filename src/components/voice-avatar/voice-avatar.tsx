import BoringAvatar from "boring-avatars";
import { cn } from "@/lib/utils";

// Vaani signature brand palette: coral, lavender, teal, rose, and light sky
export const VAANI_MARBLE_PALETTE = [
  "#ed3e59", // Signature Coral
  "#f43f5e", // Rose
  "#8b5cf6", // Lavender
  "#a855f7", // Violet
  "#0d9488", // Teal
  "#14b8a6", // Mint Teal
  "#fb7185", // Soft Coral
  "#38bdf8", // Sky
];

export interface VoiceAvatarProps {
  seed: string;
  name?: string;
  className?: string;
}

export function VoiceAvatar({
  seed,
  name,
  className,
}: VoiceAvatarProps) {
  return (
    <div
      role="img"
      aria-label={name ? `${name} avatar` : "Voice avatar"}
      className={cn(
        "relative inline-flex items-center justify-center shrink-0 rounded-full select-none overflow-hidden shadow-2xs border border-slate-200/80 bg-slate-50",
        className
      )}
    >
      <BoringAvatar
        size="100%"
        name={seed || name || "default"}
        variant="marble"
        colors={VAANI_MARBLE_PALETTE}
      />
    </div>
  );
}