import { getProductByHandle, listProducts } from "@/lib/data/products";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductActions } from "@/components/product-actions";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductGallery } from "@/components/ui/ProductGallery";
import type { HttpTypes } from "@medusajs/types";
import { ArrowLeft } from "lucide-react";

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

function getMetadata(product: HttpTypes.StoreProduct, key: string): string {
  return (product.metadata?.[key] as string) || "";
}

function getNotesFromMetadata(product: HttpTypes.StoreProduct) {
  const parseNotes = (key: string): string[] => {
    const raw = getMetadata(product, key);
    if (!raw) return [];
    return raw
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean);
  };
  return {
    top: parseNotes("notes_top"),
    heart: parseNotes("notes_heart"),
    base: parseNotes("notes_base"),
  };
}

// ─── Metadata ───────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductByHandle(slug);

  if (!product) {
    return { title: "Produit non trouvé | Sillage" };
  }

  return {
    title: `${product.title} | Sillage Parfums`,
    description: product.description,
  };
}

// ─── Page ───────────────────────────────────────────────
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductByHandle(slug);

  if (!product) {
    notFound();
  }

  const price = getPrice(product);
  const { image1, image2 } = getImages(product);
  const notes = getNotesFromMetadata(product);
  const volume = getMetadata(product, "volume") || "100ml";
  const concentration =
    getMetadata(product, "concentration") || "Eau de Parfum";
  const defaultVariantId = product.variants?.[0]?.id || "";

  // Charger les produits de la même collection pour les suggestions
  let relatedProducts: HttpTypes.StoreProduct[] = [];
  if (product.collection_id) {
    const { response } = await listProducts({
      queryParams: {
        collection_id: [product.collection_id],
        limit: 5,
      },
    });
    relatedProducts = response.products
      .filter((p) => p.id !== product.id)
      .slice(0, 4);
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Back Link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 md:pt-28">
        <Link
          href="/parfums"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux parfums
        </Link>
      </div>

      {/* Product Details */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Product Gallery */}
          <ProductGallery
            image1={image1}
            image2={image2}
            name={product.title}
          />

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
              {product.subtitle || product.collection?.title || "Parfum"}
            </p>
            <h1 className="font-serif text-4xl md:text-5xl tracking-wide text-foreground mb-4">
              {product.title}
            </h1>
            <p className="text-2xl font-medium text-foreground mb-8">
              {price.toFixed(2)} XOF
            </p>

            {product.description && (
              <p className="text-muted-foreground leading-relaxed mb-8">
                {product.description}
              </p>
            )}

            {/* Notes */}
            {(notes.top.length > 0 ||
              notes.heart.length > 0 ||
              notes.base.length > 0) && (
              <div className="space-y-6 mb-10">
                <h3 className="font-serif text-lg tracking-wide text-foreground">
                  Notes Olfactives
                </h3>
                <div className="grid grid-cols-3 gap-4 sm:gap-6">
                  {notes.top.length > 0 && (
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                        Tête
                      </p>
                      <ul className="space-y-1">
                        {notes.top.map((note) => (
                          <li key={note} className="text-sm text-foreground">
                            {note}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {notes.heart.length > 0 && (
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                        Coeur
                      </p>
                      <ul className="space-y-1">
                        {notes.heart.map((note) => (
                          <li key={note} className="text-sm text-foreground">
                            {note}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {notes.base.length > 0 && (
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                        Fond
                      </p>
                      <ul className="space-y-1">
                        {notes.base.map((note) => (
                          <li key={note} className="text-sm text-foreground">
                            {note}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Product Details */}
            <div className="flex gap-8 mb-10 pb-10 border-b border-border">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  Volume
                </p>
                <p className="text-sm text-foreground">{volume}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  Concentration
                </p>
                <p className="text-sm text-foreground">{concentration}</p>
              </div>
            </div>

            {/* Add to Cart & Wishlist */}
            <ProductActions
              variantId={defaultVariantId}
              productId={product.id}
            />
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-20 border-t border-border">
          <h2 className="font-serif text-3xl tracking-wide text-foreground mb-12 text-center">
            Dans la même collection
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {relatedProducts.map((related) => {
              const rImages = getImages(related);
              return (
                <Link key={related.id} href={`/produit/${related.handle}`}>
                  <ProductCard
                    name={related.title}
                    price={getPrice(related)}
                    image1={rImages.image1}
                    image2={rImages.image2}
                    category={
                      related.subtitle || related.collection?.title || "Parfum"
                    }
                  />
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
