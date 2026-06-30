import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";
import { getEmbedUrl, getYouTubeThumbnail } from "@/lib/video";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authed = await isAdminAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const embedUrl = body.videoUrl ? (getEmbedUrl(body.videoUrl) ?? undefined) : undefined;
  const autoThumb = body.videoUrl && !body.thumbnailUrl
    ? (getYouTubeThumbnail(body.videoUrl) ?? undefined)
    : undefined;

  const video = await prisma.video.update({
    where: { id },
    data: {
      ...body,
      embedUrl: embedUrl ?? body.embedUrl,
      thumbnailUrl: body.thumbnailUrl || autoThumb,
      tags: body.tags ? JSON.stringify(body.tags) : undefined,
      year: body.year ? parseInt(body.year) : undefined,
      updatedAt: new Date(),
    },
  });

  return NextResponse.json(video);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authed = await isAdminAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.video.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
