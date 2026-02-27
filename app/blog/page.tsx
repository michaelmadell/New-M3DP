import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/Button";

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-10">
        <div className="text-xs tracking-[0.3em] font-bold text-[var(--color-muted)]">
          [ BLOG ]
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mt-2 text-[var(--color-fg)]">
          Blog & Reviews
        </h1>
        <p className="text-[var(--color-fg)]/70 mt-3 max-w-3xl">
          Updates, reviews, and behind-the-scenes notes from the workshop.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-10 text-center">
          <p className="text-[var(--color-fg)]/70">No posts yet. Check back soon!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className={[
                "overflow-hidden rounded-xl",
                "bg-[var(--color-surface)] border border-[var(--color-border)]",
                "transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--digital-cyan)]",
              ].join(" ")}
            >
              {post.coverImage && (
                <div className="relative h-64">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 768px"
                    priority={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
              )}

              <div className="p-6">
                <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--color-fg)]/70 mb-3">
                  {post.category && (
                    <span className="px-2 py-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-fg)]/80">
                      {post.category}
                    </span>
                  )}

                  {post.publishedAt && (
                    <span>
                      {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-[var(--color-fg)] mb-3">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-[var(--digital-cyan)] transition-colors"
                  >
                    {post.title}
                  </Link>
                </h2>

                {post.excerpt && (
                  <p className="text-[var(--color-fg)]/70 mb-5">{post.excerpt}</p>
                )}

                <Button asChild variant="outline" size="sm">
                  <Link href={`/blog/${post.slug}`}>Read more →</Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export const dynamic = "force-dynamic";