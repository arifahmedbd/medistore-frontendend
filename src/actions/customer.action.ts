"use server";

import { customerService } from "@/services/customer.service";




export const placeOrderAction = async (payload: {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  postcode: string;
  notes?: string;
}) => {
  try {
    return await customerService.placeOrder(payload);
  } catch {
    return {
      data: null,
      error: { message: "Failed to place order" },
    };
  }
};

export const getMyOrdersAction = async (params?: { page?: number }) => {
  try {
    return await customerService.getMyOrders(params);
  } catch {
    return {
      data: null,
      error: { message: "Failed to fetch orders" },
    };
  }
};

export const getMyOrderByIdAction = async (orderId: string) => {
  if (!orderId) {
    return { data: null, error: { message: "Order ID is required" } };
  }

  try {
    return await customerService.getMyOrderById(orderId);
  } catch {
    return {
      data: null,
      error: { message: "Failed to fetch order" },
    };
  }
};

export const cancelOrderAction = async (orderId: string) => {
  if (!orderId) {
    return { data: null, error: { message: "Order ID is required" } };
  }

  try {
    return await customerService.cancelOrder(orderId);
  } catch {
    return {
      data: null,
      error: { message: "Failed to cancel order" },
    };
  }
};

export const getMyProfileAction = async () => {
  try {
    return await customerService.getProfile();
  } catch {
    return {
      data: null,
      error: { message: "Failed to fetch profile" },
    };
  }
};

export const updateProfileAction = async (payload: {
  name?: string;
  image?: string;
}) => {
  try {
    return await customerService.updateProfile(payload);
  } catch {
    return {
      data: null,
      error: { message: "Failed to update profile" },
    };
  }
};

export const changePasswordAction = async (
  currentPassword: string,
  newPassword: string,
) => {
  try {
    return await customerService.changePassword({
      currentPassword,
      newPassword,
    });
  } catch {
    return {
      data: null,
      error: { message: "Failed to change password" },
    };
  }
};
