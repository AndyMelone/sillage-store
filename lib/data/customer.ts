"use server";

import { sdk } from "@/lib/config";
import { HttpTypes } from "@medusajs/types";
import { cookies } from "next/headers";

const AUTH_TOKEN_COOKIE = "medusa_token";

// ─── Récupérer le token d'auth ──────────────────────────
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_TOKEN_COOKIE)?.value || null;
}

// ─── Récupérer le client connecté ───────────────────────
export async function getCustomer(): Promise<HttpTypes.StoreCustomer | null> {
  const token = await getAuthToken();
  if (!token) return null;

  try {
    const { customer } = await sdk.client.fetch<{ customer: HttpTypes.StoreCustomer }>(
      `/store/customers/me`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return customer;
  } catch {
    return null;
  }
}

// ─── Créer un customer après inscription OTP ────────────
export async function createCustomer(data: {
  first_name?: string;
  last_name?: string;
  phone?: string;
}): Promise<HttpTypes.StoreCustomer | null> {
  const token = await getAuthToken();
  if (!token) return null;

  try {
    const { customer } = await sdk.client.fetch<{ customer: HttpTypes.StoreCustomer }>(
      `/store/customers`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }
    );
    return customer;
  } catch {
    return null;
  }
}
