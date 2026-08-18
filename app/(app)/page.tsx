import { AboutSection } from "@/components/blocks/about-section";
import { BestSellersSection } from "@/components/blocks/bestSellers";
import { BlogSection } from "@/components/blocks/blog-section";
import { HeroSection } from "@/components/blocks/hero-section";
import { TestimonialsSection } from "@/components/blocks/testimonials-section";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-background">
      <HeroSection />
      <BestSellersSection />
      <TestimonialsSection />
      <div id="about">
        <AboutSection />
      </div>
      <BlogSection />
    </div>
  );
}
