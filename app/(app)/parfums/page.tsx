"use client";

import {
  BadgePercent,
  ChevronDown,
  Eye,
  Filter,
  Grid3X3,
  Heart,
  LayoutList,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { HttpTypes } from "@medusajs/types";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProductCard } from "@/components/ui/ProductCard";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
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

// ─── Sort Options ───────────────────────────────────────
const sortOptions = [
  { value: "title", label: "Nom A-Z" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "created_at", label: "Nouveautés" },
];

export default function ParfumsPage() {
  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>([]);
  const [collections, setCollections] = useState<HttpTypes.StoreCollection[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState("title");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<HttpTypes.StoreProduct | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  // ─── Charger produits et collections depuis l'API ─────
  useEffect(() => {
    async function fetchData() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
        const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

        // Fetch regions first to get region_id
        const regionsRes = await fetch(`${backendUrl}/store/regions`, {
          headers: { "x-publishable-api-key": publishableKey },
        });
        const regionsData = await regionsRes.json();
        const regionId = regionsData.regions?.[0]?.id;

        // Fetch products
        const productsRes = await fetch(
          `${backendUrl}/store/products?limit=100&fields=*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags${regionId ? `&region_id=${regionId}` : ""}`,
          { headers: { "x-publishable-api-key": publishableKey } }
        );
        const productsData = await productsRes.json();
        setProducts(productsData.products || []);

        // Fetch collections
        const collectionsRes = await fetch(`${backendUrl}/store/collections?limit=100`, {
          headers: { "x-publishable-api-key": publishableKey },
        });
        const collectionsData = await collectionsRes.json();
        setCollections(collectionsData.collections || []);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setIsLoadingProducts(false);
      }
    }
    fetchData();
  }, []);

  // ─── Filtrage & tri côté client ───────────────────────
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by collection
    if (selectedCollections.length > 0) {
      filtered = filtered.filter(
        (p) => p.collection_id && selectedCollections.includes(p.collection_id)
      );
    }

    // Filter by price
    filtered = filtered.filter((p) => {
      const price = getPrice(p);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Sort
    if (sortBy === "price-asc") {
      filtered.sort((a, b) => getPrice(a) - getPrice(b));
    } else if (sortBy === "price-desc") {
      filtered.sort((a, b) => getPrice(b) - getPrice(a));
    } else if (sortBy === "title") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "created_at") {
      filtered.sort(
        (a, b) =>
          new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
      );
    }

    return filtered;
  }, [products, selectedCollections, priceRange, sortBy]);

  const activeFiltersCount =
    selectedCollections.length +
    (priceRange[0] > 0 || priceRange[1] < 500 ? 1 : 0);

  const clearFilters = () => {
    setSelectedCollections([]);
    setPriceRange([0, 500]);
  };

  const toggleCollection = (id: string) => {
    setSelectedCollections((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const FilterSidebar = () => (
    <div className="space-y-8">
      {/* Collections */}
      {collections.length > 0 && (
        <div>
          <h3 className="font-serif text-lg mb-4">Collections</h3>
          <div className="space-y-3">
            {collections.map((col) => (
              <label
                key={col.id}
                className="flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedCollections.includes(col.id)}
                    onCheckedChange={() => toggleCollection(col.id)}
                  />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {col.title}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Prix */}
      <div>
        <h3 className="font-serif text-lg mb-4">Prix</h3>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={(val) => {
              if (Array.isArray(val)) setPriceRange([...val]);
            }}
            max={500}
            min={0}
            step={10}
            className="mb-4"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{priceRange[0]}€</span>
            <span>{priceRange[1]}€</span>
          </div>
        </div>
      </div>

      {/* Reset */}
      {activeFiltersCount > 0 && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          Réinitialiser les filtres
        </Button>
      )}
    </div>
  );

  return (
    <main className="min-h-screen bg-background">
      <section className="pt-24 md:pt-28 pb-12 bg-secondary">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
              Découvrez
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
              Nos Parfums
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Explorez notre collection de fragrances d{"'"}exception. Trouvez
              le parfum qui vous correspond.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-28">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-xl">Filtres</h2>
                  {activeFiltersCount > 0 && (
                    <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </div>
                <FilterSidebar />
              </div>
            </aside>

            {/* Products Area */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
                {/* Mobile Filter Toggle */}
                <Sheet
                  open={showMobileFilters}
                  onOpenChange={setShowMobileFilters}
                >
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="lg:hidden gap-2"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      Filtres
                      {activeFiltersCount > 0 && (
                        <span className="ml-1 w-5 h-5 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">
                          {activeFiltersCount}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle className="font-serif">Filtres</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterSidebar />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Product Count */}
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {isLoadingProducts ? "..." : filteredProducts.length}
                  </span>{" "}
                  parfum{filteredProducts.length > 1 ? "s" : ""}
                </p>

                {/* Sort & View */}
                <div className="flex items-center gap-3 ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        Trier
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {sortOptions.map((option) => (
                        <DropdownMenuItem
                          key={option.value}
                          onClick={() => setSortBy(option.value)}
                          className={
                            sortBy === option.value ? "bg-secondary" : ""
                          }
                        >
                          {option.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <div className="hidden md:flex items-center border border-border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 rounded-none rounded-l-md ${viewMode === "grid" ? "bg-secondary" : ""}`}
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 rounded-none rounded-r-md ${viewMode === "list" ? "bg-secondary" : ""}`}
                      onClick={() => setViewMode("list")}
                    >
                      <LayoutList className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Active Filters Tags */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedCollections.map((colId) => {
                    const col = collections.find((c) => c.id === colId);
                    return (
                      <button
                        key={colId}
                        onClick={() => toggleCollection(colId)}
                        className="flex items-center gap-1 px-3 py-1 bg-secondary text-sm rounded-full hover:bg-secondary/80 transition-colors"
                      >
                        {col?.title || colId}
                        <X className="h-3 w-3" />
                      </button>
                    );
                  })}
                  {(priceRange[0] > 0 || priceRange[1] < 500) && (
                    <button
                      onClick={() => setPriceRange([0, 500])}
                      className="flex items-center gap-1 px-3 py-1 bg-secondary text-sm rounded-full hover:bg-secondary/80 transition-colors"
                    >
                      {priceRange[0]}€ - {priceRange[1]}€
                      <X className="h-3 w-3" />
                    </button>
                  )}
                  <button
                    onClick={clearFilters}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
                  >
                    Tout effacer
                  </button>
                </div>
              )}

              {/* Loading */}
              {isLoadingProducts ? (
                <div className="text-center py-20">
                  <p className="text-muted-foreground">Chargement des parfums...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Filter className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Aucun parfum ne correspond à vos critères.
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    Réinitialiser les filtres
                  </Button>
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product, index) => {
                    const { image1, image2 } = getImages(product);
                    const price = getPrice(product);
                    const isNew = product.created_at
                      ? new Date(product.created_at).getTime() >
                        Date.now() - 30 * 24 * 60 * 60 * 1000
                      : false;

                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="group relative"
                      >
                        {/* Badges */}
                        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                          {isNew && (
                            <span className="flex items-center gap-1 px-2 py-1 bg-foreground text-background text-xs uppercase tracking-wider">
                              <Sparkles className="h-3 w-3" />
                              Nouveau
                            </span>
                          )}
                        </div>

                        {/* Quick Actions */}
                        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.preventDefault();
                              setQuickViewProduct(product);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8"
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>

                        <Link href={`/produit/${product.handle}`}>
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
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {filteredProducts.map((product, index) => {
                    const { image1 } = getImages(product);
                    const price = getPrice(product);

                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <div className="group flex gap-6 p-4 border border-border hover:border-foreground/20 transition-colors bg-card">
                          <Link
                            href={`/produit/${product.handle}`}
                            className="relative w-32 h-32 shrink-0 overflow-hidden"
                          >
                            <Image
                              src={image1}
                              alt={product.title}
                              fill
                              className="object-cover"
                            />
                          </Link>
                          <div className="flex-1 flex flex-col justify-center">
                            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                              {product.subtitle ||
                                product.collection?.title ||
                                "Parfum"}
                            </p>
                            <Link href={`/produit/${product.handle}`}>
                              <h3 className="font-serif text-xl text-foreground group-hover:text-accent transition-colors">
                                {product.title}
                              </h3>
                            </Link>
                            {product.description && (
                              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                {product.description}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end justify-between">
                            <span className="font-serif text-xl text-foreground">
                              {price.toFixed(2)} €
                            </span>
                            <div className="flex gap-2">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8"
                                onClick={() => setQuickViewProduct(product)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                  const variantId =
                                    product.variants?.[0]?.id;
                                  if (variantId) addItem(variantId, 1);
                                }}
                              >
                                <ShoppingBag className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <Dialog
        open={!!quickViewProduct}
        onOpenChange={() => setQuickViewProduct(null)}
      >
        <DialogContent className="max-w-3xl">
          {quickViewProduct && (() => {
            const { image1 } = getImages(quickViewProduct);
            const price = getPrice(quickViewProduct);

            return (
              <>
                <DialogHeader>
                  <DialogTitle className="font-serif text-2xl">
                    {quickViewProduct.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid md:grid-cols-2 gap-6 mt-4">
                  <div className="relative aspect-square overflow-hidden bg-secondary">
                    <Image
                      src={image1}
                      alt={quickViewProduct.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                      {quickViewProduct.subtitle ||
                        quickViewProduct.collection?.title ||
                        "Parfum"}
                    </p>
                    <span className="font-serif text-2xl text-foreground mb-4">
                      {price.toFixed(2)} €
                    </span>
                    {quickViewProduct.description && (
                      <p className="text-muted-foreground text-sm mb-6 line-clamp-3">
                        {quickViewProduct.description}
                      </p>
                    )}

                    <div className="flex gap-3 mt-auto">
                      <Button
                        className="flex-1 gap-2"
                        onClick={() => {
                          const variantId =
                            quickViewProduct.variants?.[0]?.id;
                          if (variantId) addItem(variantId, 1);
                          setQuickViewProduct(null);
                        }}
                      >
                        <ShoppingBag className="h-4 w-4" />
                        Ajouter au panier
                      </Button>
                      <Button variant="outline" size="icon">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    <Link
                      href={`/produit/${quickViewProduct.handle}`}
                      className="text-center text-sm text-muted-foreground hover:text-foreground mt-4 underline"
                    >
                      Voir tous les détails
                    </Link>
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </main>
  );
}
