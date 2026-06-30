import { prisma } from "@/lib/prisma";
import SegmentManager from "./SegmentManager";

export default async function AdminSegmentsPage() {
  const segments = await prisma.segment.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { videos: true } } },
  });

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-off-white">
          Segments
        </h1>
        <p className="text-silver text-sm mt-0.5 font-[family-name:var(--font-body)]">
          Manage portfolio categories
        </p>
      </div>
      <SegmentManager initialSegments={segments} />
    </div>
  );
}
