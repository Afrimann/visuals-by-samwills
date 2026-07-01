"use client";

import { useEffect, useRef, useState } from "react";
import { useIntro } from "./IntroProvider";

const MESSAGE = "Hey there! This is Director Samwills";
const TYPE_SPEED = 55;
const HOLD_AFTER_TYPING = 700;
const FADE_DURATION = 600;

export default function IntroSplash() {
  const { introComplete, introReady, completeIntro } = useIntro();
  const [started, setStarted] = useState(false);
  const [typed, setTyped] = useState("");
  const [fadingOut, setFadingOut] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  // Keep the latest completeIntro without making it a dependency below —
  // this effect must run exactly once per "started" transition.
  const completeIntroRef = useRef(completeIntro);
  useEffect(() => {
    completeIntroRef.current = completeIntro;
  }, [completeIntro]);

  function playTick() {
    try {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioCtxClass();
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = 650 + Math.random() * 250;
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.035);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.035);
    } catch {
      // Web Audio unsupported — fail silently, splash still works visually.
    }
  }

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTyped(MESSAGE.slice(0, i));
      playTick();
      if (i >= MESSAGE.length) {
        clearInterval(interval);
        setTimeout(() => {
          setFadingOut(true);
          setTimeout(() => completeIntroRef.current(), FADE_DURATION);
        }, HOLD_AFTER_TYPING);
      }
    }, TYPE_SPEED);
    return () => clearInterval(interval);
  }, [started]);

  if (introComplete) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-cin-black flex items-center justify-center px-6 transition-opacity duration-[600ms] ${
        fadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {!introReady ? null : !started ? (
        <button
          onClick={() => setStarted(true)}
          className="flex flex-col items-center gap-4 text-off-white group"
        >
          <span className="w-3 h-3 rounded-full bg-gold animate-pulse" />
          <span className="text-xs tracking-[0.4em] uppercase text-silver group-hover:text-gold transition-colors duration-300 font-[family-name:var(--font-accent)]">
            Tap to Enter
          </span>
        </button>
      ) : (
        <p className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl md:text-4xl text-off-white text-center leading-relaxed">
          {typed}
          <span className="inline-block w-[2px] h-[0.9em] bg-gold ml-1 align-middle animate-pulse" />
        </p>
      )}
    </div>
  );
}
