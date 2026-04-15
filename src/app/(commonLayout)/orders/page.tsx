import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ShoppingBag, ArrowRight, Clock, Package,
  Truck, CheckCircle, XCircle, ShoppingCart,
} from "lucide-react";
import { getMyOrdersAction } from "@/actions/customer.action";
import { getSessionAction } from "@/actions/session.action";

interface Props {
  searchParams?: Promise<{ page?: string }>;
}

const STATUS_META: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  PLACED:     { label: "Placed",     color: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",        icon: ShoppingCart },
  PROCESSING: { label: "Processing", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",    icon: Package },
  SHIPPED:    { label: "Shipped",    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", icon: Truck },
  DELIVERED:  { label: "Delivered",  color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle },
  CANCELLED:  { label: "Cancelled",  color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",        icon: XCircle },
};

export default async function OrdersPage({ searchParams }: Props) {
  const session = await getSessionAction()
  if (!session) redirect("/login");

  const sp   = await searchParams;
  const page = parseInt(sp?.page ?? "1", 10) || 1;

  const res        = await getMyOrdersAction({ page });
  const orders     = res?.data?.orders     ?? [];
  const totalPages = res?.data?.totalPages ?? 1;

  return (
    <main className="min-h-screen bg-[#f7f8fa] dark:bg-[#0e1117]">
      <div className="container mx-auto max-w-3xl px-4 py-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-600 text-white p-2.5 rounded-xl">
            <ShoppingBag size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Orders</h1>
            <p className="text-sm text-gray-400 mt-0.5">Track and manage your orders</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 gap-4 text-center">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-8">
              <ShoppingBag size={40} className="text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">No orders yet</p>
            <p className="text-sm text-gray-400 max-w-xs">Once you place an order it will appear here.</p>
            <Link href="/shop"
              className="mt-2 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-semibold transition">
              Browse Shop <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order: any) => {
              const meta = STATUS_META[order.status] ?? STATUS_META.PLACED;
              const Icon = meta.icon;
              const preview = order.items?.slice(0, 2) ?? [];
              return (
                <Link key={order.id} href={`/orders/${order.id}`}
                  className="block bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                  <div className="flex items-start justify-between gap-4">
                    {/* Left */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-mono text-xs text-gray-400">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${meta.color}`}>
                          <Icon size={10} /> {meta.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {preview.map((item: any) => (
                          <div key={item.id} className="flex items-center gap-1.5">
                            {item.medicine.image && (
                              <img src={item.medicine.image} alt={item.medicine.name}
                                className="w-6 h-6 rounded-md object-cover" />
                            )}
                            <span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[140px]">
                              {item.medicine.name}
                            </span>
                          </div>
                        ))}
                        {order.items?.length > 2 && (
                          <span className="text-xs text-gray-400">+{order.items.length - 2} more</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                        {order.seller?.name && ` · Sold by ${order.seller.name}`}
                      </p>
                    </div>

                    {/* Right */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <p className="font-bold text-gray-900 dark:text-white">£{order.total?.toFixed(2)}</p>
                      <ArrowRight size={15} className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link key={p} href={`/orders?page=${p}`}
                className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition ${
                  p === page
                    ? "bg-blue-600 text-white"
                    : "border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}>{p}</Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}