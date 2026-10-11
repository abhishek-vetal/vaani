import Image from "next/image";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LandingSectionLink } from "./_components/landing-section-link";

export default async function LandingLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-[#fbfaf8] text-charcoal selection:bg-rose-200 selection:text-rose-950 font-sans">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Vaani logo" width={24} height={24} className="shrink-0" />
            <span className="text-xl font-bold tracking-tight text-charcoal">Vaani</span>
          </Link>
          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <LandingSectionLink id="voices" className="transition-colors hover:text-slate-950">Voices</LandingSectionLink>
            <LandingSectionLink id="why-vaani" className="transition-colors hover:text-slate-950">Why Vaani</LandingSectionLink>
            <LandingSectionLink id="workflow" className="transition-colors hover:text-slate-950">How it works</LandingSectionLink>
            <LandingSectionLink id="use-cases" className="transition-colors hover:text-slate-950">Use cases</LandingSectionLink>
            <LandingSectionLink id="pricing" className="transition-colors hover:text-slate-950">Pricing</LandingSectionLink>
          </div>
          <details className="relative md:hidden">
            <summary className="cursor-pointer list-none rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500">Menu</summary>
            <div className="absolute right-0 top-12 flex min-w-40 flex-col gap-1 rounded-2xl border border-slate-200 bg-white p-2 text-sm font-medium text-slate-600 shadow-xl">
              <LandingSectionLink id="voices" className="rounded-xl px-3 py-2 hover:bg-rose-50 hover:text-rose-700">Voices</LandingSectionLink>
              <LandingSectionLink id="why-vaani" className="rounded-xl px-3 py-2 hover:bg-rose-50 hover:text-rose-700">Why Vaani</LandingSectionLink>
              <LandingSectionLink id="workflow" className="rounded-xl px-3 py-2 hover:bg-rose-50 hover:text-rose-700">How it works</LandingSectionLink>
              <LandingSectionLink id="use-cases" className="rounded-xl px-3 py-2 hover:bg-rose-50 hover:text-rose-700">Use cases</LandingSectionLink>
              <LandingSectionLink id="pricing" className="rounded-xl px-3 py-2 hover:bg-rose-50 hover:text-rose-700">Pricing</LandingSectionLink>
            </div>
          </details>
          <div className="flex items-center gap-4">
            <Link
              href="/sign-in"
              className="text-sm font-semibold text-slate-600 transition-colors hover:text-slate-950"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/15 transition-all hover:bg-brand-hover active:bg-brand-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>
      <main className="relative overflow-hidden">{children}</main>
    </div>
  );
}