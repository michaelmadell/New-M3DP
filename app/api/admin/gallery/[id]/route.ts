import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/adminSession";

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!requireAdminSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const image = await prisma.galleryImage.findUnique({ where: { id } });
  if (!image) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ data: image });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!requireAdminSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

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

  const tags =
    body.tags !== undefined
      ? body.tags.filter((t) => typeof t === "string").map((t) => t.trim()).filter(Boolean)
      : undefined;

  const updated = await prisma.galleryImage.update({
    where: { id },
    data: {
      ...(body.title !== undefined ? { title: body.title?.trim() || null } : {}),
      ...(body.description !== undefined
        ? { description: body.description?.trim() || null }
        : {}),
      ...(body.imageUrl !== undefined ? { imageUrl: body.imageUrl.trim() } : {}),
      ...(body.category !== undefined ? { category: body.category.trim() } : {}),
      ...(tags !== undefined ? { tags } : {}),
      ...(body.orderIndex !== undefined ? { orderIndex: body.orderIndex } : {}),
      ...(body.isVisible !== undefined ? { isVisible: body.isVisible } : {}),
    },
  });

  return NextResponse.json({ data: updated });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!requireAdminSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.galleryImage.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}