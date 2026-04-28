"use server";

import { DEFAULT_REGION_ID, sdk } from "@/lib/config";
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
        fields:
          "*items, *region, *items.product, *items.variant, *items.thumbnail, *items.metadata, +items.total, *promotions, *shipping_address, *billing_address, *shipping_methods",
      },
      cache: "no-store",
    })
    .then(({ cart }) => cart)
    .catch(() => null);
}

export async function getOrSetCart() {
  let cart = await retrieveCart(undefined);

  if (!cart) {
    const cartResp = await sdk.store.cart.create({
      region_id: DEFAULT_REGION_ID,
    });
    cart = cartResp.cart;
    await setCartId(cart.id);
  }

  return cart;
}

export async function updateCart(data: HttpTypes.StoreUpdateCart) {
  const cartId = await getCartId();
  if (!cartId) return null;

  return await sdk.store.cart
    .update(cartId, data)
    .then(({ cart }) => cart)
    .catch((err) => {
      console.error("Update cart error:", err);
      return null;
    });
}

export async function addToCart({
  variantId,
  quantity,
}: {
  variantId: string;
  quantity: number;
}) {
  const cart = await getOrSetCart();
  if (!cart) throw new Error("Error retrieving or creating cart");

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
  if (!cartId) throw new Error("Missing cart ID");

  await sdk.store.cart.updateLineItem(cartId, lineId, { quantity });
}

export async function deleteLineItem(lineId: string) {
  const cartId = await getCartId();
  if (!cartId) throw new Error("Missing cart ID");

  await sdk.store.cart.deleteLineItem(cartId, lineId);
}

// ─── Checkout Actions ──────────────────────────────────

export async function listShippingOptions() {
  const cartId = await getCartId();
  if (!cartId) return [];

  return await sdk.client
    .fetch<{ shipping_options: HttpTypes.StoreShippingOption[] }>(
      `/store/shipping-options`,
      {
        method: "GET",
        query: {
          cart_id: cartId,
        },
      },
    )
    .then(({ shipping_options }) => shipping_options)
    .catch(() => []);
}

export async function addShippingMethod(optionId: string) {
  const cartId = await getCartId();
  if (!cartId) return null;

  return await sdk.store.cart
    .addShippingMethod(cartId, { option_id: optionId })
    .then(({ cart }) => cart)
    .catch(() => null);
}

export async function initiatePayment() {
  const cartId = await getCartId();
  if (!cartId) return null;

  // In Medusa V2, we create a payment collection for the cart
  return await sdk.client
    .fetch<{ cart: HttpTypes.StoreCart }>(
      `/store/carts/${cartId}/payment-collections`,
      {
        method: "POST",
        body: {},
      },
    )
    .then(({ cart }) => cart)
    .catch((err) => {
      console.error("Initiate payment error:", err);
      return null;
    });
}

export async function completeCart() {
  const cartId = await getCartId();
  if (!cartId) return null;

  return await sdk.store.cart
    .complete(cartId)
    .then((res) => {
      if (res.type === "order") {
        removeCartId();
        return res.order;
      }
      return null;
    })
    .catch((err) => {
      console.error("Complete cart error:", err);
      return null;
    });
}
