import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Tag,
  Pill,
  ClipboardList,
  Store,
  Shield,
} from "lucide-react";

export type Role = "ADMIN" | "SELLER";

export const SIDEBAR_CONFIG = {
  SELLER: {
    title: "Seller Portal",
    icon: Store,
    basePath: "/seller/dashboard",
    nav: [
      {
        href: "/seller/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        exact: true,
      },
      { href: "/seller/dashboard/medicines", label: "Inventory", icon: Pill },
      {
        href: "/seller/dashboard/orders",
        label: "Orders",
        icon: ClipboardList,
      },
    ],
  },

  ADMIN: {
    title: "Admin Console",
    icon: Shield,
    basePath: "/admin/dashboard",
    nav: [
      {
        href: "/admin/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        exact: true,
      },
      { href: "/admin/dashboard/users", label: "Users", icon: Users },
      { href: "/admin/dashboard/orders", label: "Orders", icon: ShoppingBag },
      { href: "/admin/dashboard/categories", label: "Categories", icon: Tag },
    ],
  },
};
