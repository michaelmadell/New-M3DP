import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/Button";
import { GalleryVisibleInline } from "./gallery-visible-inline";

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; visible?: string }>;
}) {
  const params = await searchParams;
  const category = params.category; // "digital" | "film" | undefined
  const visible = params.visible; // "true" | "false" | undefined

  const images = await prisma.galleryImage.findMany({
    where: {
      ...(category ? { category } : {}),
      ...(visible === "true" ? { isVisible: true } : {}),
      ...(visible === "false" ? { isVisible: false } : {}),
    },
    orderBy: { createdAt: "desc" }, // newest only
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs tracking-[0.3em] font-bold text-[var(--color-muted)]">
            [ ADMIN / GALLERY ]
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-fg)] mt-2">
            Gallery
          </h1>
          <p className="text-sm text-[var(--color-fg)]/70 mt-2">
            Manage images, tags, and visibility.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant={!category ? "digital" : "outline"}>
            <Link href="/admin/gallery">All</Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant={category === "digital" ? "digital" : "outline"}
          >
            <Link
              href={`/admin/gallery?category=digital${visible ? `&visible=${visible}` : ""}`}
            >
              Digital
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant={category === "film" ? "digital" : "outline"}
          >
            <Link
              href={`/admin/gallery?category=film${visible ? `&visible=${visible}` : ""}`}
            >
              Film
            </Link>
          </Button>

          <span className="w-px bg-[var(--color-border)] mx-1" />

          <Button asChild size="sm" variant={!visible ? "digital" : "outline"}>
            <Link href={`/admin/gallery${category ? `?category=${category}` : ""}`}>Any</Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant={visible === "true" ? "digital" : "outline"}
          >
            <Link
              href={`/admin/gallery?${new URLSearchParams({
                ...(category ? { category } : {}),
                visible: "true",
              }).toString()}`}
            >
              Visible
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant={visible === "false" ? "digital" : "outline"}
          >
            <Link
              href={`/admin/gallery?${new URLSearchParams({
                ...(category ? { category } : {}),
                visible: "false",
              }).toString()}`}
            >
              Hidden
            </Link>
          </Button>

          <Button asChild variant="digital" size="sm">
            <Link href="/admin/gallery/new">+ New</Link>
          </Button>
        </div>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-3 px-4 py-3 border-b border-[var(--color-border)] text-xs font-bold uppercase tracking-widest text-[var(--color-fg)]/60">
          <div className="col-span-4">Image</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-3">Tags</div>
          <div className="col-span-1 text-center">Visible</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {images.length === 0 ? (
          <div className="p-6 text-sm text-[var(--color-fg)]/70">No images.</div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {images.map((img) => (
              <div key={img.id} className="grid grid-cols-12 gap-3 px-4 py-3 items-center">
                <div className="col-span-4 min-w-0">
                  <div className="font-bold text-[var(--color-fg)] truncate">
                    {img.title || "(untitled)"}
                  </div>
                  <div className="text-xs text-[var(--color-fg)]/50 truncate">
                    {new Date(img.createdAt).toLocaleString("en-GB")}
                    <span className="text-[var(--color-fg)]/40"> • </span>
                    {img.imageUrl}
                  </div>
                </div>

                <div className="col-span-2 text-[var(--color-fg)]/70">{img.category}</div>

                <div className="col-span-3 text-xs text-[var(--color-fg)]/60 truncate">
                  {img.tags.length ? img.tags.join(", ") : "—"}
                </div>

                <div className="col-span-1 flex justify-center">
                  <GalleryVisibleInline imageId={img.id} initialVisible={img.isVisible} />
                </div>

                <div className="col-span-2 flex justify-end gap-2">
                  <Button asChild size="sm" variant="outline">
                    <a href={img.imageUrl} target="_blank" rel="noreferrer">
                      View
                    </a>
                  </Button>
                  <Button asChild size="sm" variant="digital">
                    <Link href={`/admin/gallery/${img.id}`}>Edit</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}