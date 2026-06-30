"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface Props {
  value: number;
  label: string;
  suffix?: string;
}

export default function StatsCounter({ value, label, suffix = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1500;
    const step = 16;
    const totalSteps = Math.ceil(duration / step);
    const increment = value / totalSteps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, step);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-1.5">
      <span className="font-[family-name:var(--font-accent)] text-3xl md:text-5xl font-bold text-gold">
        {count}
        {suffix}
      </span>
      <span className="text-silver text-xs md:text-sm tracking-widest uppercase font-[family-name:var(--font-body)]">
        {label}
      </span>
    </div>
  );
}
