import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { UseVoiceAvatar } from "./use-voice-avatar";

interface VoiceAvatarProps {
  seed: string;
  name: string;
  className?: string;
}

export function VoiceAvatar({
  seed,
  name,
  className
}: VoiceAvatarProps) {
  const avatarUrl = UseVoiceAvatar({ seed });

  return (
    <Avatar
      className={cn("size-4 border-white shadow-xs", className)}
    >
      <AvatarImage src={avatarUrl} alt={name} />
      <AvatarFallback className="text-[8px]">
        {name.slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}