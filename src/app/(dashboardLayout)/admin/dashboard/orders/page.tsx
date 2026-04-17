import Link from "next/link";
import {
  ShoppingCart, Package, Truck, CheckCircle, XCircle, Search, Filter,
} from "lucide-react";
import { getAdminOrdersAction } from "@/actions/admin.action";

interface Props {
  searchParams?: Promise<{ search?: string; status?: string; page?: string }>;
}

const STATUSES = ["PLACED","PROCESSING","SHIPPED","DELIVERED","CANCELLED"] as const;
const STATUS_META: Record<string, { label: string; color: string; dot: string; icon: React.ElementType }> = {
  PLACED:     { label:"Placed",     color:"bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",          dot:"bg-sky-400",    icon:ShoppingCart },
  PROCESSING: { label:"Processing", color:"bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",      dot:"bg-blue-400",   icon:Package },
  SHIPPED:    { label:"Shipped",    color:"bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", dot:"bg-purple-400", icon:Truck },
  DELIVERED:  { label:"Delivered",  color:"bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",  dot:"bg-green-400",  icon:CheckCircle },
  CANCELLED:  { label:"Cancelled",  color:"bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",          dot:"bg-red-400",    icon:XCircle },
};

export default async function AdminOrdersPage({ searchParams }: Props) {
  const sp     = await searchParams;
  const search = sp?.search ?? "";
  const status = sp?.status ?? "";
  const page   = parseInt(sp?.page ?? "1", 10) || 1;

  const res        = await getAdminOrdersAction({ page, search, status: status || undefined });
  const orders     = res?.data?.orders     ?? [];
  const totalPages = res?.data?.totalPages ?? 1;
  const total      = res?.data?.total      ?? 0;

  const buildHref = (overrides: { status?: string; page?: number; search?: string }) => {
    const q = new URLSearchParams();
    const s  = overrides.search ?? search;
    const st = overrides.status ?? status;
    const p  = overrides.page   ?? 1;
    if (s)  q.set("search", s);
    if (st) q.set("status", st);
    if (p > 1) q.set("page", String(p));
    return `/admin/dashboard/orders?${q.toString()}`;
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Orders</h1>
          <p className="text-sm text-slate-400 mt-1">{total} order{total !== 1 ? "s" : ""} total</p>
        </div>
      </div>

      {/* Search + status filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <form method="GET" action="/admin/orders" className="flex gap-2 flex-1 min-w-[200px] max-w-sm">
          <input type="hidden" name="status" value={status} />
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input name="search" defaultValue={search} placeholder="Search customer or seller..."
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-[#0e1525] text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <button type="submit" className="px-3.5 py-2 bg-[#0a0f1e] dark:bg-violet-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition">
            Search
          </button>
        </form>

        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={13} className="text-slate-400" />
          <Link href={buildHref({ status: "", page: 1 })}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition ${
              !status ? "bg-[#0a0f1e] dark:bg-violet-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}>All</Link>
          {STATUSES.map((st) => {
            const meta   = STATUS_META[st];
            const active = status === st;
            return (
              <Link key={st} href={buildHref({ status: st, page: 1 })}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition ${
                  active ? meta.color + " ring-1 ring-current" : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />{meta.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#0e1525] rounded-2xl border border-slate-100 dark:border-slate-700/40 overflow-hidden mb-5">
        {orders.length === 0 ? (
          <div className="py-20 text-center">
            <Package size={32} className="mx-auto text-slate-200 dark:text-slate-700 mb-3" />
            <p className="text-slate-400 font-medium">No orders found</p>
            {(search || status) && (
              <Link href="/admin/orders" className="text-xs text-violet-500 hover:underline mt-2 inline-block">Clear filters</Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-[#09111e] text-xs text-slate-400 uppercase tracking-wide border-b border-slate-100 dark:border-slate-700/40">
                  <th className="text-left px-5 py-3">Order ID</th>
                  <th className="text-left px-4 py-3">Customer</th>
                  <th className="text-left px-4 py-3">Seller</th>
                  <th className="text-left px-4 py-3">Items</th>
                  <th className="text-right px-4 py-3">Total</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/40">
                {orders.map((o: any) => {
                  const meta = STATUS_META[o.status] ?? STATUS_META.PLACED;
                  const Icon = meta.icon;
                  return (
                    <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-[#0a1020] transition align-middle">
                      <td className="px-5 py-3.5 font-mono text-xs text-slate-400">#{o.id.slice(0,8).toUpperCase()}</td>
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">{o.user?.name ?? "—"}</p>
                        <p className="text-xs text-slate-400 truncate max-w-[150px]">{o.user?.email}</p>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{o.seller?.name ?? "—"}</td>
                      <td className="px-4 py-3.5 max-w-[160px]">
                        {o.items?.slice(0,2).map((item: any) => (
                          <p key={item.id} className="text-xs text-slate-500 dark:text-slate-400 truncate">{item.quantity}× {item.medicine.name}</p>
                        ))}
                        {o.items?.length > 2 && <p className="text-xs text-slate-400">+{o.items.length - 2} more</p>}
                      </td>
                      <td className="px-4 py-3.5 text-right font-bold text-slate-800 dark:text-white whitespace-nowrap">£{o.total?.toFixed(2)}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${meta.color}`}>
                          <Icon size={11}/>{meta.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-400 whitespace-nowrap">
                        {new Date(o.createdAt).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link key={p} href={buildHref({ page: p })}
              className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition ${
                p === page
                  ? "bg-[#0a0f1e] dark:bg-violet-600 text-white"
                  : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}>{p}</Link>
          ))}
        </div>
      )}
    </>
  );
}