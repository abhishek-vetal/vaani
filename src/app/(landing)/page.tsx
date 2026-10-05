import { HeroTerminal } from "./_components/hero-terminal";
import { AudioShowcase } from "./_components/audio-showcase";

export default function LandingPage() {
  return (
    <div className="relative flex flex-col items-center bg-slate-50 font-sans selection:bg-blue-200 selection:text-blue-900 overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-rose-500 opacity-15 blur-[100px]"></div>

      {/* Hero Section Header */}
      <section className="relative z-10 flex w-full flex-col items-center px-6 pt-36 pb-8 sm:pt-48 lg:px-8">
        <h1 className="max-w-4xl text-center text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
          Bringing text to <span className="bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 bg-clip-text text-transparent">life</span>.
        </h1>

        <p className="mt-6 max-w-2xl text-center text-lg text-slate-600 sm:text-xl leading-relaxed">
          Transform written words into fluid, expressive audio. Our next-generation models capture the true nuance of human emotion to make your content truly speak.
        </p>
      </section>

      {/* Audio Showcase Section (Moved up) */}
      <div className="relative z-10 flex w-full justify-center -mt-8">
        <AudioShowcase />
      </div>

      {/* Interactive Sleek Terminal */}
      <section className="relative z-10 flex w-full flex-col items-center px-6 pb-24 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Experience the difference</h2>
          <p className="text-slate-600 mt-2">Type anything below to hear our next-generation voice model.</p>
        </div>
        <HeroTerminal />
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-slate-200 bg-white py-12 text-center text-sm font-medium text-slate-500">
        &copy; {new Date().getFullYear()} Vaani. All rights reserved.
      </footer>
    </div>
  );
}
