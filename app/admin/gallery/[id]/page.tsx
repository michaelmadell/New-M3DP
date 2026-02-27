import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/Button";
import { GalleryEditor } from "@/components/admin/GalleryEditor";
import { DeleteGalleryImageButton } from "./delete-gallery-image-button";

export default async function AdminEditGalleryImagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const img = await prisma.galleryImage.findUnique({ where: { id } });
  if (!img) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-[var(--color-fg)]">Not found</h1>
        <Button asChild variant="outline">
          <Link href="/admin/gallery">Back to gallery</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs tracking-[0.3em] font-bold text-[var(--color-muted)]">
            [ ADMIN / GALLERY ]
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-fg)] mt-2">
            Edit Image
          </h1>
          <p className="text-sm text-[var(--color-fg)]/70 mt-2">
            {img.title || "(untitled)"}
          </p>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline">
            <a href={img.imageUrl} target="_blank" rel="noreferrer">
              View
            </a>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/gallery">Back</Link>
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur tech-grid p-6">
        <GalleryEditor
          mode="edit"
          imageId={img.id}
          initial={{
            title: img.title,
            description: img.description,
            imageUrl: img.imageUrl,
            category: img.category,
            tags: img.tags,
            orderIndex: img.orderIndex,
            isVisible: img.isVisible,
          }}
        />
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur tech-grid p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs tracking-[0.3em] font-bold text-[var(--color-muted)]">
              [ DANGER ZONE ]
            </div>
            <div className="mt-2 font-bold text-[var(--color-fg)]">Delete image</div>
            <div className="text-sm text-[var(--color-fg)]/70 mt-1">
              Removes the DB record (and the file stays on disk unless you delete it manually).
            </div>
          </div>

          <DeleteGalleryImageButton imageId={img.id} />
        </div>
      </div>
    </div>
  );
}