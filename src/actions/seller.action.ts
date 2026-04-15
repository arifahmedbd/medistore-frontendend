"use server";

import { sellerService } from "@/services/seller.service";

type ActionResponse<T = any> = {
  success: boolean;
  data: T | null;
  message?: string;
};

// ── Helper to normalize responses ───────────────────────────
function handleResponse(res: any): ActionResponse {
  if (res?.error) {
    return {
      success: false,
      data: null,
      message: res.error?.message || "Something went wrong",
    };
  }

  return {
    success: true,
    data: res?.data?.data ?? res?.data ?? res,
  };
}

// ── Dashboard ──────────────────────────────────────────────
export async function getSellerStatsAction(): Promise<ActionResponse> {
  try {
    const res = await sellerService.getStats();
    return handleResponse(res);
  } catch (e: any) {
    return { success: false, data: null, message: e.message };
  }
}

// ── Orders ───────────────────────────────────────────────
export async function getSellerOrdersAction(params?: {
  page?: number;
  status?: string;
}): Promise<ActionResponse> {
  try {
    const res = await sellerService.getOrders(params);
    return handleResponse(res);
  } catch (e: any) {
    return { success: false, data: null, message: e.message };
  }
}

export async function updateOrderStatusAction(
  orderId: string,
  status: string,
): Promise<ActionResponse> {
  try {
    const res = await sellerService.updateOrderStatus(orderId, status);
    return handleResponse(res);
  } catch (e: any) {
    return { success: false, data: null, message: e.message };
  }
}

// ── Medicines ───────────────────────────────────────────
export async function getSellerMedicinesAction(params?: {
  page?: number;
  search?: string;
}): Promise<ActionResponse> {
  try {
    const res = await sellerService.getMedicines(params);
    return handleResponse(res);
  } catch (e: any) {
    return { success: false, data: null, message: e.message };
  }
}

export async function createMedicineAction(data: {
  name: string;
  description: string;
  price: number;
  stock: number;
  manufacturer: string;
  image?: string;
  categoryId: string;
}): Promise<ActionResponse> {
  try {
    const res = await sellerService.createMedicine(data);
    return handleResponse(res);
  } catch (e: any) {
    return { success: false, data: null, message: e.message };
  }
}

export async function updateMedicineAction(
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
): Promise<ActionResponse> {
  try {
    const res = await sellerService.updateMedicine(medicineId, data);
    return handleResponse(res);
  } catch (e: any) {
    return { success: false, data: null, message: e.message };
  }
}

export async function deleteMedicineAction(
  medicineId: string,
): Promise<ActionResponse> {
  try {
    const res = await sellerService.deleteMedicine(medicineId);
    return handleResponse(res);
  } catch (e: any) {
    return { success: false, data: null, message: e.message };
  }
}
