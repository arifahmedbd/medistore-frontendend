"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, LogOut } from "lucide-react";

import { ModeToggle } from "./ModeToggle";
import { Button } from "@/components/ui/button";
import CartButton from "@/components/cart/CartButton";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { authClient } from "@/lib/auth-client";

interface NavbarProps {
  user: any;
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  const roleMenu = [];
  if (user) {
    if (user.role === "CUSTOMER")
      roleMenu.push({ title: "Dashboard", url: "/orders" },{title: "Profile", url: "/profile" });
    if (user.role === "SELLER")
      roleMenu.push({ title: "Seller Dashboard", url: "/seller/dashboard" });
    if (user.role === "ADMIN")
      roleMenu.push({ title: "Admin Dashboard", url: "/admin/dashboard" });
  }

  const menu = [
    { title: "Home", url: "/" },
    { title: "Shop", url: "/shop" },
    { title: "About", url: "/about" },
    { title: "Contact", url: "/contact" },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-accent-foreground">
          MediStore
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6">
          {menu.map((item) => (
            <Link key={item.title} href={item.url} className="hover:text-primary">
              {item.title}
            </Link>
          ))}

          {roleMenu.map((item) => (
            <Link key={item.title} href={item.url} className="hover:text-primary">
              {item.title}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <ModeToggle />

          {/* ✅ Cart Button (Zustand powered) */}
          {user?.role === "CUSTOMER" && <CartButton />}

          {!user && (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}

          {user && (
            <Button
              onClick={handleLogout}
              variant="destructive"
              size="sm"
              className="flex items-center gap-1"
            >
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>

            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>
                  <Link href="/" className="text-xl font-bold">
                    MediStore
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-4 mt-4">
                {menu.map((item) => (
                  <Link
                    key={item.title}
                    href={item.url}
                    className="text-lg font-semibold"
                  >
                    {item.title}
                  </Link>
                ))}

                {roleMenu.map((item) => (
                  <Link
                    key={item.title}
                    href={item.url}
                    className="text-lg font-semibold"
                  >
                    {item.title}
                  </Link>
                ))}

                {/* ✅ Mobile Cart */}
                {user?.role === "CUSTOMER" && (
                  <div className="flex items-center gap-2">
                    <CartButton />
                    <span className="font-semibold">Cart</span>
                  </div>
                )}

                {!user && (
                  <>
                    <Button asChild variant="outline">
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/register">Register</Link>
                    </Button>
                  </>
                )}

                {user && (
                  <Button
                    onClick={handleLogout}
                    variant="destructive"
                    className="flex items-center gap-1"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}