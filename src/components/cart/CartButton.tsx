"use client";

import { useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/providers/cart.context";

export default function CartButton() {
  const { itemCount, toggleDrawer, fetchCart } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <button
      onClick={toggleDrawer}
      className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-200"
      aria-label={`Open cart, ${itemCount} items`}
    >
      <ShoppingBag size={22} />
      {itemCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </button>
  );
}