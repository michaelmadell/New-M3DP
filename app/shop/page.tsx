import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/Button";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;

  const categories = await prisma.category.findMany({
    include: {
      products: {
        select: { id: true },
      },
    },
    orderBy: { name: "asc" },
  });

  // Total count for "All Products" (option A)
  const totalActiveProducts = await prisma.product.count({
    where: { isActive: true },
  });

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(params.category && {
        category: { slug: params.category },
      }),
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  const activeCategory = params.category ?? null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-14 sm:py-16">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-10">
        <div>
          <div className="text-xs tracking-[0.3em] font-bold text-[var(--color-muted)]">
            [ SHOP ]
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--color-fg)] mt-2">
            Products
          </h1>
          <p className="text-[var(--color-fg)]/70 mt-3 max-w-2xl">
            Ready-to-buy prints and maker goods. Want something custom? Request a quote.
          </p>
        </div>

        <Button asChild variant="digital" size="sm" className="self-start sm:self-auto">
          <Link href="/quote">Request Custom Quote</Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="md:sticky md:top-28 h-fit">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4">
            <h2 className="text-sm font-bold tracking-wider uppercase text-[var(--color-fg)]/80 mb-3">
              Categories
            </h2>

            <div className="flex flex-col gap-2">
              <Button
                asChild
                variant={activeCategory === null ? "digital" : "ghost"}
                className="w-full justify-between"
              >
                <Link href="/shop">
                  <span>All Products</span>
                  <span className="text-xs text-[var(--color-fg)]/60">
                    {totalActiveProducts}
                  </span>
                </Link>
              </Button>

              {categories.map((category) => {
                const isActive = activeCategory === category.slug;
                const count = category.products.length;

                return (
                  <Button
                    key={category.id}
                    asChild
                    variant={isActive ? "digital" : "ghost"}
                    className="w-full justify-between"
                  >
                    <Link href={`/shop?category=${category.slug}`}>
                      <span className="truncate">{category.name}</span>
                      <span className="text-xs text-[var(--color-fg)]/60">
                        {count}
                      </span>
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Product grid */}
        <section className="md:col-span-3">
          {products.length === 0 ? (
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-10 text-center">
              <p className="text-[var(--color-fg)]/70 mb-6">
                No products found in this category.
              </p>
              <Button asChild variant="analog">
                <Link href="/quote">Request a Custom Quote Instead</Link>
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/${product.slug}`}
                  className={[
                    "group block overflow-hidden rounded-xl",
                    "bg-[var(--color-surface)] border border-[var(--color-border)]",
                    "transition-transform duration-200 hover:-translate-y-0.5",
                    "hover:border-[var(--digital-cyan)]",
                  ].join(" ")}
                >
                  <div className="relative h-48 bg-[var(--color-surface-2)]">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[var(--color-fg)]/40">
                        No image
                      </div>
                    )}

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-bold text-[var(--color-fg)] leading-snug">
                        {product.name}
                      </h3>
                      <span className="text-sm font-bold text-[var(--color-fg)] whitespace-nowrap">
                        £{product.price.toFixed(2)}
                      </span>
                    </div>

                    <p className="text-[var(--color-fg)]/70 text-sm mt-2 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider text-[var(--color-fg)]/60">
                        {product.category?.name ?? "Uncategorized"}
                      </span>

                      {product.stock > 0 ? (
                        <span className="text-xs font-bold text-[var(--digital-cyan)]">
                          In Stock
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-[var(--analog-amber)]">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";