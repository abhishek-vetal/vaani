import { describe, it } from "node:test";
import assert from "node:assert/strict";

const TTS_RATE_PER_CHARACTER = 0.002;
const MAX_CALCULATOR_CHARACTERS = 10_000_000;

function calculateTtsCost(characterCount: number): number {
  if (!Number.isFinite(characterCount) || characterCount < 0) return 0;
  const safeChars = Math.min(Math.floor(characterCount), MAX_CALCULATOR_CHARACTERS);
  return safeChars * TTS_RATE_PER_CHARACTER;
}

function formatInrWithSpace(rupees: number): string {
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rupees);
  return formatted.replace("₹", "₹ ");
}

describe("Vaani Pricing & Cost Estimation", () => {
  it("should calculate exact TTS cost at ₹0.002 per character", () => {
    assert.strictEqual(calculateTtsCost(0), 0);
    assert.strictEqual(calculateTtsCost(1), 0.002);
    assert.strictEqual(calculateTtsCost(1000), 2.00); // 1,000 chars = ₹ 2.00
    assert.strictEqual(calculateTtsCost(2500), 5.00); // 2,500 chars = ₹ 5.00
    assert.strictEqual(calculateTtsCost(5000), 10.00); // 5,000 chars = ₹ 10.00
  });

  it("should cap character count to 10,000,000 characters", () => {
    const cappedCost = calculateTtsCost(20_000_000);
    assert.strictEqual(cappedCost, 10_000_000 * 0.002);
    assert.strictEqual(cappedCost, 20_000.00);
  });

  it("should safely handle negative or invalid inputs", () => {
    assert.strictEqual(calculateTtsCost(-500), 0);
    assert.strictEqual(calculateTtsCost(NaN), 0);
    assert.strictEqual(calculateTtsCost(Infinity), 0);
  });

  it("should format INR currency strings with proper ₹ space separation", () => {
    const formatted = formatInrWithSpace(10.42);
    assert.match(formatted, /^₹\s10\.42$/);

    const zeroFormatted = formatInrWithSpace(0);
    assert.match(zeroFormatted, /^₹\s0\.00$/);
  });
});
