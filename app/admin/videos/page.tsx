import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

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
    <div className="max-w-5xl mx-auto px-6 py-10">
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
          className="px-5 py-2.5 bg-gold text-cin-black text-xs tracking-widest uppercase font-[family-name:var(--font-body)] hover:bg-pale-gold transition-colors"
        >
          + Add New
        </Link>
      </div>

      <div className="bg-charcoal border border-smoke/40 rounded-sm overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[60px_1fr_140px_100px_100px] gap-4 px-5 py-3 border-b border-smoke/40 text-[10px] tracking-widest uppercase text-smoke font-[family-name:var(--font-accent)]">
          <span>Thumb</span>
          <span>Title</span>
          <span>Segment</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {videos.map((v: (typeof videos)[number], i: number) => (
          <div
            key={v.id}
            className={`grid grid-cols-[60px_1fr_140px_100px_100px] gap-4 px-5 py-3 items-center ${
              i !== videos.length - 1 ? "border-b border-smoke/40" : ""
            }`}
          >
            {/* Thumbnail */}
            <div className="w-14 aspect-video bg-graphite rounded-sm overflow-hidden">
              {v.thumbnailUrl && (
                <Image
                  src={v.thumbnailUrl}
                  alt=""
                  width={56}
                  height={32}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Title */}
            <div>
              <p className="text-off-white text-sm font-[family-name:var(--font-body)] line-clamp-1">
                {v.title}
              </p>
              {v.isFeatured && (
                <span className="text-[10px] text-gold font-[family-name:var(--font-accent)] tracking-widest">
                  Featured
                </span>
              )}
            </div>

            {/* Segment */}
            <span
              className="text-[10px] tracking-widest uppercase font-[family-name:var(--font-accent)]"
              style={{ color: v.segment.accentColor }}
            >
              {v.segment.name}
            </span>

            {/* Status */}
            <span
              className={`text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full font-[family-name:var(--font-accent)] w-fit ${
                v.status === "PUBLISHED"
                  ? "text-green-400 bg-green-400/10 border border-green-400/30"
                  : "text-smoke bg-smoke/10 border border-smoke/30"
              }`}
            >
              {v.status === "PUBLISHED" ? "Live" : "Draft"}
            </span>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Link
                href={`/admin/videos/${v.id}`}
                className="text-xs text-silver hover:text-gold transition-colors font-[family-name:var(--font-body)]"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}

        {videos.length === 0 && (
          <div className="py-12 text-center text-silver text-sm">
            No videos yet.{" "}
            <Link href="/admin/videos/new" className="text-gold underline">
              Add your first video
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
