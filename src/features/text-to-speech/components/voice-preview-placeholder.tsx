// Acoustic bars with bespoke durations and phase offsets for an organic, non-mechanical rhythm
const EQUALIZER_BARS = [
  { height: 42, duration: "2.3s", delay: "0.00s" },
  { height: 26, duration: "1.9s", delay: "0.12s" },
  { height: 36, duration: "2.4s", delay: "0.22s" },
  { height: 22, duration: "2.1s", delay: "0.08s" },
  { height: 32, duration: "2.5s", delay: "0.28s" },
  { height: 18, duration: "1.8s", delay: "0.15s" },
  { height: 30, duration: "2.2s", delay: "0.32s" },
];

export function VoicePreviewPlaceholder() {
  return (
    <div className="hidden h-full flex-1 flex-col items-center justify-center border-t border-slate-100 bg-[#fbfaf8] p-6 lg:flex">
      <div className="flex max-w-sm flex-col items-center text-center">
        {/* Organic, fluid audio waveform animation */}
        <div className="flex h-11 items-end gap-1.5" aria-hidden="true">
          <style>{`@keyframes bounce-wave-fluid { 0%, 100% { transform: scaleY(0.32); } 50% { transform: scaleY(1); } }`}</style>
          {EQUALIZER_BARS.map((bar, index) => (
            <span
              key={index}
              className="w-1 origin-bottom rounded-full bg-brand motion-safe:animate-[bounce-wave-fluid_cubic-bezier(0.4,0,0.2,1)_infinite]"
              style={{
                height: `${bar.height}px`,
                animationDuration: bar.duration,
                animationDelay: bar.delay,
              }}
            />
          ))}
        </div>

        <p className="mt-4 max-w-xs text-sm font-medium tracking-tight text-slate-500 sm:max-w-sm">
          Your generated audio will appear here
        </p>
      </div>
    </div>
  );
}