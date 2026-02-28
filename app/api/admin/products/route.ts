import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/adminSession";

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function GET(req: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const active = searchParams.get("active"); // "true" | "false" | null

  const products = await prisma.product.findMany({
    where:
      active === "true"
        ? { isActive: true }
        : active === "false"
        ? { isActive: false }
        : undefined,
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return NextResponse.json({ data: products });
}

export async function POST(req: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as
    | {
        name?: string;
        slug?: string;
        description?: string | null;
        price?: number;
        stock?: number;
        images?: string[];
        categoryId?: string;
        isActive?: boolean;
      }
    | null;

  if (!body) return badRequest("Invalid JSON");
  if (!body.name?.trim()) return badRequest("Missing name");
  if (!body.slug?.trim()) return badRequest("Missing slug");
  if (typeof body.price !== "number" || !Number.isFinite(body.price) || body.price < 0)
    return badRequest("Invalid price");
  if (typeof body.stock !== "number" || !Number.isFinite(body.stock) || body.stock < 0)
    return badRequest("Invalid stock");
  if (!body.categoryId) return badRequest("Missing categoryId");

  const images = Array.isArray(body.images)
    ? body.images.filter((s) => typeof s === "string").map((s) => s.trim()).filter(Boolean)
    : [];

  const created = await prisma.product.create({
    data: {
      name: body.name.trim(),
      slug: body.slug.trim(),
      description: body.description?.trim() || null,
      price: body.price,
      stock: body.stock,
      images,
      isActive: body.isActive ?? true,
      categoryId: body.categoryId,
    },
  });

  return NextResponse.json({ data: created }, { status: 201 });
}