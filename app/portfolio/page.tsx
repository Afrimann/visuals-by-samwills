import { prisma } from "@/lib/prisma";
import PortfolioGrid from "@/components/PortfolioGrid";

export const metadata = {
  title: "Portfolio — Visuals by Samwills",
  description: "Music videos, wedding reels, short reels, documentaries, and commercials.",
};

async function getData() {
  const [videos, segments] = await Promise.all([
    prisma.video.findMany({
      where: { status: "PUBLISHED" },
      select: {
        id: true,
        title: true,
        slug: true,
        thumbnailUrl: true,
        description: true,
        embedUrl: true,
        year: true,
        segment: { select: { name: true, accentColor: true, slug: true } },
      },
      orderBy: [{ segment: { sortOrder: "asc" } }, { sortOrder: "asc" }],
    }),
    prisma.segment.findMany({
      where: { isVisible: true },
      select: { id: true, slug: true, name: true, accentColor: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);
  return { videos, segments };
}

export default async function PortfolioPage() {
  const { videos, segments } = await getData();

  return (
    <div className="pt-24 pb-20 min-h-screen bg-cin-black">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        {/* Heading */}
        <div className="mb-12 md:mb-16">
          <p className="font-[family-name:var(--font-display)] italic text-gold text-sm tracking-widest uppercase mb-3">
            The Work
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl text-off-white font-light">
            Our Portfolio
          </h1>
          <p className="text-silver mt-3 text-sm md:text-base font-[family-name:var(--font-body)]">
            Motion. Emotion. Memory.
          </p>
        </div>

        {/* Grid with filter */}
        <PortfolioGrid videos={videos} segments={segments} />
      </div>
    </div>
  );
}
