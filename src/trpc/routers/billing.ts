import { TRPCError } from "@trpc/server";
import { polar } from "@/lib/polar";
import { env } from "@/lib/env";
import { createTRPCRouter, orgProcedure } from "../init";

let cachedMeterPrices: Map<string, number> | null = null;
let lastMeterPricesFetch = 0;

async function getMeterPrices(): Promise<Map<string, number>> {
  const now = Date.now();
  if (cachedMeterPrices && now - lastMeterPricesFetch < 1000 * 60 * 5) {
    return cachedMeterPrices;
  }
  try {
    const product = await polar.products.get({ id: env.POLAR_PRODUCT_ID });
    const map = new Map<string, number>();
    for (const price of product.prices ?? []) {
      if (price.amountType === "metered_unit" && price.meterId && price.unitAmount) {
        map.set(price.meterId, parseFloat(price.unitAmount));
      }
    }
    cachedMeterPrices = map;
    lastMeterPricesFetch = now;
    return map;
  } catch (error) {
    console.error("Failed to fetch Polar product meter prices:", error);
    return cachedMeterPrices ?? new Map();
  }
}

export const billingRouter = createTRPCRouter({
  createCheckout: orgProcedure.mutation(async ({ ctx }) => {
    const result = await polar.checkouts.create({
      products: [env.POLAR_PRODUCT_ID],
      externalCustomerId: ctx.orgId,
      successUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    });

    if (!result.url) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create checkout session",
      });
    }

    return { checkoutUrl: result.url };
  }),

  createPortalSession: orgProcedure.mutation(async ({ ctx }) => {
    const result = await polar.customerSessions.create({
      externalCustomerId: ctx.orgId,
    });

    if (!result.customerPortalUrl) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create customer portal session",
      });
    }

    return { portalUrl: result.customerPortalUrl };
  }),

  getStatus: orgProcedure.query(async ({ ctx }) => {
    try {
      const customerState = await polar.customers.getStateExternal({
        externalId: ctx.orgId,
      });

      const hasActiveSubscription =
        (customerState.activeSubscriptions ?? []).length > 0;

      // Sum up invoiced costs from all meters across active subscriptions
      let invoicedCostPaise = 0;
      for (const sub of customerState.activeSubscriptions ?? []) {
        for (const meter of sub.meters ?? []) {
          invoicedCostPaise += meter.amount ?? 0;
        }
      }

      // Calculate real-time costs from activeMeters
      let realtimeCostPaise = 0;
      if (customerState.activeMeters && customerState.activeMeters.length > 0) {
        const meterPrices = await getMeterPrices();
        for (const meter of customerState.activeMeters) {
          const unitAmount = meterPrices.get(meter.meterId) ?? 0;
          realtimeCostPaise += meter.consumedUnits * unitAmount;
        }
      }

      // Whichever is higher (real-time ongoing usage vs invoiced amount)
      const estimatedCostCents = Math.max(invoicedCostPaise, realtimeCostPaise);

      return {
        hasActiveSubscription,
        customerId: customerState.id,
        estimatedCostCents,
      };
    } catch {
      // Customer doesn't exist yet in Polar
      return {
        hasActiveSubscription: false,
        customerId: null,
        estimatedCostCents: 0,
      };
    }
  }),
});