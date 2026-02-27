import Link from "next/link";
import { Button } from "@/components/Button";
import { GalleryEditor } from "@/components/admin/GalleryEditor";

export default function AdminNewGalleryImagePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs tracking-[0.3em] font-bold text-[var(--color-muted)]">
            [ ADMIN / GALLERY ]
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-fg)] mt-2">
            New Gallery Image
          </h1>
          <p className="text-sm text-[var(--color-fg)]/70 mt-2">
            Upload an image, add tags, and set visibility.
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href="/admin/gallery">Back</Link>
        </Button>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur tech-grid p-6">
        <GalleryEditor mode="create" />
      </div>
    </div>
  );
}