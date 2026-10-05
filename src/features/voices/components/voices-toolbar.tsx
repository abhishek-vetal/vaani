import { useState } from "react";
import { useQueryState } from "nuqs";
import { useDebouncedCallback } from "use-debounce";
import { CirclePlus, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";
import { voicesSearchParams } from "@/features/voices/lib/params";
import { VoiceCreateDialog } from "./voice-create-dialog";

export function VoicesToolbar() {
  const [query, setQuery] = useQueryState(
    "query",
    voicesSearchParams.query
  );  

  const [localQuery, setLocalQuery] = useState(query);
  const [prevQuery, setPrevQuery] = useState(query);

  if (prevQuery !== query) {
    setPrevQuery(query);
    setLocalQuery(query);
  }

  const debouncedSetQuery = useDebouncedCallback(
    (value: string) => setQuery(value || null),
    250,
  );

  const handleClear = () => {
    setLocalQuery("");
    debouncedSetQuery.cancel();
    setQuery(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
          Voice Library
        </h2>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Discover natural voices or clone your own.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <InputGroup className="w-full sm:max-w-md h-10 rounded-xl border border-slate-200 bg-white shadow-xs focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-500/10">
          <InputGroupAddon align="inline-start">
            <Search className="size-4 text-slate-400" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search by name, category, or country..."
            className="text-sm placeholder:text-slate-400"
            value={localQuery}
            onChange={(e) => {
              const val = e.target.value;
              setLocalQuery(val);
              if (!val) {
                handleClear();
              } else {
                debouncedSetQuery(val);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                debouncedSetQuery.cancel();
                setQuery(localQuery || null);
              } else if (e.key === "Escape") {
                handleClear();
              }
            }}
          />
          {localQuery && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-xs"
                variant="ghost"
                className="text-slate-400 hover:text-slate-700 size-6 rounded-md"
                onClick={handleClear}
                aria-label="Clear search"
              >
                <X className="size-3.5" />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>

        {/* Custom voice action button */}
        <VoiceCreateDialog>
          <Button className="h-10 rounded-xl px-5 font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 w-full sm:w-auto shrink-0">
            <CirclePlus className="size-4" />
            <span>Create Custom Voice</span>
          </Button>
        </VoiceCreateDialog>
      </div>
    </div>
  );
};