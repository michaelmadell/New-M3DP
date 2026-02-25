import { Header } from '@/components/Header'
import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Monkeys 3DPrints - Custom 3D Printing & Film Processing',
  description: 'Professional 3D printing services, film processing, and photography. Where digital fabrication meets analog artistry.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        {/* Header */}
        <Header />
        

        {/* Main Content */}
        <main>{children}</main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  )
}