import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { writeFile } from 'fs/promises'
import path from 'path'
import nodemailer from 'nodemailer'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string || null
    const message = formData.get('message') as string || null
    
    // Process uploaded files
    const files: Array<{ name: string; url: string; size: number }> = []
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'quotes')
    
    // Ensure upload directory exists
    const fs = require('fs')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    
    // Process each uploaded file
    const entries = Array.from(formData.entries())
    for (const [key, value] of entries) {
      if (key.startsWith('file_') && value instanceof File) {
        const file = value as File
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        
        // Generate unique filename
        const timestamp = Date.now()
        const safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
        const filename = `${timestamp}_${safeFilename}`
        const filepath = path.join(uploadDir, filename)
        
        await writeFile(filepath, buffer)
        
        files.push({
          name: file.name,
          url: `/uploads/quotes/${filename}`,
          size: file.size,
        })
      }
    }
    
    // Save to database
    const quote = await prisma.quote.create({
      data: {
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        message,
        files,
        status: 'pending',
      },
    })
    
    // Send email notification
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      })
      
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: process.env.SMTP_USER, // Send to yourself
        subject: `New Quote Request from ${name}`,
        html: `
          <h2>New Quote Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Message:</strong> ${message || 'N/A'}</p>
          <p><strong>Files:</strong> ${files.length} file(s) uploaded</p>
          <p><strong>Files:</strong></p>
          <ul>
            ${files.map(f => `<li>${f.name} (${(f.size / 1024).toFixed(2)} KB)</li>`).join('')}
          </ul>
        `,
      })
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError)
      // Don't fail the request if email fails
    }
    
    return NextResponse.json({ success: true, quoteId: quote.id })
  } catch (error) {
    console.error('Error processing quote:', error)
    return NextResponse.json(
      { error: 'Failed to process quote request' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    const quotes = await prisma.quote.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    })
    
    return NextResponse.json(quotes)
  } catch (error) {
    console.error('Error fetching quotes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quotes' },
      { status: 500 }
    )
  }
}
