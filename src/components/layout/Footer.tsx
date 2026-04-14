import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-border/50">
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-green-500/10 blur-3xl opacity-30" />

      <div className="relative container mx-auto px-4 py-14 grid md:grid-cols-3 gap-10">

        <div>
          <h3 className="text-xl font-semibold text-foreground">
            MediStore
          </h3>
          <p className="text-muted-foreground mt-3 max-w-sm">
            Your trusted online pharmacy for OTC medicines, fast delivery,
            and secure checkout.
          </p>
        </div>

        <div>
          <h4 className="font-medium mb-3 text-foreground">
            Quick Links
          </h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <Link href="/shop" className="hover:text-blue-500 transition">
                Shop
              </Link>
            </li>
            <li>
              <Link href="/orders" className="hover:text-blue-500 transition">
                Orders
              </Link>
            </li>
            <li>
              <Link href="/profile" className="hover:text-blue-500 transition">
                Profile
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-3 text-foreground">
            Contact
          </h4>
          <p className="text-muted-foreground">
            support@medistore.com
          </p>

          {/* Optional Socials */}
          <div className="flex gap-3 mt-4">
            <div className="w-9 h-9 rounded-lg bg-white/40 dark:bg-white/10 backdrop-blur flex items-center justify-center cursor-pointer hover:scale-105 transition">
              🌐
            </div>
            <div className="w-9 h-9 rounded-lg bg-white/40 dark:bg-white/10 backdrop-blur flex items-center justify-center cursor-pointer hover:scale-105 transition">
              🐦
            </div>
            <div className="w-9 h-9 rounded-lg bg-white/40 dark:bg-white/10 backdrop-blur flex items-center justify-center cursor-pointer hover:scale-105 transition">
              📸
            </div>
          </div>
        </div>
      </div>

      <div className="relative text-center text-sm text-muted-foreground pb-6">
        © {new Date().getFullYear()} MediStore. All rights reserved.
      </div>
    </footer>
  );
}