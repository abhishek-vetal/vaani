import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { getSignedAudioUrl } from "@/lib/r2";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ generationId: string }> },
) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { generationId } = await params;

  const generation = await prisma.generation.findUnique({
    where: { id: generationId, orgId },
  });

  if (!generation) {
    return new Response("Not found", { status: 404 });
  }

  if (!generation.r2ObjectKey) {
    return new Response("Audio is not available yet", { status: 409 });
  }

  const rangeHeader = _request.headers.get("range");
  const fetchHeaders: HeadersInit = {};
  if (rangeHeader) {
    fetchHeaders["Range"] = rangeHeader;
  }

  const signedUrl = await getSignedAudioUrl(generation.r2ObjectKey);
  const audioResponse = await fetch(signedUrl, { headers: fetchHeaders });

  if (!audioResponse.ok && audioResponse.status !== 206) {
    return new Response("Failed to fetch audio", { status: 502 });
  }

  const responseHeaders = new Headers();
  responseHeaders.set(
    "Content-Type",
    audioResponse.headers.get("content-type") || "audio/wav",
  );
  responseHeaders.set("Accept-Ranges", "bytes");
  responseHeaders.set("Cache-Control", "private, max-age=3600");

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