import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/adminSession";

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function GET() {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ data: categories });
}

export async function POST(req: Request) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as
    | { name?: string; slug?: string; description?: string | null }
    | null;

  if (!body) return badRequest("Invalid JSON");
  if (!body.name?.trim()) return badRequest("Missing name");
  if (!body.slug?.trim()) return badRequest("Missing slug");

  const created = await prisma.category.create({
    data: {
      name: body.name.trim(),
      slug: body.slug.trim(),
      description: body.description?.trim() || null,
    },
  });

  return NextResponse.json({ data: created }, { status: 201 });
}