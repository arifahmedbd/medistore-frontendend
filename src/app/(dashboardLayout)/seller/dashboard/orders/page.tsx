import Link from "next/link";
import { Clock, Package, Truck, CheckCircle, XCircle, Filter } from "lucide-react";
import OrderStatusUpdater from "@/components/modules/sellerDashboard/OrderStatusUpdater";
import { getSellerOrdersAction } from "@/actions/seller.action";

interface Props {
  searchParams?: Promise<{ status?: string; page?: string }>;
}

const STATUSES = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

const STATUS_META: Record<string, { label: string; color: string; dot: string; icon: React.ElementType }> = {
  PLACED:     { label: "Placed",     color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", dot: "bg-amber-400", icon: Clock },
  PROCESSING: { label: "Processing", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",       dot: "bg-blue-400", icon: Package },
  SHIPPED:    { label: "Shipped",    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", dot: "bg-purple-400", icon: Truck },
  DELIVERED:  { label: "Delivered",  color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",   dot: "bg-green-400", icon: CheckCircle },
  CANCELLED:  { label: "Cancelled",  color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",         dot: "bg-red-400", icon: XCircle },
};

export default async function SellerOrdersPage({ searchParams }: Props) {
  const resolved = await searchParams;
  const status   = resolved?.status ?? "";
  const page     = parseInt(resolved?.page ?? "1", 10) || 1;

  const res = await getSellerOrdersAction({ page, status: status || undefined });
  const ordersData = res?.data;
  const orders = ordersData?.orders ?? [];
  const totalPages = ordersData?.totalPages ?? 1;

  const buildHref = (s: string, p = 1) => {
    const q = new URLSearchParams();
    if (s) q.set("status", s);
    if (p > 1) q.set("page", String(p));
    return `/seller/dashboard/orders?${q.toString()}`;
  };

  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Orders</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage and update customer orders</p>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Filter size={16} className="text-slate-400 dark:text-slate-300" />
        <Link
          href="/seller/dashboard/orders"
          className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition ${
            !status
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          All
        </Link>
        {STATUSES.map((s) => {
          const meta = STATUS_META[s];
          const active = status === s;
          return (
            <Link
              key={s}
              href={buildHref(s)}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full transition ${
                active ? meta.color + " ring-1 ring-current" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
              {meta.label}
            </Link>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-[720px] w-full text-sm bg-white dark:bg-[#0e1c30] rounded-2xl border border-slate-200 dark:border-slate-700">
          <thead className="bg-slate-50 dark:bg-[#0a1628] text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="text-left px-4 py-3">Order ID</th>
              <th className="text-left px-4 py-3">Customer</th>
              <th className="text-left px-4 py-3">Items</th>
              <th className="text-right px-4 py-3">Total</th>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-slate-400 dark:text-slate-500">
                  <Package size={36} className="mx-auto mb-3 text-slate-200 dark:text-slate-700" />
                  No orders found
                  {status && (
                    <div>
                      <Link href="/seller/dashboard/orders" className="text-xs text-green-600 dark:text-green-400 hover:underline mt-2 inline-block">
                        Clear filter
                      </Link>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              orders.map((order: any) => {
                const meta = STATUS_META[order.status] ?? STATUS_META.PLACED;
                const StatusIcon = meta.icon;
                return (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-[#0a1628] transition">
                    <td className="px-4 py-3 font-mono text-xs text-slate-600 dark:text-slate-400">#{order.id}</td>
                    <td className="px-4 py-3 max-w-[160px]">
                      <p className="font-medium text-slate-800 dark:text-slate-200 truncate">{order.user?.name ?? "—"}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{order.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <ul className="space-y-0.5">
                        {order.items?.slice(0, 2).map((item: any) => (
                          <li key={item.id} className="text-xs text-slate-600 dark:text-slate-400 truncate">
                            {item.quantity}× {item.medicine.name}
                          </li>
                        ))}
                        {order.items?.length > 2 && (
                          <li className="text-xs text-slate-400 dark:text-slate-500">+{order.items.length - 2} more</li>
                        )}
                      </ul>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-800 dark:text-white whitespace-nowrap">
                      £{order.total?.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${meta.color}`}>
                        <StatusIcon size={11} />
                        {meta.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
                        <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={buildHref(status, p)}
              className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition ${
                p === page
                  ? "bg-slate-900 dark:bg-green-500 text-white dark:text-slate-900"
                  : "bg-white dark:bg-[#0e1c30] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#122a4a]"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}