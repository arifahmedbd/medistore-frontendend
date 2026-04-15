"use client";

import { useState } from "react";
import { ShoppingBag, Plus, Minus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/providers/cart.context";

interface AddToCartButtonProps {
  medicineId: string;
  medicineName: string;
  stock: number;
}

export default function AddToCartButton({
  medicineId,
  medicineName,
  stock,
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem, loadingItems } = useCartStore();
  const isLoading = loadingItems.has(medicineId);
  const outOfStock = stock === 0;

  const handleAdd = async () => {
    if (outOfStock || isLoading) return;
    try {
      await addItem(medicineId, medicineName, quantity);
   
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to add item");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Quantity selector */}
      {!outOfStock && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Qty:</span>
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition disabled:opacity-30 text-gray-700 dark:text-gray-300"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="px-4 py-2 text-sm font-bold text-gray-900 dark:text-white min-w-[40px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
              disabled={quantity >= stock}
              className="px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition disabled:opacity-30 text-gray-700 dark:text-gray-300"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {stock} available
          </span>
        </div>
      )}

      {/* Add to Cart button */}
      <button
        onClick={handleAdd}
        disabled={outOfStock || isLoading}
        className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-base transition ${
          outOfStock
            ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-md shadow-blue-200 dark:shadow-none"
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Adding...
          </>
        ) : outOfStock ? (
          "Out of Stock"
        ) : (
          <>
            <ShoppingBag size={18} />
            Add to Cart
          </>
        )}
      </button>
    </div>
  );
}