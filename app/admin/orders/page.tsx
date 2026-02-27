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

type Status = (typeof STATUSES)[number];

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

function clampInt(v: unknown, def: number, min: number, max: number) {
  const n = typeof v === "string" ? Number(v) : NaN;
  if (!Number.isFinite(n)) return def;
  return Math.max(min, Math.min(max, Math.trunc(n)));
}

function buildHref(params: Record<string, string | undefined>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if(v && v !== "") sp.set(k, v);
  }
  const qs = sp.toString();
  return `/admin/orders${qs ? `?${qs}` : ""}`;
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string; take?: string }>;
}) {
  const params = await searchParams;
  
  const status = (params.status ?? "all") as Status;
  const q = params.q?.trim() ?? "";
  const page = clampInt(params.page, 1, 1, Number.MAX_SAFE_INTEGER);
  const take = clampInt(params.take, 20, 1, 100);

  const where = 
    status === "all" && !q
      ? undefined
      : {
        ...(status === "all" ? {} : { status }),
        ...(q
          ? {
            OR: [
              { orderNumber: { contains: q, mode: "insensitive" as const } },
              { customerName: { contains: q, mode: "insensitive" as const } },
              { customerEmail: { contains: q, mode: "insensitive" as const } }
            ]
          }
        : {})
      };

  const [total, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * take,
      take,
      include: { items: true },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / take));
  const safePage = Math.min(page, totalPages);

  const pageOrders = 
    safePage === page
      ? orders
      : await prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (safePage - 1) * take,
        take,
        include: { items: true },
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
            Search orders and update fulfillment status.
          </p>
        </div>

        <div className="flex flex-col items-stretch gap-2 md:items-end">
          {/* Search */}
          <form action="/admin/orders" className="flex flex-wrap gap-2 justify-end">
            <input type="hidden" name="status" value={status === "all" ? "" : status} />

            <input
              name="q"
              defaultValue={q}
              placeholder="Search order # / name / email…"
              className="w-full md:w-[320px] border border-[var(--color-border)] bg-[var(--color-surface)]/70 backdrop-blur rounded-md px-3 py-2 text-sm text-[var(--color-fg)] outline-none focus:border-[var(--digital-cyan)]"
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

            {(q || status !== "all") && (
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/orders">Reset</Link>
              </Button>
            )}
          </form>

          {/* Status chips */}
          <div className="flex flex-wrap gap-2 justify-end">
            {STATUSES.map((s) => (
              <Button
                key={s}
                asChild
                variant={s === status ? "digital" : "outline"}
                size="sm"
              >
                <Link
                  href={buildHref({
                    status: s === "all" ? undefined : s,
                    q: q || undefined,
                    take: String(take),
                    page: "1",
                  })}
                >
                  {s}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="text-sm text-[var(--color-fg)]/60">
        {total} result(s) • page {safePage} of {totalPages}
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

        {pageOrders.length === 0 ? (
          <div className="p-6 text-sm text-[var(--color-fg)]/70">
            No orders found.
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {pageOrders.map((o) => (
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

                <div className="col-span-1 text-[var(--color-fg)]/70">{o.items.length}</div>

                <div className="col-span-1 text-right font-bold text-[var(--color-fg)]">
                  £{o.total.toFixed(2)}
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
              status: status === "all" ? undefined : status,
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
              status: status === "all" ? undefined : status,
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