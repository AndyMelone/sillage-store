import { listCollections } from "@/lib/data/collections";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export async function CollectionsSection() {
  const { collections } = await listCollections();

  if (collections.length === 0) return null;

  return (
    <section className="py-20 bg-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
            Explorez par famille olfactive
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground">
            Nos Collections
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((collection) => {
            // Utiliser metadata.image si disponible, sinon un placeholder
            const imageUrl =
              (collection.metadata?.image as string) ||
              "/images/collection-placeholder.jpg";

            return (
              <Link
                key={collection.id}
                href={`/collections/${collection.handle}`}
                className="group block relative aspect-3/4 overflow-hidden"
              >
                <Image
                  src={imageUrl}
                  alt={collection.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <h3 className="font-serif text-2xl mb-1 group-hover:translate-x-2 transition-transform duration-300">
                    {collection.title}
                  </h3>
                  {(() => {
                    const desc = collection.metadata?.description as string | undefined;
                    return desc ? (
                      <p className="text-sm text-white/70 mb-3">{desc}</p>
                    ) : null;
                  })()}
                  <span className="inline-flex items-center text-xs uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Explorer
                    <ArrowRight className="ml-2 h-3 w-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
