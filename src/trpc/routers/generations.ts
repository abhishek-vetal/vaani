import { z } from "zod";
import { polar } from "@/lib/polar";
import { env } from "@/lib/env";
import { TRPCError } from "@trpc/server";
import { chatterbox } from "@/lib/chatterbox-client";
import prisma from "@/lib/db";
import { uploadAudio } from "@/lib/r2";
import { TEXT_MAX_LENGTH } from "@/features/text-to-speech/data/constants";
import { createTRPCRouter, orgProcedure } from "../init";

// this router is basically a collection of backend operations related to generations
export const generationsRouter = createTRPCRouter({
  getById: orgProcedure
    .input(z.object({
      id: z.string()
    }))
    // we use query since we are reading the data
    .query(async ({ input, ctx }) => {
      const generation = await prisma.generation.findUnique({
        where: { id: input.id, orgId: ctx.orgId },
        // we are not going to send orgId, r2ObjectKey since this is not required to user
        // we hide the r2ObjectKey since its a internal storage detail
        omit: {
          orgId: true,
          r2ObjectKey: true,
        },
      });

      if (!generation) {
        // we use TRPCError to throw error from the backend
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return {
        ...generation,
        audioUrl: `/api/audio/${generation.id}`,
      };
    }),

  getAll: orgProcedure
    .query(async ({ ctx }) => {
      const generations = await prisma.generation.findMany({
        where: { orgId: ctx.orgId },
        orderBy: { createdAt: "desc" },
        omit: {
          orgId: true,
          r2ObjectKey: true,
        },
      });

      if (!generations) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return generations;
    }),

  // zod validation 
  //  Frontend validation
  // → better UX

  // Backend validation
  // → security + data integrity
  create: orgProcedure
    .input(
      z.object({
        text: z.string().min(1).max(TEXT_MAX_LENGTH),
        voiceId: z.string().min(1),
        temperature: z.number().min(0).max(2).default(0.8),
        topP: z.number().min(0).max(1).default(0.95),
        topK: z.number().min(1).max(10000).default(1000),
        repetitionPenalty: z.number().min(1).max(2).default(1.2),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Check for active subscription before generation
      try {
        const customerState = await polar.customers.getStateExternal({
          externalId: ctx.orgId,
        });
        const hasActiveSubscription =
          (customerState.activeSubscriptions ?? []).length > 0;
        if (!hasActiveSubscription) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "SUBSCRIPTION_REQUIRED",
          });
        }
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        // Customer doesn't exist in Polar yet -> no subscription
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "SUBSCRIPTION_REQUIRED",
        });
      }

      // finding voice to generate audio 
      const voice = await prisma.voice.findUnique({
        where: {
          id: input.voiceId,
          OR: [
            { variant: "SYSTEM" },
            { variant: "CUSTOM", orgId: ctx.orgId, }
          ],
        },
        select: {
          id: true,
          name: true,
          r2ObjectKey: true,
        },
      });

      if (!voice) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Voice not found",
        });
      }

      // The voice record exists, but we can't generate audio 
      // because the underlying voice audio isn't available
      if (!voice.r2ObjectKey) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Voice audio not available",
        });
      }

      const { data, error } = await chatterbox.POST("/generate", {
        body: {
          prompt: input.text,
          voice_key: voice.r2ObjectKey,
          temperature: input.temperature,
          top_p: input.topP,
          top_k: input.topK,
          repetition_penalty: input.repetitionPenalty,
          norm_loudness: true,
        },
        // treat the response as binary data rather than normal JSON
        parseAs: "arrayBuffer",
      });

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate audio",
        });
      }

      // make sure the actual response is really binary audio data
      if (!(data instanceof ArrayBuffer)) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Invalid audio response",
        });
      }

      const buffer = Buffer.from(data);
      let generationId: string | null = null;
      let r2ObjectKey: string | null = null;

      try {
        const generation = await prisma.generation.create({
          data: {
            orgId: ctx.orgId,
            text: input.text,
            voiceName: voice.name,
            voiceId: voice.id,
            temperature: input.temperature,
            topP: input.topP,
            topK: input.topK,
            repetitionPenalty: input.repetitionPenalty,
          },
          select: {
            id: true,
          },
        });

        generationId = generation.id;
        r2ObjectKey = `generations/orgs/${ctx.orgId}/${generation.id}`;

        await uploadAudio({ buffer, key: r2ObjectKey });

        await prisma.generation.update({
          where: {
            id: generation.id,
          },
          data: {
            r2ObjectKey,
          },
        });

      } catch {
        if (generationId) {
          await prisma.generation
            .delete({
              where: {
                id: generationId,
              },
            })
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to store generated audio",
        });
      }

      if (!generationId || !r2ObjectKey) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to store generated audio",
        });
      }

      // Ingest usage event to Polar (fire-and-forget, don't block response)
      polar.events
        .ingest({
          events: [
            {
              name: env.POLAR_METER_TTS_GENERATION,
              externalCustomerId: ctx.orgId,
              metadata: { [env.POLAR_METER_TTS_PROPERTY]: input.text.length },
            },
          ],
        })
        .catch((error) => {
          console.error("Failed to ingest Polar TTS generation event:", error);
        });

      return {
        id: generationId,
      };
    }),
}); 