"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/use-cart-store";
import { useWishlistStore } from "@/store/use-wishlist-store";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductActionsProps {
  variantId: string;
  productId: string;
}

export function ProductActions({ variantId, productId }: ProductActionsProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isWishlisted = mounted ? isInWishlist(productId) : false;

  return (
    <div>
      <Button
        onClick={() => addItem(variantId, 1)}
        disabled={!variantId}
        className="w-full rounded-none py-7 text-lg font-semibold"
      >
        Ajouter au panier
      </Button>
      <button
        type="button"
        onClick={() => toggleItem(productId)}
        className={cn(
          "mt-3 flex w-full items-center justify-center gap-2 py-2 text-sm font-medium transition-colors",
          isWishlisted
            ? "text-accent"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Heart className={cn("size-4", isWishlisted && "fill-current")} />
        {isWishlisted ? "Dans la liste de souhaits" : "Ajouter à la liste de souhaits"}
      </button>
    </div>
  );
}
