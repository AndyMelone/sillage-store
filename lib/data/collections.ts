"use server";

import { sdk } from "@/lib/config";
import { HttpTypes } from "@medusajs/types";

export const retrieveCollection = async (id: string) => {
  return sdk.client
    .fetch<{ collection: HttpTypes.StoreCollection }>(
      `/store/collections/${id}`,
      {
        cache: "force-cache",
      }
    )
    .then(({ collection }) => collection);
};

export const listCollections = async (
  queryParams: Record<string, string | number> = {}
): Promise<{ collections: HttpTypes.StoreCollection[]; count: number }> => {
  queryParams.limit = queryParams.limit || 100;
  queryParams.offset = queryParams.offset || 0;

  return sdk.client
    .fetch<{ collections: HttpTypes.StoreCollection[]; count: number }>(
      "/store/collections",
      {
        query: queryParams,
        cache: "force-cache",
      }
    )
    .then(({ collections, count }) => ({ collections, count: count || collections.length }));
};

export const getCollectionByHandle = async (
  handle: string
): Promise<HttpTypes.StoreCollection> => {
  return sdk.client
    .fetch<{ collections: HttpTypes.StoreCollection[] }>(`/store/collections`, {
      query: { handle, fields: "*products" },
      cache: "force-cache",
    })
    .then(({ collections }) => collections[0]);
};
