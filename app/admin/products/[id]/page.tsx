import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/Button";
import { ProductEditor } from "@/components/admin/ProductEditor";
import { DeleteProductButton } from "./delete-product-button";

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-[var(--color-fg)]">Not found</h1>
        <Button asChild variant="outline">
          <Link href="/admin/products">Back to products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs tracking-[0.3em] font-bold text-[var(--color-muted)]">
            [ ADMIN / PRODUCTS ]
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-fg)] mt-2">
            Edit Product
          </h1>
          <p className="text-sm text-[var(--color-fg)]/70 mt-2">
            {product.name}
          </p>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/products/${product.slug}`} target="_blank">
              View
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/products">Back</Link>
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur tech-grid p-6">
        <ProductEditor
          mode="edit"
          productId={product.id}
          initial={{
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: product.price,
            stock: product.stock,
            images: product.images,
            categoryId: product.categoryId,
            isActive: product.isActive,
          }}
        />
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur tech-grid p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs tracking-[0.3em] font-bold text-[var(--color-muted)]">
              [ DANGER ZONE ]
            </div>
            <div className="mt-2 font-bold text-[var(--color-fg)]">Delete product</div>
            <div className="text-sm text-[var(--color-fg)]/70 mt-1">
              This may fail if the product is referenced by existing orders.
            </div>
          </div>

          <DeleteProductButton productId={product.id} />
        </div>
      </div>
    </div>
  );
}