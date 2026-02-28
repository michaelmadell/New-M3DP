import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { writeFile } from 'fs/promises'
import path from 'path'
import crypto from 'node:crypto'
import nodemailer from 'nodemailer'
import fs from 'node:fs'

type storedFile = {
  name: string;
  url: string;
  size: number;
}

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'quotes');

const ALLOWED_EXT = new Set(['.stl', '.step', '.step', '.stp', '.iges', '.igs', '.obj', '.zip', '.rar', '.7z']);
const MAX_FILE_BYTES = 100 * 1024 * 1024; // 100 MB
const MAX_FILES = 5;

function getExt(filename: string): string {
  return filename.split('.').slice(-1)[0].toLowerCase();
}

function safeBaseName(filename: string) {
  const ext = getExt(filename);
  const base = filename.replace(/\.[^/.]+$/, "");
  const safeBase = base.replace(/[^a-zA-Z0-9._-]/g, "_");
  return { safeBase: safeBase || "file", ext };
}

function badRequest(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phoneRaw = String(formData.get("phone") ?? "").trim();
    const messageRaw = String(formData.get("message") ?? "").trim();

    const phone = phoneRaw ? phoneRaw : null;
    const message = messageRaw ? messageRaw : null;

    if (!name) return badRequest("Name is required");
    if (!email) return badRequest("Email is required");

    // New client format: repeated "files" entries
    const fileEntries = formData.getAll("files");

    const uploadFiles = fileEntries.filter((v): v is File => v instanceof File);

    if (uploadFiles.length === 0) return badRequest("At least one file is required");
    if (uploadFiles.length > MAX_FILES) return badRequest(`Max ${MAX_FILES} files allowed`);

    if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

    const storedFiles: storedFile[] = [];

    for (const file of uploadFiles) {
      const ext = getExt(file.name);
      if (!ALLOWED_EXT.has(ext)) {
        return badRequest(`File type not allowed: ${ext || "unknown"}`);
      }

      if (file.size > MAX_FILE_BYTES) {
        return badRequest(`File too large: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
      }

      const safeBase = safeBaseName(file.name);

      const id = crypto.randomBytes(12).toString("hex");
      const filename = `${Date.now()}_${id}_${safeBase.safeBase}.${safeBase.ext}`;
      const filepath = path.join(UPLOAD_DIR, filename);
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filepath, buffer);

      storedFiles.push({
        name: file.name,
        url: `/uploads/quotes/${filename}`,
        size: file.size,
      });
    }
    
    // Save to database
    const quote = await prisma.quote.create({
      data: {
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        message,
        files: storedFiles as any,
        status: 'pending',
      },
    })
    
    // Send email notification
    try {
      const host = process.env.SMTP_HOST;
      const user = process.env.SMTP_USER;
      const pass = process.env.SMTP_PASSWORD;
      const from = process.env.SMTP_FROM;

      if (host && user && pass && from) {
      const transporter = nodemailer.createTransport({
        host,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: false,
        auth: {
          user,
          pass,
        },
      })
      
      await transporter.sendMail({
        from,
        to: user, // Send to yourself
        subject: `New Quote Request from ${name}`,
        html: `
          <h2>New Quote Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Message:</strong> ${message || 'N/A'}</p>
          <p><strong>Files:</strong> ${storedFiles.length} file(s) uploaded</p>
          <p><strong>Files:</strong></p>
          <ul>
              ${storedFiles
                .map(
                  (f) =>
                    `<li>${f.name} (${(f.size / 1024).toFixed(2)} KB) - ${f.url}</li>`
                )
                .join("")}
            </ul>
        `,
      });
    }else{
      console.warn('SMTP not configured, skipping email notification')
    }
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError)
      // Don't fail the request if email fails
    }
    
    return NextResponse.json({ success: true, quoteId: quote.id }, { status: 201 });
  } catch (error) {
    console.error('Error processing quote:', error)
    return NextResponse.json(
      { error: 'Failed to process quote request' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return new Response("Method Not Allowed", { status: 405 });
}
