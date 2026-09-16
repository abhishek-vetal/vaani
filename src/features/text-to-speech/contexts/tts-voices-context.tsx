"use client"

// AppRouter is complete tRPC router type
import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";
import { createContext, useContext } from "react";

// Take the return type of voices.getAll, go to its system array, and get the type of one item in that array
type TTSVoiceItem = inferRouterOutputs<AppRouter>["voices"]["getAll"]["system"][number]

interface TTSVoicesContextValue {
  customVoices: TTSVoiceItem[];
  systemVoices: TTSVoiceItem[];
  allVoices: TTSVoiceItem[];
}

// we are providing either voices data or null to the generic function
const TTSVoicesContext = createContext<TTSVoicesContextValue | null>(null)

export function TTSVoicesProvider({
  children,
  value
}: {
  children: React.ReactNode;
  value: TTSVoicesContextValue;
}) {
  return (
    <TTSVoicesContext.Provider value={value}>
      {children}
    </TTSVoicesContext.Provider>
  )
}

export function useTTSVoices() {
  const context = useContext(TTSVoicesContext)

  if (!context) {
    throw new Error("useTTSVoices must be used within a TTSVoicesProvider children");
  }

  return context;
}