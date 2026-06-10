"use client";

import { cn } from "@/lib/utils";
import { createNoise3D } from "simplex-noise";
import {
  HTMLAttributes,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
} from "react";

type WavyBackgroundProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  waveYOffset?: number;
};

export function WavyBackground({
  children,
  className,
  containerClassName,
  colors,
  waveWidth = 50,
  backgroundFill = "black",
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  waveYOffset = 250,
  ...props
}: WavyBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  const noise = useMemo(() => createNoise3D(), []);

  const isSafari =
    typeof window !== "undefined" &&
    navigator.userAgent.includes("Safari") &&
    !navigator.userAgent.includes("Chrome");

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let width = 0;
    let height = 0;
    let nt = 0;

    const animationSpeed =
      speed === "slow"
        ? 0.0011
        : speed === "fast"
          ? 0.002
          : 0.001;

    const waveColors = colors ?? [
      "#38bdf8",
      "#818cf8",
      "#c084fc",
      "#e879f9",
      "#22d3ee",
    ];

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;

      ctx.filter = `blur(${blur}px)`;
    };

    const drawWave = (count: number) => {
      nt += animationSpeed;

      for (let i = 0; i < count; i++) {
        ctx.beginPath();

        ctx.lineWidth = waveWidth;

        ctx.strokeStyle =
          waveColors[i % waveColors.length];

        for (let x = 0; x < width; x += 5) {
          const y =
            noise(
              x / 800,
              i * 0.3,
              nt
            ) * 100;

          ctx.lineTo(
            x,
            y + waveYOffset
          );
        }

        ctx.stroke();
        ctx.closePath();
      }
    };

    const render = () => {
      ctx.fillStyle = backgroundFill;

      ctx.globalAlpha = waveOpacity;

      ctx.fillRect(
        0,
        0,
        width,
        height
      );

      drawWave(5);

      animationRef.current =
        requestAnimationFrame(render);
    };

    resize();

    window.addEventListener(
      "resize",
      resize
    );

    render();

    return () => {
      cancelAnimationFrame(
        animationRef.current
      );

      window.removeEventListener(
        "resize",
        resize
      );
    };
  }, [
    blur,
    speed,
    colors,
    waveWidth,
    backgroundFill,
    waveOpacity,
    waveYOffset,
    noise,
  ]);

  return (
    <div
      className={cn(
        "relative flex h-screen items-center justify-center overflow-hidden",
        containerClassName
      )}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={
          isSafari
            ? {
                filter: `blur(${blur}px)`,
              }
            : undefined
        }
      />

      <div
        className={cn(
          "relative z-10",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}