import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { TooltipProvider } from "@/components/ui/tooltip";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-screen">
        <ClerkProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster richColors />
        </ClerkProvider>
      </body>
    </html>
  );
}
