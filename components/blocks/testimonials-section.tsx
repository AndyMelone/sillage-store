"use client";

import { Quote, Star } from "lucide-react";
import { motion } from "motion/react";

const testimonials = [
  {
    quote:
      "Bluffée! L'odeur est identique à l'original et tient toute la journée. Je reçois des compliments à chaque fois que je le porte.",
    author: "Mélanie D.",
    product: "Noir Absolu",
    rating: 5,
  },
  {
    quote:
      "Ce parfum est incroyable ! L'odeur est riche, boisée et légèrement épicée. La tenue est excellente. Franchement, pour ce prix, c'est un vrai coup de cœur.",
    author: "Lionel M.",
    product: "Oud Mystique",
    rating: 4,
  },
  {
    quote:
      "J'ai déjà racheté plusieurs parfums tellement ils sont réussis ! La qualité est top, l'odeur est fidèle avec une grosse tenue et un gros sillage.",
    author: "Sophie L.",
    product: "Rose Éternelle",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center sm:mb-14"
        >
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Témoignages
          </p>
          <h2 className="font-serif text-3xl text-foreground sm:text-4xl md:text-5xl">
            Laissons nos clients parler
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative border border-border bg-card p-6 sm:p-8"
            >
              <Quote className="absolute right-5 top-5 h-8 w-8 text-muted-foreground/30" />

              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    color="black"
                    className="h-4 w-4 fill-accent text-accent"
                  />
                ))}
              </div>

              <p className="mb-6 italic leading-relaxed text-foreground">
                {`"${testimonial.quote}"`}
              </p>

              <div>
                <p className="font-medium text-foreground">
                  {testimonial.author}
                </p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.product}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
