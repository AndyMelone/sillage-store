"use client";

import * as React from "react";
import Link from "next/link";
import { useWishlistStore } from "@/store/use-wishlist-store";
import { getAllProducts } from "@/lib/products";
import { ProductCard } from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function WishlistPage() {
  const { itemIds, removeItem } = useWishlistStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-background pt-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-40 animate-pulse bg-muted rounded-xl" />
        </div>
      </main>
    );
  }

  const wishlistProducts = getAllProducts().filter((p) =>
    itemIds.includes(String(p.id))
  );

  return (
    <main className="min-h-screen bg-background py-12">
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
            <h1 className="font-serif text-4xl md:text-5xl tracking-wide text-foreground">
              Ma Liste de Souhaits
            </h1>
          </div>
          <p className="text-muted-foreground">
            {wishlistProducts.length}{" "}
            {wishlistProducts.length === 1 ? "article sauvegardé" : "articles sauvegardés"}
          </p>
        </div>

        <AnimatePresence mode="popLayout">
          {wishlistProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
              {wishlistProducts.map((product) => (
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
                    className="absolute top-2 right-2 z-10 bg-background/80 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => removeItem(String(product.id))}
                  >
                    <Heart className="size-4 fill-current" />
                    <span className="sr-only">Retirer de la liste</span>
                  </Button>
                  <Link href={`/produit/${product.slug}`}>
                    <ProductCard
                      name={product.name}
                      price={product.price}
                      image1={product.image1}
                      image2={product.image2}
                      category={product.category}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="size-20 bg-muted rounded-full flex items-center justify-center mb-6">
                <Heart className="size-10 text-muted-foreground opacity-20" />
              </div>
              <h2 className="text-2xl font-serif mb-4">Votre liste est vide</h2>
              <p className="text-muted-foreground max-w-sm mb-8">
                Parcourez notre collection et enregistrez vos produits favoris pour les retrouver plus tard.
              </p>
              <Button asChild size="lg" className="rounded-full px-8">
                <Link href="/">
                  <ShoppingBag className="mr-2 size-4" />
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
