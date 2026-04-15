import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const categoryService = {
  getCategories: async () => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/categories`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        return { data: null, error: data };
      }

      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: { message: "Failed to fetch categories" },
      };
    }
  },

  createCategory: async (payload: { name: string }) => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        return { data: null, error: data };
      }

      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: { message: "Failed to create category" },
      };
    }
  },

  updateCategory: async (id: string, payload: { name: string }) => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        return { data: null, error: data };
      }

      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: { message: "Failed to update category" },
      };
    }
  },

  deleteCategory: async (id: string) => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/categories/${id}`, {
        method: "DELETE",
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        return { data: null, error: data };
      }

      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: { message: "Failed to delete category" },
      };
    }
  },
};
