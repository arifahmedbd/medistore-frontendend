import { create } from "zustand";
import { toast } from "sonner";
import {
  getCartAction,
  addToCartAction,
  updateCartItemAction,
  removeCartItemAction,
  clearCartAction,
} from "@/actions/cart.action";

export interface CartMedicine {
  id: string;
  name: string;
  price: number;
  image: string | null;
  stock: number;
  manufacturer: string;
  category: { name: string };
}

export interface CartItem {
  id: string;
  medicineId: string;
  quantity: number;
  medicine: CartMedicine;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isOpen: boolean;
  isLoading: boolean;
  loadingItems: Set<string>;

  fetchCart: () => Promise<void>;
  addItem: (
    medicineId: string,
    medicineName: string,
    quantity?: number,
  ) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  total: 0,
  itemCount: 0,
  isOpen: false,
  isLoading: false,
  loadingItems: new Set(),

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const res = await getCartAction();
      if (res.success) {
        const items: CartItem[] = res.data.data.items ?? [];

        set({
          items,
          itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
          total: items.reduce(
            (sum, i) => sum + i.quantity * i.medicine.price,
            0,
          ),
        });
      } else {
        toast.error(res.message ?? "Failed to fetch cart");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Something went wrong while fetching cart");
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (medicineId: string, medicineName: string, quantity = 1) => {
    // mark the item as loading
    set((state) => ({
      loadingItems: new Set(state.loadingItems).add(medicineId),
    }));

    try {
      // call backend to add item
      const res = await addToCartAction(medicineId, quantity);
      if (!res.success) throw new Error(res.message);

      // fetch the full cart to sync frontend with backend
      await get().fetchCart();

      toast.success(`${medicineName} added to cart`);
      get().openDrawer(); // auto-open cart drawer
    } catch (err: any) {
      toast.error(err?.message || "Failed to add item");
    } finally {
      // remove loading state
      set((state) => {
        const next = new Set(state.loadingItems);
        next.delete(medicineId);
        return { loadingItems: next };
      });
    }
  },

  updateItem: async (itemId, quantity) => {
    set((state) => ({ loadingItems: new Set(state.loadingItems).add(itemId) }));

    try {
      const res = await updateCartItemAction(itemId, quantity);
      if (!res.success) throw new Error(res.message);

      set((state) => {
        const updatedItems = state.items.map((i) =>
          i.id === itemId ? { ...i, quantity } : i,
        );
        return {
          items: updatedItems,
          itemCount: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
          total: updatedItems.reduce(
            (sum, i) => sum + i.quantity * i.medicine.price,
            0,
          ),
        };
      });

      toast.success(res.message ?? "Cart updated");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to update item");
    } finally {
      set((state) => {
        const next = new Set(state.loadingItems);
        next.delete(itemId);
        return { loadingItems: next };
      });
    }
  },

  removeItem: async (itemId) => {
    set((state) => ({ loadingItems: new Set(state.loadingItems).add(itemId) }));

    try {
      const res = await removeCartItemAction(itemId);
      if (!res.success) throw new Error(res.message);

      set((state) => {
        const updatedItems = state.items.filter((i) => i.id !== itemId);
        return {
          items: updatedItems,
          itemCount: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
          total: updatedItems.reduce(
            (sum, i) => sum + i.quantity * i.medicine.price,
            0,
          ),
        };
      });

      toast.success(res.message ?? "Item removed from cart");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to remove item");
    } finally {
      set((state) => {
        const next = new Set(state.loadingItems);
        next.delete(itemId);
        return { loadingItems: next };
      });
    }
  },

  clearCart: async () => {
    set({ isLoading: true });
    try {
      const res = await clearCartAction();
      if (res.success) {
        set({ items: [], itemCount: 0, total: 0 });
        toast.success(res.message ?? "Cart cleared");
      } else {
        toast.error(res.message ?? "Failed to clear cart");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Something went wrong while clearing cart");
    } finally {
      set({ isLoading: false });
    }
  },

  openDrawer: () => set({ isOpen: true }),
  closeDrawer: () => set({ isOpen: false }),
  toggleDrawer: () => set((s) => ({ isOpen: !s.isOpen })),
}));
