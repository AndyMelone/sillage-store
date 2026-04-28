import Medusa from "@medusajs/js-sdk";

export const sdk = new Medusa({
  baseUrl:
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
    "https://sillage-back-production.up.railway.app/",
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
});

export const DEFAULT_REGION_ID = process.env.NEXT_PUBLIC_DEFAULT_REGION_ID!;
