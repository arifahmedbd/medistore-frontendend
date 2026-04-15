"use server";

import { categoryService } from "@/services/category.service";

export interface Category {
  id: string;
  name: string;
  createdAt: string;
}

export const getCategoriesAction = async (): Promise<Category[]> => {
  try {
    const res = await categoryService.getCategories();
    return Array.isArray(res.data?.data) ? res.data.data : [];
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const createCategoryAction = async (payload: { name: string }) => {
  try {
    return await categoryService.createCategory(payload);
  } catch (error) {
    return {
      data: null,
      error: { message: "Failed to create category" },
    };
  }
};

export const updateCategoryAction = async (
  id: string,
  payload: { name: string },
) => {
  if (!id) {
    return { data: null, error: { message: "Category ID is required" } };
  }

  try {
    return await categoryService.updateCategory(id, payload);
  } catch (error) {
    return {
      data: null,
      error: { message: "Failed to update category" },
    };
  }
};

export const deleteCategoryAction = async (id: string) => {
  if (!id) {
    return { data: null, error: { message: "Category ID is required" } };
  }

  try {
    return await categoryService.deleteCategory(id);
  } catch (error) {
    return {
      data: null,
      error: { message: "Failed to delete category" },
    };
  }
};
