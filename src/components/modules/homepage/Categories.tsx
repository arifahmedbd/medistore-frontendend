"use client";
import { motion } from "framer-motion";
import { Pill, Snowflake, Leaf, Smile } from "lucide-react"; 
import { CategoryCard } from "./CategoryCard";

interface Category {
  title: string;
  icon: React.ReactNode;
}

const categories: Category[] = [
  { title: "Pain Relief", icon: <Pill size={24} /> },
  { title: "Cold & Flu", icon: <Snowflake size={24} /> },
  { title: "Vitamins", icon: <Leaf size={24} /> },
  { title: "Skin Care", icon: <Smile size={24} /> },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const Categories = () => (
  <section className="container mx-auto px-4 py-14">
    <h2 className="text-2xl md:text-3xl font-semibold mb-10 text-foreground">
      Shop by Category
    </h2>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {categories.map((cat) => (
        <motion.div
          key={cat.title}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <CategoryCard title={cat.title} icon={cat.icon} />
        </motion.div>
      ))}
    </div>
  </section>
);

