import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "admin_session";

// 7 days
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}

function safeEqual(a: string, b: string) {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

export async function POST(req: Request) {
  const { password, next } = (await req.json().catch(() => ({}))) as {
    password?: string;
    next?: string;
  };

  const adminPassword = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!adminPassword || !secret) {
    return NextResponse.json(
      { ok: false, error: "Server not configured" },
      { status: 500 }
    );
  }

  if (!password) {
    return NextResponse.json({ ok: false, error: "Missing password" }, { status: 400 });
  }

  // Timing-safe password compare
  const ok = safeEqual(password, adminPassword);
  if (!ok) {
    return NextResponse.json({ ok: false, error: "Invalid password" }, { status: 401 });
  }

  const exp = Date.now() + SESSION_TTL_MS;
  const payload = `v1:${exp}`;
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