import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner"; 
import { ClerkProvider } from "@clerk/nextjs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TRPCReactProvider } from "@/trpc/client";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Vaani",
    template: "%s | Vaani"
  },
  description: "AI powered Text to Speech and Voice cloning platform.",
};

export default function RootLayout({ children } : {children: React.ReactNode}) {
  return (
    // clerk provider wraps the html tag
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className="h-full">
        <body className={`${inter.className} min-h-siacreen antliased`}>
          <TRPCReactProvider>
            <TooltipProvider>
              <NuqsAdapter>
                {children}
              </NuqsAdapter>
            </TooltipProvider>
            <Toaster richColors />
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}