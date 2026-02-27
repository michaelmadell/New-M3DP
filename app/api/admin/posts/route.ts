import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/adminSession";

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function GET(req: Request) {
  if (!requireAdminSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const published = searchParams.get("published"); // "true" | "false" | null

  const posts = await prisma.post.findMany({
    where:
      published === "true"
        ? { isPublished: true }
        : published === "false"
        ? { isPublished: false }
        : undefined,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ data: posts });
}

export async function POST(req: Request) {
  if (!requireAdminSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
  if (!body.title?.trim()) return badRequest("Missing title");
  if (!body.slug?.trim()) return badRequest("Missing slug");
  if (!body.content?.trim()) return badRequest("Missing content");

  const now = new Date();

  const created = await prisma.post.create({
    data: {
      title: body.title.trim(),
      slug: body.slug.trim(),
      content: body.content,
      excerpt: body.excerpt?.trim() || null,
      coverImage: body.coverImage?.trim() || null,
      category: body.category?.trim() || null,
      isPublished: body.isPublished ?? false,
      publishedAt: body.isPublished ? now : null,
    },
  });

  return NextResponse.json({ data: created }, { status: 201 });
}