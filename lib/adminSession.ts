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

export async function requireAdminSession(): Promise<boolean> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;

  const cookieValue = (await cookies()).get(COOKIE_NAME)?.value;
  if (!cookieValue) return false;

  const idx = cookieValue.lastIndexOf(".");
  if (idx <= 0) return false;

  const payload = cookieValue.slice(0, idx);
  const sig = cookieValue.slice(idx + 1);

  if (!payload.startsWith("v1:")) return false;
  const exp = Number(payload.slice(3));
  if (!Number.isFinite(exp)) return false;
  if (Date.now() >= exp) return false;

  const expected = sign(payload, secret);
  return safeEqual(sig, expected);
}