import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/Button";
import { OrderStatusInline } from "./order-status-inline";

const STATUSES = [
  "all",
  "pending",
  "paid",
  "processing",
  "shipped",
  "completed",
  "cancelled",
] as const;

function statusBadge(status: string) {
  const base =
    "inline-flex items-center px-2 py-1 rounded-md text-xs font-bold tracking-widest uppercase border";
  switch (status) {
    case "pending":
      return `${base} border-[var(--analog-amber)] text-[var(--analog-amber)] bg-[var(--analog-amber)]/10`;
    case "paid":
      return `${base} border-[var(--digital-cyan)] text-[var(--digital-cyan)] bg-[var(--digital-cyan)]/10`;
    case "processing":
      return `${base} border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent)]/10`;
    case "shipped":
      return `${base} border-[var(--digital-cyan)] text-[var(--digital-cyan)] bg-[var(--digital-cyan)]/10`;
    case "completed":
      return `${base} border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary)]/10`;
    case "cancelled":
      return `${base} border-[var(--color-destructive)] text-[var(--color-destructive)] bg-[var(--color-destructive)]/10`;
    default:
      return `${base} border-[var(--color-border)] text-[var(--color-fg)]/70 bg-[var(--color-surface-2)]`;
  }
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const status = (params.status ?? "all") as (typeof STATUSES)[number];

  const orders = await prisma.order.findMany({
    where: status === "all" ? undefined : { status },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      items: true, // for item count
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs tracking-[0.3em] font-bold text-[var(--color-muted)]">
            [ ADMIN / ORDERS ]
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-fg)] mt-2">
            Orders
          </h1>
          <p className="text-sm text-[var(--color-fg)]/70 mt-2">
            Review orders and update fulfillment status.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <Button
              key={s}
              asChild
              variant={s === status ? "digital" : "outline"}
              size="sm"
            >
              <Link
                href={s === "all" ? "/admin/orders" : `/admin/orders?status=${s}`}
              >
                {s}
              </Link>
            </Button>
          ))}
        </div>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden">
        <div className="grid grid-cols-14 gap-3 px-4 py-3 border-b border-[var(--color-border)] text-xs font-bold uppercase tracking-widest text-[var(--color-fg)]/60">
          <div className="col-span-2">Order</div>
          <div className="col-span-3">Customer</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Quick update</div>
          <div className="col-span-1">Items</div>
          <div className="col-span-1 text-right">Total</div>
        </div>

        {orders.length === 0 ? (
          <div className="p-6 text-sm text-[var(--color-fg)]/70">
            No orders found.
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {orders.map((o) => (
              <div
                key={o.id}
                className="grid grid-cols-14 gap-3 px-4 py-3 text-sm hover:bg-[var(--color-surface-2)]/60 transition-colors items-center"
              >
                <Link
                  href={`/admin/orders/${o.id}`}
                  className="col-span-2 font-bold text-[var(--color-fg)] truncate hover:text-[var(--digital-cyan)] transition-colors"
                >
                  #{o.orderNumber}
                </Link>

                <div className="col-span-3 text-[var(--color-fg)] truncate">
                  {o.customerName}
                  <div className="text-xs text-[var(--color-fg)]/50">
                    {new Date(o.createdAt).toLocaleString("en-GB", {
                      year: "2-digit",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                <div className="col-span-3 text-[var(--color-fg)]/70 truncate">
                  {o.customerEmail}
                </div>

                <div className="col-span-2">
                  <span className={statusBadge(o.status)}>{o.status}</span>
                </div>

                <div className="col-span-2">
                  <OrderStatusInline orderId={o.id} currentStatus={o.status} />
                </div>

                <div className="col-span-1 text-[var(--color-fg)]/70">
                  {o.items.length}
                </div>

                <div className="col-span-1 text-right font-bold text-[var(--color-fg)]">
                  £{o.total.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}