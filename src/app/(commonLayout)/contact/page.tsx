export default function ContactPage() {
  return (
    <main className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      {/* Header */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
            Contact Us
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            We’re here to help you with your medicines and orders.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-12 grid md:grid-cols-2 gap-10">
        
        {/* LEFT SIDE */}
        <div className="space-y-6">
          
          {/* Support Info */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Customer Support
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Need help with medicines, orders, or delivery? Our support team is ready to assist you.
            </p>
          </div>

          {/* WhatsApp CTA (PRIMARY) */}
          <a
            href="https://wa.me/447XXXXXXXXX?text=Hi%20MediStore%2C%20I%20need%20help%20with%20my%20order"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-green-500 hover:bg-green-600 text-white p-6 rounded-2xl transition shadow-sm"
          >
            <h3 className="text-lg font-semibold">💬 Chat on WhatsApp</h3>
            <p className="text-sm opacity-90 mt-1">
              Fastest way to get support
            </p>
          </a>

          {/* Email */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="font-medium text-gray-900 dark:text-white">
              Email Support
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              support@medistore.com
            </p>
          </div>

          {/* Hours */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="font-medium text-gray-900 dark:text-white">
              Support Hours
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Mon - Sun: 9:00 AM – 10:00 PM
            </p>
          </div>
        </div>

        {/* RIGHT SIDE (Trust / Info Panel) */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Why Contact MediStore?
          </h2>

          <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <li>✔ Assistance with medicine selection</li>
            <li>✔ Order tracking and updates</li>
            <li>✔ Delivery and shipping queries</li>
            <li>✔ Verified and trusted support team</li>
          </ul>

          <div className="mt-6">
            <a
              href="/shop"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}