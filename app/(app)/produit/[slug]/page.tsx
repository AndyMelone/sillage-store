import { getProductByHandle, listProducts } from "@/lib/data/products";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductActions } from "@/components/product-actions";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductGallery } from "@/components/ui/ProductGallery";
import { ProductInfoAccordion } from "@/components/ui/ProductInfoAccordion";
import type { HttpTypes } from "@medusajs/types";
import { ArrowLeft, Flame } from "lucide-react";

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

function getGalleryImages(product: HttpTypes.StoreProduct): string[] {
  const images = product.images?.map((img) => img.url).filter(Boolean) ?? [];
  if (images.length > 0) return images;
  return product.thumbnail ? [product.thumbnail] : [];
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
  const galleryImages = getGalleryImages(product);
  const notes = getNotesFromMetadata(product);
  const volume = getMetadata(product, "volume") || "100ml";
  const concentration =
    getMetadata(product, "concentration") || "Eau de Parfum";
  const defaultVariantId = product.variants?.[0]?.id || "";
  const inventoryQuantity = product.variants?.[0]?.inventory_quantity;
  const hasNotes =
    notes.top.length > 0 || notes.heart.length > 0 || notes.base.length > 0;

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

  const accordionItems = [
    {
      title: "Description",
      content: product.description || "Aucune description disponible.",
    },
    ...(hasNotes
      ? [
          {
            title: "Notes Olfactives",
            content: (
              <div className="grid grid-cols-3 gap-4">
                {notes.top.length > 0 && (
                  <div>
                    <p className="mb-1 text-xs uppercase tracking-wider text-foreground">
                      Tête
                    </p>
                    <p>{notes.top.join(", ")}</p>
                  </div>
                )}
                {notes.heart.length > 0 && (
                  <div>
                    <p className="mb-1 text-xs uppercase tracking-wider text-foreground">
                      Cœur
                    </p>
                    <p>{notes.heart.join(", ")}</p>
                  </div>
                )}
                {notes.base.length > 0 && (
                  <div>
                    <p className="mb-1 text-xs uppercase tracking-wider text-foreground">
                      Fond
                    </p>
                    <p>{notes.base.join(", ")}</p>
                  </div>
                )}
              </div>
            ),
          },
        ]
      : []),
    {
      title: "Détails",
      content: (
        <div className="flex gap-8">
          <div>
            <p className="mb-1 text-xs uppercase tracking-wider text-foreground">
              Volume
            </p>
            <p>{volume}</p>
          </div>
          <div>
            <p className="mb-1 text-xs uppercase tracking-wider text-foreground">
              Concentration
            </p>
            <p>{concentration}</p>
          </div>
        </div>
      ),
    },
  ];

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
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.06fr_1fr]">
          {/* Product Gallery */}
          <ProductGallery images={galleryImages} name={product.title} />

          {/* Product Info */}
          <div className="pt-1">
            <span className="inline-flex bg-secondary px-2 py-1 text-xs text-muted-foreground">
              {product.subtitle || product.collection?.title || "Parfum"}
            </span>
            <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight text-foreground">
              {product.title}
            </h1>
            {product.subtitle && (
              <p className="mt-1 text-2xl text-muted-foreground">
                {product.subtitle}
              </p>
            )}
            <p className="mt-4 font-heading text-5xl font-bold text-accent">
              {price.toLocaleString("fr-FR", {
                style: "currency",
                currency: "XOF",
                maximumFractionDigits: 0,
              })}
            </p>

            <ProductActions
              variantId={defaultVariantId}
              productId={product.id}
            />

            <div className="mt-6 flex items-center justify-center gap-2 bg-secondary px-4 py-3 text-base text-muted-foreground">
              <Flame className="h-4 w-4 text-accent" />
              <span>
                {typeof inventoryQuantity === "number"
                  ? inventoryQuantity > 0
                    ? `Plus que ${inventoryQuantity} en stock`
                    : "Rupture de stock"
                  : "En stock"}
              </span>
            </div>

            <ProductInfoAccordion items={accordionItems} />
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-20 border-t border-border">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground mb-12 text-center">
            Dans la même <span className="text-accent">collection</span>
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
