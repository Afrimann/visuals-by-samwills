import { prisma } from "@/lib/prisma";
import Link from "next/link";
import VideoListClient from "./VideoListClient";

export default async function AdminVideosPage() {
  const videos = await prisma.video.findMany({
    orderBy: [{ segment: { sortOrder: "asc" } }, { sortOrder: "asc" }],
    select: {
      id: true,
      title: true,
      thumbnailUrl: true,
      status: true,
      isFeatured: true,
      sortOrder: true,
      createdAt: true,
      segment: { select: { name: true, accentColor: true } },
    },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-off-white">
            Videos
          </h1>
          <p className="text-silver text-sm mt-0.5 font-[family-name:var(--font-body)]">
            {videos.length} total
          </p>
        </div>
        <Link
          href="/admin/videos/new"
          className="px-4 py-2.5 bg-gold text-cin-black text-xs tracking-widest uppercase font-[family-name:var(--font-body)] hover:bg-pale-gold transition-colors"
        >
          + Add New
        </Link>
      </div>

      <VideoListClient initialVideos={videos} />
    </div>
  );
}
