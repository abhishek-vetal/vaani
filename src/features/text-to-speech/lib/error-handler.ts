export const TTS_ERROR_MESSAGES = {
  TEMPORARILY_UNAVAILABLE:
    "Audio generation is temporarily unavailable. Please try again.",
  USAGE_LIMIT_REACHED:
    "Audio generation limit reached. Please try again later.",
  CREDITS_EXPIRED:
    "Free credits have expired. Please upgrade to continue.",
  SUBSCRIPTION_REQUIRED: "Subscription required",
} as const;

export function classifyChatterboxError(
  status: number | undefined,
  error: unknown,
): {
  code: "FORBIDDEN" | "TOO_MANY_REQUESTS" | "INTERNAL_SERVER_ERROR";
  message: string;
} {
  const errorText =
    typeof error === "string"
      ? error
      : error && typeof error === "object"
        ? JSON.stringify(error)
        : String(error ?? "");

  // 1. Confirm if actual error explicitly proves free credits have expired
  // Do not claim that free credits have expired unless the actual error confirms it
  const isCreditsExpired =
    /credit.*(?:expired|exhausted|depleted|run\s*out|empty)/i.test(errorText);
  if (isCreditsExpired) {
    return {
      code: "FORBIDDEN",
      message: TTS_ERROR_MESSAGES.CREDITS_EXPIRED,
    };
  }

  // 2. Confirm if backend confirms a Modal usage-limit / quota issue
  const isUsageLimit =
    status === 429 ||
    status === 402 ||
    /spending\s*limit|usage\s*limit|rate\s*limit|quota\s*exceeded|concurrency\s*limit|exceeded.*quota|budget\s*exceeded/i.test(
      errorText,
    );
  if (isUsageLimit) {
    return {
      code: "TOO_MANY_REQUESTS",
      message: TTS_ERROR_MESSAGES.USAGE_LIMIT_REACHED,
    };
  }

  // 3. Generic temporary unavailability
  return {
    code: "INTERNAL_SERVER_ERROR",
    message: TTS_ERROR_MESSAGES.TEMPORARILY_UNAVAILABLE,
  };
}
