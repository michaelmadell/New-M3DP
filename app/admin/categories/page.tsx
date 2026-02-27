import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/Button";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { products: { select: { id: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-xs tracking-[0.3em] font-bold text-[var(--color-muted)]">
            [ ADMIN / CATEGORIES ]
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-fg)] mt-2">Categories</h1>
          <p className="text-sm text-[var(--color-fg)]/70 mt-2">
            Used to organize products.
          </p>
        </div>

        <Button asChild variant="digital">
          <Link href="/admin/categories/new">+ New</Link>
        </Button>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-3 px-4 py-3 border-b border-[var(--color-border)] text-xs font-bold uppercase tracking-widest text-[var(--color-fg)]/60">
          <div className="col-span-4">Name</div>
          <div className="col-span-3">Slug</div>
          <div className="col-span-2 text-right">Products</div>
          <div className="col-span-3 text-right">Actions</div>
        </div>

        {categories.length === 0 ? (
          <div className="p-6 text-sm text-[var(--color-fg)]/70">No categories.</div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {categories.map((c) => (
              <div key={c.id} className="grid grid-cols-12 gap-3 px-4 py-3 items-center">
                <div className="col-span-4 font-bold text-[var(--color-fg)]">{c.name}</div>
                <div className="col-span-3 text-[var(--color-fg)]/70">{c.slug}</div>
                <div className="col-span-2 text-right text-[var(--color-fg)]/70">
                  {c.products.length}
                </div>
                <div className="col-span-3 flex justify-end gap-2">
                  <Button asChild size="sm" variant="digital">
                    <Link href={`/admin/categories/${c.id}`}>Edit</Link>
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