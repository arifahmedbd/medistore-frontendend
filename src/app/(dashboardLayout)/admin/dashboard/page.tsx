import Link from "next/link";
import {
  Users, ShoppingBag, TrendingUp, TrendingDown, Pill,
  Tag, ShieldAlert, ArrowRight, Minus, UserCheck,
  Store, ShoppingCart, Package, Truck, CheckCircle, XCircle, Flame,
} from "lucide-react";
import { getAdminStatsAction } from "@/actions/admin.action";

const STATUS_META: Record<string, { label: string; dot: string; icon: React.ElementType }> = {
  PLACED:     { label: "Placed",     dot: "bg-sky-400",    icon: ShoppingCart },
  PROCESSING: { label: "Processing", dot: "bg-blue-400",   icon: Package },
  SHIPPED:    { label: "Shipped",    dot: "bg-purple-400", icon: Truck },
  DELIVERED:  { label: "Delivered",  dot: "bg-green-400",  icon: CheckCircle },
  CANCELLED:  { label: "Cancelled",  dot: "bg-red-400",    icon: XCircle },
};

function MoM({ v }: { v: number | null }) {
  if (v === null) return <span className="text-[11px] text-white/30">No prev. data</span>;
  const up = v >= 0;
  const Icon = v === 0 ? Minus : up ? TrendingUp : TrendingDown;
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
      v === 0 ? "bg-white/10 text-white/50"
      : up    ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
    }`}>
      <Icon size={10} />{Math.abs(v).toFixed(1)}% MoM
    </span>
  );
}

export default async function AdminDashboardPage() {
  const res = await getAdminStatsAction();
  const s   = res?.data ?? {
    totalUsers: 0, totalCustomers: 0, totalSellers: 0, bannedUsers: 0,
    newUsersThisMonth: 0, usersMoM: null,
    totalOrders: 0, ordersThisMonth: 0,
    totalRevenue: 0, monthRevenue: 0, revMoM: null,
    totalMedicines: 0, totalCategories: 0,
    orderStatusBreakdown: {}, recentUsers: [], recentOrders: [],
  };

  const totalStatus = Object.values(s.orderStatusBreakdown as Record<string, number>)
    .reduce((a: number, b: number) => a + b, 0) || 1;

  return (
    <>
      <style>{`
        @keyframes adFade { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        .ad-fade { opacity:0; animation:adFade 0.45s ease forwards; }
      `}</style>

      {/* Header */}
      <div className="ad-fade flex items-center justify-between mb-8 flex-wrap gap-3" style={{ animationDelay:"0s" }}>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">
            {new Date().toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link href="/admin/users"      className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-1.5"><Users size={13}/>Users</Link>
          <Link href="/admin/orders"     className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-1.5"><ShoppingBag size={13}/>Orders</Link>
          <Link href="/admin/categories" className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-1.5"><Tag size={13}/>Categories</Link>
        </div>
      </div>

      {/* Primary stat cards — dark glass style */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        {[
          { label:"Total Revenue",  value:`£${s.totalRevenue.toFixed(2)}`, sub:`£${s.monthRevenue.toFixed(2)} this month`, badge:<MoM v={s.revMoM}/>, icon:TrendingUp,  grad:"from-violet-600 to-indigo-600", delay:"0.1s" },
          { label:"Total Orders",   value:String(s.totalOrders),           sub:`${s.ordersThisMonth} this month`,          badge:null,                 icon:ShoppingBag, grad:"from-sky-600 to-blue-600",     delay:"0.2s" },
          { label:"Total Users",    value:String(s.totalUsers),            sub:`${s.newUsersThisMonth} joined this month`, badge:<MoM v={s.usersMoM}/>,icon:Users,       grad:"from-emerald-600 to-teal-600", delay:"0.3s" },
          { label:"Medicines",      value:String(s.totalMedicines),        sub:`across ${s.totalCategories} categories`,   badge:null,                 icon:Pill,        grad:"from-orange-500 to-rose-500",  delay:"0.4s" },
        ].map(({ label, value, sub, badge, icon:Icon, grad, delay }) => (
          <div key={label} className={`ad-fade bg-gradient-to-br ${grad} rounded-2xl p-5 text-white`} style={{ animationDelay:delay }}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Icon size={18} />
              </div>
              {badge}
            </div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-white/60 mt-1">{sub}</p>
            <p className="text-[11px] text-white/40 mt-2 uppercase tracking-wide font-semibold">{label}</p>
          </div>
        ))}
      </div>

      {/* Secondary stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label:"Customers",   value:s.totalCustomers, icon:UserCheck,   color:"text-sky-600 dark:text-sky-400",      bg:"bg-sky-50 dark:bg-sky-900/20" },
          { label:"Sellers",     value:s.totalSellers,   icon:Store,       color:"text-emerald-600 dark:text-emerald-400", bg:"bg-emerald-50 dark:bg-emerald-900/20" },
          { label:"Banned",      value:s.bannedUsers,    icon:ShieldAlert, color:"text-red-500 dark:text-red-400",       bg:"bg-red-50 dark:bg-red-900/20" },
          { label:"Categories",  value:s.totalCategories,icon:Tag,         color:"text-violet-600 dark:text-violet-400", bg:"bg-violet-50 dark:bg-violet-900/20" },
        ].map(({ label, value, icon:Icon, color, bg }, i) => (
          <div key={label} className="ad-fade bg-white dark:bg-[#0e1525] rounded-2xl border border-slate-100 dark:border-slate-700/40 p-4 flex items-center gap-3" style={{ animationDelay:`${0.1*(i+1)}s` }}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
              <Icon size={16} className={color} />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800 dark:text-white">{value}</p>
              <p className="text-xs text-slate-400">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Middle row: status breakdown + recent signups */}
      <div className="grid md:grid-cols-5 gap-4 mb-5">
        {/* Order status bars — 3 cols */}
        <div className="ad-fade md:col-span-3 bg-white dark:bg-[#0e1525] rounded-2xl border border-slate-100 dark:border-slate-700/40 p-5" style={{ animationDelay:"0.45s" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800 dark:text-white text-sm">Order Status Breakdown</h2>
            <Link href="/admin/orders" className="text-[11px] text-violet-500 hover:underline font-medium flex items-center gap-1">All orders <ArrowRight size={11}/></Link>
          </div>
          <div className="space-y-3">
            {(["PLACED","PROCESSING","SHIPPED","DELIVERED","CANCELLED"] as const).map((st) => {
              const meta  = STATUS_META[st];
              const count = (s.orderStatusBreakdown as any)[st] ?? 0;
              const pct   = Math.round((count / totalStatus) * 100);
              return (
                <div key={st}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{meta.label}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-500">{count} <span className="font-normal text-slate-400">({pct}%)</span></span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${meta.dot} transition-all duration-700`} style={{ width:`${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent signups — 2 cols */}
        <div className="ad-fade md:col-span-2 bg-white dark:bg-[#0e1525] rounded-2xl border border-slate-100 dark:border-slate-700/40 overflow-hidden" style={{ animationDelay:"0.5s" }}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700/40">
            <div className="flex items-center gap-2">
              <Flame size={14} className="text-orange-500" />
              <h2 className="font-semibold text-slate-800 dark:text-white text-sm">Recent Signups</h2>
            </div>
            <Link href="/admin/users" className="text-[11px] text-violet-500 hover:underline font-medium flex items-center gap-1">All <ArrowRight size={11}/></Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700/40">
            {s.recentUsers.length === 0 ? (
              <p className="text-center text-sm text-slate-400 py-10">No users yet</p>
            ) : s.recentUsers.map((u: any) => (
              <div key={u.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 dark:hover:bg-[#0a1020] transition">
                <div className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-xs font-bold text-violet-600 dark:text-violet-400 shrink-0">
                  {u.name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700 dark:text-white truncate">{u.name}</p>
                  <p className="text-xs text-slate-400 truncate">{u.email}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    u.role === "SELLER" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                    : u.role === "ADMIN" ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400"
                    : "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400"
                  }`}>{u.role}</span>
                  {u.status === "BANNED" && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">BANNED</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders table */}
      <div className="ad-fade bg-white dark:bg-[#0e1525] rounded-2xl border border-slate-100 dark:border-slate-700/40 overflow-hidden" style={{ animationDelay:"0.55s" }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700/40">
          <h2 className="font-semibold text-slate-800 dark:text-white text-sm">Recent Orders</h2>
          <Link href="/admin/orders" className="text-[11px] text-violet-500 hover:underline font-medium flex items-center gap-1">View all <ArrowRight size={11}/></Link>
        </div>
        {s.recentOrders.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-12">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-[#09111e] text-xs text-slate-400 uppercase tracking-wide">
                  <th className="text-left px-5 py-3">Order</th>
                  <th className="text-left px-4 py-3">Customer</th>
                  <th className="text-left px-4 py-3">Seller</th>
                  <th className="text-right px-4 py-3">Total</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/40">
                {s.recentOrders.map((o: any) => {
                  const meta = STATUS_META[o.status] ?? STATUS_META.PLACED;
                  const Icon = meta.icon;
                  return (
                    <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-[#0a1020] transition">
                      <td className="px-5 py-3.5 font-mono text-xs text-slate-400">#{o.id.slice(0,8).toUpperCase()}</td>
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-slate-700 dark:text-slate-200 text-sm">{o.user?.name ?? "—"}</p>
                        <p className="text-xs text-slate-400">{o.user?.email}</p>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-500 dark:text-slate-400">{o.seller?.name ?? "—"}</td>
                      <td className="px-4 py-3.5 text-right font-bold text-slate-800 dark:text-white">£{o.total?.toFixed(2)}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300`}>
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
    </>
  );
}