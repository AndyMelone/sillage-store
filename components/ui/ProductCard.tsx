"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductCardProps {
  name: string;
  price: number;
  originalPrice?: number;
  image1: string;
  image2: string;
  category?: string;
  currency?: string;
}

export function ProductCard({
  name,
  price,
  originalPrice,
  image1,
  image2,
  category = "Eau de Parfum",
  currency = "€",
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-3/4 overflow-hidden bg-secondary mb-4">
        {/* First Image */}
        <Image
          src={image1}
          alt={name}
          fill
          className={`object-cover transition-opacity duration-500 ease-out ${
            isHovered ? "opacity-0" : "opacity-100"
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Second Image */}
        <Image
          src={image2}
          alt={`${name} - vue alternative`}
          fill
          className={`object-cover transition-opacity duration-500 ease-out ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          {category}
        </p>
        <h3 className="font-serif text-lg tracking-wide text-foreground group-hover:text-accent transition-colors duration-300">
          {name}
        </h3>
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground">
            {price.toFixed(2)} {currency}
          </p>
          {originalPrice && (
            <p className="text-sm text-muted-foreground line-through">
              {originalPrice.toFixed(2)} {currency}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
