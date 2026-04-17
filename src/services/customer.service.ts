import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const customerService = {
  placeOrder: async (payload: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    postcode: string;
    notes?: string;
  }) => {
    try {
      const cookieStore = await cookies();

      const cookieHeader = cookieStore
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join("; ");

      const res = await fetch(`${API_URL}/customer/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          cookie: cookieHeader,
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) return { data: null, error: data };

      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Failed to place order" } };
    }
  },

  getMyOrders: async (params?: { page?: number }) => {
    try {
      const cookieStore = await cookies();

      const q = new URLSearchParams();
      if (params?.page) q.set("page", String(params.page));

      const res = await fetch(`${API_URL}/customer/orders?${q}`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) return { data: null, error: data };

      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Failed to fetch orders" } };
    }
  },

  getMyOrderById: async (orderId: string) => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/customer/orders/${orderId}`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) return { data: null, error: data };

      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Failed to fetch order" } };
    }
  },

  cancelOrder: async (orderId: string) => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/customer/orders/${orderId}/cancel`, {
        method: "PATCH",
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) return { data: null, error: data };

      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Failed to cancel order" } };
    }
  },

  getProfile: async () => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/customer/profile`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) return { data: null, error: data };

      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Failed to fetch profile" } };
    }
  },

  updateProfile: async (payload: { name?: string; image?: string }) => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/customer/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) return { data: null, error: data };

      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Failed to update profile" } };
    }
  },

  
};
