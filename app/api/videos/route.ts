import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";
import { getEmbedUrl, getYouTubeThumbnail, toSlug } from "@/lib/video";

export async function GET() {
  const videos = await prisma.video.findMany({
    where: { status: "PUBLISHED" },
    select: {
      id: true,
      title: true,
      slug: true,
      thumbnailUrl: true,
      description: true,
      embedUrl: true,
      year: true,
      segment: { select: { name: true, accentColor: true } },
    },
    orderBy: [{ segment: { sortOrder: "asc" } }, { sortOrder: "asc" }],
  });

  return NextResponse.json(videos);
}

export async function POST(req: NextRequest) {
  const authed = await isAdminAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, segmentId, videoUrl, thumbnailUrl, description, tags, status, isFeatured, sortOrder, year } = body;

  if (!title || !segmentId || !videoUrl) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const embedUrl = getEmbedUrl(videoUrl) ?? undefined;
  const autoThumb = !thumbnailUrl ? (getYouTubeThumbnail(videoUrl) ?? undefined) : undefined;

  let slug = toSlug(title);
  const existing = await prisma.video.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  const video = await prisma.video.create({
    data: {
      title,
      slug,
      segmentId,
      videoUrl,
      embedUrl,
      thumbnailUrl: thumbnailUrl || autoThumb,
      description,
      tags: JSON.stringify(tags ?? []),
      status: status ?? "DRAFT",
      isFeatured: isFeatured ?? false,
      sortOrder: sortOrder ?? 0,
      year: year ? parseInt(year) : undefined,
    },
  });

  return NextResponse.json(video, { status: 201 });
}
