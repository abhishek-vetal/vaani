import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getAppUrl } from "../src/lib/env";

describe("Polar Checkout and Application URL Resolution", () => {
  const originalEnv = { ...process.env };

  const restoreEnv = () => {
    process.env = { ...originalEnv };
  };

  it("should prioritize NEXT_PUBLIC_APP_URL when set", () => {
    try {
      process.env.NEXT_PUBLIC_APP_URL = "https://vaani-ai.online";
      process.env.VERCEL_ENV = "production";
      assert.strictEqual(getAppUrl(), "https://vaani-ai.online");
    } finally {
      restoreEnv();
    }
  });

  it("should strip trailing slashes from NEXT_PUBLIC_APP_URL", () => {
    try {
      process.env.NEXT_PUBLIC_APP_URL = "https://vaani-ai.online/";
      assert.strictEqual(getAppUrl(), "https://vaani-ai.online");
    } finally {
      restoreEnv();
    }
  });

  it("should resolve to http://localhost:3000 when configured for local dev", () => {
    try {
      process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
      delete process.env.VERCEL_ENV;
      delete process.env.VERCEL_URL;
      assert.strictEqual(getAppUrl(), "http://localhost:3000");
    } finally {
      restoreEnv();
    }
  });

  it("should fallback to production domain on Vercel production if env var missing", () => {
    try {
      delete process.env.NEXT_PUBLIC_APP_URL;
      process.env.VERCEL_ENV = "production";
      assert.strictEqual(getAppUrl(), "https://vaani-ai.online");
    } finally {
      restoreEnv();
    }
  });

  it("should fallback to VERCEL_URL on Vercel preview environments", () => {
    try {
      delete process.env.NEXT_PUBLIC_APP_URL;
      delete process.env.VERCEL_ENV;
      process.env.VERCEL_URL = "vaani-preview-123.vercel.app";
      assert.strictEqual(getAppUrl(), "https://vaani-preview-123.vercel.app");
    } finally {
      restoreEnv();
    }
  });

  it("should fallback to http://localhost:3000 when no environment variables are present", () => {
    try {
      delete process.env.NEXT_PUBLIC_APP_URL;
      delete process.env.VERCEL_ENV;
      delete process.env.VERCEL_URL;
      delete process.env.VERCEL;
      delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
      assert.strictEqual(getAppUrl(), "http://localhost:3000");
    } finally {
      restoreEnv();
    }
  });

  it("should construct valid Polar checkout successUrl and returnUrl pointing to /dashboard", () => {
    try {
      process.env.NEXT_PUBLIC_APP_URL = "https://vaani-ai.online";
      const baseUrl = getAppUrl();
      const successUrl = `${baseUrl}/dashboard?checkout_id={CHECKOUT_ID}`;
      const returnUrl = `${baseUrl}/dashboard`;

      assert.strictEqual(
        successUrl,
        "https://vaani-ai.online/dashboard?checkout_id={CHECKOUT_ID}",
      );
      assert.strictEqual(returnUrl, "https://vaani-ai.online/dashboard");
      assert.ok(successUrl.includes("checkout_id={CHECKOUT_ID}"));
      assert.ok(successUrl.startsWith("https://vaani-ai.online/dashboard"));
      assert.ok(returnUrl === "https://vaani-ai.online/dashboard");
    } finally {
      restoreEnv();
    }
  });
});
