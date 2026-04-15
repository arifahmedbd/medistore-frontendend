import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

async function getHeaders() {
  const cookieStore = await cookies();
  return {
    "Content-Type": "application/json",
    Cookie: cookieStore.toString(),
  };
}

export const adminService = {
  // ── Dashboard ──
  getStats: async () => {
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/admin/stats`, {
        headers,
        cache: "no-store",
      });

      const data = await res.json();
      if (!res.ok) return { data: null, error: data };

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: "Failed to fetch admin stats" } };
    }
  },

  // ── Users ──
  getUsers: async (params?: {
    page?: number;
    search?: string;
    role?: "USER" | "SELLER" | "ADMIN";
    status?: "ACTIVE" | "BANNED";
  }) => {
    try {
      const headers = await getHeaders();
      const q = new URLSearchParams();

      if (params?.page) q.set("page", String(params.page));
      if (params?.search) q.set("search", params.search);
      if (params?.role) q.set("role", params.role);
      if (params?.status) q.set("status", params.status);

      const res = await fetch(`${API_URL}/admin/users?${q}`, {
        headers,
        cache: "no-store",
      });

      const data = await res.json();
      if (!res.ok) return { data: null, error: data };

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: "Failed to fetch users" } };
    }
  },

  updateUserRole: async (userId: string, role: "USER" | "SELLER") => {
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/admin/users/${userId}/role`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ role }),
      });

      const data = await res.json();
      if (!res.ok) return { data: null, error: data };

      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: { message: "Failed to update user role" },
      };
    }
  },

  updateUserStatus: async (userId: string, status: "ACTIVE" | "BANNED") => {
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/admin/users/${userId}/status`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok) return { data: null, error: data };

      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: { message: "Failed to update user status" },
      };
    }
  },

  // ── Orders ──
  getOrders: async (params?: {
    page?: number;
    search?: string;
    status?: string;
  }) => {
    try {
      const headers = await getHeaders();
      const q = new URLSearchParams();

      if (params?.page) q.set("page", String(params.page));
      if (params?.search) q.set("search", params.search);
      if (params?.status) q.set("status", params.status);

      const res = await fetch(`${API_URL}/admin/orders?${q}`, {
        headers,
        cache: "no-store",
      });

      const data = await res.json();
      if (!res.ok) return { data: null, error: data };

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: "Failed to fetch orders" } };
    }
  },

  // ── Categories ──
  getCategories: async () => {
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/admin/categories`, {
        headers,
        cache: "no-store",
      });

      const data = await res.json();
      if (!res.ok) return { data: null, error: data };

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: "Failed to fetch categories" } };
    }
  },

  createCategory: async (name: string) => {
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/admin/categories`, {
        method: "POST",
        headers,
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      if (!res.ok) return { data: null, error: data };

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: "Failed to create category" } };
    }
  },

  updateCategory: async (id: string, name: string) => {
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/admin/categories/${id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      if (!res.ok) return { data: null, error: data };

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: "Failed to update category" } };
    }
  },

  deleteCategory: async (id: string) => {
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/admin/categories/${id}`, {
        method: "DELETE",
        headers,
      });

      const data = await res.json();
      if (!res.ok) return { data: null, error: data };

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: "Failed to delete category" } };
    }
  },
};
