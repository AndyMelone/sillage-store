import Medusa, { FetchArgs, FetchInput } from "@medusajs/js-sdk";

const DEFAULT_MEDUSA_BACKEND_URL =
  "https://sillage-back-production.up.railway.app/";

let MEDUSA_BACKEND_URL = DEFAULT_MEDUSA_BACKEND_URL;

if (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
}

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
});

const originalFetch = sdk.client.fetch.bind(sdk.client);

sdk.client.fetch = async <T>(
  input: FetchInput,
  init?: FetchArgs,
): Promise<T> => {
  const headers = init?.headers ?? {};

  const newHeaders = {
    ...headers,
  };
  init = {
    ...init,
    headers: newHeaders,
  };
  return originalFetch(input, init);
};
