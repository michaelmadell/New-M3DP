import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "admin_session";

function toHex(buffer: ArrayBuffer) {
    return [...new Uint8Array(buffer)]
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

async function hmacSha256Hex(secret: string, message: string) {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
        "raw",
        enc.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );
    const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
    return toHex(sig);
}

async function isValidSessionCookie(
    cookieValue: string | undefined, 
    secret: string
) {
  if (!cookieValue) return false;

  // cookie format: "<payload>.<sig>"
  const idx = cookieValue.lastIndexOf(".");
  if (idx <= 0) return false;

  const payload = cookieValue.slice(0, idx);
  const sig = cookieValue.slice(idx + 1);

  if (!payload.startsWith("v1:")) return false;

  const parts = payload.split(":");
  if (parts.length !== 3) return false;

  const exp = Number(parts[1]);
  const userId = parts[2];

  if (!Number.isFinite(exp)) return false;
  if (!userId) return false;
  if (Date.now() >= exp) return false;

  const expected = await hmacSha256Hex(secret, payload);
  return sig === expected;
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Only protect /admin (but allow /admin/login and the login API itself)
  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (pathname === "/admin/login") return NextResponse.next();
  if (pathname.startsWith("/api/admin/login")) return NextResponse.next();

  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    // Fail closed in prod; in dev you’ll notice quickly.
    return NextResponse.redirect(new URL("/admin/login?error=misconfigured", req.url));
  }

  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  const ok = await isValidSessionCookie(cookie, secret);

  if (ok) return NextResponse.next();

  const loginUrl = new URL("/admin/login", req.url);
  loginUrl.searchParams.set("next", pathname + search);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};