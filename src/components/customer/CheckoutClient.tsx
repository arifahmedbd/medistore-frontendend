"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Phone, User, FileText, Package,
  ArrowLeft, ArrowRight, Loader2, CheckCircle2, ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/providers/cart.context";
import { placeOrderAction } from "@/actions/customer.action";



interface Props { defaultName: string; defaultPhone: string; }

export default function CheckoutClient({ defaultName, defaultPhone }: Props) {
  const router = useRouter();
  const { items, total, itemCount, fetchCart } = useCartStore();
  const [isPending, startTransition]           = useTransition();
  const [placed, setPlaced]                    = useState(false);

  const [form, setForm] = useState({
    fullName: defaultName, phone: defaultPhone,
    street: "", city: "", postcode: "", notes: "",
  });

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!form.fullName || !form.phone || !form.street || !form.city || !form.postcode) {
    toast.error("Please fill in all required fields");
    return;
  }
  if (items.length === 0) { toast.error("Your cart is empty"); return; }

  try {
    const res = await placeOrderAction(form);
    if (!res?.error) {
      setPlaced(true);
      await fetchCart();
      toast.success("Order placed successfully!");
    } else {
      console.error(res.error);
      toast.error(res.error.message || "Failed to place order");
    }
  } catch (err) {
    console.error(err);
    toast.error("Unexpected error occurred");
  }
};

  // ── Success state ──────────────────────────────────────────
  if (placed) {
    return (
      <main className="min-h-screen bg-[#f7f8fa] dark:bg-[#0e1117] flex items-center justify-center px-4">
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-10 max-w-md w-full text-center shadow-lg">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={32} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Order Placed!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-1">
            Thank you, <strong>{form.fullName}</strong>!
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">
            Your order will be delivered to {form.street}, {form.city}. Pay on delivery.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/orders"
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold transition">
              View My Orders <ArrowRight size={15} />
            </Link>
            <Link href="/shop"
              className="flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 py-3 rounded-2xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ── Empty cart guard ───────────────────────────────────────
  if (!isPending && items.length === 0) {
    return (
      <main className="min-h-screen bg-[#f7f8fa] dark:bg-[#0e1117] flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Your cart is empty</p>
          <Link href="/shop" className="text-blue-600 hover:underline text-sm">Browse medicines</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8fa] dark:bg-[#0e1117]">
      <div className="container mx-auto max-w-5xl px-4 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Checkout</h1>
            <p className="text-sm text-gray-400 mt-1">Fill in your delivery details</p>
          </div>
          <Link href="/cart" className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 transition group">
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Cart
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* ── Form ── */}
            <div className="lg:col-span-2 space-y-5">

              {/* Contact */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
                <h2 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <User size={16} className="text-blue-500" /> Contact Info
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input value={form.fullName} onChange={set("fullName")}
                      placeholder="John Doe"
                      className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3.5 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                      Phone <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input value={form.phone} onChange={set("phone")}
                        placeholder="+44 7700 000000" type="tel"
                        className="w-full pl-9 pr-3.5 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
                <h2 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <MapPin size={16} className="text-blue-500" /> Delivery Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                      Street Address <span className="text-red-400">*</span>
                    </label>
                    <input value={form.street} onChange={set("street")}
                      placeholder="123 High Street"
                      className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3.5 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                        City <span className="text-red-400">*</span>
                      </label>
                      <input value={form.city} onChange={set("city")}
                        placeholder="London"
                        className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3.5 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                        Postcode <span className="text-red-400">*</span>
                      </label>
                      <input value={form.postcode} onChange={set("postcode")}
                        placeholder="SW1A 1AA"
                        className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3.5 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
                <h2 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <FileText size={16} className="text-blue-500" /> Order Notes
                  <span className="text-xs font-normal text-gray-400">(optional)</span>
                </h2>
                <textarea value={form.notes} onChange={set("notes")} rows={3}
                  placeholder="Special instructions, e.g. leave at front door..."
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3.5 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
            </div>

            {/* ── Summary ── */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 sticky top-24">
                <h2 className="font-bold text-gray-800 dark:text-white mb-4">Order Summary</h2>

                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                        {item.medicine.name} ×{item.quantity}
                      </span>
                      <span className="font-medium text-gray-700 dark:text-gray-200 shrink-0 ml-2">
                        £{(item.medicine.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 pt-3 mb-4 space-y-1.5">
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Subtotal ({itemCount} items)</span>
                    <span>£{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Delivery</span>
                    <span className="text-green-600 dark:text-green-400 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 dark:text-white text-base pt-2 border-t border-gray-100 dark:border-gray-700">
                    <span>Total</span><span>£{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment method */}
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-3.5 py-3 mb-4 flex items-center gap-3">
                  <Package size={18} className="text-green-600 dark:text-green-400 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-300">Cash on Delivery</p>
                    <p className="text-xs text-green-600/70 dark:text-green-400/70">Pay when your order arrives</p>
                  </div>
                </div>

                <button type="submit" disabled={isPending || items.length === 0}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3.5 rounded-2xl font-semibold transition disabled:opacity-50 shadow-md shadow-blue-200 dark:shadow-none">
                  {isPending ? <><Loader2 size={17} className="animate-spin" /> Placing Order...</> : <>Place Order · £{total.toFixed(2)}</>}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}