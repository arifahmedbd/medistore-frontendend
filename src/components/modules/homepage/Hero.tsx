"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Hero = () => {
  return (
    <section
      className="relative overflow-hidden border-b"
      aria-label="Hero Section - Fast Medicine Delivery"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-green-500/20 blur-3xl opacity-40" />

      <div className="container relative mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.2 } },
          }}
        >
          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-6xl font-bold leading-tight mb-6 text-foreground"
          >
            Fast, Reliable{" "}
            <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              Medicine Delivery
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-muted-foreground mb-6 text-lg md:text-xl"
          >
            Trusted medicines, delivered fast. Secure checkout, verified sellers.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex gap-4 flex-wrap">
            <Link
              href="/shop"
              className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-lg transition-transform transform hover:scale-105"
            >
              Shop Now
            </Link>

            <Link
              href="/shop"
              className="px-6 py-3 rounded-xl border backdrop-blur bg-white/30 dark:bg-white/10 transition-transform transform hover:scale-105"
            >
              Browse
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05, rotate: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="relative h-[350px] md:h-[400px] rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
        >
          <Image
            src="/hero.jpg" 
            alt="Medicine delivery illustration"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;