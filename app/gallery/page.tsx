import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Button } from "@/components/Button";

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const category = params.category || "all";

  const images = await prisma.galleryImage.findMany({
    where: {
      isVisible: true,
      ...(category !== "all" && { category }),
    },
    orderBy: [{ createdAt: "desc" }],
  });

  const categories = [
    { key: "all", label: "All" },
    { key: "digital", label: "Digital Photography" },
    { key: "film", label: "Film Photography" },
  ] as const;

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-10">
        <div className="text-xs tracking-[0.3em] font-bold text-[var(--color-muted)]">
          [ GALLERY ]
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mt-2 text-[var(--color-fg)]">
          Photography Gallery
        </h1>
        <p className="text-[var(--color-fg)]/70 mt-3 max-w-3xl">
          A selection of digital and film work. Use the filters to narrow the
          view.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 mb-10">
        {categories.map((c) => {
          const isActive = category === c.key;

          return (
            <Button
              key={c.key}
              asChild
              variant={isActive ? "digital" : "outline"}
              size="sm"
            >
              <Link href={`/gallery?category=${c.key}`}>{c.label}</Link>
            </Button>
          );
        })}
      </div>

      {/* Gallery Grid */}
      {images.length === 0 ? (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-10 text-center">
          <p className="text-[var(--color-fg)]/70">
            No images in this category yet.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative aspect-video overflow-hidden rounded-xl cursor-pointer bg-[var(--color-surface)] border border-[var(--color-border)]"
            >
              <Image
                src={image.imageUrl}
                alt={image.title || "Gallery image"}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {image.title && (
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                    {image.title}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const dynamic = "force-dynamic";