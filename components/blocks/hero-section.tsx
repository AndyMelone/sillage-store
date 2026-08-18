import { listCollections } from "@/lib/data/collections";
import Image from "next/image";
import Link from "next/link";

export async function HeroSection() {
  const { collections } = await listCollections().catch(() => ({
    collections: [] as Awaited<ReturnType<typeof listCollections>>["collections"],
  }));

  const categories = collections.slice(0, 4);

  return (
    <section className="mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 md:pt-28 md:pb-24">
      <div className="mb-4 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="font-heading text-4xl leading-tight font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
          Découvrez <span className="text-accent">Essence</span>
          <br />
          Parfums.
        </h1>
      </div>
      <p className="mx-auto mb-12 max-w-md text-center text-sm text-muted-foreground md:mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
        Des fragrances d&apos;exception inspirées des plus grandes maisons de
        parfumerie, à des prix accessibles.
      </p>

      {categories.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          {categories.map((collection) => {
            const metadataImage = collection.metadata?.image as
              | string
              | undefined;
            const imageUrl =
              metadataImage ||
              (collection.products?.[0]?.thumbnail as string) ||
              "/placeholders/sillage.png";
            const count = collection.products?.length ?? 0;

            return (
              <Link
                key={collection.id}
                href={`/collections/${collection.handle}`}
                className="group relative block overflow-hidden bg-card"
              >
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={collection.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-foreground/70 to-transparent p-5 transition-all duration-300 group-hover:from-accent/90">
                  <h3 className="text-base font-semibold text-primary-foreground">
                    {collection.title}
                  </h3>
                  <p className="text-xs text-primary-foreground/70">
                    {count} parfum{count > 1 ? "s" : ""}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
