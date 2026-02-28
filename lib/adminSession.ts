import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "admin_session";

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}

function safeEqual(a: string, b: string) {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

export type AdminSession = {
  userId: string;
  exp: number;
}

export async function requireAdminSession(): Promise<AdminSession | null> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return null;

  const cookieValue = (await cookies()).get(COOKIE_NAME)?.value;
  if (!cookieValue) return null;

  const idx = cookieValue.lastIndexOf(".");
  if (idx <= 0) return null;

  const payload = cookieValue.slice(0, idx);
  const sig = cookieValue.slice(idx + 1);

  if (!payload.startsWith("v1:")) return null;

  const parts = payload.split(":");
  if (parts.length !== 3) return null;

  const exp = Number(parts[1]);
  const userId = parts[2];

  if (!Number.isFinite(exp)) return null;
  if (!userId) return null;
  if (Date.now() >= exp) return null;

  const expected = sign(payload, secret);
  if (!safeEqual(sig, expected)) return null;

  return { userId, exp };
}