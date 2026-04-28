"use client";

import * as React from "react";
import Link from "next/link";
import { useWishlistStore } from "@/store/use-wishlist-store";
import { listProductsByIds } from "@/lib/data/products";
import { ProductCard } from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { HttpTypes } from "@medusajs/types";
import { Spinner } from "@/components/ui/spinner";

export default function WishlistPage() {
  const { itemIds, removeItem } = useWishlistStore();
  const [products, setProducts] = React.useState<HttpTypes.StoreProduct[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    async function loadProducts() {
      if (itemIds.length > 0) {
        const data = await listProductsByIds(itemIds);
        setProducts(data);
      }
      setIsLoading(false);
    }
    loadProducts();
  }, [itemIds]);

  if (!mounted || isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Spinner className="size-8" />
      </main>
    );
  }

  const handleRemove = (id: string) => {
    removeItem(id);
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <main className="min-h-screen bg-background py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="size-4" />
              Retour à la boutique
            </Link>
            <h1 className="font-serif text-5xl tracking-wide text-foreground">
              Ma Liste de Souhaits
            </h1>
          </div>
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest">
            {products.length}{" "}
            {products.length === 1 ? "article sauvegardé" : "articles sauvegardés"}
          </p>
        </div>

        <AnimatePresence mode="popLayout">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative group"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md rounded-full text-red-500 hover:bg-red-500 hover:text-white shadow-lg transition-all"
                    onClick={() => handleRemove(product.id)}
                  >
                    <Heart className="size-4 fill-current" />
                  </Button>
                  <Link href={`/produit/${product.handle}`}>
                    <ProductCard
                      name={product.title}
                      price={product.variants?.[0]?.calculated_price?.calculated_amount || 0}
                      image1={product.thumbnail || ""}
                      image2={product.images?.[1]?.url || product.thumbnail || ""}
                      category={product.collection?.title || "Parfum"}
                      variantId={product.variants?.[0]?.id}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <div className="size-24 bg-zinc-50 rounded-full flex items-center justify-center mb-8">
                <Heart className="size-12 text-zinc-200" />
              </div>
              <h2 className="text-3xl font-serif mb-4">Votre liste est vide</h2>
              <p className="text-muted-foreground max-w-sm mb-10 mx-auto">
                Parcourez notre collection et enregistrez vos produits favoris pour les retrouver plus tard.
              </p>
              <Button asChild size="lg" className="rounded-full px-12 h-14 text-lg font-medium shadow-xl shadow-zinc-200">
                <Link href="/">
                  <ShoppingBag className="mr-2 size-5" />
                  Découvrir nos parfums
                </Link>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
