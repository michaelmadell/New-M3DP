import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/Button";
import { ProductActiveInline } from "./product-active-inline";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ active?: string }>;
}) {
  const params = await searchParams;
  const active = params.active; // "true" | "false" | undefined

  const products = await prisma.product.findMany({
    where:
      active === "true"
        ? { isActive: true }
        : active === "false"
        ? { isActive: false }
        : undefined,
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

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

        <div className="flex flex-wrap gap-2">
          <Button asChild variant={!active ? "digital" : "outline"} size="sm">
            <Link href="/admin/products">All</Link>
          </Button>
          <Button
            asChild
            variant={active === "true" ? "digital" : "outline"}
            size="sm"
          >
            <Link href="/admin/products?active=true">Active</Link>
          </Button>
          <Button
            asChild
            variant={active === "false" ? "digital" : "outline"}
            size="sm"
          >
            <Link href="/admin/products?active=false">Inactive</Link>
          </Button>

          <Button asChild variant="digital" size="sm">
            <Link href="/admin/products/new">+ New</Link>
          </Button>
        </div>
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

        {products.length === 0 ? (
          <div className="p-6 text-sm text-[var(--color-fg)]/70">
            No products found.
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {products.map((p) => (
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
    </div>
  );
}