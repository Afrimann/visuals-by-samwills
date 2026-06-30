import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const collabs = await prisma.collaboration.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(collabs);
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, logoUrl, websiteUrl, description, sortOrder } = body;

  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const collab = await prisma.collaboration.create({
    data: {
      name,
      logoUrl: logoUrl ?? null,
      websiteUrl: websiteUrl ?? null,
      description: description ?? null,
      sortOrder: sortOrder ?? 0,
    },
  });

  return NextResponse.json(collab, { status: 201 });
}
