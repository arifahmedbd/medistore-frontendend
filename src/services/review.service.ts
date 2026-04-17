// src/services/review.service.ts
import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const reviewService = {
  getByMedicineId: async (medicineId: string) => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/review/medicine/${medicineId}`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        return { data: null, error: data };
      }

      return { data: data.data, error: null };
    } catch (error) {
      return {
        data: null,
        error: { message: "Failed to fetch reviews" },
      };
    }
  },

  create: async (payload: {
    medicineId: string;
    rating: number;
    comment: string;
  }) => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        return { data: null, error: data };
      }

      return { data: data.data, error: null };
    } catch (error) {
      return {
        data: null,
        error: { message: "Failed to create review" },
      };
    }
  },

  update: async (
    id: string,
    payload: { rating?: number; comment?: string },
  ) => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/review/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        return { data: null, error: data };
      }

      return { data: data.data, error: null };
    } catch (error) {
      return {
        data: null,
        error: { message: "Failed to update review" },
      };
    }
  },

  delete: async (id: string) => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/review/${id}`, {
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
        error: { message: "Failed to delete review" },
      };
    }
  },
};
