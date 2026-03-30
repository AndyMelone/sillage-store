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
    <div className="flex flex-col sm:flex-row gap-4">
      <Button
        size="lg"
        onClick={() => addItem(variantId, 1)}
        disabled={!variantId}
        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-wider text-sm py-6"
      >
        Ajouter au panier
      </Button>
      <Button
        size="lg"
        variant="outline"
        onClick={() => toggleItem(productId)}
        className={cn(
          "flex-1 uppercase tracking-wider text-sm py-6 border-foreground transition-colors",
          isWishlisted
            ? "bg-foreground text-background"
            : "text-foreground hover:bg-foreground hover:text-background"
        )}
      >
        <Heart className={cn("mr-2 size-4", isWishlisted && "fill-current")} />
        {isWishlisted ? "Dans la liste" : "Liste de souhaits"}
      </Button>
    </div>
  );
}
