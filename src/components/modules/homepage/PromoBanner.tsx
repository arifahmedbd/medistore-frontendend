
export const PromoBanner = () => (
  <section className="container mx-auto px-4 pb-14">
    <div className="relative overflow-hidden rounded-2xl p-10 text-white shadow-2xl">

      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-500" />

      <div className="absolute inset-0 backdrop-blur-2xl opacity-30" />

      <div className="relative flex flex-col md:flex-row justify-between items-center">
        <div>
          <h2 className="text-3xl font-semibold mb-2">
            Stay Healthy, Save More 💊
          </h2>
          <p className="opacity-90">
            Up to 20% off on selected medicines
          </p>
        </div>

        <a
          href="/shop"
          className="mt-4 md:mt-0 px-6 py-2 rounded-lg bg-white text-blue-600 font-medium hover:scale-105 transition"
        >
          Shop Deals
        </a>
      </div>
    </div>
  </section>
);