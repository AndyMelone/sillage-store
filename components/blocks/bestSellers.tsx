import {
  PopularProductsGrid,
  type PopularProduct,
} from "@/components/blocks/popular-products-grid";
import { listProducts } from "@/lib/data/products";
import { HttpTypes } from "@medusajs/types";

const THIRTY_DAYS_AGO = Date.now() - 30 * 24 * 60 * 60 * 1000;

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
    queryParams: { limit: 9 },
  }).catch(() => ({ response: { products: [], count: 0 }, nextPage: null }));

  const products = response.products;

  if (products.length === 0) return null;

  const items: PopularProduct[] = products.map((product) => {
    const { image1, image2 } = getProductImages(product);
    return {
      id: product.id,
      handle: product.handle ?? product.id,
      name: product.title,
      price: getProductPrice(product),
      image1,
      image2,
      category: product.subtitle || product.collection?.title || "Parfum",
      isNew: product.created_at
        ? new Date(product.created_at).getTime() > THIRTY_DAYS_AGO
        : false,
    };
  });

  return (
    <section id="best-sellers" className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="mb-6 text-center text-sm text-muted-foreground">
          <span className="bg-secondary p-2">Produits Populaires</span>
        </p>
        <h2 className="mb-4 text-center font-heading text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl">
          Découvrez Nos <span className="text-accent">Meilleures</span>
          <br />
          <span className="text-accent">Ventes</span>.
        </h2>
        <p className="mx-auto mb-10 max-w-md text-center text-sm text-muted-foreground">
          Des fragrances d&apos;exception, sélectionnées pour vous.
        </p>

        <PopularProductsGrid products={items} />
      </div>
    </section>
  );
}
