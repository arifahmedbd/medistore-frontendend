import { Categories } from "@/components/modules/homepage/Categories";
import { FeaturedProducts } from "@/components/modules/homepage/FeaturedProducts";
import Hero from "@/components/modules/homepage/Hero";
import { TrustBar } from "@/components/modules/homepage/TrustBar";



export default function HomePage() {
  return (
    <main className="bg-gray-50 dark:bg-gray-900 transition-colors">
      <Hero />
       <TrustBar />
      <Categories />
      <FeaturedProducts />
    </main>
  );
}