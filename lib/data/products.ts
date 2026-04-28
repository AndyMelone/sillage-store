"use server";

import { sdk } from "@/lib/config";
import { HttpTypes } from "@medusajs/types";
import { listRegions } from "./regions";

// ─── Cache la region par défaut ─────────────────────────
let cachedRegionId: string | null = null;

async function getDefaultRegionId(): Promise<string> {
  if (cachedRegionId) return cachedRegionId;
  const regions = await listRegions();
  if (regions.length === 0)
    throw new Error("Aucune région configurée dans Medusa.");
  cachedRegionId = regions[0].id;
  return cachedRegionId;
}

export const retrieveProduct = async (
  id: string,
  queryParams?: HttpTypes.StoreProductParams,
) => {
  const region_id = await getDefaultRegionId();
  return sdk.client
    .fetch<{ product: HttpTypes.StoreProduct }>(`/store/products/${id}`, {
      query: {
        region_id,
        fields:
          "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags",
        ...queryParams,
      },
      cache: "force-cache",
    })
    .then(({ product }) => product);
};

export const getProductByHandle = async (
  handle: string,
): Promise<HttpTypes.StoreProduct | null> => {
  const region_id = await getDefaultRegionId();
  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[] }>(`/store/products`, {
      query: {
        handle,
        region_id,
        fields:
          "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags",
      },
      cache: "force-cache",
    })
    .then(({ products }) => products[0] || null);
};

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
          fields:
            "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags",
          ...queryParams,
        },
        // cache: "force-cache",
      },
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

export const listProductsByCollectionId = async (
  collectionId: string,
  limit: number = 12,
): Promise<HttpTypes.StoreProduct[]> => {
  const region_id = await getDefaultRegionId();
  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[] }>(`/store/products`, {
      query: {
        collection_id: [collectionId],
        limit,
        region_id,
        fields:
          "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags",
      },
      cache: "force-cache",
    })
    .then(({ products }) => products);
};

export const searchProducts = async (
  query: string,
  limit: number = 5,
): Promise<HttpTypes.StoreProduct[]> => {
  if (!query || query.length < 2) return [];
  const region_id = await getDefaultRegionId();
  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[] }>(`/store/products`, {
      method: "GET",
      query: {
        q: query,
        limit,
        region_id,
        fields:
          "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,*collection",
      },
      cache: "no-store",
    })
    .then(({ products }) => products)
    .catch((err) => {
      console.error("Search products error:", err);
      return [];
    });
};

export const listProductsByIds = async (
  ids: string[],
): Promise<HttpTypes.StoreProduct[]> => {
  if (ids.length === 0) return [];
  const region_id = await getDefaultRegionId();
  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[] }>(`/store/products`, {
      query: {
        id: ids,
        region_id,
        fields:
          "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,*collection",
      },
      cache: "no-store",
    })
    .then(({ products }) => products);
};
