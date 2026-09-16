import { useState } from "react";
import { useQueryState } from "nuqs";
import { useDebouncedCallback } from "use-debounce";
import { CirclePlus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";
import { voicesSearchParams } from "@/features/voices/lib/params";
import { VoiceCreateDialog } from "./voice-create-dialog";

export function VoicesToolbar() {
  // this again reads the query from the URL
  const [query, setQuery] = useQueryState(
    "query",
    voicesSearchParams.query
  );  

  // what user it typing currently
  const [localQuery, setLocalQuery] = useState(query);

  // when user stops typing for 300ms, sets the URL
  const debouncedSetQuery = useDebouncedCallback(
    (value: string) => setQuery(value),
    300,
  );
` `
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl lg:text-2xl font-semibold tracking-tight">
          All Libraries
        </h2>
        <p className="text-sm text-muted-foreground">
          Discover your voices, or make your own
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">

          <InputGroup className="lg:max-w-sm">
            <InputGroupAddon>
              <Search className="size-4" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search voices..."
              value={localQuery}
              onChange={(e) => {
                setLocalQuery(e.target.value);
                debouncedSetQuery(e.target.value);
              }}
            />
          </InputGroup>

          {/* desktop custom voices button */}
          <div className="ml-auto hidden lg:block">
            <VoiceCreateDialog>
              <Button>
                <CirclePlus />
                Custom voice
              </Button>
            </VoiceCreateDialog>
          </div>
          
          {/* mobile custom voices button */}
          <div className="lg:hidden">
            <VoiceCreateDialog>
              <Button size="sm" className="w-full">
                <CirclePlus />
                Custom voice
              </Button>
            </VoiceCreateDialog>
          </div>

        </div>
      </div>
    </div>
  );
};