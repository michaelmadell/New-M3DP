import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/Button";
import { OrderEditor } from "./order-editor"
export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!order) {
    return (
      <div className="space-y-4">
        <div className="text-xs tracking-[0.3em] font-bold text-[var(--color-muted)]">
          [ ADMIN / ORDERS ]
        </div>
        <h1 className="text-2xl font-bold text-[var(--color-fg)]">Not found</h1>
        <Button asChild variant="outline">
          <Link href="/admin/orders">Back to orders</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs text-[var(--color-fg)]/60">
            <Link
              href="/admin/orders"
              className="hover:text-[var(--digital-cyan)] transition-colors"
            >
              Orders
            </Link>{" "}
            <span className="text-[var(--color-fg)]/40">/</span> #{order.orderNumber}
          </div>

          <h1 className="text-3xl font-bold text-[var(--color-fg)] mt-2">
            Order #{order.orderNumber}
          </h1>

          <div className="text-sm text-[var(--color-fg)]/70 mt-1">
            {order.customerName} • {order.customerEmail}
            {order.customerPhone ? (
              <span className="text-[var(--color-fg)]/40"> • {order.customerPhone}</span>
            ) : null}
          </div>
        </div>

        <Button asChild variant="outline">
          <Link href="/admin/orders">Back</Link>
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
            <h2 className="font-bold text-[var(--color-fg)] mb-4">Items</h2>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-4 border border-[var(--color-border)] bg-[var(--color-surface-2)]/40 rounded-lg p-4"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-[var(--color-fg)] truncate">
                      {item.product.name}
                    </div>
                    <div className="text-xs text-[var(--color-fg)]/60 mt-1">
                      Qty: {item.quantity} • Unit: £{item.price.toFixed(2)}
                    </div>
                    <div className="text-xs text-[var(--color-fg)]/50 mt-1">
                      Product: {item.product.slug}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs text-[var(--color-fg)]/60 uppercase tracking-widest">
                      Line
                    </div>
                    <div className="font-bold text-[var(--color-fg)]">
                      £{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-[var(--color-border)] pt-4 flex items-center justify-between">
              <div className="text-sm text-[var(--color-fg)]/70">Total</div>
              <div className="text-xl font-bold text-[var(--color-fg)]">
                £{order.total.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
            <h2 className="font-bold text-[var(--color-fg)] mb-3">Addresses</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-[var(--color-border)] bg-[var(--color-surface-2)]/40 rounded-lg p-4">
                <div className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-fg)]/60">
                  Shipping
                </div>
                <pre className="mt-2 text-xs text-[var(--color-fg)]/70 whitespace-pre-wrap">
                  {order.shippingAddress
                    ? JSON.stringify(order.shippingAddress, null, 2)
                    : "N/A"}
                </pre>
              </div>

              <div className="border border-[var(--color-border)] bg-[var(--color-surface-2)]/40 rounded-lg p-4">
                <div className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-fg)]/60">
                  Billing
                </div>
                <pre className="mt-2 text-xs text-[var(--color-fg)]/70 whitespace-pre-wrap">
                  {order.billingAddress
                    ? JSON.stringify(order.billingAddress, null, 2)
                    : "N/A"}
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
            <h2 className="font-bold text-[var(--color-fg)] mb-4">Update</h2>
            <OrderEditor
              order={{
                id: order.id,
                status: order.status,
                notes: order.notes,
              }}
            />
          </div>

          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 text-sm text-[var(--color-fg)]/70 space-y-2">
            <div>
              <span className="font-bold text-[var(--color-fg)]">Created:</span>{" "}
              {new Date(order.createdAt).toLocaleString("en-GB")}
            </div>
            <div>
              <span className="font-bold text-[var(--color-fg)]">Updated:</span>{" "}
              {new Date(order.updatedAt).toLocaleString("en-GB")}
            </div>
            <div>
              <span className="font-bold text-[var(--color-fg)]">Stripe:</span>{" "}
              {order.stripePaymentId ?? "N/A"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}