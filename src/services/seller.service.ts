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

export const sellerService = {
  getStats: async () => {
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/seller/stats`, {
        headers,
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) return { data: null, error: data };
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: "Failed to fetch seller stats" } };
    }
  },

  getOrders: async (params?: { page?: number; status?: string }) => {
    try {
      const headers = await getHeaders();
      const q = new URLSearchParams();
      if (params?.page) q.set("page", String(params.page));
      if (params?.status) q.set("status", params.status);

      const res = await fetch(`${API_URL}/seller/orders?${q}`, {
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

  updateOrderStatus: async (orderId: string, status: string) => {
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/seller/orders/${orderId}/status`, {
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
        error: { message: "Failed to update order status" },
      };
    }
  },

  getMedicines: async (params?: { page?: number; search?: string }) => {
    try {
      const headers = await getHeaders();
      const q = new URLSearchParams();
      if (params?.page) q.set("page", String(params.page));
      if (params?.search) q.set("search", params.search);

      const res = await fetch(`${API_URL}/seller/medicines?${q}`, {
        headers,
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) return { data: null, error: data };
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: "Failed to fetch medicines" } };
    }
  },

  createMedicine: async (data: {
    name: string;
    description: string;
    price: number;
    stock: number;
    manufacturer: string;
    image?: string;
    categoryId: string;
  }) => {
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/seller/medicines`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (!res.ok) return { data: null, error: resData };
      return { data: resData, error: null };
    } catch (error) {
      return { data: null, error: { message: "Failed to create medicine" } };
    }
  },

  updateMedicine: async (
    medicineId: string,
    data: Partial<{
      name: string;
      description: string;
      price: number;
      stock: number;
      manufacturer: string;
      image: string;
      categoryId: string;
    }>,
  ) => {
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/seller/medicines/${medicineId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (!res.ok) return { data: null, error: resData };
      return { data: resData, error: null };
    } catch (error) {
      return { data: null, error: { message: "Failed to update medicine" } };
    }
  },

  deleteMedicine: async (medicineId: string) => {
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_URL}/seller/medicines/${medicineId}`, {
        method: "DELETE",
        headers,
      });
      const resData = await res.json();
      if (!res.ok) return { data: null, error: resData };
      return { data: resData, error: null };
    } catch (error) {
      return { data: null, error: { message: "Failed to delete medicine" } };
    }
  },
};
