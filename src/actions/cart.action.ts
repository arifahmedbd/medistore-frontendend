"use server";

import { cartService } from "@/services/cart.service";

export async function getCartAction() {
  const res = await cartService.getCart();
  if (res.error) {
    return {
      success: false,
      message: res.error?.message || "Failed to fetch cart",
      data: { items: [], total: 0, itemCount: 0 },
    };
  }

  return {
    success: true,
    message: "Cart fetched",
    data: res.data,
  };
}

export async function addToCartAction(medicineId: string, quantity: number) {
  const res = await cartService.addItem(medicineId, quantity);

  if (res.error) {
    return {
      success: false,
      message: res.error?.message,
      data: null,
    };
  }

  return {
    success: true,
    message: "Item added",
    data: res.data,
  };
}

export async function updateCartItemAction(itemId: string, quantity: number) {
  const res = await cartService.updateItem(itemId, quantity);

  if (res.error) {
    return {
      success: false,
      message: res.error?.message || "Failed to update item",
      data: null,
    };
  }

  return {
    success: true,
    message: "Item updated",
    data: res.data,
  };
}

export async function removeCartItemAction(itemId: string) {
  const res = await cartService.removeItem(itemId);

  if (res.error) {
    return {
      success: false,
      message: res.error?.message || "Failed to remove item",
      data: null,
    };
  }

  return {
    success: true,
    message: "Item removed",
    data: res.data,
  };
}

export async function clearCartAction() {
  const res = await cartService.clear();

  if (res.error) {
    return {
      success: false,
      message: res.error?.message || "Failed to clear cart",
      data: null,
    };
  }

  return {
    success: true,
    message: "Cart cleared",
    data: res.data,
  };
}
