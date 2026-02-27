import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/Button";
import { ProductActiveInline } from "./product-active-inline";

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
  return `/admin/products${qs ? `?${qs}` : ""}`;
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ active?: string; q?: string; page?: string; take?: string }>;
}) {
  const params = await searchParams;

  const active = params.active;
  const q = (params.q ?? "").trim();
  const page = clampInt(params.page, 1, 1, 9999);
  const take = clampInt(params.take, 20, 5, 100);
  
  const where = {
    ...(active === "true" ? { isActive: true } : {}),
    ...(active === "false" ? { isActive: false } : {}),
    ...(q
      ? { name: { contains: q, mode: "insensitive" as const } }
      : {}
    )
  }

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * take,
      take,
      include: { category: true }
    })
  ])

  const totalPages = Math.max(1, Math.ceil(total / take));
  const safePage = Math.min(page, totalPages);

  const pageProducts = 
    safePage === page
      ? products
      : await prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (safePage - 1) * take,
        take,
        include: { category: true }
      })

  return (
<div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs tracking-[0.3em] font-bold text-[var(--color-muted)]">
            [ ADMIN / PRODUCTS ]
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-fg)] mt-2">
            Products
          </h1>
          <p className="text-sm text-[var(--color-fg)]/70 mt-2">
            Inventory, pricing, and visibility.
          </p>
        </div>

        <div className="flex flex-col items-stretch gap-2 md:items-end">
          {/* Search */}
          <form action="/admin/products" className="flex flex-wrap gap-2 justify-end">
            <input type="hidden" name="active" value={active ?? ""} />

            <input
              name="q"
              defaultValue={q}
              placeholder="Search product name…"
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

            {(q || active) && (
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/products">Reset</Link>
              </Button>
            )}
          </form>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 justify-end">
            <Button asChild variant={!active ? "digital" : "outline"} size="sm">
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

            <Button
              asChild
              variant={active === "true" ? "digital" : "outline"}
              size="sm"
            >
              <Link
                href={buildHref({
                  active: "true",
                  q: q || undefined,
                  take: String(take),
                  page: "1",
                })}
              >
                Active
              </Link>
            </Button>

            <Button
              asChild
              variant={active === "false" ? "digital" : "outline"}
              size="sm"
            >
              <Link
                href={buildHref({
                  active: "false",
                  q: q || undefined,
                  take: String(take),
                  page: "1",
                })}
              >
                Inactive
              </Link>
            </Button>

            <Button asChild variant="digital" size="sm">
              <Link href="/admin/products/new">+ New</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="text-sm text-[var(--color-fg)]/60">
        {total} result(s) • page {safePage} of {totalPages}
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-3 px-4 py-3 border-b border-[var(--color-border)] text-xs font-bold uppercase tracking-widest text-[var(--color-fg)]/60">
          <div className="col-span-4">Product</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2 text-right">Price</div>
          <div className="col-span-1 text-right">Stock</div>
          <div className="col-span-1 text-center">Active</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {pageProducts.length === 0 ? (
          <div className="p-6 text-sm text-[var(--color-fg)]/70">
            No products found.
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {pageProducts.map((p) => (
              <div
                key={p.id}
                className="grid grid-cols-12 gap-3 px-4 py-3 text-sm items-center hover:bg-[var(--color-surface-2)]/60 transition-colors"
              >
                <div className="col-span-4 min-w-0">
                  <div className="font-bold text-[var(--color-fg)] truncate">
                    {p.name}
                  </div>
                  <div className="text-xs text-[var(--color-fg)]/50 truncate">
                    {p.slug}
                  </div>
                </div>

                <div className="col-span-2 text-[var(--color-fg)]/70 truncate">
                  {p.category?.name ?? "—"}
                </div>

                <div className="col-span-2 text-right font-bold text-[var(--color-fg)]">
                  £{p.price.toFixed(2)}
                </div>

                <div className="col-span-1 text-right text-[var(--color-fg)]/70">
                  {p.stock}
                </div>

                <div className="col-span-1 flex justify-center">
                  <ProductActiveInline productId={p.id} initialActive={p.isActive} />
                </div>

                <div className="col-span-2 flex justify-end gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/products/${p.slug}`} target="_blank">
                      View
                    </Link>
                  </Button>
                  <Button asChild variant="digital" size="sm">
                    <Link href={`/admin/products/${p.id}`}>Edit</Link>
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
              active,
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
              active,
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