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
  return `/admin/categories${qs ? `?${qs}` : ""}`;
}

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; take?: string }>;
}) {
  const params = await searchParams;

  const q = (params.q ?? "").trim();
  const page = clampInt(params.page, 1, 1, 9999);
  const take = clampInt(params.take, 20, 5, 100);

  const where = q ? { name: { contains: q, mode: "insensitive" as const } } : undefined;

  const [total, categories] = await Promise.all([
    prisma.category.count({ where }),
    prisma.category.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * take,
      take,
      include: { products: { select: { id: true } } },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / take));
  const safePage = Math.min(page, totalPages);

  const pageCategories =
    safePage === page
      ? categories
      : await prisma.category.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip: (safePage - 1) * take,
          take,
          include: { products: { select: { id: true } } },
        });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs tracking-[0.3em] font-bold text-[var(--color-muted)]">
            [ ADMIN / CATEGORIES ]
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-fg)] mt-2">
            Categories
          </h1>
          <p className="text-sm text-[var(--color-fg)]/70 mt-2">
            Organize products and navigation.
          </p>
        </div>

        <div className="flex flex-col items-stretch gap-2 md:items-end">
          <form action="/admin/categories" className="flex flex-wrap gap-2 justify-end">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search category name…"
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

            {q && (
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/categories">Reset</Link>
              </Button>
            )}
          </form>

          <div className="flex flex-wrap gap-2 justify-end">
            <Button asChild variant="digital" size="sm">
              <Link href="/admin/categories/new">+ New</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="text-sm text-[var(--color-fg)]/60">
        {total} result(s) • page {safePage} of {totalPages}
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-3 px-4 py-3 border-b border-[var(--color-border)] text-xs font-bold uppercase tracking-widest text-[var(--color-fg)]/60">
          <div className="col-span-4">Name</div>
          <div className="col-span-3">Slug</div>
          <div className="col-span-2 text-right">Products</div>
          <div className="col-span-3 text-right">Actions</div>
        </div>

        {pageCategories.length === 0 ? (
          <div className="p-6 text-sm text-[var(--color-fg)]/70">No categories found.</div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {pageCategories.map((c) => (
              <div
                key={c.id}
                className="grid grid-cols-12 gap-3 px-4 py-3 text-sm items-center hover:bg-[var(--color-surface-2)]/60 transition-colors"
              >
                <div className="col-span-4 min-w-0">
                  <div className="font-bold text-[var(--color-fg)] truncate">{c.name}</div>
                  {c.description ? (
                    <div className="text-xs text-[var(--color-fg)]/50 truncate">{c.description}</div>
                  ) : null}
                </div>

                <div className="col-span-3 text-[var(--color-fg)]/70 truncate">{c.slug}</div>

                <div className="col-span-2 text-right text-[var(--color-fg)]/70">
                  {c.products.length}
                </div>

                <div className="col-span-3 flex justify-end gap-2">
                  <Button asChild variant="digital" size="sm">
                    <Link href={`/admin/categories/${c.id}`}>Edit</Link>
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