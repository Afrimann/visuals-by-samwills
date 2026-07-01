"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useIntro } from "./IntroProvider";

// a_-90 corrects the source clip's baked-in 90° rotation and yields landscape output
const SHOWREEL_SRC =
  "https://res.cloudinary.com/dwgkfg8ec/video/upload/a_-90/v1782881483/samwills3_kaghpt.mp4";

export default function HeroReel() {
  const { introComplete } = useIntro();

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-cin-black">
      {/* Video background — always muted; audio is handled by the site-wide music toggle */}
      <video
        className="absolute inset-0 z-0 w-full h-full object-cover"
        src={SHOWREEL_SRC}
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 z-10 bg-cin-black/60" />

      {/* Opening curtain */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: introComplete ? 0 : 1 }}
        transition={{ delay: 0.1, duration: 1, ease: "easeInOut" }}
        className="absolute inset-0 z-30 bg-cin-black pointer-events-none"
      />

      {/* Content */}
      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, filter: "blur(8px)", letterSpacing: "0.6em" }}
          animate={
            introComplete
              ? { opacity: 1, filter: "blur(0px)", letterSpacing: "0.3em" }
              : { opacity: 0, filter: "blur(8px)", letterSpacing: "0.6em" }
          }
          transition={{ delay: 0.6, duration: 1.1, ease: "easeOut" }}
          className="font-[family-name:var(--font-display)] italic text-gold text-sm md:text-base uppercase mb-6"
        >
          Cinematography · Storytelling · Motion
        </motion.p>

        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "110%" }}
            animate={{ y: introComplete ? "0%" : "110%" }}
            transition={{ delay: 1, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-[family-name:var(--font-display)] text-5xl md:text-7xl lg:text-8xl font-light text-off-white leading-none tracking-tight mb-3"
          >
            VISUALS
          </motion.h1>
        </div>

        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "110%" }}
            animate={{ y: introComplete ? "0%" : "110%" }}
            transition={{ delay: 1.2, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-[family-name:var(--font-display)] text-5xl md:text-7xl lg:text-8xl font-light text-gold leading-none tracking-tight mb-8"
          >
            BY SAMWILLS
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, filter: "blur(6px)" }}
          animate={
            introComplete
              ? { opacity: 1, filter: "blur(0px)" }
              : { opacity: 0, filter: "blur(6px)" }
          }
          transition={{ delay: 1.8, duration: 0.9, ease: "easeOut" }}
          className="text-silver text-base md:text-lg font-[family-name:var(--font-body)] mb-10 tracking-wide"
        >
          Every frame tells your story.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={
            introComplete
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 20, filter: "blur(6px)" }
          }
          transition={{ delay: 2.1, duration: 0.9, ease: "easeOut" }}
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

      {/* Scroll indicator
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: introComplete ? 1 : 0 }}
        transition={{ delay: 2.5, duration: 0.8 }}
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
      </motion.div> */}
    </section>
  );
}
