"use server";

import { adminService } from "@/services/admin.service";

type ActionResponse<T = any> = {
  success: boolean;
  data: T | null;
  message?: string;
};

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

export async function getAdminStatsAction(): Promise<ActionResponse> {
  try {
    const res = await adminService.getStats();
    return handleResponse(res);
  } catch (e: any) {
    return { success: false, data: null, message: e.message };
  }
}

export async function getAdminUsersAction(params?: {
  page?: number;
  search?: string;
  role?: "CUSTOMER" | "SELLER" | "ADMIN";
  status?: "ACTIVE" | "BANNED";
}): Promise<ActionResponse> {
  try {
    const res = await adminService.getUsers(params);
    return handleResponse(res);
  } catch (e: any) {
    return { success: false, data: null, message: e.message };
  }
}

export async function updateUserRoleAction(
  userId: string,
  role: "CUSTOMER" | "SELLER",
): Promise<ActionResponse> {
  try {
    const res = await adminService.updateUserRole(userId, role);
    return handleResponse(res);
  } catch (e: any) {
    return { success: false, data: null, message: e.message };
  }
}

export async function updateUserStatusAction(
  userId: string,
  status: "ACTIVE" | "BANNED",
): Promise<ActionResponse> {
  try {
    const res = await adminService.updateUserStatus(userId, status);
    return handleResponse(res);
  } catch (e: any) {
    return { success: false, data: null, message: e.message };
  }
}

// ── Orders ─────────────────────────────────────────────────
export async function getAdminOrdersAction(params?: {
  page?: number;
  search?: string;
  status?: string;
}): Promise<ActionResponse> {
  try {
    const res = await adminService.getOrders(params);
    return handleResponse(res);
  } catch (e: any) {
    return { success: false, data: null, message: e.message };
  }
}

// ── Categories ─────────────────────────────────────────────
export async function getAdminCategoriesAction(): Promise<ActionResponse> {
  try {
    const res = await adminService.getCategories();
    return handleResponse(res);
  } catch (e: any) {
    return { success: false, data: null, message: e.message };
  }
}

export async function createCategoryAction(
  name: string,
): Promise<ActionResponse> {
  try {
    const res = await adminService.createCategory(name);
    return handleResponse(res);
  } catch (e: any) {
    return { success: false, data: null, message: e.message };
  }
}

export async function updateCategoryAction(
  id: string,
  name: string,
): Promise<ActionResponse> {
  try {
    const res = await adminService.updateCategory(id, name);
    return handleResponse(res);
  } catch (e: any) {
    return { success: false, data: null, message: e.message };
  }
}

export async function deleteCategoryAction(
  id: string,
): Promise<ActionResponse> {
  try {
    const res = await adminService.deleteCategory(id);
    return handleResponse(res);
  } catch (e: any) {
    return { success: false, data: null, message: e.message };
  }
}
