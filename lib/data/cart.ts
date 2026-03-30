"use server";

import { sdk } from "@/lib/config";
import { HttpTypes } from "@medusajs/types";
import { cookies } from "next/headers";

const CART_ID_COOKIE = "_medusa_cart_id";

export async function getCartId() {
  const cookieStore = await cookies();
  return cookieStore.get(CART_ID_COOKIE)?.value;
}

export async function setCartId(cartId: string) {
  const cookieStore = await cookies();
  cookieStore.set(CART_ID_COOKIE, cartId, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function removeCartId() {
  const cookieStore = await cookies();
  cookieStore.set(CART_ID_COOKIE, "", { maxAge: -1 });
}

export async function retrieveCart(cartId?: string) {
  const id = cartId || (await getCartId());

  if (!id) {
    return null;
  }

  return await sdk.client
    .fetch<{ cart: HttpTypes.StoreCart }>(`/store/carts/${id}`, {
      method: "GET",
      query: {
        fields: "*items, *region, *items.product, *items.variant, *items.thumbnail, *items.metadata, +items.total, *promotions",
      },
      cache: "no-store", // Ensure we always get the freshest cart
    })
    .then(({ cart }) => cart)
    .catch(() => null);
}

import { listRegions } from "./regions";

export async function getOrSetCart() {
  let cart = await retrieveCart(undefined);

  if (!cart) {
    const regions = await listRegions();
    const defaultRegionId = regions[0]?.id;
    
    if (!defaultRegionId) {
      throw new Error("No default region found in Medusa.");
    }

    const cartResp = await sdk.store.cart.create({ region_id: defaultRegionId });
    cart = cartResp.cart;
    await setCartId(cart.id);
  }

  return cart;
}

export async function addToCart({
  variantId,
  quantity,
}: {
  variantId: string;
  quantity: number;
}) {
  if (!variantId) {
    throw new Error("Missing variant ID when adding to cart");
  }

  const cart = await getOrSetCart();

  if (!cart) {
    throw new Error("Error retrieving or creating cart");
  }

  await sdk.store.cart.createLineItem(cart.id, {
    variant_id: variantId,
    quantity,
  });
}

export async function updateLineItem({
  lineId,
  quantity,
}: {
  lineId: string;
  quantity: number;
}) {
  const cartId = await getCartId();

  if (!cartId) {
    throw new Error("Missing cart ID when updating line item");
  }

  await sdk.store.cart.updateLineItem(cartId, lineId, { quantity });
}

export async function deleteLineItem(lineId: string) {
  const cartId = await getCartId();

  if (!cartId) {
    throw new Error("Missing cart ID when deleting line item");
  }

  await sdk.store.cart.deleteLineItem(cartId, lineId);
}
