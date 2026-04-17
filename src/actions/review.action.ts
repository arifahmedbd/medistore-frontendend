"use server";

import { reviewService } from "@/services/review.service";

export const getReviewsByMedicineAction = async (medicineId: string) => {
  try {
    const res = await reviewService.getByMedicineId(medicineId);
    return { data: res.data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err?.response?.data || { message: "Failed to fetch reviews" },
    };
  }
};

export const createReviewAction = async (payload: {
  medicineId: string;
  rating: number;
  comment: string;
}) => {
  return await reviewService.create(payload);
};

export const updateReviewAction = async (
  id: string,
  payload: { rating?: number; comment?: string },
) => {
  return await reviewService.update(id, payload);
};

export const deleteReviewAction = async (id: string) => {
  return await reviewService.delete(id);
};
