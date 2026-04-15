import Link from "next/link";
import { ProductCard } from "./ProductCard";
import { featuredProducts } from "@/lib/data";

export const FeaturedProducts = () => (
  <section className="container mx-auto px-4 pb-14">
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-2xl font-semibold">Featured Medicines</h2>
      <Link href="/shop" className="text-blue-600 font-medium">
        View All →
      </Link>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {featuredProducts.map((p) => (
        <ProductCard key={p.id} {...p} />
      ))}
    </div>
  </section>
);