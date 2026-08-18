"use client";

import { ProductCard } from "@/components/ui/ProductCard";
import { useProductsStore } from "@/store/use-products-store";
import type { HttpTypes } from "@medusajs/types";
import { Flame } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const THIRTY_DAYS_AGO = Date.now() - 30 * 24 * 60 * 60 * 1000;

function getPrice(product: HttpTypes.StoreProduct): number {
  const variant = product.variants?.[0];
  return variant?.calculated_price?.calculated_amount ?? 0;
}

function getImages(product: HttpTypes.StoreProduct) {
  const images = product.images || [];
  return {
    image1: product.thumbnail || images[0]?.url || "/placeholders/sillage.png",
    image2: images[1]?.url || product.thumbnail || "/placeholders/sillage.webp",
  };
}

export default function ParfumsPage() {
  const { products, collections, isLoading, fetchProducts, fetchCollections } =
    useProductsStore();
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    fetchProducts();
    fetchCollections();
  }, [fetchProducts, fetchCollections]);

  const tabs = useMemo(
    () => [
      { value: "all", label: "Tous" },
      { value: "new", label: "Nouveautés" },
      ...collections.slice(0, 4).map((c) => ({ value: c.id, label: c.title })),
    ],
    [collections],
  );

  const filteredProducts = useMemo(() => {
    if (activeFilter === "all") return products;
    if (activeFilter === "new") {
      return products.filter((p) =>
        p.created_at
          ? new Date(p.created_at).getTime() > THIRTY_DAYS_AGO
          : false,
      );
    }
    return products.filter(
      (p) => (p.collection_id || p.collection?.id) === activeFilter,
    );
  }, [products, activeFilter]);

  return (
    <main className="min-h-screen bg-background">
      <section className="pt-24 pb-16 md:pt-28 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-4 text-center">
            <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Découvrez Nos <span className="text-accent">Parfums</span>
            </h1>
          </div>
          <p className="mx-auto mb-10 max-w-md text-center text-sm text-muted-foreground">
            Explorez notre collection de fragrances d&apos;exception, à des
            prix accessibles.
          </p>

          <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveFilter(tab.value)}
                className={`flex items-center gap-1.5 rounded-none border px-4 py-2 text-sm font-medium transition-colors ${
                  activeFilter === tab.value
                    ? "border-accent bg-accent text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-secondary"
                }`}
              >
                <Flame className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <p className="py-20 text-center text-muted-foreground">
              Chargement des parfums...
            </p>
          ) : filteredProducts.length === 0 ? (
            <p className="py-20 text-center text-muted-foreground">
              Aucun parfum ne correspond à ce filtre.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => {
                const { image1, image2 } = getImages(product);
                const price = getPrice(product);
                const isNew = product.created_at
                  ? new Date(product.created_at).getTime() > THIRTY_DAYS_AGO
                  : false;

                return (
                  <Link key={product.id} className="block" href={`/produit/${product.handle}`}>
                    <ProductCard
                      name={product.title}
                      price={price}
                      image1={image1}
                      image2={image2}
                      category={
                        product.subtitle || product.collection?.title || "Parfum"
                      }
                      badge={isNew ? "Nouveau" : undefined}
                    />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
