import { prisma } from '@/lib/prisma'
import Image from 'next/image'

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams
  const category = params.category || 'all'

  const images = await prisma.galleryImage.findMany({
    where: {
      isVisible: true,
      ...(category !== 'all' && { category }),
    },
    orderBy: [
      { orderIndex: 'asc' },
      { createdAt: 'desc' },
    ],
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Photography Gallery</h1>

      {/* Category Filter */}
      <div className="flex space-x-4 mb-8">
        <a
          href="/gallery?category=all"
          className={`px-4 py-2 rounded ${
            category === 'all'
              ? 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)]'
              : 'bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/50'
          }`}
        >
          All
        </a>
        <a
          href="/gallery?category=digital"
          className={`px-4 py-2 rounded ${
            category === 'digital'
              ? 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)]'
              : 'bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/50'
          }`}
        >
          Digital Photography
        </a>
        <a
          href="/gallery?category=film"
          className={`px-4 py-2 rounded ${
            category === 'film'
              ? 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)]'
              : 'bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/50'
          }`}
        >
          Film Photography
        </a>
      </div>

      {/* Gallery Grid */}
      {images.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No images in this category yet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {images.map((image) => (
            <div key={image.id} className="group relative aspect-video overflow-hidden rounded-lg cursor-pointer">
              <Image
                src={image.imageUrl}
                alt={image.title || 'Gallery image'}
                fill
                className="object-cover transition-transform group-hover:scale-110"
              />
              {image.title && (
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-end p-4">
                  <p className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    {image.title}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const dynamic = 'force-dynamic'
