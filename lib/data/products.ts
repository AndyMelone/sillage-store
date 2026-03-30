"use server";

import { sdk } from "@/lib/config";
import { HttpTypes } from "@medusajs/types";
import { listRegions } from "./regions";

// ─── Cache la region par défaut ─────────────────────────
let cachedRegionId: string | null = null;

async function getDefaultRegionId(): Promise<string> {
  if (cachedRegionId) return cachedRegionId;
  const regions = await listRegions();
  if (regions.length === 0) throw new Error("Aucune région configurée dans Medusa.");
  cachedRegionId = regions[0].id;
  return cachedRegionId;
}

// ─── Récupérer un produit par ID ────────────────────────
export const retrieveProduct = async (id: string, queryParams?: HttpTypes.StoreProductParams) => {
  const region_id = await getDefaultRegionId();
  return sdk.client
    .fetch<{ product: HttpTypes.StoreProduct }>(
      `/store/products/${id}`,
      {
        query: {
          region_id,
          fields: "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags",
          ...queryParams,
        },
        cache: "force-cache",
      }
    )
    .then(({ product }) => product);
};

// ─── Récupérer un produit par handle (slug) ─────────────
export const getProductByHandle = async (handle: string): Promise<HttpTypes.StoreProduct | null> => {
  const region_id = await getDefaultRegionId();
  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[] }>(
      `/store/products`,
      {
        query: {
          handle,
          region_id,
          fields: "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags",
        },
        cache: "force-cache",
      }
    )
    .then(({ products }) => products[0] || null);
};

// ─── Lister les produits (paginé) ───────────────────────
export const listProducts = async ({
  pageParam = 1,
  queryParams,
}: {
  pageParam?: number;
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams;
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number };
  nextPage: number | null;
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams;
}> => {
  const region_id = await getDefaultRegionId();
  const limit = queryParams?.limit || 12;
  const _pageParam = Math.max(pageParam, 1);
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit;

  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
      `/store/products`,
      {
        method: "GET",
        query: {
          limit,
          offset,
          region_id,
          fields: "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags",
          ...queryParams,
        },
        cache: "force-cache",
      }
    )
    .then(({ products, count }) => {
      const nextPage = count > offset + limit ? pageParam + 1 : null;

      return {
        response: {
          products,
          count,
        },
        nextPage: nextPage,
        queryParams,
      };
    });
};

// ─── Lister les produits d'une collection ────────────────
export const listProductsByCollectionId = async (
  collectionId: string,
  limit: number = 12
): Promise<HttpTypes.StoreProduct[]> => {
  const region_id = await getDefaultRegionId();
  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[] }>(
      `/store/products`,
      {
        query: {
          collection_id: [collectionId],
          limit,
          region_id,
          fields: "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags",
        },
        cache: "force-cache",
      }
    )
    .then(({ products }) => products);
};
