import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/Button";
import { PostEditor } from "@/components/admin/PostEditor";
import { DeletePostButton } from "./delete-post-button";

export default async function AdminEditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-[var(--color-fg)]">Not found</h1>
        <Button asChild variant="outline">
          <Link href="/admin/blog">Back to blog</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs tracking-[0.3em] font-bold text-[var(--color-muted)]">
            [ ADMIN / BLOG ]
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-fg)] mt-2">Edit Post</h1>
          <p className="text-sm text-[var(--color-fg)]/70 mt-2">{post.title}</p>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/blog/${post.slug}`} target="_blank">
              View
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/blog">Back</Link>
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur tech-grid p-6">
        <PostEditor
          mode="edit"
          postId={post.id}
          initial={{
            title: post.title,
            slug: post.slug,
            content: post.content,
            excerpt: post.excerpt,
            coverImage: post.coverImage,
            category: post.category,
            isPublished: post.isPublished,
          }}
        />
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur tech-grid p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs tracking-[0.3em] font-bold text-[var(--color-muted)]">
              [ DANGER ZONE ]
            </div>
            <div className="mt-2 font-bold text-[var(--color-fg)]">Delete post</div>
            <div className="text-sm text-[var(--color-fg)]/70 mt-1">
              This removes the post permanently.
            </div>
          </div>

          <DeletePostButton postId={post.id} />
        </div>
      </div>
    </div>
  );
}