import Link from "next/link";
import {
  TrendingUp, ShoppingBag, Pill, AlertTriangle,
  ArrowRight, Clock, CheckCircle, Truck, XCircle, Package,
} from "lucide-react";
import { getSellerStatsAction } from "@/actions/seller.action";

const STATUS_META: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  PLACED:    { label: "Placed",    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",   icon: Clock },
  PROCESSING: { label: "Processing", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",       icon: Package },
  SHIPPED:    { label: "Shipped",    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", icon: Truck },
  DELIVERED:  { label: "Delivered",  color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",   icon: CheckCircle },
  CANCELLED:  { label: "Cancelled",  color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",           icon: XCircle },
};

function StatCard({ label, value, icon: Icon, accent, sub, delay }: { label: string; value: string | number; icon: React.ElementType; accent: string; sub?: string; delay: string }) {
  return (
    <div
      className="sd-fade bg-white dark:bg-[#0e1c30] rounded-2xl p-5 border border-slate-100 dark:border-slate-700/50 flex items-start gap-4 hover:shadow-md transition-shadow"
      style={{ animationDelay: delay }}
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wide mb-1">{label}</p>
        <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
        {sub && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default async function SellerDashboardPage() {
  const res = await getSellerStatsAction();
  const stats = res?.data;
  const recentOrders = stats?.recentOrders ?? [];
  return (
    <>
      <style>{`
        @keyframes sdFade { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        .sd-fade { opacity:0; animation: sdFade 0.5s ease forwards; }
      `}</style>

      {/* Header */}
      <div className="sd-fade mb-8" style={{ animationDelay: "0s" }}>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard</h1>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Welcome back — here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Revenue" value={`£${(stats?.totalRevenue ?? 0).toFixed(2)}`} icon={TrendingUp} accent="bg-green-100 dark:bg-green-900/30 text-green-600" delay="0.1s" />
        <StatCard label="Total Orders" value={stats?.totalOrders ?? 0} icon={ShoppingBag} accent="bg-blue-100 dark:bg-blue-900/30 text-blue-600" delay="0.2s" sub="all time" />
        <StatCard label="Medicines Listed" value={stats?.totalMedicines ?? 0} icon={Pill} accent="bg-purple-100 dark:bg-purple-900/30 text-purple-600" delay="0.3s" />
        <StatCard label="Low Stock" value={stats?.lowStockCount ?? 0} icon={AlertTriangle}
          accent={(stats?.lowStockCount ?? 0) > 0
            ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600"
            : "bg-slate-100 dark:bg-slate-700 text-slate-400"} delay="0.4s" sub="≤ 10 units" />
      </div>

      {/* Quick links */}
      <div className="sd-fade grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8" style={{ animationDelay: "0.45s" }}>
        <Link href="/seller/dashboard/medicines" className="flex items-center justify-between bg-white dark:bg-[#0e1c30] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white px-5 py-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-[#122a4a] transition group">
          <div>
            <p className="font-semibold text-sm">Add Medicine</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">List a new product</p>
          </div>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-[#2ecc8a]" />
        </Link>
        <Link href="/seller/dashboard/orders" className="flex items-center justify-between bg-[#2ecc8a]/10 dark:bg-[#0a1e16] border border-[#2ecc8a]/30 dark:border-[#2ecc8a]/30 text-[#0b1f3a] dark:text-white px-5 py-4 rounded-2xl hover:bg-[#2ecc8a]/20 dark:hover:bg-[#0c2f20] transition group">
          <div>
            <p className="font-semibold text-sm">View Orders</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Update order status</p>
          </div>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-[#27ae72]" />
        </Link>
      </div>

      {/* Recent orders table */}
      <div className="sd-fade overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-700/50 bg-white dark:bg-[#0e1c30]" style={{ animationDelay: "0.55s" }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700/50">
          <h2 className="font-semibold text-slate-800 dark:text-white mb-2 sm:mb-0">Recent Orders</h2>
          <Link href="/seller/dashboard/orders" className="text-xs text-[#27ae72] dark:text-[#2ecc8a] hover:underline font-medium flex items-center gap-1">
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-16 text-center text-slate-400 dark:text-slate-500 text-sm">No orders yet</div>
        ) : (
          <table className="w-full text-sm min-w-[600px] sm:min-w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#0a1628] text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                <th className="text-left px-6 py-3">Order</th>
                <th className="text-left px-4 py-3">Customer</th>
                <th className="text-left px-4 py-3">Items</th>
                <th className="text-right px-4 py-3">Total</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/40">
              {recentOrders.map((order: any) => {
                const meta = STATUS_META[order.status] ?? STATUS_META.PLACED;
                const StatusIcon = meta.icon;
                return (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-[#0a1628] transition">
                    <td className="px-6 py-3.5 font-mono text-xs text-slate-500 dark:text-slate-400">#{order.id}</td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-slate-700 dark:text-slate-200">{order.user?.name ?? "—"}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{order.user?.email}</p>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400">
                      {order.items?.map((i: any) => i.medicine.name).join(", ").slice(0, 40)}
                      {order.items?.length > 1 ? `…` : ""}
                    </td>
                    <td className="px-4 py-3.5 text-right font-semibold text-slate-800 dark:text-white">£{order.total?.toFixed(2)}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${meta.color}`}>
                        <StatusIcon size={11} />
                        {meta.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-400 dark:text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}