"use client";

import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/use-cart-store";
import { useProductsStore } from "@/store/use-products-store";
import Image from "next/image";
import { useState } from "react";

interface ProductCardProps {
  name: string;
  price: number;
  originalPrice?: number;
  image1?: string | null;
  image2?: string | null;
  category?: string;
  variantId?: string;
}

export function ProductCard({
  name,
  price,
  originalPrice,
  image1,
  image2,
  category = "Eau de Parfum",
  variantId,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { currencyCode, decimalDigits } = useProductsStore();
  const addItem = useCartStore((state) => state.addItem);
  const isLoading = useCartStore((state) => state.isLoading);

  const finalImage1 = image1 || "/placeholders/sillage.png";
  const finalImage2 = image2 || "/placeholders/sillage.webp";

  const formatPrice = (amount: number) => {
    // If decimalDigits is 0 (like XOF), we don't divide by 100
    const value = decimalDigits === 0 ? amount : amount / 100;
    return value.toLocaleString("fr-FR", {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: decimalDigits,
    });
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (variantId) {
      addItem(variantId, 1);
    }
  };

  return (
    <div
      className="group cursor-pointer relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-3/4 overflow-hidden bg-zinc-50 mb-4 rounded-2xl border border-zinc-100/50">
        <Image
          src={finalImage1}
          alt={name}
          fill
          className={cn(
            "object-cover transition-all duration-700 ease-out",
            isHovered ? "opacity-0 scale-110" : "opacity-100 scale-100",
          )}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        <Image
          src={finalImage2}
          alt={`${name} - vue alternative`}
          fill
          className={cn(
            "object-cover transition-all duration-700 ease-out",
            isHovered ? "opacity-100 scale-100" : "opacity-0 scale-90",
          )}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="space-y-1 text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400">
          {category}
        </p>
        <h3 className="font-serif text-xl tracking-wide text-zinc-900 group-hover:text-primary transition-colors">
          {name}
        </h3>
        <div className="flex items-center justify-center gap-2">
          <p className="text-sm font-semibold text-zinc-900">
            {formatPrice(price)}
          </p>
          {originalPrice && (
            <p className="text-sm text-zinc-400 line-through">
              {formatPrice(originalPrice)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
