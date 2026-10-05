import Image from "next/image";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function LandingLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();

  // authenticated users go straight to dashboard
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-200 selection:text-blue-900 font-sans">
      {/* Stark, minimalist Navbar */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Vaani logo"
              width={24}
              height={24}
              className="shrink-0"
            />
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Vaani
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link 
              href="/sign-in" 
              className="text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900"
            >
              Sign in
            </Link>
            <Link 
              href="/sign-up" 
              className="rounded-full bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose-500/20 transition-transform hover:scale-105 hover:bg-rose-700"
            >
              Sign up
            </Link>
          </div>
        </nav>
      </header>

      {/* Main content area */}
      <main className="relative">
        {children}
      </main>
    </div>
  );
}
