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

      <div className="bg-charcoal border border-smoke/40 rounded-sm overflow-hidden">
        {videos.map((v: (typeof videos)[number], i: number) => (
          <div
            key={v.id}
            className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 ${
              i !== videos.length - 1 ? "border-b border-smoke/40" : ""
            }`}
          >
            {/* Thumbnail */}
            <div className="w-14 sm:w-16 aspect-video shrink-0 bg-graphite rounded-sm overflow-hidden">
              {v.thumbnailUrl ? (
                <Image
                  src={v.thumbnailUrl}
                  alt=""
                  width={64}
                  height={36}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-smoke" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-off-white text-sm font-[family-name:var(--font-body)] font-medium line-clamp-1">
                {v.title}
              </p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span
                  className="text-[10px] tracking-widest uppercase font-[family-name:var(--font-accent)]"
                  style={{ color: v.segment.accentColor }}
                >
                  {v.segment.name}
                </span>
                <span
                  className={`text-[10px] tracking-widest uppercase px-1.5 py-0.5 rounded-full border font-[family-name:var(--font-accent)] ${
                    v.status === "PUBLISHED"
                      ? "text-green-400 bg-green-400/10 border-green-400/30"
                      : "text-smoke bg-smoke/10 border-smoke/30"
                  }`}
                >
                  {v.status === "PUBLISHED" ? "Live" : "Draft"}
                </span>
                {v.isFeatured && (
                  <span className="text-[10px] text-gold font-[family-name:var(--font-accent)] tracking-widest">
                    ★ Featured
                  </span>
                )}
              </div>
            </div>

            {/* Edit */}
            <Link
              href={`/admin/videos/${v.id}`}
              className="shrink-0 px-3 py-1.5 border border-smoke/60 text-xs text-silver hover:border-gold hover:text-gold transition-colors font-[family-name:var(--font-body)] rounded-sm"
            >
              Edit
            </Link>
          </div>
        ))}

        {videos.length === 0 && (
          <div className="py-12 text-center text-silver text-sm font-[family-name:var(--font-body)]">
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
