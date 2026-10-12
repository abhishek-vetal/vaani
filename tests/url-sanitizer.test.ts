import { describe, it } from "node:test";
import assert from "node:assert/strict";

function sanitizeUrl(urlString: string): string {
  const url = new URL(urlString);
  const sensitiveParams = [
    "customer_session_token",
    "checkout_id",
    "token",
    "session_id",
  ];

  for (const param of sensitiveParams) {
    url.searchParams.delete(param);
  }

  const cleanSearch = url.searchParams.toString();
  return url.pathname + (cleanSearch ? `?${cleanSearch}` : "") + url.hash;
}

describe("URL Sanitizer & Parameter Stripping", () => {
  it("should strip customer_session_token completely from /dashboard", () => {
    const input =
      "https://vaani-ai.online/dashboard?customer_session_token=polar_cst_HGpO5iyLF6J7IblEeAJYs6GxpC6Pr5nzeE08XP3WltFB";
    const cleaned = sanitizeUrl(input);
    assert.strictEqual(cleaned, "/dashboard");
  });

  it("should strip checkout_id and session_id from URL", () => {
    const input =
      "https://vaani-ai.online/dashboard?checkout_id=chk_12345&session_id=sess_987";
    const cleaned = sanitizeUrl(input);
    assert.strictEqual(cleaned, "/dashboard");
  });

  it("should preserve legitimate query parameters like text or voiceId", () => {
    const input =
      "https://vaani-ai.online/text-to-speech?text=Hello%20World&customer_session_token=polar_cst_secret&voiceId=voice_123";
    const cleaned = sanitizeUrl(input);
    assert.strictEqual(
      cleaned,
      "/text-to-speech?text=Hello+World&voiceId=voice_123",
    );
  });

  it("should leave URLs without sensitive parameters unchanged", () => {
    const input = "https://vaani-ai.online/dashboard";
    const cleaned = sanitizeUrl(input);
    assert.strictEqual(cleaned, "/dashboard");
  });
});
