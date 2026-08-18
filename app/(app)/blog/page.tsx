import { blogPosts } from "@/lib/data/blog-posts";
import Image from "next/image";
import Link from "next/link";

const [featured, ...rest] = blogPosts;

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="bg-secondary pt-24 pb-12 md:pt-28 md:pb-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <span className="mb-4 inline-block bg-white px-4 py-1 text-sm text-muted-foreground">
            Blog
          </span>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Derniers <span className="text-accent">Articles</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground md:text-base">
            Idées et conseils pratiques autour du parfum, des matières
            premières et de la parfumerie moderne.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Link
            href={`/blog/${featured.slug}`}
            className="group grid overflow-hidden bg-secondary md:grid-cols-[1.1fr_1fr]"
          >
            <div className="relative h-72 w-full overflow-hidden md:h-full md:min-h-105">
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col justify-center p-6 md:p-10">
              {featured.isNew && (
                <span className="mb-4 inline-flex w-fit bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
                  Nouveau
                </span>
              )}
              <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
                {featured.date} <span className="mx-1">•</span>{" "}
                {featured.readTime}
              </p>
              <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-accent md:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-4 text-sm text-muted-foreground md:text-base">
                {featured.excerpt}
              </p>
            </div>
          </Link>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 flex items-baseline justify-between">
            <h3 className="font-heading text-xl font-bold tracking-tight text-foreground md:text-2xl">
              Plus d&apos;Articles
            </h3>
            <span className="text-sm text-muted-foreground">
              {blogPosts.length} articles
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group overflow-hidden bg-secondary block"
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                    {post.date} <span className="mx-1">•</span> {post.readTime}
                  </p>
                  <h4 className="text-base font-bold text-foreground transition-colors group-hover:text-accent">
                    {post.title}
                  </h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
