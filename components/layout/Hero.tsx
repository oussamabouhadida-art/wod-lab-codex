"use client";

import { motion } from "framer-motion";

const wordVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function Hero({ tagline, cta }: { tagline: string; cta: string }) {
  const words = tagline.split(" ");

  return (
    <section className="relative grid-noise min-h-[85vh] border-b border-divider">
      <div className="mx-auto flex max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-8 flex h-10 w-32 items-center justify-center border border-lime/30 text-lime">
          <svg width="90" height="16" viewBox="0 0 90 16" fill="none">
            <rect x="2" y="2" width="12" height="12" stroke="currentColor" />
            <rect x="76" y="2" width="12" height="12" stroke="currentColor" />
            <rect x="14" y="7" width="62" height="2" fill="currentColor" />
          </svg>
        </div>
        <h1 className="max-w-4xl font-display text-6xl uppercase leading-[0.95] text-heading sm:text-7xl lg:text-8xl">
          {words.map((word, i) => (
            <motion.span key={`${word}-${i}`} custom={i} variants={wordVariants} initial="hidden" animate="visible" className="mr-4 inline-block">
              {word}
            </motion.span>
          ))}
        </h1>
        <a href="#wods-section" className="mt-10 inline-flex w-fit rounded-[4px] bg-lime px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-black">
          {cta}
        </a>
      </div>
    </section>
  );
}
