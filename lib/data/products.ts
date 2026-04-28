"use server";

import { DEFAULT_REGION_ID, sdk } from "@/lib/config";
import { HttpTypes } from "@medusajs/types";

const PRODUCT_FIELDS =
  "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags";

const PRODUCT_FIELDS_WITH_COLLECTION =
  "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,*collection";

export const retrieveProduct = async (
  id: string,
  queryParams?: HttpTypes.StoreProductParams,
) => {
  return sdk.store.product
    .retrieve(id, {
      region_id: DEFAULT_REGION_ID,
      fields: PRODUCT_FIELDS,
      ...queryParams,
    })
    .then(({ product }) => product);
};

export const getProductByHandle = async (
  handle: string,
): Promise<HttpTypes.StoreProduct | null> => {
  return sdk.store.product
    .list({
      handle,
      region_id: DEFAULT_REGION_ID,
      fields: PRODUCT_FIELDS,
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
  const limit = queryParams?.limit || 12;
  const _pageParam = Math.max(pageParam, 1);
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit;

  return sdk.store.product
    .list({
      limit,
      offset,
      region_id: DEFAULT_REGION_ID,
      fields: PRODUCT_FIELDS,
      ...queryParams,
    })
    .then(({ products, count }) => {
      const nextPage = count > offset + limit ? pageParam + 1 : null;
      return { response: { products, count }, nextPage, queryParams };
    });
};

export const listProductsByCollectionId = async (
  collectionId: string,
  limit: number = 12,
): Promise<HttpTypes.StoreProduct[]> => {
  return sdk.store.product
    .list({
      collection_id: [collectionId],
      limit,
      region_id: DEFAULT_REGION_ID,
      fields: PRODUCT_FIELDS,
    })
    .then(({ products }) => products);
};

export const searchProducts = async (
  query: string,
  limit: number = 5,
): Promise<HttpTypes.StoreProduct[]> => {
  if (!query || query.length < 2) return [];
  return sdk.store.product
    .list({
      q: query,
      limit,
      region_id: DEFAULT_REGION_ID,
      fields: PRODUCT_FIELDS_WITH_COLLECTION,
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
  return sdk.store.product
    .list({
      id: ids,
      region_id: DEFAULT_REGION_ID,
      fields: PRODUCT_FIELDS_WITH_COLLECTION,
    })
    .then(({ products }) => products);
};
