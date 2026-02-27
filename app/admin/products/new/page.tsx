import Link from "next/link";
import { Button } from "@/components/Button";
import { ProductEditor } from "@/components/admin/ProductEditor";

export default function AdminNewProductPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs tracking-[0.3em] font-bold text-[var(--color-muted)]">
            [ ADMIN / PRODUCTS ]
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-fg)] mt-2">
            New Product
          </h1>
          <p className="text-sm text-[var(--color-fg)]/70 mt-2">
            Create a new product and publish when ready.
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href="/admin/products">Back</Link>
        </Button>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur tech-grid p-6">
        <ProductEditor mode="create" />
      </div>
    </div>
  );
}