"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VideoCardData } from "./VideoCard";

interface Props {
  video: VideoCardData & { embedUrl?: string | null };
  onClose: () => void;
}

export default function VideoLightbox({ video, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[100] bg-cin-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-4xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Video */}
          <div className="relative aspect-video bg-charcoal rounded-sm overflow-hidden">
            {video.embedUrl ? (
              <iframe
                src={video.embedUrl}
                className="absolute inset-0 w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={video.title}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-silver text-sm">
                Video unavailable —{" "}
                <a
                  href={video.slug}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold underline ml-1"
                >
                  open on YouTube
                </a>
              </div>
            )}
          </div>

          {/* Info bar */}
          <div className="mt-4 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
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
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-off-white">
                {video.title}
              </h2>
              {video.description && (
                <p className="text-silver text-sm mt-1.5 leading-relaxed max-w-lg">
                  {video.description}
                </p>
              )}
            </div>

            <button
              onClick={onClose}
              className="shrink-0 w-9 h-9 rounded-full border border-smoke flex items-center justify-center text-silver hover:text-off-white hover:border-silver transition-colors duration-200"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
