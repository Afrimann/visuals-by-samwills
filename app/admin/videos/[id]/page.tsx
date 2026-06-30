import { prisma } from "@/lib/prisma";
import VideoForm from "@/components/VideoForm";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditVideoPage({ params }: Props) {
  const { id } = await params;

  const [video, segments] = await Promise.all([
    prisma.video.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        segmentId: true,
        videoUrl: true,
        thumbnailUrl: true,
        description: true,
        status: true,
        isFeatured: true,
        sortOrder: true,
        year: true,
      },
    }),
    prisma.segment.findMany({
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!video) notFound();

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center gap-3 mb-1">
        <Link
          href="/admin/videos"
          className="text-silver text-sm hover:text-gold transition-colors font-[family-name:var(--font-body)]"
        >
          ← Videos
        </Link>
      </div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-off-white mb-2">
        Edit Video
      </h1>
      <p className="text-silver text-sm mb-8 font-[family-name:var(--font-body)]">{video.title}</p>
      <VideoForm segments={segments} initialData={video} />
    </div>
  );
}
