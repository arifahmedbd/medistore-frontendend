"use server";

import { medicineService } from "@/services/medicine.service";

export const getMedicinesAction = async (params?: {
  search?: string;
  categoryId?: string;
  sellerId?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    return await medicineService.getMedicines(params, {
      cache: "no-store",
    });
  } catch (error) {
    return {
      data: null,
      error: { message: "Failed to fetch medicines" },
    };
  }
};

export const getMedicineByIdAction = async (id: string) => {
  if (!id) {
    return { data: null, error: { message: "Medicine ID is required" } };
  }

  try {
    return await medicineService.getMedicineById(id);
  } catch (error) {
    return {
      data: null,
      error: { message: "Failed to fetch medicine" },
    };
  }
};

export const createMedicineAction = async (payload: any) => {
  try {
    return await medicineService.addMedicine(payload);
  } catch (error) {
    return {
      data: null,
      error: { message: "Failed to create medicine" },
    };
  }
};

export const updateMedicineAction = async (id: string, payload: any) => {
  if (!id) {
    return { data: null, error: { message: "Medicine ID is required" } };
  }

  try {
    return await medicineService.updateMedicine(id, payload);
  } catch (error) {
    return {
      data: null,
      error: { message: "Failed to update medicine" },
    };
  }
};

export const deleteMedicineAction = async (id: string) => {
  if (!id) {
    return { data: null, error: { message: "Medicine ID is required" } };
  }

  try {
    return await medicineService.deleteMedicine(id);
  } catch (error) {
    return {
      data: null,
      error: { message: "Failed to delete medicine" },
    };
  }
};
