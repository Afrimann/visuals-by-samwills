import { prisma } from "@/lib/prisma";
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
      <VideoListClient initialVideos={videos} />
    </div>
  );
}
