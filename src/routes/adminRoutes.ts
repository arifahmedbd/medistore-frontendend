import { Route } from "@/types";

export const adminRoutes: Route[] = [
  {
    title: "Admin Dashboard",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
      },
      {
        title: "Users",
        url: "/users",
      },
      {
        title: "Orders",
        url: "/orders",
      },
      {
        title: "Categories",
        url: "/categories",
      },
    ],
  },
];
