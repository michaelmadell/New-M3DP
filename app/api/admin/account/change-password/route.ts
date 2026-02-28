import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/adminSession";

function jsonError(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function POST(req: Request) {
  const session = await requireAdminSession();
  if (!session) return jsonError("Unauthorized", 401);

  const body = (await req.json().catch(() => null)) as
    | { currentPassword?: string; newPassword?: string; confirmPassword?: string }
    | null;

  if (!body) return jsonError("Invalid JSON", 400);

  const currentPassword = body.currentPassword ?? "";
  const newPassword = body.newPassword ?? "";
  const confirmPassword = body.confirmPassword ?? "";

  if (!currentPassword) return jsonError("Missing current password", 400);
  if (!newPassword) return jsonError("Missing new password", 400);

  if (newPassword.length < 10) {
    return jsonError("New password must be at least 10 characters", 400);
  }

  if (newPassword !== confirmPassword) {
    return jsonError("New passwords do not match", 400);
  }

  if (newPassword === currentPassword) {
    return jsonError("New password must be different from current password", 400);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, password: true, role: true, email: true },
  });

  if (!user) return jsonError("Unauthorized", 401);
  if (user.role !== "ADMIN") return jsonError("Forbidden", 403);

  const ok = await bcrypt.compare(currentPassword, user.password);
  if (!ok) return jsonError("Current password is incorrect", 401);

  const nextHash = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: nextHash },
  });

  return NextResponse.json({ ok: true });
}