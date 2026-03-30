"use server";

import { sdk } from "@/lib/config";
import { HttpTypes } from "@medusajs/types";

export const listRegions = async (): Promise<HttpTypes.StoreRegion[]> => {
  return sdk.client
    .fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
      method: "GET",
      cache: "force-cache",
    })
    .then(({ regions }) => regions);
};

export const retrieveRegion = async (id: string) => {
  return sdk.client
    .fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
      method: "GET",
      cache: "force-cache",
    })
    .then(({ region }) => region);
};
