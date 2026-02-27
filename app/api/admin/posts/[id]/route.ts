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
  if (!requireAdminSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: post });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!requireAdminSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = (await req.json().catch(() => null)) as
    | {
        title?: string;
        slug?: string;
        content?: string;
        excerpt?: string | null;
        coverImage?: string | null;
        category?: string | null;
        isPublished?: boolean;
      }
    | null;

  if (!body) return badRequest("Invalid JSON");

  const now = new Date();

  const updated = await prisma.post.update({
    where: { id },
    data: {
      ...(body.title !== undefined ? { title: body.title.trim() } : {}),
      ...(body.slug !== undefined ? { slug: body.slug.trim() } : {}),
      ...(body.content !== undefined ? { content: body.content } : {}),
      ...(body.excerpt !== undefined ? { excerpt: body.excerpt?.trim() || null } : {}),
      ...(body.coverImage !== undefined ? { coverImage: body.coverImage?.trim() || null } : {}),
      ...(body.category !== undefined ? { category: body.category?.trim() || null } : {}),
      ...(body.isPublished !== undefined
        ? { isPublished: body.isPublished, publishedAt: body.isPublished ? now : null }
        : {}),
    },
  });

  return NextResponse.json({ data: updated });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!requireAdminSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}