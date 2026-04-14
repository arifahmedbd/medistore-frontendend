import { Route } from "@/types";

export const userRoutes: Route[] = [
  {
    title: "User Dashboard",
    items: [
      {
        title: "Cart",
        url: "/cart",
      },
      {
        title: "Checkout",
        url: "/checkout",
      },
      {
        title: "My Orders",
        url: "/orders",
      },
      {
        title: "Order Details",
        url: "/orders/:id",
      },
      {
        title: "Profile",
        url: "/profile",
      },
    ],
  },
];
