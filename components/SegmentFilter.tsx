"use client";

import { motion } from "framer-motion";

interface Segment {
  slug: string;
  name: string;
  accentColor: string;
}

interface Props {
  segments: Segment[];
  active: string;
  onChange: (slug: string) => void;
}

export default function SegmentFilter({ segments, active, onChange }: Props) {
  const all = [{ slug: "all", name: "All Work", accentColor: "#C9A84C" }, ...segments];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {all.map((seg) => {
        const isActive = active === seg.slug;
        return (
          <button
            key={seg.slug}
            onClick={() => onChange(seg.slug)}
            className={`relative px-4 py-1.5 text-xs font-[family-name:var(--font-accent)] tracking-widest uppercase rounded-full border transition-all duration-300 ${
              isActive
                ? "text-cin-black border-gold bg-gold"
                : "text-silver border-smoke bg-transparent hover:border-silver hover:text-off-white"
            }`}
          >
            {seg.name}
            {isActive && (
              <motion.span
                layoutId="filter-active"
                className="absolute inset-0 rounded-full bg-gold -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
