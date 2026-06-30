import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

export default async function AdminDashboard() {
  const [videos, segments, collabs, submissions] = await Promise.all([
    prisma.video.findMany({
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
    }),
    prisma.segment.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { videos: true } } },
    }),
    prisma.collaboration.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, status: true },
    }),
  ]);

  return (
    <DashboardClient
      initialVideos={videos}
      initialSegments={segments}
      initialCollabs={collabs}
      initialSubmissions={submissions}
    />
  );
}
