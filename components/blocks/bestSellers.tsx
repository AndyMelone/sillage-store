import { ProductCard } from "@/components/ui/ProductCard";
import { listProducts } from "@/lib/data/products";
import { HttpTypes } from "@medusajs/types";
import Link from "next/link";

function getProductPrice(product: HttpTypes.StoreProduct): number {
  const variant = product.variants?.[0];
  if (variant?.calculated_price?.calculated_amount) {
    return variant.calculated_price.calculated_amount / 100;
  }
  return 0;
}

function getProductImages(product: HttpTypes.StoreProduct) {
  const images = product.images || [];
  return {
    image1: product.thumbnail || images[0]?.url || "/placeholders/sillage.png",
    image2: images[1]?.url || product.thumbnail || "/placeholders/sillage.webp",
  };
}

export async function BestSellersSection() {
  const { response } = await listProducts({
    pageParam: 1,
    queryParams: { limit: 3 },
  }).catch(() => ({ response: { products: [], count: 0 }, nextPage: null }));

  const products = response.products;

  if (products.length === 0) return null;

  return (
    <section id="best-sellers" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
            Les plus populaires
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground">
            Meilleures Ventes
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 lg:gap-10">
          {products.map((product) => {
            const { image1, image2 } = getProductImages(product);
            return (
              <Link key={product.id} href={`/produit/${product.handle}`}>
                <ProductCard
                  name={product.title}
                  price={getProductPrice(product)}
                  image1={image1}
                  image2={image2}
                  variantId={product.variants?.[0]?.id}
                  category={
                    product.subtitle || product.collection?.title || "Parfum"
                  }
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
