import Link from "next/link";
import { Button } from "@/components/Button";
import { PostEditor } from "@/components/admin/PostEditor";

export default function AdminNewPostPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs tracking-[0.3em] font-bold text-[var(--color-muted)]">
            [ ADMIN / BLOG ]
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-fg)] mt-2">New Post</h1>
          <p className="text-sm text-[var(--color-fg)]/70 mt-2">
            Write in Markdown. Upload images straight into your post.
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href="/admin/blog">Back</Link>
        </Button>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur tech-grid p-6">
        <PostEditor mode="create" />
      </div>
    </div>
  );
}