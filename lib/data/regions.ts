"use server";

import { sdk } from "@/lib/config";
import { HttpTypes } from "@medusajs/types";

export const listRegions = async (): Promise<HttpTypes.StoreRegion[]> => {
  return sdk.store.region.list({ fields: "*countries" }).then(({ regions }) => regions);
};

export const retrieveRegion = async (id: string) => {
  return sdk.store.region.retrieve(id).then(({ region }) => region);
};
