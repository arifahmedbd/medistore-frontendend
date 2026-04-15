import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  manufacturer: string;
  image?: string;
  createdAt: string;

  categoryId: string;
  sellerId: string;

  category: {
    id: string;
    name: string;
  };

  seller: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };

  reviews?: Review[];
  orderItems?: OrderItem[];
}

export interface Review {
  id: string;
  userId: string;
  medicineId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  medicineId: string;
  quantity: number;
  price: number;
  createdAt: string;
}

interface ServiceOptions {
  cache?: RequestCache;
  revalidate?: number;
}

interface GetMedicinesParams {
  search?: string;
  categoryId?: string;
  sellerId?: string;
  page?: number;
  limit?: number;
}

export const medicineService = {
  getMedicines: async function (
    params?: GetMedicinesParams,
    options?: ServiceOptions,
  ) {
    try {
      const cookieStore = await cookies();

      const url = new URL(`${API_URL}/medicines`);

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            url.searchParams.append(key, value.toString());
          }
        });
      }

      const config: RequestInit = {
        headers: {
          Cookie: cookieStore.toString(),
        },
      };

      if (options?.cache) {
        config.cache = options.cache;
      }

      if (options?.revalidate) {
        config.next = { revalidate: options.revalidate };
      }

      const res = await fetch(url.toString(), config);
      const data = await res.json();

      if (!res.ok) {
        return { data: null, error: data };
      }

      return { data, error: null };
    } catch (err) {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },

  getMedicineById: async function (id: string) {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/medicines/${id}`, {
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
    } catch (err) {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },

  addMedicine: async function (payload: any) {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/medicines`, {
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
    } catch (err) {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },

  updateMedicine: async function (id: string, payload: any) {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/medicines/${id}`, {
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
    } catch (err) {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },

  deleteMedicine: async function (id: string) {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/medicines/${id}`, {
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
    } catch (err) {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },
};
