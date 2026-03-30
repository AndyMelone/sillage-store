import { HttpTypes } from "@medusajs/types";
import { listProducts } from "@/lib/data/products";
import { ProductCard } from "@/components/ui/ProductCard";
import Link from "next/link";

// ─── Helper : extraire le prix calculé d'un produit ─────
function getProductPrice(product: HttpTypes.StoreProduct): number {
  const variant = product.variants?.[0];
  if (variant?.calculated_price?.calculated_amount) {
    return variant.calculated_price.calculated_amount;
  }
  return 0;
}

// ─── Helper : extraire les images ───────────────────────
function getProductImages(product: HttpTypes.StoreProduct) {
  const images = product.images || [];
  return {
    image1: product.thumbnail || images[0]?.url || "/images/placeholder.jpg",
    image2: images[1]?.url || product.thumbnail || "/images/placeholder.jpg",
  };
}

export async function BestSellersSection() {
  // Charger les 6 premiers produits depuis Medusa
  const { response } = await listProducts({
    pageParam: 1,
    queryParams: { limit: 6 },
  });

  const products = response.products;

  if (products.length === 0) return null;

  return (
    <section id="best-sellers" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
            Les plus populaires
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground">
            Meilleures Ventes
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {products.map((product) => {
            const { image1, image2 } = getProductImages(product);
            return (
              <Link key={product.id} href={`/produit/${product.handle}`}>
                <ProductCard
                  name={product.title}
                  price={getProductPrice(product)}
                  image1={image1}
                  image2={image2}
                  category={product.subtitle || product.collection?.title || "Parfum"}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
