import { HttpTypes } from "@medusajs/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  addToCart,
  deleteLineItem,
  getOrSetCart,
  retrieveCart,
  updateLineItem,
} from "../lib/data/cart";

export interface CartItem {
  id: string;
  variant_id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartState {
  cart: HttpTypes.StoreCart | null;
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  initCart: () => Promise<void>;
  syncCart: () => Promise<void>;
  addItem: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  totalItems: number;
  totalPrice: number;
}

const mapCartItems = (cart: HttpTypes.StoreCart | null): CartItem[] => {
  if (!cart?.items) return [];
  return cart.items.map((item) => ({
    id: item.id,
    variant_id: item.variant_id!,
    name: item.title,
    price: item.unit_price,
    quantity: item.quantity,
    image: item.thumbnail || undefined,
  }));
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      items: [],
      isOpen: false,
      isLoading: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      initCart: async () => {
        set({ isLoading: true });
        try {
          const cart = await getOrSetCart();
          set({ cart, items: mapCartItems(cart) });
        } finally {
          set({ isLoading: false });
        }
      },

      syncCart: async () => {
        set({ isLoading: true });
        try {
          const cart = await retrieveCart();
          if (cart) {
            set({ cart, items: mapCartItems(cart) });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      addItem: async (variantId: string, quantity: number) => {
        set({ isLoading: true });
        try {
          await addToCart({ variantId, quantity });
          await get().syncCart();
          set({ isOpen: true });
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (lineId: string) => {
        set({ isLoading: true });
        try {
          await deleteLineItem(lineId);
          await get().syncCart();
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (lineId: string, quantity: number) => {
        if (quantity <= 0) {
          await get().removeItem(lineId);
          return;
        }
        set({ isLoading: true });
        try {
          await updateLineItem({ lineId, quantity });
          await get().syncCart();
        } finally {
          set({ isLoading: false });
        }
      },

      get totalItems() {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
      get totalPrice() {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );
      },
    }),
    {
      name: "sillage-cart-storage",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
