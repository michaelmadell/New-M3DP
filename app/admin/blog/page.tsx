import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/Button";

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ published?: string }>;
}) {
  const params = await searchParams;
  const published = params.published; // "true" | "false" | undefined

  const posts = await prisma.post.findMany({
    where:
      published === "true"
        ? { isPublished: true }
        : published === "false"
        ? { isPublished: false }
        : undefined,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-xs tracking-[0.3em] font-bold text-[var(--color-muted)]">
            [ ADMIN / BLOG ]
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-fg)] mt-2">Blog Posts</h1>
          <p className="text-sm text-[var(--color-fg)]/70 mt-2">
            Markdown posts with optional cover images.
          </p>
        </div>

        <div className="flex gap-2">
          <Button asChild variant={!published ? "digital" : "outline"} size="sm">
            <Link href="/admin/blog">All</Link>
          </Button>
          <Button asChild variant={published === "true" ? "digital" : "outline"} size="sm">
            <Link href="/admin/blog?published=true">Published</Link>
          </Button>
          <Button asChild variant={published === "false" ? "digital" : "outline"} size="sm">
            <Link href="/admin/blog?published=false">Drafts</Link>
          </Button>

          <Button asChild variant="digital">
            <Link href="/admin/blog/new">+ New</Link>
          </Button>
        </div>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-3 px-4 py-3 border-b border-[var(--color-border)] text-xs font-bold uppercase tracking-widest text-[var(--color-fg)]/60">
          <div className="col-span-5">Title</div>
          <div className="col-span-3">Slug</div>
          <div className="col-span-2">State</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {posts.length === 0 ? (
          <div className="p-6 text-sm text-[var(--color-fg)]/70">No posts.</div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {posts.map((p) => (
              <div key={p.id} className="grid grid-cols-12 gap-3 px-4 py-3 items-center">
                <div className="col-span-5 min-w-0">
                  <div className="font-bold text-[var(--color-fg)] truncate">{p.title}</div>
                  <div className="text-xs text-[var(--color-fg)]/50">
                    {new Date(p.createdAt).toLocaleString("en-GB")}
                  </div>
                </div>
                <div className="col-span-3 text-[var(--color-fg)]/70 truncate">{p.slug}</div>
                <div className="col-span-2">
                  <span
                    className={[
                      "inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase border",
                      p.isPublished
                        ? "border-[var(--digital-cyan)] text-[var(--digital-cyan)] bg-[var(--digital-cyan)]/10"
                        : "border-[var(--analog-amber)] text-[var(--analog-amber)] bg-[var(--analog-amber)]/10",
                    ].join(" ")}
                  >
                    {p.isPublished ? "PUBLISHED" : "DRAFT"}
                  </span>
                </div>
                <div className="col-span-2 flex justify-end gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/blog/${p.slug}`} target="_blank">
                      View
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="digital">
                    <Link href={`/admin/blog/${p.id}`}>Edit</Link>
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