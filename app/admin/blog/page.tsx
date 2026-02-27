import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/Button";

function clampInt(v: unknown, def: number, min: number, max: number) {
  const n = typeof v === "string" ? Number(v) : NaN;
  if (!Number.isFinite(n)) return def;
  return Math.max(min, Math.min(max, Math.trunc(n)));
}

function buildHref(params: Record<string, string | undefined>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v && v !== "") sp.set(k, v);
  }
  const qs = sp.toString();
  return `/admin/blog${qs ? `?${qs}` : ""}`;
}

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ published?: string; q?: string; page?: string; take?: string }>;
}) {
  const params = await searchParams;

  const published = params.published; // "true" | "false" | undefined
  const q = (params.q ?? "").trim();
  const page = clampInt(params.page, 1, 1, 9999);
  const take = clampInt(params.take, 20, 5, 100);

  const where = {
    ...(published === "true" ? { isPublished: true } : {}),
    ...(published === "false" ? { isPublished: false } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" as const } },
            { slug: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [total, posts] = await Promise.all([
    prisma.post.count({ where }),
    prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * take,
      take,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / take));
  const safePage = Math.min(page, totalPages);

  const pagePosts =
    safePage === page
      ? posts
      : await prisma.post.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip: (safePage - 1) * take,
          take,
        });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs tracking-[0.3em] font-bold text-[var(--color-muted)]">
            [ ADMIN / BLOG ]
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-fg)] mt-2">Blog Posts</h1>
          <p className="text-sm text-[var(--color-fg)]/70 mt-2">
            Search, publish, and edit posts.
          </p>
        </div>

        <div className="flex flex-col items-stretch gap-2 md:items-end">
          <form action="/admin/blog" className="flex flex-wrap gap-2 justify-end">
            <input type="hidden" name="published" value={published ?? ""} />

            <input
              name="q"
              defaultValue={q}
              placeholder="Search title or slug…"
              className="w-full md:w-[280px] border border-[var(--color-border)] bg-[var(--color-surface)]/70 backdrop-blur rounded-md px-3 py-2 text-sm text-[var(--color-fg)] outline-none focus:border-[var(--digital-cyan)]"
            />

            <select
              name="take"
              defaultValue={String(take)}
              className="border border-[var(--color-border)] bg-[var(--color-surface)]/70 backdrop-blur rounded-md px-3 py-2 text-sm text-[var(--color-fg)] outline-none focus:border-[var(--digital-cyan)]"
              title="Page size"
            >
              {[10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}/page
                </option>
              ))}
            </select>

            <Button type="submit" variant="digital" size="sm">
              Search
            </Button>

            {(q || published) && (
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/blog">Reset</Link>
              </Button>
            )}
          </form>

          <div className="flex flex-wrap gap-2 justify-end">
            <Button asChild variant={!published ? "digital" : "outline"} size="sm">
              <Link
                href={buildHref({
                  q: q || undefined,
                  take: String(take),
                  page: "1",
                })}
              >
                All
              </Link>
            </Button>

            <Button asChild variant={published === "true" ? "digital" : "outline"} size="sm">
              <Link
                href={buildHref({
                  published: "true",
                  q: q || undefined,
                  take: String(take),
                  page: "1",
                })}
              >
                Published
              </Link>
            </Button>

            <Button asChild variant={published === "false" ? "digital" : "outline"} size="sm">
              <Link
                href={buildHref({
                  published: "false",
                  q: q || undefined,
                  take: String(take),
                  page: "1",
                })}
              >
                Drafts
              </Link>
            </Button>

            <Button asChild variant="digital" size="sm">
              <Link href="/admin/blog/new">+ New</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="text-sm text-[var(--color-fg)]/60">
        {total} result(s) • page {safePage} of {totalPages}
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-3 px-4 py-3 border-b border-[var(--color-border)] text-xs font-bold uppercase tracking-widest text-[var(--color-fg)]/60">
          <div className="col-span-5">Title</div>
          <div className="col-span-3">Slug</div>
          <div className="col-span-2">State</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {pagePosts.length === 0 ? (
          <div className="p-6 text-sm text-[var(--color-fg)]/70">No posts.</div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {pagePosts.map((p) => (
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

      <div className="flex items-center justify-between gap-3">
        <Button asChild variant="outline" size="sm" disabled={safePage <= 1}>
          <Link
            aria-disabled={safePage <= 1}
            href={buildHref({
              published,
              q: q || undefined,
              take: String(take),
              page: String(Math.max(1, safePage - 1)),
            })}
          >
            ← Prev
          </Link>
        </Button>

        <div className="text-xs text-[var(--color-fg)]/60">
          Page {safePage} / {totalPages}
        </div>

        <Button asChild variant="outline" size="sm" disabled={safePage >= totalPages}>
          <Link
            aria-disabled={safePage >= totalPages}
            href={buildHref({
              published,
              q: q || undefined,
              take: String(take),
              page: String(Math.min(totalPages, safePage + 1)),
            })}
          >
            Next →
          </Link>
        </Button>
      </div>
    </div>
  );
}