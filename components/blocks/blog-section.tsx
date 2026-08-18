import { blogPosts } from "@/lib/data/blog-posts";
import Image from "next/image";
import Link from "next/link";

export function BlogSection() {
  const posts = blogPosts.slice(0, 3);

  return (
    <section className="bg-secondary py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <span className="mb-4 inline-block bg-white px-4 py-1 text-sm text-muted-foreground">
            Blog
          </span>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Découvrez notre <span className="text-accent">blog</span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            Conseils, histoires et inspirations autour de la parfumerie.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block overflow-hidden bg-background"
            >
              <div className="relative h-56 w-full overflow-hidden md:h-64">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="text-base font-bold text-foreground transition-colors group-hover:text-accent">
                  {post.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-accent"
          >
            Voir Plus d&apos;Articles
          </Link>
        </div>
      </div>
    </section>
  );
}
