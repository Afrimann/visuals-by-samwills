"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIntro } from "./IntroProvider";

const links = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
  { href: "/collaborations", label: "Collaborations" },
  { href: "/contact", label: "Contact" },
];

// Same track site-wide for now — swap per page later if needed.
const BACKGROUND_MUSIC_SRC =
  "https://res.cloudinary.com/dwgkfg8ec/video/upload/v1782884069/videoplayback_aoaqmn.webm";

export default function Nav() {
  const pathname = usePathname();
  const { introComplete } = useIntro();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [musicMuted, setMusicMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  const unmuteMusic = () => {
    setMusicMuted(false);
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = false;
    audio.play().catch(() => {});
  };

  const toggleMusic = () => {
    if (musicMuted) {
      unmuteMusic();
      return;
    }
    setMusicMuted(true);
    if (audioRef.current) audioRef.current.muted = true;
  };

  // Browsers block audio-with-sound until a real user gesture happens —
  // the first click anywhere (including the intro splash's "Tap to Enter")
  // starts the music, satisfying "plays unless muted" as closely as policy allows.
  useEffect(() => {
    const onFirstInteraction = () => {
      unmuteMusic();
      window.removeEventListener("click", onFirstInteraction);
    };
    window.addEventListener("click", onFirstInteraction, { once: true });
    return () => window.removeEventListener("click", onFirstInteraction);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      // Hysteresis avoids rapid on/off toggling right at the boundary.
      setScrolled((prev) => {
        if (window.scrollY > 56) return true;
        if (window.scrollY < 24) return false;
        return prev;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isHome = pathname === "/";

  return (
    <>
      <motion.header
        initial={isHome ? { opacity: 0, y: -16 } : false}
        animate={
          isHome && !introComplete
            ? { opacity: 0, y: -16 }
            : { opacity: 1, y: 0 }
        }
        transition={{ delay: 0.3, duration: 0.9, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-md transition-colors duration-500 ${
          scrolled || !isHome
            ? "bg-charcoal/95 border-smoke/40"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-[family-name:var(--font-display)] text-sm sm:text-lg md:text-xl tracking-wide sm:tracking-widest text-off-white hover:text-gold transition-colors duration-300 whitespace-nowrap shrink-0"
          >
            VISUALS BY SAMWILLS
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => {
              const active =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm tracking-widest uppercase font-[family-name:var(--font-body)] transition-colors duration-300 pb-0.5 ${
                    active
                      ? "text-gold"
                      : "text-silver hover:text-off-white"
                  }`}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-px bg-gold"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {/* Background music toggle */}
            <button
              onClick={toggleMusic}
              className="w-9 h-9 rounded-full border border-silver/30 flex items-center justify-center text-silver hover:text-gold hover:border-gold transition-colors duration-300"
              aria-label={musicMuted ? "Play background music" : "Mute background music"}
            >
              {musicMuted ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 9v6h4l5 5V4l-5 5H9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4l16 16" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 9v6h4l5 5V4l-5 5H9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.5 8.5a5 5 0 010 7" />
                </svg>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col gap-1.5 p-2 group"
              aria-label="Toggle menu"
            >
              <span
                className={`block h-px w-6 bg-off-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2.5" : ""}`}
              />
              <span
                className={`block h-px w-6 bg-off-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-px w-6 bg-off-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2.5" : ""}`}
              />
            </button>
          </div>
        </div>

        <audio ref={audioRef} src={BACKGROUND_MUSIC_SRC} loop autoPlay muted playsInline />
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-cin-black flex flex-col items-center justify-center gap-10"
          >
            {links.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
              >
                <Link
                  href={link.href}
                  className="font-[family-name:var(--font-display)] text-4xl text-off-white hover:text-gold transition-colors duration-300 italic"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
