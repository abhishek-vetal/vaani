import Image from "next/image";
import Link from "next/link";
import { FaPersonBiking } from "react-icons/fa6";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2 bg-[#0A0A0A]">
      {/* Left Column: Premium Dark Visuals */}
      <div className="relative hidden flex-col justify-between bg-[#121212] text-white lg:flex overflow-hidden z-20 shadow-[20px_0_40px_rgba(0,0,0,0.15)]">
        
        {/* Subtle Ambient Glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-red-600/10 blur-[120px]" />
        
        <div className="relative z-10 flex h-full flex-col justify-between p-12 lg:p-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <Image
              src="/logo.png"
              alt="Vaani logo"
              width={28}
              height={28}
              className="shrink-0"
            />
            <span className="text-xl font-bold tracking-tight text-white">
              Vaani
            </span>
          </Link>

          {/* Central Aesthetic Area */}
          <div className="flex flex-col gap-10">
            {/* Custom CSS Waveform */}
            <div className="flex h-12 items-end gap-1.5 opacity-80">
              <style>{`
                @keyframes bounce-wave {
                  0%, 100% { transform: scaleY(0.4); }
                  50% { transform: scaleY(1); }
                }
                .wave-bar {
                  width: 4px;
                  background-color: #ef4444;
                  border-radius: 99px;
                  transform-origin: bottom;
                  animation: bounce-wave 1.5s ease-in-out infinite;
                }
              `}</style>
              <div className="wave-bar h-full" style={{ animationDelay: '0.0s' }} />
              <div className="wave-bar h-full" style={{ animationDelay: '0.2s', height: '80%' }} />
              <div className="wave-bar h-full" style={{ animationDelay: '0.4s', height: '100%' }} />
              <div className="wave-bar h-full" style={{ animationDelay: '0.6s', height: '60%' }} />
              <div className="wave-bar h-full" style={{ animationDelay: '0.8s', height: '90%' }} />
              <div className="wave-bar h-full" style={{ animationDelay: '1.0s', height: '50%' }} />
              <div className="wave-bar h-full" style={{ animationDelay: '1.2s', height: '70%' }} />
            </div>
            <div className="max-w-md">
              <h1 className="text-4xl font-medium tracking-tight text-white flex items-center gap-3">
                One step closer. <FaPersonBiking className="text-3xl text-zinc-600/80" />
              </h1>
              <p className="mt-5 text-lg font-light leading-relaxed text-zinc-400">
                Produce studio-quality voiceovers and precise custom clones. Built for creators who demand control.
              </p>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-sm font-medium tracking-wide text-zinc-600">
            VAANI STUDIO v1.0
          </div>
        </div>
      </div>

      {/* Right Column: Auth Form */}
      <div className="relative flex flex-col bg-zinc-50 overflow-hidden">
        


        {/* Subtle Ambient Glow to soften the transition */}
        <div className="pointer-events-none absolute -left-40 top-1/4 z-0 h-[500px] w-[500px] rounded-full bg-zinc-200/50 blur-[100px]" />

        {/* Mobile Header */}
        <header className="relative z-10 flex h-20 items-center border-b border-zinc-200 px-6 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Vaani logo"
              width={24}
              height={24}
              className="shrink-0"
            />
            <span className="text-xl font-medium tracking-tight text-zinc-950">
              Vaani
            </span>
          </Link>
        </header>

        {/* Centered clerk card */}
        <div className="relative z-10 flex flex-1 items-center justify-center p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
