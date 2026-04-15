"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag, Plus, Minus, Trash2, Loader2,
  ArrowRight, Package, ImageOff, ArrowLeft,
} from "lucide-react";
import { useCartStore } from "@/providers/cart.context";

export default function CartPageClient() {
  const { items, total, itemCount, isLoading, loadingItems, fetchCart, updateItem, removeItem, clearCart } =
    useCartStore();

  useEffect(() => { fetchCart(); }, [fetchCart]);

  if (isLoading && items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8fa] dark:bg-[#0e1117]">
      <div className="container mx-auto max-w-5xl px-4 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2.5 rounded-xl">
              <ShoppingBag size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Cart</h1>
              <p className="text-sm text-gray-400 mt-0.5">
                {itemCount} item{itemCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <Link href="/shop" className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition group">
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            Continue Shopping
          </Link>
        </div>

        {items.length === 0 ? (
          /* ── Empty state ── */
          <div className="flex flex-col items-center justify-center py-28 gap-5">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-8">
              <ShoppingBag size={40} className="text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">Your cart is empty</p>
            <p className="text-sm text-gray-400 max-w-xs text-center">
              Looks like you haven&apos;t added any medicines yet.
            </p>
            <Link href="/shop"
              className="mt-2 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-semibold transition">
              Browse Shop <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* ── Items list ── */}
            <div className="lg:col-span-2 space-y-3">
              {/* Clear all */}
              <div className="flex justify-end">
                <button onClick={clearCart}
                  className="text-xs text-red-400 hover:text-red-600 font-medium transition">
                  Clear all
                </button>
              </div>

              {items.map((item) => {
                const isMutating = loadingItems.has(item.id);
                return (
                  <div key={item.id}
                    className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 flex gap-4 transition-opacity ${isMutating ? "opacity-50" : ""}`}>
                    {/* Image */}
                    <Link href={`/shop/${item.medicineId}`} className="shrink-0">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                        {item.medicine.image
                          ? <img src={item.medicine.image} alt={item.medicine.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center"><ImageOff size={18} className="text-gray-400" /></div>
                        }
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-0.5">
                        {item.medicine.category.name}
                      </p>
                      <Link href={`/shop/${item.medicineId}`}>
                        <h3 className="font-semibold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition truncate">
                          {item.medicine.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-400 mt-0.5">{item.medicine.manufacturer}</p>
                      <p className="font-bold text-gray-900 dark:text-white mt-2">
                        £{(item.medicine.price * item.quantity).toFixed(2)}
                        <span className="text-xs font-normal text-gray-400 ml-1">
                          (£{item.medicine.price.toFixed(2)} each)
                        </span>
                      </p>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col items-end justify-between shrink-0">
                      <button onClick={() => removeItem(item.id)} disabled={isMutating}
                        className="p-1.5 text-gray-300 hover:text-red-500 transition">
                        {isMutating ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      </button>
                      <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-700">
                        <button onClick={() => updateItem(item.id, item.quantity - 1)}
                          disabled={isMutating}
                          className="px-2.5 py-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 transition text-gray-600 dark:text-gray-300 disabled:opacity-40">
                          <Minus size={12} />
                        </button>
                        <span className="px-3 py-1.5 text-sm font-bold text-gray-800 dark:text-white min-w-[32px] text-center">
                          {item.quantity}
                        </span>
                        <button onClick={() => updateItem(item.id, item.quantity + 1)}
                          disabled={isMutating || item.quantity >= item.medicine.stock}
                          className="px-2.5 py-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 transition text-gray-600 dark:text-gray-300 disabled:opacity-40">
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Order summary ── */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 sticky top-24">
                <h2 className="font-bold text-gray-800 dark:text-white mb-4 text-base">Order Summary</h2>

                <div className="space-y-2.5 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400 truncate max-w-[160px]">
                        {item.medicine.name} ×{item.quantity}
                      </span>
                      <span className="font-medium text-gray-700 dark:text-gray-200 shrink-0 ml-2">
                        £{(item.medicine.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mb-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Subtotal</span><span>£{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Delivery</span><span className="text-green-600 dark:text-green-400 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 dark:text-white text-base pt-1 border-t border-gray-100 dark:border-gray-700">
                    <span>Total</span><span>£{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* COD badge */}
                <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-3 py-2 mb-4">
                  <Package size={14} className="text-green-600 dark:text-green-400 shrink-0" />
                  <p className="text-xs text-green-700 dark:text-green-300 font-medium">Cash on Delivery</p>
                </div>

                <Link href="/checkout"
                  className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3.5 rounded-2xl font-semibold transition shadow-md shadow-blue-200 dark:shadow-none">
                  Proceed to Checkout <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}