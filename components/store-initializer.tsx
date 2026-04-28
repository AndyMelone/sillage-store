"use client";

import { useAuthStore } from "@/store/use-auth-store";
import { useCartStore } from "@/store/use-cart-store";
import { useEffect } from "react";

export function StoreInitializer() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const initCart = useCartStore((state) => state.initCart);

  useEffect(() => {
    checkAuth();
    initCart();
  }, [checkAuth, initCart]);

  return null;
}
