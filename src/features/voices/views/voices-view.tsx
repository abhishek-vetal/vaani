"use client";

import { useTRPC } from "@/trpc/client";
import { useQueryState } from "nuqs";
import { useSuspenseQuery } from "@tanstack/react-query";

import { VoicesList } from "../components/voices-list";
import { voicesSearchParams } from "../lib/params";
import { VoicesToolbar } from "../components/voices-toolbar";

function VoicesContent() {
  const trpc = useTRPC();
  // this reads the query from the URL
  const [query] = useQueryState(
    "query",
    voicesSearchParams.query
  );
  const { data } = useSuspenseQuery(
    trpc.voices.getAll.queryOptions({ query })
  );

  const hasCustom = data.custom.length > 0;

  return (
    <>
      {hasCustom && <VoicesList title="Custom Voices" voices={data.custom} />}
      <VoicesList title="Built-in Voices" voices={data.system} />
      {!hasCustom && <VoicesList title="Custom Voices" voices={data.custom} />}
    </>
  );
};

export function VoicesView() {
  return (
    <div className="flex-1 space-y-6 sm:space-y-8 overflow-y-auto px-4 py-6 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <VoicesToolbar />
      <div className="space-y-6 sm:space-y-8">
        <VoicesContent />
      </div>
    </div>
  );
};