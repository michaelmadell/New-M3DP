import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/adminSession";

const ALLOWED_STATUSES = new Set([
  "pending",
  "reviewed",
  "quoted",
  "accepted",
  "completed",
  "declined",
]);

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const quote = await prisma.quote.findUnique({ where: { id } });

  if (!quote) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: quote });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const body = (await req.json().catch(() => null)) as
    | { status?: string; notes?: string | null; quotedPrice?: number | null }
    | null;

  if (!body) return badRequest("Invalid JSON");

  if (body.status && !ALLOWED_STATUSES.has(body.status)) {
    return badRequest("Invalid status");
  }

  if (body.quotedPrice !== undefined && body.quotedPrice !== null) {
    if (
      typeof body.quotedPrice !== "number" ||
      !Number.isFinite(body.quotedPrice) ||
      body.quotedPrice < 0
    ) {
      return badRequest("Invalid quotedPrice");
    }
  }

  const updated = await prisma.quote.update({
    where: { id },
    data: {
      ...(body.status !==undefined ? { status: body.status } : {}),
      ...(body.notes !== undefined ? { notes: body.notes?.trim() } : {}),
      ...(body.quotedPrice !== undefined ? { quotedPrice: body.quotedPrice } : {}),
    },
  });

  return NextResponse.json({ data: updated });
}