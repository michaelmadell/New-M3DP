import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/Button";
import { CategoryEditor } from "@/components/admin/CategoryEditor";
import { DeleteCategoryButton } from "./delete-category-button";

export default async function AdminEditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const category = await prisma.category.findUnique({
    where: { id },
    include: { products: { select: { id: true } } },
  });

  if (!category) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-[var(--color-fg)]">Not found</h1>
        <Button asChild variant="outline">
          <Link href="/admin/categories">Back to categories</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs tracking-[0.3em] font-bold text-[var(--color-muted)]">
            [ ADMIN / CATEGORIES ]
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-fg)] mt-2">
            Edit Category
          </h1>
          <p className="text-sm text-[var(--color-fg)]/70 mt-2">{category.name}</p>
        </div>

        <Button asChild variant="outline">
          <Link href="/admin/categories">Back</Link>
        </Button>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur tech-grid p-6">
        <CategoryEditor
          mode="edit"
          categoryId={category.id}
          initial={{
            name: category.name,
            slug: category.slug,
            description: category.description,
          }}
        />
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur tech-grid p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs tracking-[0.3em] font-bold text-[var(--color-muted)]">
              [ DANGER ZONE ]
            </div>
            <div className="mt-2 font-bold text-[var(--color-fg)]">Delete category</div>
            <div className="text-sm text-[var(--color-fg)]/70 mt-1">
              This will fail if products still reference this category.
              <span className="text-[var(--color-fg)]/50">
                {" "}
                ({category.products.length} product(s) currently linked)
              </span>
            </div>
          </div>

          <DeleteCategoryButton categoryId={category.id} />
        </div>
      </div>
    </div>
  );
}