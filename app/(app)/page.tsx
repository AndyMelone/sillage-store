export const dynamic = "force-dynamic";

import { AboutSection } from "@/components/blocks/about-section";
import { BestSellersSection } from "@/components/blocks/bestSellers";
import { CollectionsSection } from "@/components/blocks/collections-section";
import { FeaturedProductSection } from "@/components/blocks/featured-product-section";
import { HeroSection } from "@/components/blocks/hero-section";
import { NewsletterSection } from "@/components/blocks/newsletter-section";
import { TestimonialsSection } from "@/components/blocks/testimonials-section";
import { ValuePropsSection } from "@/components/blocks/value-props-section";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="min-h-screen w-full bg-white dark:bg-black">
        <HeroSection />

        <ValuePropsSection />
        <BestSellersSection />
        <FeaturedProductSection />
        <div id="collections">
          <CollectionsSection />
        </div>
        <TestimonialsSection />
        <div id="about">
          <AboutSection />
        </div>
        <NewsletterSection />
      </main>
    </div>
  );
}
