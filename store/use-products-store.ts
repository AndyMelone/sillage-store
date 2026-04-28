import { sdk } from "@/lib/config";
import { HttpTypes } from "@medusajs/types";
import { create } from "zustand";

interface ProductsState {
  // Data
  products: HttpTypes.StoreProduct[];
  collections: HttpTypes.StoreCollection[];
  isLoading: boolean;
  error: string | null;

  // Filters & UI State
  selectedCollections: string[];
  priceRange: [number, number];
  sortBy: string;
  viewMode: "grid" | "list";
  quickViewProduct: HttpTypes.StoreProduct | null;
  currencyCode: string;
  decimalDigits: number;

  // Actions
  fetchProducts: () => Promise<void>;
  fetchCollections: () => Promise<void>;
  setSelectedCollections: (ids: string[]) => void;
  toggleCollection: (id: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setSortBy: (sort: string) => void;
  setViewMode: (mode: "grid" | "list") => void;

  clearFilters: () => void;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  // Initial State
  products: [],
  collections: [],
  isLoading: false,
  error: null,
  selectedCollections: [],
  priceRange: [0, 1000000],
  sortBy: "title",
  viewMode: "grid",
  quickViewProduct: null,
  currencyCode: "XOF",
  decimalDigits: 0,

  // Actions
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      // Fetch regions first to get region_id and currency info
      const { regions } = await sdk.store.region.list();
      const region = regions?.[0];
      const regionId = region?.id;
      const currencyCode = region?.currency_code || "XOF";

      // In Medusa V2, we might need to retrieve the full currency to get decimals,
      // but for now let's default based on common knowledge or assume XOF = 0
      const decimalDigits = 0;

      // Fetch products
      const fields =
        "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,*collection";

      const { products } = await sdk.store.product.list({
        limit: 100,
        fields,
        ...(regionId ? { region_id: regionId } : {}),
      });

      set({
        products: products || [],
        isLoading: false,
        currencyCode,
        decimalDigits,
      });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  fetchCollections: async () => {
    try {
      const { collections } = await sdk.store.collection.list(
        { limit: 100 },
        {
          next: {
            tags: ["collections"],
          },
        },
      );
      set({ collections: collections || [] });
    } catch (err) {
      console.error("Error fetching collections:", err);
    }
  },

  setSelectedCollections: (ids) => set({ selectedCollections: ids }),

  toggleCollection: (id) => {
    const { selectedCollections } = get();
    const newSelection = selectedCollections.includes(id)
      ? selectedCollections.filter((c) => c !== id)
      : [...selectedCollections, id];
    set({ selectedCollections: newSelection });
  },

  setPriceRange: (range) => set({ priceRange: range }),

  setSortBy: (sort) => set({ sortBy: sort }),

  setViewMode: (mode) => set({ viewMode: mode }),

  clearFilters: () =>
    set({
      selectedCollections: [],
      priceRange: [0, 1000000],
    }),
}));
