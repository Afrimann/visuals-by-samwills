import { prisma } from "@/lib/prisma";
import VideoForm from "@/components/VideoForm";
import Link from "next/link";

export default async function NewVideoPage() {
  const segments = await prisma.segment.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true },
  });

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
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-off-white mb-8">
        Add New Video
      </h1>
      <VideoForm segments={segments} />
    </div>
  );
}
