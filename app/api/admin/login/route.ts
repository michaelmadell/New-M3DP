import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "admin_session";

// 7 days
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}

function badRequest(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status});
}

function safeEqual(a: string, b: string) {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

export async function POST(req: Request) {
  const { email, password, next } = (await req.json().catch(() => ({}))) as {
    email?: string;
    password?: string;
    next?: string;
  };

  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    return badRequest("Admin session secret not configured", 500);
  }

  const normalizedEmail = typeof email === "string" ?
    email.trim().toLowerCase() : "";

  if (!normalizedEmail) return badRequest("Email is required", 400);
  if (!password) return badRequest("Password is required", 400);

  const user = await prisma.user.findUnique({ where: {email: normalizedEmail}})

  if (!user) return badRequest("Invalid email or password", 401);

  if (user.role !== "ADMIN") return badRequest("Unauthorized", 403);

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return badRequest("Invalid email or password", 401);

  const exp = Date.now() + SESSION_TTL_MS;
  const payload = `v1:${exp}:${user.id}`;
  const sig = sign(payload, secret);
  const cookieValue = `${payload}.${sig}`;

  const res = NextResponse.json({
    ok: true,
    redirectTo: typeof next === "string" && next.startsWith("/admin") ? next : "/admin",
  });

  res.cookies.set({
    name: COOKIE_NAME,
    value: cookieValue,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(exp),
  });

  return res;
}