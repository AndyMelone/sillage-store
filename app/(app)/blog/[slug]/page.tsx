import { blogPosts, getBlogPostBySlug } from "@/lib/data/blog-posts";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: "Article non trouvé | Sillage" };
  return {
    title: `${post.title} | Sillage Parfums`,
    description: post.excerpt,
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background pt-24 md:pt-28">
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 md:py-20">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au Blog
        </Link>

        <header className="mt-4 border-b border-border pb-6">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {post.date} <span className="mx-1">•</span> {post.readTime}{" "}
            <span className="mx-1">•</span> {post.author}
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-3 text-base text-muted-foreground md:text-lg">
            {post.excerpt}
          </p>
        </header>

        <div className="relative mt-6 h-70 w-full overflow-hidden md:h-105">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <article className="mt-8 space-y-5">
          {post.content.map((paragraph, i) => (
            <p
              key={i}
              className="text-base leading-relaxed text-muted-foreground md:text-lg"
            >
              {paragraph}
            </p>
          ))}
        </article>
      </div>

      <section className="border-t border-border bg-secondary py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="mb-8 font-heading text-xl font-bold tracking-tight text-foreground md:text-2xl">
            À lire aussi
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {blogPosts
              .filter((p) => p.slug !== post.slug)
              .slice(0, 3)
              .map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group block overflow-hidden bg-background"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={related.image}
                      alt={related.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-bold text-foreground transition-colors group-hover:text-accent">
                      {related.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {related.excerpt}
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
