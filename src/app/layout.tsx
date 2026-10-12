import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Toaster } from "sonner"; 
import { ClerkProvider } from "@clerk/nextjs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TRPCReactProvider } from "@/trpc/client";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { UrlCleaner } from "@/components/url-cleaner";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Vaani",
    template: "%s | Vaani"
  },
  description: "AI powered Text to Speech and Voice cloning platform.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children } : {children: React.ReactNode}) {
  return (
    // clerk provider wraps the html tag
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className="h-full">
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(){try{var u=new URL(window.location.href);var p=['customer_session_token','checkout_id','session_id','token'];var m=false;p.forEach(function(k){if(u.searchParams.has(k)){u.searchParams.delete(k);m=true;}});if(m){var c=u.pathname+(u.searchParams.toString()?'?'+u.searchParams.toString():'')+u.hash;window.history.replaceState(window.history.state,'',c);}}catch(e){}})();`,
            }}
          />
        </head>
        <body className={`${jakarta.className} min-h-screen antialiased selection:bg-indigo-100 selection:text-indigo-900`}>
          <Suspense fallback={null}>
            <UrlCleaner />
          </Suspense>
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