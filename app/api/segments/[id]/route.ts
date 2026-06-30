import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { toSlug } from "@/lib/video";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const updated = await prisma.segment.update({
    where: { id },
    data: {
      ...(body.name && { name: body.name, slug: toSlug(body.name) }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.accentColor && { accentColor: body.accentColor }),
      ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const videoCount = await prisma.video.count({ where: { segmentId: id } });
  if (videoCount > 0) {
    return NextResponse.json(
      { error: `Cannot delete: ${videoCount} videos belong to this segment` },
      { status: 400 }
    );
  }

  await prisma.segment.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
