"use server";

import { sdk } from "@/lib/config";
import { HttpTypes } from "@medusajs/types";

export const retrieveCollection = async (id: string) => {
  return sdk.client
    .fetch<{ collection: HttpTypes.StoreCollection }>(
      `/store/collections/${id}`,
      {
        cache: "no-store",
      },
    )
    .then(({ collection }) => collection);
};

export const listCollections = async (
  queryParams: Record<string, string | number> = {},
): Promise<{ collections: HttpTypes.StoreCollection[]; count: number }> => {
  queryParams.limit = queryParams.limit || 100;
  queryParams.offset = queryParams.offset || 0;

  const { collections, count } = await sdk.store.collection.list({
    limit: queryParams.limit as number,
    offset: queryParams.offset as number,
  });

  const collectionsWithProducts = await Promise.all(
    collections.map(async (collection) => {
      const { products } = await sdk.store.product.list({
        collection_id: collection.id,
        limit: 20,
        offset: 0,
      });
      return { ...collection, products };
    }),
  );

  return {
    collections: collectionsWithProducts,
    count: count || collections.length,
  };
};

export const getCollectionByHandle = async (
  handle: string,
): Promise<HttpTypes.StoreCollection> => {
  return sdk.client
    .fetch<{ collections: HttpTypes.StoreCollection[] }>(`/store/collections`, {
      query: { handle, fields: "*products" },
      cache: "no-store",
    })
    .then(({ collections }) => collections[0]);
};
