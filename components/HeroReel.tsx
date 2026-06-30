"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

// Template: Cinematic showreel embed (muted autoplay loop)
const SHOWREEL_EMBED =
  "https://www.youtube.com/embed/2Vv-BfVoq4g?autoplay=1&mute=1&loop=1&playlist=2Vv-BfVoq4g&controls=0&showinfo=0&rel=0&modestbranding=1";

export default function HeroReel() {
  const [muted, setMuted] = useState(true);

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-cin-black">
      {/* Video background */}
      <div className="absolute inset-0 z-0">
        <iframe
          src={SHOWREEL_EMBED}
          className="absolute w-[177.78vh] h-[100vh] min-w-full min-h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          allow="autoplay; fullscreen"
          title="Visuals by Samwills Showreel"
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 z-10 bg-cin-black/60" />

      {/* Content */}
      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="font-[family-name:var(--font-display)] italic text-gold text-sm md:text-base tracking-[0.3em] uppercase mb-6"
        >
          Cinematography · Storytelling · Motion
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-[family-name:var(--font-display)] text-5xl md:text-7xl lg:text-8xl font-light text-off-white leading-none tracking-tight mb-3"
        >
          VISUALS
        </motion.h1>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-[family-name:var(--font-display)] text-5xl md:text-7xl lg:text-8xl font-light text-gold leading-none tracking-tight mb-8"
        >
          BY SAMWILLS
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="text-silver text-base md:text-lg font-[family-name:var(--font-body)] mb-10 tracking-wide"
        >
          Every frame tells your story.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.8 }}
          className="flex items-center justify-center gap-5 flex-wrap"
        >
          <Link
            href="/portfolio"
            className="px-8 py-3.5 bg-gold text-cin-black text-sm tracking-widest uppercase font-[family-name:var(--font-body)] hover:bg-pale-gold transition-colors duration-300"
          >
            See the Work
          </Link>
          <Link
            href="/contact"
            className="px-8 py-3.5 border border-off-white/50 text-off-white text-sm tracking-widest uppercase font-[family-name:var(--font-body)] hover:border-gold hover:text-gold transition-colors duration-300"
          >
            Work With Us
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-silver tracking-widest uppercase font-[family-name:var(--font-accent)]">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-silver to-transparent"
        />
      </motion.div>

      {/* Mute toggle */}
      <button
        onClick={() => setMuted(!muted)}
        className="absolute bottom-8 right-6 z-20 w-9 h-9 rounded-full border border-silver/30 flex items-center justify-center text-silver hover:text-gold hover:border-gold transition-colors duration-300"
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z" />
          </svg>
        )}
      </button>
    </section>
  );
}
