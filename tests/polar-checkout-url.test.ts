import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getAppUrl } from "../src/lib/env";

describe("Polar Checkout and Application URL Resolution", () => {
  const originalEnv = { ...process.env };

  const restoreEnv = () => {
    for (const key of Object.keys(process.env)) {
      if (!(key in originalEnv)) {
        delete (process.env as Record<string, string | undefined>)[key];
      }
    }
    for (const [key, val] of Object.entries(originalEnv)) {
      if (val !== undefined) {
        (process.env as Record<string, string | undefined>)[key] = val;
      }
    }
  };

  const envRecord = process.env as Record<string, string | undefined>;

  it("should default to canonical https://vaani-ai.online in production when no env vars are set", () => {
    try {
      delete process.env.APP_URL;
      delete process.env.NEXT_PUBLIC_APP_URL;
      delete process.env.VERCEL_URL;
      envRecord.NODE_ENV = "production";
      assert.strictEqual(getAppUrl(), "https://vaani-ai.online");
    } finally {
      restoreEnv();
    }
  });

  it("should default to http://localhost:3000 in development when no env vars are set", () => {
    try {
      delete process.env.APP_URL;
      delete process.env.NEXT_PUBLIC_APP_URL;
      delete process.env.VERCEL_URL;
      envRecord.NODE_ENV = "development";
      assert.strictEqual(getAppUrl(), "http://localhost:3000");
    } finally {
      restoreEnv();
    }
  });

  it("should prioritize APP_URL over NEXT_PUBLIC_APP_URL", () => {
    try {
      process.env.APP_URL = "https://vaani-ai.online";
      process.env.NEXT_PUBLIC_APP_URL = "https://other-url.com";
      assert.strictEqual(getAppUrl(), "https://vaani-ai.online");
    } finally {
      restoreEnv();
    }
  });

  it("should normalize www. and trailing slashes to canonical origin", () => {
    try {
      process.env.APP_URL = "https://www.vaani-ai.online/";
      assert.strictEqual(getAppUrl(), "https://vaani-ai.online");
    } finally {
      restoreEnv();
    }
  });

  it("should construct valid Polar checkout successUrl and returnUrl pointing to /dashboard", () => {
    try {
      envRecord.NODE_ENV = "production";
      delete process.env.APP_URL;
      delete process.env.NEXT_PUBLIC_APP_URL;
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

  it("should construct valid Polar customer session returnUrl pointing to /dashboard", () => {
    try {
      envRecord.NODE_ENV = "production";
      delete process.env.APP_URL;
      delete process.env.NEXT_PUBLIC_APP_URL;
      const baseUrl = getAppUrl();
      const returnUrl = `${baseUrl}/dashboard`;

      assert.strictEqual(returnUrl, "https://vaani-ai.online/dashboard");
    } finally {
      restoreEnv();
    }
  });

  it("should throw an error if APP_URL is set to localhost in production", () => {
    try {
      process.env.APP_URL = "http://localhost:3000";
      envRecord.NODE_ENV = "production";
      assert.throws(
        () => getAppUrl(),
        /APP_URL cannot be localhost in production/,
      );
    } finally {
      restoreEnv();
    }
  });

  it("should safely handle raw URLs without protocol", () => {
    try {
      process.env.APP_URL = "vaani-ai.online";
      envRecord.NODE_ENV = "production";
      assert.strictEqual(getAppUrl(), "https://vaani-ai.online");
    } finally {
      restoreEnv();
    }
  });
});
