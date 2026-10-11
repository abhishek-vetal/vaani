import { useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useCheckout } from "../hooks/use-checkout";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";

function formatCurrency(cents: number): string {
  const rupees = cents / 100;
  const fractionDigits = rupees > 0 && rupees < 1 ? 3 : 2;
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: fractionDigits,
  }).format(rupees);

  return formatted.replace("₹", "₹ ");
}

function UpgradeCard() {
  const { checkout, isPending: isCheckoutPending } = useCheckout();

  return (
    <div className="flex flex-col gap-3.5">
      <div>
        <p className="text-sm font-semibold tracking-tight text-slate-900">
          Pay as you go
        </p>
        <p className="mt-1 text-xs text-slate-500 leading-normal">
          Generate speech starting at ₹ 0.002 per character
        </p>
      </div>
      <Button
        className="h-8.5 w-full rounded-xl bg-brand text-xs font-semibold text-white shadow-2xs transition-all hover:bg-brand-hover active:bg-brand-active cursor-pointer"
        disabled={isCheckoutPending}
        onClick={checkout}
      >
        {isCheckoutPending ? (
          <>
            <Spinner className="mr-1.5 size-3.5" />
            Redirecting...
          </>
        ) : (
          "Upgrade"
        )}
      </Button>
    </div>
  );
};

function UsageCard({ 
  estimatedCostCents
}: { 
  estimatedCostCents: number
}) {
  const trpc = useTRPC();
  const portalMutation = useMutation(
    trpc.billing.createPortalSession.mutationOptions({}),
  );

  const openPortal = useCallback(() => {
    portalMutation.mutate(undefined, {
      onSuccess: (data) => {
        window.open(data.portalUrl, "_blank");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to open customer portal");
      },
    });
  }, [portalMutation]);

  return (
    <div className="flex flex-col gap-3.5">
      <div>
        <p className="text-sm font-semibold tracking-tight text-slate-900">
          Estimated usage
        </p>
        <p className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
          {formatCurrency(estimatedCostCents)}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Estimated this period
        </p>
      </div>
      <Button
        variant="outline"
        className="h-8.5 w-full rounded-xl border-slate-200/90 bg-white text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
        disabled={portalMutation.isPending}
        onClick={openPortal}
      >
        {portalMutation.isPending ? (
          <>
            <Spinner className="mr-1.5 size-3.5" />
            Redirecting...
          </>
        ) : (
          "Manage billing"
        )}
      </Button>
    </div>
  );
};

export function UsageContainer() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.billing.getStatus.queryOptions());

  return (
    <div className="group-data-[collapsible=icon]:hidden rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
      {data?.hasActiveSubscription ? (
        <UsageCard estimatedCostCents={data.estimatedCostCents} />
      ) : (
        <UpgradeCard />
      )}
    </div>
  );
};