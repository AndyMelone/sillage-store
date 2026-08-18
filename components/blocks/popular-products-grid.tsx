"use client";

import { ProductCard } from "@/components/ui/ProductCard";
import { Flame } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

export interface PopularProduct {
  id: string;
  handle: string;
  name: string;
  price: number;
  image1: string;
  image2: string;
  category: string;
  isNew: boolean;
}

const TABS = [
  { value: "all", label: "Tous" },
  { value: "new", label: "Nouveautés" },
  { value: "popular", label: "Populaires" },
] as const;

type Tab = (typeof TABS)[number]["value"];

export function PopularProductsGrid({
  products,
}: {
  products: PopularProduct[];
}) {
  const [tab, setTab] = useState<Tab>("all");

  const filtered = useMemo(() => {
    if (tab === "new") return products.filter((p) => p.isNew);
    return products;
  }, [tab, products]);

  return (
    <>
      <div className="mb-10 flex items-center justify-center gap-2">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`flex items-center gap-1.5 rounded-none border px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.value
                ? "border-accent bg-accent text-primary-foreground"
                : "border-border bg-background text-foreground hover:bg-secondary"
            }`}
          >
            <Flame className="h-3.5 w-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => (
          <Link key={product.id} className="block" href={`/produit/${product.handle}`}>
            <ProductCard
              name={product.name}
              price={product.price}
              image1={product.image1}
              image2={product.image2}
              category={product.category}
              badge={product.isNew ? "Nouveau" : undefined}
            />
          </Link>
        ))}
      </div>
    </>
  );
}
