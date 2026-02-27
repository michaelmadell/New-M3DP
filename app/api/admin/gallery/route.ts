import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/adminSession";

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function GET(req: Request) {
  if (!requireAdminSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || undefined; // "digital"|"film"
  const visible = searchParams.get("visible"); // "true"|"false"|null

  const images = await prisma.galleryImage.findMany({
    where: {
      ...(category ? { category } : {}),
      ...(visible === "true" ? { isVisible: true } : {}),
      ...(visible === "false" ? { isVisible: false } : {}),
    },
    orderBy: { createdAt: "desc" }, // newest only
  });

  return NextResponse.json({ data: images });
}

export async function POST(req: Request) {
  if (!requireAdminSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as
    | {
        title?: string | null;
        description?: string | null;
        imageUrl?: string;
        category?: string;
        tags?: string[];
        orderIndex?: number;
        isVisible?: boolean;
      }
    | null;

  if (!body) return badRequest("Invalid JSON");
  if (!body.imageUrl?.trim()) return badRequest("Missing imageUrl");
  if (!body.category?.trim()) return badRequest("Missing category");

  const tags = Array.isArray(body.tags)
    ? body.tags
        .filter((t) => typeof t === "string")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const created = await prisma.galleryImage.create({
    data: {
      title: body.title?.trim() || null,
      description: body.description?.trim() || null,
      imageUrl: body.imageUrl.trim(),
      category: body.category.trim(),
      tags,
      orderIndex: Number.isFinite(body.orderIndex) ? (body.orderIndex as number) : 0,
      isVisible: body.isVisible ?? true,
    },
  });

  return NextResponse.json({ data: created }, { status: 201 });
}