"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { X, Trash2, Plus, Minus, ShoppingBag, Loader2 } from "lucide-react";
import { useCartStore } from "@/providers/cart.context";

export default function CartDrawer() {
  const {
    isOpen,
    closeDrawer,
    items,
    total,
    itemCount,
    isLoading,
    loadingItems,
    updateItem,
    removeItem,
    clearCart,
  } = useCartStore();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeDrawer]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeDrawer}
      />

      {/* Drawer */}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-blue-600" />
            <h2 className="font-bold text-lg text-gray-900 dark:text-white">
              Your Cart
            </h2>
            {itemCount > 0 && (
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={closeDrawer}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-500 dark:text-gray-400"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        {isLoading && items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 size={28} className="animate-spin text-blue-600" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
              <ShoppingBag size={36} className="text-gray-300 dark:text-gray-600" />
            </div>
            <p className="font-semibold text-gray-700 dark:text-gray-200 text-lg">
              Your cart is empty
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Add medicines from the shop to get started.
            </p>
            <button
              onClick={closeDrawer}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition"
            >
              Browse Shop
            </button>
          </div>
        ) : (
          <>
            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.map((item) => {
                const isMutating = loadingItems.has(item.id);
                return (
                  <div
                    key={item.id}
                    className={`flex gap-3 p-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 transition-opacity ${
                      isMutating ? "opacity-50" : ""
                    }`}
                  >
                    {/* Image */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0">
                      {item.medicine.image ? (
                        <img
                          src={item.medicine.image}
                          alt={item.medicine.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag size={18} className="text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-0.5">
                        {item.medicine.category.name}
                      </p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                        {item.medicine.name}
                      </p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                        £{(item.medicine.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={isMutating}
                        className="p-1 text-gray-400 hover:text-red-500 transition"
                        aria-label="Remove item"
                      >
                        {isMutating ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>

                      <div className="flex items-center gap-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateItem(item.id, item.quantity - 1)}
                          disabled={isMutating}
                          className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 transition text-gray-600 dark:text-gray-300 disabled:opacity-40"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2 text-sm font-semibold text-gray-800 dark:text-white min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateItem(item.id, item.quantity + 1)}
                          disabled={isMutating || item.quantity >= item.medicine.stock}
                          className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 transition text-gray-600 dark:text-gray-300 disabled:opacity-40"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 dark:border-gray-800 px-5 py-5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {itemCount} item{itemCount !== 1 ? "s" : ""}
                </span>
                <button
                  onClick={clearCart}
                  className="text-xs text-red-500 hover:text-red-600 font-medium transition"
                >
                  Clear all
                </button>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700 dark:text-gray-200">Total</span>
                <span className="text-xl font-extrabold text-gray-900 dark:text-white">
                  £{total.toFixed(2)}
                </span>
              </div>

              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="block w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-center py-3.5 rounded-2xl font-semibold transition shadow-md shadow-blue-200 dark:shadow-none"
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}