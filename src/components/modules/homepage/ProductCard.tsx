
"use client";
import { motion } from "framer-motion";

interface Props {
  name: string;
  category: string;
  price: number;
}
export const ProductCard = ({ name, category, price }: Props) => (
  <motion.div
    whileHover={{ y: -6 }}
    className="rounded-2xl p-4 backdrop-blur-xl bg-white/40 dark:bg-white/10 border border-white/20 shadow-sm hover:shadow-2xl transition"
  >
    <div className="h-40 rounded-xl mb-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700" />

    <h3 className="font-medium text-foreground">{name}</h3>
    <p className="text-sm text-muted-foreground">{category}</p>

    <div className="flex justify-between items-center mt-3">
      <p className="font-semibold text-foreground">
        £{price.toFixed(2)}
      </p>

      <button className="px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm">
        Add
      </button>
    </div>
  </motion.div>
);