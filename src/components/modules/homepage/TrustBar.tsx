"use client";

import { motion } from "framer-motion";

const items = [
  { icon: "✔", text: "100% Genuine Medicines" },
  { icon: "🚚", text: "Fast Delivery" },
  { icon: "🔒", text: "Secure Checkout" },
  { icon: "⭐", text: "Trusted Sellers" },
];

export const TrustBar = () => (
  <section className="relative border-b border-border/50">
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3 justify-center md:justify-start p-4 rounded-xl backdrop-blur-xl bg-white/40 dark:bg-white/10 border border-white/20"
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-sm font-medium text-foreground">
              {item.text}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);