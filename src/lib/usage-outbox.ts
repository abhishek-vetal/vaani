import { polar } from "./polar";
import prisma from "./db";
import type { Prisma } from "@/generated/prisma/client";

const MAX_ATTEMPTS = 5;

export interface RecordUsageEventInput {
  externalId: string;
  eventName: string;
  customerId: string;
  properties: Record<string, string | number | boolean>;
}

export interface UsageDeliveryResult {
  success: boolean;
  externalId: string;
  status: "DELIVERED" | "PENDING" | "FAILED";
  attempts: number;
  error?: string;
}

/**
 * Persist an event durably into the UsageEvent outbox table.
 * If an event with the given externalId already exists, returns the existing record (idempotent).
 */
export async function recordUsageEvent(
  input: RecordUsageEventInput,
  tx?: Prisma.TransactionClient,
) {
  const db = tx ?? prisma;

  return db.usageEvent.upsert({
    where: { externalId: input.externalId },
    create: {
      externalId: input.externalId,
      eventName: input.eventName,
      customerId: input.customerId,
      properties: input.properties as Prisma.InputJsonValue,
      status: "PENDING",
      attempts: 0,
    },
    update: {}, // Do not overwrite if already created
  });
}

/**
 * Attempt delivery of a single usage event to Polar.
 * Automatically marks as DELIVERED if successful (or already processed by Polar as duplicate).
 */
export async function deliverUsageEvent(
  eventIdOrExternalId: string,
): Promise<UsageDeliveryResult> {
  const event = await prisma.usageEvent.findFirst({
    where: {
      OR: [{ id: eventIdOrExternalId }, { externalId: eventIdOrExternalId }],
    },
  });

  if (!event) {
    throw new Error(`Usage event not found: ${eventIdOrExternalId}`);
  }

  if (event.status === "DELIVERED") {
    return {
      success: true,
      externalId: event.externalId,
      status: "DELIVERED",
      attempts: event.attempts,
    };
  }

  const nextAttempt = event.attempts + 1;

  try {
    const response = await polar.events.ingest({
      events: [
        {
          name: event.eventName,
          externalCustomerId: event.customerId,
          externalId: event.externalId,
          metadata: (event.properties as Record<string, string | number | boolean>) ?? {},
        },
      ],
    });

    // In Polar, inserted > 0 or duplicates > 0 indicates Polar safely accepted/recorded the event
    const accepted = (response.inserted ?? 0) > 0 || (response.duplicates ?? 0) > 0;

    if (!accepted) {
      throw new Error("Polar returned 0 inserted and 0 duplicates");
    }

    await prisma.usageEvent.update({
      where: { id: event.id },
      data: {
        status: "DELIVERED",
        attempts: nextAttempt,
        deliveredAt: new Date(),
        lastError: null,
      },
    });

    return {
      success: true,
      externalId: event.externalId,
      status: "DELIVERED",
      attempts: nextAttempt,
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    const newStatus = nextAttempt >= MAX_ATTEMPTS ? "FAILED" : "PENDING";

    await prisma.usageEvent.update({
      where: { id: event.id },
      data: {
        status: newStatus,
        attempts: nextAttempt,
        lastError: errorMessage.slice(0, 1000),
      },
    });

    return {
      success: false,
      externalId: event.externalId,
      status: newStatus,
      attempts: nextAttempt,
      error: errorMessage,
    };
  }
}

/**
 * Durably record an event and attempt immediate delivery.
 * If Polar fails, returns without throwing so caller flow (audio playback/response) is uninterrupted,
 * but the billable event remains safe in the outbox for retries.
 */
export async function recordAndDispatchUsageEvent(
  input: RecordUsageEventInput,
  tx?: Prisma.TransactionClient,
): Promise<UsageDeliveryResult> {
  const recorded = await recordUsageEvent(input, tx);

  try {
    return await deliverUsageEvent(recorded.id);
  } catch (error: unknown) {
    console.error(
      `[UsageOutbox] Failed immediate delivery for event ${input.externalId}, saved as PENDING:`,
      error,
    );
    return {
      success: false,
      externalId: recorded.externalId,
      status: "PENDING",
      attempts: 0,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Flush any pending usage events that failed immediate delivery.
 * Can be invoked by a maintenance task, background job, or health check.
 */
export async function flushUsageOutbox(limit = 50): Promise<{
  processed: number;
  succeeded: number;
  failed: number;
}> {
  const pendingEvents = await prisma.usageEvent.findMany({
    where: {
      status: "PENDING",
      attempts: { lt: MAX_ATTEMPTS },
    },
    orderBy: { createdAt: "asc" },
    take: limit,
  });

  let succeeded = 0;
  let failed = 0;

  for (const event of pendingEvents) {
    const result = await deliverUsageEvent(event.id);
    if (result.success) {
      succeeded++;
    } else {
      failed++;
    }
  }

  return {
    processed: pendingEvents.length,
    succeeded,
    failed,
  };
}
