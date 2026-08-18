"use server";

import { sdk } from "@/lib/config";
import { HttpTypes } from "@medusajs/types";
import { cookies } from "next/headers";

const AUTH_TOKEN_COOKIE = "medusa_token";

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_TOKEN_COOKIE)?.value || null;
}

export async function getCustomer(): Promise<HttpTypes.StoreCustomer | null> {
  const token = await getAuthToken();
  if (!token) return null;

  try {
    const { customer } = await sdk.client.fetch<{
      customer: HttpTypes.StoreCustomer;
    }>(`/store/customers/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      query: {
        fields: "*addresses",
      },
      cache: "no-store",
    });
    return customer;
  } catch {
    return null;
  }
}

export async function updateCustomer(data: {
  first_name?: string;
  last_name?: string;
  phone?: string;
}) {
  const token = await getAuthToken();
  if (!token) return null;

  try {
    const { customer } = await sdk.client.fetch<{
      customer: HttpTypes.StoreCustomer;
    }>(`/store/customers/me`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });
    return customer;
  } catch (err) {
    console.error("Update customer error:", err);
    return null;
  }
}

export async function addAddress(address: HttpTypes.StoreCustomerAddress) {
  const token = await getAuthToken();
  if (!token) return null;

  try {
    const { customer } = await sdk.client.fetch<{
      customer: HttpTypes.StoreCustomer;
    }>(`/store/customers/me/addresses`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: address,
    });
    return customer;
  } catch (err) {
    console.error("Add address error:", err);
    return null;
  }
}

export async function deleteAddress(addressId: string) {
  const token = await getAuthToken();
  if (!token) return null;

  try {
    await sdk.client.fetch(`/store/customers/me/addresses/${addressId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return true;
  } catch (err) {
    console.error("Delete address error:", err);
    return false;
  }
}

export async function listOrders() {
  const token = await getAuthToken();
  if (!token) return [];

  try {
    const { orders } = await sdk.client.fetch<{
      orders: HttpTypes.StoreOrder[];
    }>(`/store/orders`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      query: {
        fields: "*items,*shipping_address,+total",
      },
      cache: "no-store",
    });
    return orders;
  } catch (err) {
    console.error("List orders error:", err);
    return [];
  }
}

export async function getOrder(orderId: string): Promise<HttpTypes.StoreOrder | null> {
  const token = await getAuthToken();
  if (!token) return null;

  try {
    const { order } = await sdk.client.fetch<{
      order: HttpTypes.StoreOrder;
    }>(`/store/orders/${orderId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      query: {
        fields:
          "id,display_id,status,created_at,email,*items,*shipping_address,*shipping_methods,+total,+subtotal,+shipping_total,+tax_total,currency_code",
      },
      cache: "no-store",
    });
    return order;
  } catch (err) {
    console.error("Get order error:", err);
    return null;
  }
}
