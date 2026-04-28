"use client";

import type { HttpTypes } from "@medusajs/types";
import { ArrowLeft, ArrowRight, Heart, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ui/ProductCard";
import { useCartStore } from "@/store/use-cart-store";

// ─── Helpers ────────────────────────────────────────────
function getPrice(product: HttpTypes.StoreProduct): number {
  const variant = product.variants?.[0];
  if (variant?.calculated_price?.calculated_amount) {
    return variant.calculated_price.calculated_amount;
  }
  return 0;
}

function getImages(product: HttpTypes.StoreProduct) {
  const images = product.images || [];
  return {
    image1: product.thumbnail || images[0]?.url || "/images/placeholder.jpg",
    image2: images[1]?.url || product.thumbnail || "/images/placeholder.jpg",
  };
}

export default function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [collection, setCollection] =
    useState<HttpTypes.StoreCollection | null>(null);
  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>([]);
  const [allCollections, setAllCollections] = useState<
    HttpTypes.StoreCollection[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    async function fetchData() {
      try {
        const backendUrl =
          process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
        const publishableKey =
          process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";
        const headers = { "x-publishable-api-key": publishableKey };

        // Fetch all collections
        const colRes = await fetch(
          `${backendUrl}/store/collections?limit=100`,
          { headers },
        );
        const colData = await colRes.json();
        const cols: HttpTypes.StoreCollection[] = colData.collections || [];
        setAllCollections(cols);

        // Find current collection by handle
        const current = cols.find((c) => c.handle === slug);
        if (!current) {
          setIsLoading(false);
          return;
        }
        setCollection(current);

        // Fetch region for pricing
        const regRes = await fetch(`${backendUrl}/store/regions`, { headers });
        const regData = await regRes.json();
        const regionId = regData.regions?.[0]?.id || "";

        // Fetch products for this collection
        const prodRes = await fetch(
          `${backendUrl}/store/products?collection_id[]=${current.id}&limit=50&region_id=${regionId}&fields=*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags`,
          { headers },
        );
        const prodData = await prodRes.json();
        setProducts(prodData.products || []);
      } catch (error) {
        console.error("Error loading collection:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </main>
    );
  }

  if (!collection) {
    notFound();
  }

  const heroImage =
    (products.at(0)?.thumbnail as string) ||
    (collection.metadata?.image as any) ||
    "/placeholders/sillage.png";
  const longDescription =
    (collection.metadata?.longDescription as string) ||
    (collection.metadata?.description as string) ||
    "";
  const notes = ((collection.metadata?.notes as string) || "")
    .split(",")
    .map((n) => n.trim())
    .filter(Boolean);
  const characteristics = (() => {
    try {
      const raw = collection.metadata?.characteristics as string;
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  })();

  const currentIndex = allCollections.findIndex((c) => c.handle === slug);
  const nextCollection =
    allCollections[(currentIndex + 1) % allCollections.length];
  const prevCollection =
    allCollections[
      (currentIndex - 1 + allCollections.length) % allCollections.length
    ];

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <Image
          src={heroImage}
          alt={collection.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/20" />

        {/* Back Link */}
        <div className="absolute top-24 md:top-28 left-6 z-10">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Toutes les collections
          </Link>
        </div>

        {/* Hero Content */}
        <div className="absolute inset-x-0 bottom-0 p-8 md:p-16">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-white/70 mb-3">
                {products.length} parfum{products.length > 1 ? "s" : ""} dans
                cette collection
              </p>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white mb-4">
                {collection.title}
              </h1>
              {longDescription && (
                <p className="text-white/80 max-w-2xl text-lg leading-relaxed">
                  {longDescription}
                </p>
              )}
            </motion.div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {allCollections.length > 1 && (
          <div className="absolute bottom-8 right-8 flex gap-2">
            <Link
              href={`/collections/${prevCollection.handle}`}
              className="w-12 h-12 flex items-center justify-center border border-white/30 text-white hover:bg-white hover:text-black transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <Link
              href={`/collections/${nextCollection.handle}`}
              className="w-12 h-12 flex items-center justify-center border border-white/30 text-white hover:bg-white hover:text-black transition-colors"
            >
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        )}
      </section>

      {/* Collection Info */}
      {(notes.length > 0 || characteristics.length > 0) && (
        <section className="py-16 bg-secondary">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Notes Signature */}
              {notes.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="font-serif text-2xl text-foreground mb-6">
                    Notes Signature
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Les matières premières qui définissent l{"'"}identité de
                    cette collection :
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {notes.map((note, index) => (
                      <motion.span
                        key={note}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="px-4 py-2 bg-background border border-border text-sm text-foreground hover:border-accent transition-colors cursor-default"
                      >
                        {note}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Characteristics */}
              {characteristics.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="font-serif text-2xl text-foreground mb-6">
                    Caractéristiques
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {characteristics.map(
                      (
                        char: { icon: string; label: string; value: string },
                        index: number,
                      ) => (
                        <motion.div
                          key={char.label}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="p-5 bg-background border border-border"
                        >
                          <span className="text-3xl mb-3 block">
                            {char.icon}
                          </span>
                          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                            {char.label}
                          </p>
                          <p className="font-medium text-foreground">
                            {char.value}
                          </p>
                        </motion.div>
                      ),
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Products Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
              Découvrez nos créations
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground">
              Les Parfums
            </h2>
          </motion.div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {products.map((product, index) => {
                const { image1, image2 } = getImages(product);
                const price = getPrice(product);

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group"
                  >
                    <Link href={`/produit/${product.handle}`}>
                      <div className="relative">
                        <ProductCard
                          name={product.title}
                          price={price}
                          image1={image1}
                          image2={image2}
                          category={
                            product.subtitle ||
                            product.collection?.title ||
                            "Parfum"
                          }
                        />

                        {/* Quick Actions */}
                        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <button className="w-10 h-10 bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors">
                            <Heart className="h-4 w-4" />
                          </button>
                          <button
                            className="w-10 h-10 bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                            onClick={(e) => {
                              e.preventDefault();
                              const variantId = product.variants?.[0]?.id;
                              if (variantId) addItem(variantId, 1);
                            }}
                          >
                            <ShoppingBag className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-4">
                Aucun parfum dans cette collection pour le moment.
              </p>
              <Link href="/parfums">
                <Button variant="outline">Voir tous les parfums</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Other Collections */}
      {allCollections.length > 1 && (
        <section className="py-20 bg-secondary">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
                Continuez votre exploration
              </p>
              <h2 className="font-serif text-4xl text-foreground">
                Autres Collections
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-3 gap-6">
              {allCollections
                .filter((c) => c.handle !== slug)
                .slice(0, 3)
                .map((otherCollection, index) => {
                  const otherImage =
                    (otherCollection.metadata?.image as string) ||
                    "/images/collection-placeholder.jpg";
                  return (
                    <motion.div
                      key={otherCollection.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Link
                        href={`/collections/${otherCollection.handle}`}
                        className="group block relative aspect-4/3 overflow-hidden"
                      >
                        <Image
                          src={otherImage}
                          alt={otherCollection.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                          <h3 className="font-serif text-2xl mb-1 group-hover:translate-x-2 transition-transform">
                            {otherCollection.title}
                          </h3>
                          {(() => {
                            const desc = otherCollection.metadata
                              ?.description as string | undefined;
                            return desc ? (
                              <p className="text-sm text-white/70">{desc}</p>
                            ) : null;
                          })()}
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
