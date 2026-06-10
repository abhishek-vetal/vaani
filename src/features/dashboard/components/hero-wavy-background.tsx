import { WavyBackground } from "@/components/ui/wavy-background";

export function HeroWavyBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block">
      <WavyBackground
        backgroundFill="hsl(0 0% 100%)"
        blur={3}
        speed="fast"
        waveOpacity={0.1}
        waveWidth={60}
        waveYOffset={260}
        containerClassName="h-full"
        className="hidden"
      />
    </div>
  )
}
