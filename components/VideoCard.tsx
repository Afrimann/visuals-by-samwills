"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export interface VideoCardData {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl: string | null;
  description: string | null;
  segment: { name: string; accentColor: string };
  year: number | null;
}

interface Props {
  video: VideoCardData;
  onClick: (video: VideoCardData) => void;
  index?: number;
}

export default function VideoCard({ video, onClick, index = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={() => onClick(video)}
      className="group cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-graphite rounded-sm">
        {video.thumbnailUrl ? (
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-graphite to-cin-black" />
        )}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-cin-black/30 group-hover:bg-cin-black/10 transition-colors duration-500" />

        {/* Gold border glow on hover */}
        <div className="absolute inset-0 border border-transparent group-hover:border-gold/50 transition-colors duration-500 rounded-sm" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full border border-gold/60 flex items-center justify-center bg-cin-black/50 backdrop-blur-sm group-hover:border-gold group-hover:bg-cin-black/70 transition-all duration-300 group-hover:scale-110">
            <svg
              className="w-5 h-5 text-gold ml-0.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-3 px-0.5">
        {/* Segment tag */}
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className="text-[10px] font-[family-name:var(--font-accent)] tracking-widest uppercase px-2 py-0.5 rounded-full"
            style={{
              color: video.segment.accentColor,
              backgroundColor: `${video.segment.accentColor}18`,
              border: `1px solid ${video.segment.accentColor}40`,
            }}
          >
            {video.segment.name}
          </span>
          {video.year && (
            <span className="text-[10px] text-smoke font-[family-name:var(--font-accent)]">
              {video.year}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-[family-name:var(--font-display)] text-lg text-off-white group-hover:text-gold transition-colors duration-300 leading-tight">
          {video.title}
        </h3>

        {/* Description */}
        {video.description && (
          <p className="text-silver text-xs mt-1 leading-relaxed line-clamp-2">
            {video.description}
          </p>
        )}
      </div>
    </motion.div>
  );
}
