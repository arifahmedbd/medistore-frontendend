// src/services/cart.service.ts
import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const cartService = {
  getCart: async () => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/cart`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        return { data: { items: [], total: 0, itemCount: 0 }, error: data };
      }

      return { data, error: null };
    } catch (error) {
      return {
        data: { items: [], total: 0, itemCount: 0 },
        error: { message: "Failed to fetch cart" },
      };
    }
  },

  addItem: async (medicineId: string, quantity: number) => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/cart/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
        body: JSON.stringify({ medicineId, quantity }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { data: null, error: data };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: "Failed to add item" } };
    }
  },

  updateItem: async (itemId: string, quantity: number) => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/cart/items/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify({ quantity }),
        cache: "no-store",
      });

      const data = await res.json();
      if (!res.ok) return { data: null, error: data };

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: "Failed to update item" } };
    }
  },

  removeItem: async (itemId: string) => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/cart/items/${itemId}`, {
        method: "DELETE",
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      const data = await res.json();
      if (!res.ok) return { data: null, error: data };

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: "Failed to remove item" } };
    }
  },

  clear: async () => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/cart`, {
        method: "DELETE",
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      const data = await res.json();
      if (!res.ok) return { data: null, error: data };

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: "Failed to clear cart" } };
    }
  },
};
