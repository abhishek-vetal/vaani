import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-[#0a0a0a] lg:grid-cols-[minmax(0,1fr)_minmax(520px,1fr)]">
      <aside className="relative hidden overflow-hidden bg-[#121212] text-white lg:flex">
        <div className="pointer-events-none absolute -left-40 top-1/4 size-144 rounded-full bg-rose-600/[0.08] blur-[120px]" />
        <div className="relative z-10 flex min-h-full w-full flex-col p-10 xl:p-14">
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <Image src="/logo.png" alt="Vaani logo" width={28} height={28} className="shrink-0" />
            <span className="text-xl font-bold tracking-tight text-white">Vaani</span>
          </Link>

          <div className="flex flex-1 items-center">
            <div className="max-w-lg">
              <div className="mb-8 flex h-12 items-end gap-1.5 opacity-80" aria-hidden="true">
                <style>{`@keyframes bounce-wave { 0%, 100% { transform: scaleY(0.38); } 50% { transform: scaleY(1); } }`}</style>
                {[54, 34, 46, 28, 42, 24, 38].map((height, index) => (
                  <span
                    key={index}
                    className="w-1 origin-bottom rounded-full bg-brand motion-safe:animate-[bounce-wave_ease-in-out_infinite]"
                    style={{
                      height: `${height}px`,
                      animationDuration: `${1.8 + (index % 3) * 0.25}s`,
                      animationDelay: `${index * 0.08}s`,
                    }}
                  />
                ))}
              </div>
              <h1 className="max-w-xl text-5xl font-semibold leading-[1.02] tracking-[-0.055em] text-white xl:text-6xl">
                One step closer.
              </h1>
              <p className="mt-6 max-w-md text-lg leading-8 text-zinc-400">
                Turn your words into expressive audio. Bring your ideas to life with Vaani.
              </p>
            </div>
          </div>

          <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-600">Words in. Voice out.</p>
        </div>
      </aside>

      <main className="relative flex min-h-screen flex-col overflow-hidden border-l border-white/10 bg-[#fbfaf8]">
        <div className="pointer-events-none absolute -left-40 top-1/4 size-128 rounded-full bg-rose-100/55 blur-[110px]" />
        <header className="relative z-10 flex h-20 items-center border-b border-slate-200/80 px-6 lg:hidden">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <Image src="/logo.png" alt="Vaani logo" width={24} height={24} className="shrink-0" />
            <span className="text-xl font-semibold tracking-tight text-charcoal">Vaani</span>
          </Link>
        </header>
        <div className="relative z-10 flex flex-1 items-center justify-center p-4 py-10 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}