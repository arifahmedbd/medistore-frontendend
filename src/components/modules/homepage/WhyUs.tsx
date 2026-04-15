export const WhyUs = () => (
 <section className="py-20">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl font-semibold mb-12 text-foreground">
        Why Choose MediStore?
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            title: "Verified Sellers",
            desc: "Only trusted pharmacies allowed to sell.",
          },
          {
            title: "Fast Delivery",
            desc: "Get your medicines delivered quickly.",
          },
          {
            title: "Secure Platform",
            desc: "Your data and orders are fully protected.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="p-6 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-white/10 border border-white/20 hover:shadow-xl transition"
          >
            <h3 className="font-semibold mb-2 text-foreground">
              {item.title}
            </h3>
            <p className="text-muted-foreground text-sm">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);