import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { deleteAudio } from "@/lib/r2";
import { createTRPCRouter, orgProcedure } from "../init";
import prisma from "@/lib/db";
import { VOICE_CATEGORY_LABELS, type VoiceCategory } from "@/features/voices/data/voice-categories";

const KNOWN_REGIONS: Record<string, string[]> = {
  US: ["united states", "usa", "america", "american", "us"],
  IN: ["india", "indian", "in", "hindi"],
  GB: ["united kingdom", "uk", "britain", "british", "england", "english", "gb"],
  AU: ["australia", "australian", "au"],
  CA: ["canada", "canadian", "ca"],
};

export const voicesRouter = createTRPCRouter({
  getAll: orgProcedure
    .input(
      z
        .object({
          query: z.string().trim().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const q = input?.query?.trim().toLowerCase();

      let searchFilter = {};

      if (q) {
        // Find any category that matches the search query
        const matchingCategories = (Object.keys(VOICE_CATEGORY_LABELS) as VoiceCategory[]).filter((cat) => {
          const label = VOICE_CATEGORY_LABELS[cat].toLowerCase();
          const key = cat.toLowerCase().replace(/_/g, " ");
          return label.includes(q) || key.includes(q) || q.includes(label) || q.includes(key);
        });

        // Find any country/region codes that match the search query
        const matchingCountryCodes = Object.entries(KNOWN_REGIONS)
          .filter(([code, aliases]) => {
            return code.toLowerCase() === q || aliases.some((alias) => alias.includes(q) || q.includes(alias));
          })
          .map(([code]) => code);

        searchFilter = {
          OR: [
            { 
              name: { 
                contains: input!.query!, 
                mode: "insensitive" as const
              } 
            },
            {
              description: {
                contains: input!.query!,
                mode: "insensitive" as const
              },
            },
            {
              language: {
                contains: input!.query!,
                mode: "insensitive" as const
              },
            },
            ...(matchingCategories.length > 0
              ? [{ category: { in: matchingCategories } }]
              : []),
            ...matchingCountryCodes.map((code) => ({
              language: {
                contains: code,
                mode: "insensitive" as const,
              },
            })),
          ],
        };
      }

      const [custom, system] = await Promise.all([
        prisma.voice.findMany({
          where: {
            variant: "CUSTOM",
            orgId: ctx.orgId,
            ...searchFilter,
          },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
            language: true,
            variant: true,
          },
        }),
        prisma.voice.findMany({
          where: {
            variant: "SYSTEM",
            ...searchFilter,
          },
          orderBy: { name: "asc" },
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
            language: true,
            variant: true,
          },
        }),
      ]);

      return { custom, system };
    }),

    delete: orgProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const voice = await prisma.voice.findUnique({
          where: {
            id: input.id,
            variant: "CUSTOM",
            orgId: ctx.orgId,
          },
          select: { id: true, r2ObjectKey: true },
        });

        if (!voice) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Voice not found",
          });
        }

        await prisma.voice.delete({ where: { id: voice.id } });

        if (voice.r2ObjectKey) {
          await deleteAudio(voice.r2ObjectKey).catch(() => {});
        }

        return { success: true };
      }),
});