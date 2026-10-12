import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

export const env = createEnv({
  server: {
    POLAR_ACCESS_TOKEN: z.string().min(1),
    POLAR_SERVER: z.enum(["sandbox", "production"]).default("sandbox"),
    POLAR_PRODUCT_ID: z.string().min(1),
    POLAR_METER_VOICE_CREATION: z.string().min(1),
    POLAR_METER_TTS_GENERATION: z.string().min(1),
    POLAR_METER_TTS_PROPERTY: z.string().min(1),
    DATABASE_URL: z.string().min(1),
    R2_ACCOUNT_ID: z.string().min(1),
    R2_ACCESS_KEY_ID: z.string().min(1),
    R2_SECRET_ACCESS_KEY: z.string().min(1),
    R2_BUCKET_NAME: z.string().min(1),
    CHATTERBOX_API_URL: z.url(),
    CHATTERBOX_API_KEY: z.string().min(1),
    APP_URL: z.string().url().optional(),
  },

  client: {
    NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  },

  experimental__runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  skipValidation:
    !!process.env.SKIP_ENV_VALIDATION ||
    process.env.npm_lifecycle_event === "lint" ||
    (Boolean(process.env.VERCEL) && !process.env.DATABASE_URL) ||
    (process.env.VERCEL_ENV === "preview" && !process.env.DATABASE_URL),
});

export function getAppUrl(): string {
  const isProduction =
    process.env.VERCEL_ENV === "production" ||
    process.env.NODE_ENV === "production";

  const raw =
    process.env.APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (isProduction
      ? "https://vaani-ai.online"
      : "http://localhost:3000");

  const trimmed = raw.trim();
  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  const url = new URL(withProtocol);

  if (
    isProduction &&
    ["localhost", "127.0.0.1", "::1", "[::1]"].includes(url.hostname)
  ) {
    throw new Error(
      "Invalid configuration: APP_URL cannot be localhost in production.",
    );
  }

  if (url.hostname.startsWith("www.")) {
    url.hostname = url.hostname.slice(4);
  }

  return url.origin;
}
