import { Header } from '@/components/Header'
import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Footer } from '@/components/Footer'

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://monkeys3dprints.co.uk';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Monkeys 3DPrints - Custom 3D Printing & Film Processing',
    template: '%s | Monkeys 3DPrints',
  },
  description: 'Professional 3D printing services, film processing, and photography. Where digital fabrication meets analog artistry.',
  applicationName: 'Monkeys 3DPrints',
  alternates: { canonical: '/' },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Monkeys 3DPrints",
    title: "Monkeys 3DPrints",
    description: "Custom 3D Printing, film processing, and creative services. UK Based.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Monkeys 3DPrints"
      }
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    }
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className="min-h-screen antialiased">
        {/* Header */}
        <Header />
        

        {/* Main Content */}
        <div className="min-h-[calc(100vh-1px)] flex flex-col">
          <main className="flex-1">{children}</main>
        

        {/* Footer */}
        <Footer />
        </div>
      </body>
    </html>
  )
}