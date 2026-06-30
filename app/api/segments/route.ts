import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { toSlug } from "@/lib/video";

export async function GET() {
  const segments = await prisma.segment.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { videos: true } } },
  });
  return NextResponse.json(segments);
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, description, accentColor, sortOrder } = body;

  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const segment = await prisma.segment.create({
    data: {
      name,
      slug: toSlug(name),
      description: description ?? null,
      accentColor: accentColor ?? "#c9a84c",
      sortOrder: sortOrder ?? 0,
    },
  });

  return NextResponse.json(segment, { status: 201 });
}
