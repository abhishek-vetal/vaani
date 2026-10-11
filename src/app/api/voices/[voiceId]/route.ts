import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { getSignedAudioUrl } from "@/lib/r2";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ voiceId: string }> },
) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { voiceId } = await params;

  const voice = await prisma.voice.findUnique({
    where: { id: voiceId },
    select: {
      variant: true,
      orgId: true,
      r2ObjectKey: true,
    },
  });

  if (!voice) {
    return new Response("Not found", { status: 404 });
  }

  if (voice.variant === "CUSTOM" && voice.orgId !== orgId) {
    return new Response("Not found", { status: 404 });
  }

  if (!voice.r2ObjectKey) {
    return new Response("Voice audio is not available yet", { status: 409 });
  }

  const rangeHeader = _request.headers.get("range");
  const fetchHeaders: HeadersInit = {};
  if (rangeHeader) {
    fetchHeaders["Range"] = rangeHeader;
  }

  const signedUrl = await getSignedAudioUrl(voice.r2ObjectKey);
  const audioResponse = await fetch(signedUrl, { headers: fetchHeaders });

  if (!audioResponse.ok && audioResponse.status !== 206) {
    return new Response("Failed to fetch voice audio", { status: 502 });
  }

  const contentType =
    audioResponse.headers.get("content-type") || "audio/wav";

  const responseHeaders = new Headers();
  responseHeaders.set("Content-Type", contentType);
  responseHeaders.set("Accept-Ranges", "bytes");
  responseHeaders.set(
    "Cache-Control",
    voice.variant === "SYSTEM"
      ? "public, max-age=86400"
      : "private, max-age=3600",
  );

  const contentRange = audioResponse.headers.get("content-range");
  if (contentRange) {
    responseHeaders.set("Content-Range", contentRange);
  }

  const contentLength = audioResponse.headers.get("content-length");
  if (contentLength) {
    responseHeaders.set("Content-Length", contentLength);
  }

  return new Response(audioResponse.body, {
    status: audioResponse.status,
    headers: responseHeaders,
  });
};