"use client";

import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import VideoCard, { VideoCardData } from "./VideoCard";
import VideoLightbox from "./VideoLightbox";
import SegmentFilter from "./SegmentFilter";

interface Segment {
  id: string;
  slug: string;
  name: string;
  accentColor: string;
}

interface Video extends VideoCardData {
  embedUrl?: string | null;
}

interface Props {
  videos: Video[];
  segments: Segment[];
  initialSegment?: string;
}

export default function PortfolioGrid({ videos, segments, initialSegment = "all" }: Props) {
  const [activeSegment, setActiveSegment] = useState(initialSegment);
  const [lightboxVideo, setLightboxVideo] = useState<Video | null>(null);

  const filtered = useMemo(() => {
    if (activeSegment === "all") return videos;
    return videos.filter((v) => v.segment.name === segments.find((s) => s.slug === activeSegment)?.name);
  }, [activeSegment, videos, segments]);

  return (
    <>
      {/* Filter */}
      <div className="mb-10 md:mb-12">
        <SegmentFilter
          segments={segments}
          active={activeSegment}
          onChange={setActiveSegment}
        />
      </div>

      {/* Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((video, i) => (
            <motion.div
              key={video.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <VideoCard
                video={video}
                onClick={(v) => setLightboxVideo(v as Video)}
                index={i}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-silver text-sm">
          No videos in this segment yet.
        </div>
      )}

      {/* Lightbox */}
      {lightboxVideo && (
        <VideoLightbox
          video={lightboxVideo}
          onClose={() => setLightboxVideo(null)}
        />
      )}
    </>
  );
}
