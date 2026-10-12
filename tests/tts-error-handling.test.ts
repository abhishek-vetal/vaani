import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  classifyChatterboxError,
  TTS_ERROR_MESSAGES,
} from "../src/features/text-to-speech/lib/error-handler";

describe("TTS & Chatterbox Error Handling & Classification", () => {
  it("should return polished temporary unavailable message for generic Chatterbox 500 error", () => {
    const result = classifyChatterboxError(500, "Internal Server Error");
    assert.strictEqual(result.code, "INTERNAL_SERVER_ERROR");
    assert.strictEqual(
      result.message,
      TTS_ERROR_MESSAGES.TEMPORARILY_UNAVAILABLE,
    );
  });

  it("should return temporary unavailable message when error is undefined or null", () => {
    const result = classifyChatterboxError(503, null);
    assert.strictEqual(result.code, "INTERNAL_SERVER_ERROR");
    assert.strictEqual(
      result.message,
      TTS_ERROR_MESSAGES.TEMPORARILY_UNAVAILABLE,
    );
  });

  it("should classify HTTP 429 as a Modal usage-limit issue without claiming credits expired", () => {
    const result = classifyChatterboxError(429, {
      detail: "Rate limit exceeded. Too many concurrent requests.",
    });
    assert.strictEqual(result.code, "TOO_MANY_REQUESTS");
    assert.strictEqual(
      result.message,
      TTS_ERROR_MESSAGES.USAGE_LIMIT_REACHED,
    );
    assert.doesNotMatch(result.message, /credit/i);
  });

  it("should classify HTTP 402 as a Modal usage/spending-limit issue", () => {
    const result = classifyChatterboxError(402, {
      detail: "Workspace spending limit reached.",
    });
    assert.strictEqual(result.code, "TOO_MANY_REQUESTS");
    assert.strictEqual(
      result.message,
      TTS_ERROR_MESSAGES.USAGE_LIMIT_REACHED,
    );
  });

  it("should classify quota/usage limit in error body even if status code is generic", () => {
    const result = classifyChatterboxError(500, "Modal usage limit exceeded for this workspace");
    assert.strictEqual(result.code, "TOO_MANY_REQUESTS");
    assert.strictEqual(
      result.message,
      TTS_ERROR_MESSAGES.USAGE_LIMIT_REACHED,
    );
  });

  it("should ONLY confirm credits expired if the error explicitly mentions credit expiry/exhaustion", () => {
    const result = classifyChatterboxError(403, "Free credits have expired for this account");
    assert.strictEqual(result.code, "FORBIDDEN");
    assert.strictEqual(
      result.message,
      TTS_ERROR_MESSAGES.CREDITS_EXPIRED,
    );
  });

  it("should NOT claim credits expired for generic rate limit or spending limit errors", () => {
    const result1 = classifyChatterboxError(429, "Too many requests");
    assert.doesNotMatch(result1.message, /credit/i);

    const result2 = classifyChatterboxError(502, "Bad Gateway");
    assert.doesNotMatch(result2.message, /credit/i);

    const result3 = classifyChatterboxError(400, "Invalid voice key");
    assert.doesNotMatch(result3.message, /credit/i);
  });
});
