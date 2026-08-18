"use client";

import { useProductsStore } from "@/store/use-products-store";
import Image from "next/image";

interface ProductCardProps {
  name: string;
  price: number;
  originalPrice?: number;
  image1?: string | null;
  image2?: string | null;
  category?: string;
  variantId?: string;
  badge?: string;
  inStock?: boolean;
}

export function ProductCard({
  name,
  price,
  originalPrice,
  image1,
  category = "Eau de Parfum",
  badge,
  inStock = true,
}: ProductCardProps) {
  const { currencyCode, decimalDigits } = useProductsStore();
  const finalImage1 = image1 || "/placeholders/sillage.png";

  const formatPrice = (amount: number) => {
    const value = decimalDigits === 0 ? amount : amount / 100;
    return value.toLocaleString("fr-FR", {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: decimalDigits,
    });
  };

  return (
    <div className="group relative bg-background p-6 transition-colors hover:bg-secondary">
      {badge && (
        <span className="absolute left-4 top-4 z-10 rounded-none bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
          {badge}
        </span>
      )}

      <div className="relative aspect-square w-full overflow-hidden p-4">
        <Image
          src={finalImage1}
          alt={name}
          fill
          className="object-contain transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
      </div>

      <div className="pt-4">
        <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {category}
        </p>
        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-foreground">
              {name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {inStock ? "En stock" : "Rupture de stock"}
            </p>
          </div>
          <div className="flex shrink-0 items-baseline gap-2">
            <span className="text-sm font-semibold text-foreground">
              {formatPrice(price)}
            </span>
            {originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
