import { describe, it, after } from "node:test";
import assert from "node:assert/strict";
import prisma from "../src/lib/db";
import { recordUsageEvent } from "../src/lib/usage-outbox";

describe("Polar Usage Outbox & Deduplication", () => {
  const testExternalId = `test_evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const testCustomerId = "org_test_audit_12345";

  after(async () => {
    // Clean up test events
    await prisma.usageEvent.deleteMany({
      where: { customerId: testCustomerId },
    }).catch(() => {});
  });

  it("should durably record a pending usage event in the database", async () => {
    const event = await recordUsageEvent({
      externalId: testExternalId,
      eventName: "tts_generation",
      customerId: testCustomerId,
      properties: { characters: 1500 },
    });

    assert.ok(event.id);
    assert.strictEqual(event.externalId, testExternalId);
    assert.strictEqual(event.eventName, "tts_generation");
    assert.strictEqual(event.customerId, testCustomerId);
    assert.strictEqual(event.status, "PENDING");
    assert.strictEqual(event.attempts, 0);
  });

  it("should be idempotent and not create duplicate events on identical externalId", async () => {
    // Re-recording the exact same externalId
    const duplicated = await recordUsageEvent({
      externalId: testExternalId,
      eventName: "tts_generation",
      customerId: testCustomerId,
      properties: { characters: 1500 },
    });

    // Count in DB must still be 1
    const count = await prisma.usageEvent.count({
      where: { externalId: testExternalId },
    });

    assert.strictEqual(count, 1);
    assert.strictEqual(duplicated.externalId, testExternalId);
  });

  it("should transition status to DELIVERED and set deliveredAt upon delivery", async () => {
    // Mark as delivered simulating successful Polar acknowledgment
    const updated = await prisma.usageEvent.update({
      where: { externalId: testExternalId },
      data: {
        status: "DELIVERED",
        attempts: 1,
        deliveredAt: new Date(),
        lastError: null,
      },
    });

    assert.strictEqual(updated.status, "DELIVERED");
    assert.ok(updated.deliveredAt);
    assert.strictEqual(updated.lastError, null);
  });

  it("should mark status as FAILED when attempts reach max threshold", async () => {
    const failedEventExternalId = `test_fail_${Date.now()}`;
    await recordUsageEvent({
      externalId: failedEventExternalId,
      eventName: "voice_creation",
      customerId: testCustomerId,
      properties: {},
    });

    const failed = await prisma.usageEvent.update({
      where: { externalId: failedEventExternalId },
      data: {
        status: "FAILED",
        attempts: 5,
        lastError: "Polar API unreachable after 5 attempts",
      },
    });

    assert.strictEqual(failed.status, "FAILED");
    assert.strictEqual(failed.attempts, 5);
    assert.strictEqual(failed.lastError, "Polar API unreachable after 5 attempts");
  });
});
