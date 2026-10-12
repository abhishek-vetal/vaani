import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("HTTP Authorization & Middleware Behavior", () => {
  const baseUrl = process.env.TEST_BASE_URL || "http://localhost:3000";

  it("should return HTTP 401 Unauthorized JSON for unauthenticated API requests", async () => {
    const res = await fetch(`${baseUrl}/api/voices/create`, {
      method: "POST",
    });

    assert.strictEqual(res.status, 401);
    const contentType = res.headers.get("content-type");
    assert.match(contentType || "", /application\/json/);
    const body = await res.json();
    assert.strictEqual(body.error, "Unauthorized");
  });

  it("should return HTTP 401 Unauthorized for audio streaming without session", async () => {
    const res = await fetch(`${baseUrl}/api/audio/test-generation-id`, {
      method: "GET",
    });

    assert.strictEqual(res.status, 401);
    const body = await res.json();
    assert.strictEqual(body.error, "Unauthorized");
  });

  it("should return HTTP 307 redirect to /sign-in for unauthenticated browser pages", async () => {
    const res = await fetch(`${baseUrl}/dashboard`, {
      redirect: "manual",
    });

    assert.strictEqual(res.status, 307);
    const location = res.headers.get("location");
    assert.ok(location);
    assert.match(location, /\/sign-in/);
  });

  it("should allow public access to the landing page with HTTP 200", async () => {
    const res = await fetch(`${baseUrl}/`, {
      redirect: "manual",
    });

    assert.strictEqual(res.status, 200);
  });
});
