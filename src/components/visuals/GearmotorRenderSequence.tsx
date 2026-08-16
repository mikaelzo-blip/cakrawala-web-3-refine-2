'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

type GearmotorRenderSequenceProps = {
  progress: number;
  activeStep: number;
};

const FRAME_COUNT = 10;
const sources = Array.from({ length: FRAME_COUNT }, (_, index) =>
  `/images/gearmotor/step-${String(index).padStart(2, '0')}.webp`
);

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function smoothstep(start: number, end: number, value: number) {
  const t = clamp((value - start) / Math.max(0.0001, end - start), 0, 1);
  return t * t * (3 - 2 * t);
}

export function GearmotorRenderSequence({ progress, activeStep }: GearmotorRenderSequenceProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  const visualProgress = reducedMotion
    ? clamp(activeStep, 0, FRAME_COUNT - 1)
    : clamp(progress * FRAME_COUNT, 0, FRAME_COUNT - 1);

  const currentFrame = Math.floor(visualProgress);
  const nextFrame = Math.min(FRAME_COUNT - 1, currentFrame + 1);
  const mix = currentFrame === nextFrame
    ? 0
    : smoothstep(0.12, 0.88, visualProgress - currentFrame);

  return (
    <div
      className="relative h-full min-h-[320px] w-full select-none sm:min-h-[390px] lg:min-h-[560px]"
      aria-label="Visualisasi teknis gearmotor industri tanpa merek"
    >
      {sources.map((src, index) => {
        let opacity = 0;
        if (index === currentFrame) opacity = currentFrame === nextFrame ? 1 : 1 - mix;
        if (index === nextFrame && nextFrame !== currentFrame) opacity = mix;

        return (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            priority={index <= 1}
            sizes="(max-width: 1024px) 100vw, 62vw"
            className="object-contain object-center transition-opacity duration-150 ease-linear motion-reduce:transition-none"
            style={{ opacity }}
            aria-hidden="true"
          />
        );
      })}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[14%] bottom-[7%] h-px bg-[#102A43]/12 lg:inset-x-[11%]"
      />
    </div>
  );
}
