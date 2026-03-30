import { listCollections } from "@/lib/data/collections";
import { listProductsByCollectionId } from "@/lib/data/products";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function CollectionsPage() {
  const { collections } = await listCollections();

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-24 md:pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-secondary" />
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-accent" />
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Explorez nos univers olfactifs
            </p>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 text-balance">
            Nos Collections
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Chaque collection raconte une histoire unique, un voyage sensoriel
            à travers les plus belles matières premières de la parfumerie.
          </p>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid gap-16 lg:gap-24">
            {await Promise.all(
              collections.map(async (collection, index) => {
                const products = await listProductsByCollectionId(collection.id, 100);
                const productsCount = products.length;
                const isReversed = index % 2 === 1;
                const heroImage =
                  (collection.metadata?.heroImage as string) ||
                  (collection.metadata?.image as string) ||
                  "/images/collection-placeholder.jpg";
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

                return (
                  <div
                    key={collection.id}
                    className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                      isReversed ? "lg:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Image */}
                    <Link
                      href={`/collections/${collection.handle}`}
                      className={`group relative aspect-4/3 lg:aspect-3/4 overflow-hidden ${
                        isReversed ? "lg:order-2" : ""
                      }`}
                    >
                      <Image
                        src={heroImage}
                        alt={collection.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute inset-x-0 bottom-0 p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                        <span className="inline-flex items-center gap-2 text-white text-sm uppercase tracking-wider">
                          Découvrir la collection
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </Link>

                    {/* Content */}
                    <div className={`${isReversed ? "lg:order-1 lg:text-right" : ""}`}>
                      <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">
                        {productsCount} parfum{productsCount > 1 ? "s" : ""}
                      </p>
                      <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
                        {collection.title}
                      </h2>
                      {longDescription && (
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                          {longDescription}
                        </p>
                      )}

                      {/* Notes */}
                      {notes.length > 0 && (
                        <div className="mb-8">
                          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                            Notes signature
                          </p>
                          <div
                            className={`flex flex-wrap gap-2 ${isReversed ? "lg:justify-end" : ""}`}
                          >
                            {notes.slice(0, 4).map((note) => (
                              <span
                                key={note}
                                className="px-3 py-1 text-xs uppercase tracking-wider border border-border text-muted-foreground"
                              >
                                {note}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Characteristics */}
                      {characteristics.length > 0 && (
                        <div
                          className={`grid grid-cols-2 gap-4 mb-8 ${
                            isReversed
                              ? "lg:ml-auto lg:max-w-md"
                              : "lg:max-w-md"
                          }`}
                        >
                          {characteristics
                            .slice(0, 2)
                            .map(
                              (char: {
                                icon: string;
                                label: string;
                                value: string;
                              }) => (
                                <div
                                  key={char.label}
                                  className="text-center p-4 bg-secondary"
                                >
                                  <span className="text-2xl mb-2 block">
                                    {char.icon}
                                  </span>
                                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                                    {char.label}
                                  </p>
                                  <p className="text-sm font-medium text-foreground">
                                    {char.value}
                                  </p>
                                </div>
                              )
                            )}
                        </div>
                      )}

                      <Link
                        href={`/collections/${collection.handle}`}
                        className={`inline-flex items-center gap-3 group/link ${
                          isReversed ? "lg:flex-row-reverse" : ""
                        }`}
                      >
                        <span className="text-sm uppercase tracking-wider text-foreground group-hover/link:text-accent transition-colors">
                          Explorer la collection
                        </span>
                        <span
                          className={`w-12 h-px bg-foreground group-hover/link:bg-accent group-hover/link:w-16 transition-all ${
                            isReversed ? "order-first lg:order-last" : ""
                          }`}
                        />
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-4">
            Besoin d{"'"}aide pour choisir ?
          </h2>
          <p className="text-primary-foreground/70 mb-8 max-w-xl mx-auto">
            Notre guide olfactif vous accompagne pour trouver le parfum qui
            vous correspond parfaitement.
          </p>
          <Link
            href="/parfums"
            className="inline-flex items-center gap-2 px-8 py-4 bg-background text-foreground uppercase text-sm tracking-wider hover:bg-background/90 transition-colors"
          >
            Voir tous les parfums
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
