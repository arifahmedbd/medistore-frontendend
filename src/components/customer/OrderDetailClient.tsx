"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, MapPin, Package, Store, ShoppingCart,
  Truck, CheckCircle, XCircle, RotateCcw, X,
  Loader2, ImageOff, Clock,
} from "lucide-react";
import { toast } from "sonner";
import { cancelOrderAction } from "@/actions/customer.action";
import { useCartStore } from "@/providers/cart.context";


// ── Status timeline config ─────────────────────────────────
const TIMELINE = [
  { key: "PLACED",     label: "Order Placed",  icon: ShoppingCart, desc: "We received your order" },
  { key: "PROCESSING", label: "Processing",    icon: Package,      desc: "Seller is preparing your items" },
  { key: "SHIPPED",    label: "Shipped",       icon: Truck,        desc: "Your order is on its way" },
  { key: "DELIVERED",  label: "Delivered",     icon: CheckCircle,  desc: "Order delivered successfully" },
];

const STATUS_ORDER = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED"];

function getTimelineStep(status: string) {
  if (status === "CANCELLED") return -1;
  return STATUS_ORDER.indexOf(status);
}

// ── Cancel confirm modal ───────────────────────────────────
function CancelModal({ orderId, onClose, onSuccess }: {
  orderId: string; onClose: () => void; onSuccess: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const confirm = () => startTransition(async () => {
    const res = await cancelOrderAction(orderId);
    if (!res?.error) { toast.success("Order cancelled"); onSuccess(); }
    else toast.error(res?.error ?? "Cannot cancel this order");
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <XCircle size={22} className="text-red-500" />
        </div>
        <h3 className="font-bold text-center text-gray-800 dark:text-white mb-2">Cancel Order?</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
          This will cancel your order and restore stock. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            Keep Order
          </button>
          <button onClick={confirm} disabled={isPending}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2">
            {isPending && <Loader2 size={13} className="animate-spin" />}
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────
export default function OrderDetailClient({ order }: { order: any }) {
  const router               = useRouter();
  const [showCancel, setShowCancel] = useState(false);
  const { addItem, openDrawer }     = useCartStore();

  const currentStep  = getTimelineStep(order.status);
  const isCancelled  = order.status === "CANCELLED";
  const canCancel    = ["PLACED", "PROCESSING"].includes(order.status);

  const handleReorder = async () => {
    for (const item of order.items) {
      await addItem(item.medicine.id, item.medicine.name, item.quantity);
    }
    openDrawer();
    toast.success("Items added to cart!");
  };

  const subtotal  = order.items.reduce((s: number, i: any) => s + i.price * i.quantity, 0);
  const delivery  = 0;

  return (
    <>
      <main className="min-h-screen bg-[#f7f8fa] dark:bg-[#0e1117]">
        <div className="container mx-auto max-w-3xl px-4 py-10">

          {/* Header */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Link href="/orders"
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-500 dark:text-gray-400">
                <ArrowLeft size={18} />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Order #{order.id.slice(0, 8).toUpperCase()}
                </h1>
                <p className="text-sm text-gray-400 mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button onClick={handleReorder}
                className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <RotateCcw size={14} /> Reorder
              </button>
              {canCancel && (
                <button onClick={() => setShowCancel(true)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 transition">
                  <X size={14} /> Cancel
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">

            {/* ── Status Timeline ── */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
              <h2 className="font-semibold text-gray-800 dark:text-white mb-5 text-sm">Order Status</h2>

              {isCancelled ? (
                <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 rounded-xl px-4 py-3">
                  <XCircle size={20} className="text-red-500 shrink-0" />
                  <div>
                    <p className="font-semibold text-red-600 dark:text-red-400">Order Cancelled</p>
                   
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {/* Connector line */}
                  <div className="absolute left-4 top-5 bottom-5 w-0.5 bg-gray-200 dark:bg-gray-700" />

                  <div className="space-y-5">
                    {TIMELINE.map((step, idx) => {
                      const done    = idx <= currentStep;
                      const current = idx === currentStep;
                      const Icon    = step.icon;
                      return (
                        <div key={step.key} className="flex items-start gap-4 relative">
                          {/* Dot */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${
                            done
                              ? current
                                ? "bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900/40"
                                : "bg-green-500 text-white"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-400"
                          }`}>
                            <Icon size={14} />
                          </div>
                          <div className="flex-1 min-w-0 pt-1">
                            <p className={`text-sm font-semibold ${done ? "text-gray-800 dark:text-white" : "text-gray-400 dark:text-gray-500"}`}>
                              {step.label}
                              {current && <span className="ml-2 text-xs font-normal text-blue-600 dark:text-blue-400 animate-pulse">● Current</span>}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">{step.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* ── Items ── */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
              <h2 className="font-semibold text-gray-800 dark:text-white mb-4 text-sm">
                Items ({order.items.length})
              </h2>
              <div className="space-y-3">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0">
                      {item.medicine.image
                        ? <img src={item.medicine.image} alt={item.medicine.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center"><ImageOff size={14} className="text-gray-400" /></div>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/shop/${item.medicine.id}`}
                        className="text-sm font-semibold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition truncate block">
                        {item.medicine.name}
                      </Link>
                      <p className="text-xs text-gray-400">{item.medicine.category?.name} · Qty {item.quantity}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">£{(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-xs text-gray-400">£{item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price breakdown */}
              <div className="border-t border-gray-100 dark:border-gray-700 mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>Subtotal</span><span>£{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>Delivery</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">Free</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 dark:text-white text-base pt-1 border-t border-gray-100 dark:border-gray-700">
                  <span>Total</span><span>£{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* ── Delivery Info ── */}
            <div className="grid sm:grid-cols-2 gap-4">
              {order.shippingAddress && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
                  <h2 className="font-semibold text-gray-800 dark:text-white mb-3 text-sm flex items-center gap-2">
                    <MapPin size={14} className="text-blue-500" /> Delivery Address
                  </h2>
                  <div className="text-sm text-gray-600 dark:text-gray-300 space-y-0.5">
                    <p className="font-semibold">{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.phone}</p>
                    <p>{order.shippingAddress.street}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.postcode}</p>
                    {order.shippingAddress.notes && (
                      <p className="text-gray-400 italic mt-1">&quot;{order.shippingAddress.notes}&quot;</p>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
                <h2 className="font-semibold text-gray-800 dark:text-white mb-3 text-sm flex items-center gap-2">
                  <Store size={14} className="text-blue-500" /> Seller
                </h2>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{order.seller?.name ?? "—"}</p>
                <p className="text-xs text-gray-400 mt-0.5">{order.seller?.email}</p>
                <div className="mt-3 flex items-center gap-2">
                  <Package size={13} className="text-green-500 shrink-0" />
                  <p className="text-xs text-green-700 dark:text-green-400 font-medium">Cash on Delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showCancel && (
        <CancelModal
          orderId={order.id}
          onClose={() => setShowCancel(false)}
          onSuccess={() => { setShowCancel(false); router.refresh(); }}
        />
      )}
    </>
  );
}