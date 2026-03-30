import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  itemIds: string[];
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  toggleItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      itemIds: [],
      addItem: (id) => {
        if (!get().itemIds.includes(id)) {
          set({ itemIds: [...get().itemIds, id] });
        }
      },
      removeItem: (id) => {
        set({ itemIds: get().itemIds.filter((itemId) => itemId !== id) });
      },
      toggleItem: (id) => {
        if (get().isInWishlist(id)) {
          get().removeItem(id);
        } else {
          get().addItem(id);
        }
      },
      isInWishlist: (id) => get().itemIds.includes(id),
      clearWishlist: () => set({ itemIds: [] }),
    }),
    {
      name: "sillage-wishlist-storage",
    }
  )
);
