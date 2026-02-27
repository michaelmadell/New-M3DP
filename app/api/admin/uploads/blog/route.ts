import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/adminSession";
import { writeFile } from "fs/promises";
import path from "path";
import crypto from "node:crypto";

export async function POST(req: Request) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  // Basic validation
  const allowed = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
  if (!allowed.has(file.type)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }

  // 10MB cap (adjust as desired)
  const MAX = 10 * 1024 * 1024;
  if (file.size > MAX) {
    return NextResponse.json({ error: "File too large" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public", "uploads", "blog");

  // Ensure directory exists
  const fs = await import("node:fs");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const ext =
    file.type === "image/png"
      ? "png"
      : file.type === "image/jpeg"
      ? "jpg"
      : file.type === "image/webp"
      ? "webp"
      : file.type === "image/gif"
      ? "gif"
      : "bin";

  const id = crypto.randomBytes(16).toString("hex");
  const filename = `${Date.now()}_${id}.${ext}`;
  const filepath = path.join(uploadDir, filename);

  await writeFile(filepath, buffer);

  const url = `/uploads/blog/${filename}`;
  return NextResponse.json({ url });
}