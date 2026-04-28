"use client";

import { motion } from "motion/react";

export function AboutSection() {
  return (
    <section className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Notre Philosophie
          </p>
          <h2 className="mb-8 font-serif text-3xl text-foreground sm:text-4xl md:text-5xl">
            Qu{"'"}est-ce qu{"'"}une inspiration de parfum ?
          </h2>
          <p className="mb-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Une recréation haut de gamme inspirée des parfums de luxe. Nous
            utilisons les mêmes familles olfactives et ingrédients de qualité
            que les grandes maisons, pour vous offrir des fragrances
            exceptionnelles à des prix accessibles.
          </p>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            <span className=" font-medium">La même qualité,</span> jusqu{"'"}à{" "}
            <span className=" font-semibold">90% moins cher.</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:mt-16"
        >
          <div>
            <p className="mb-2 font-serif text-4xl text-foreground md:text-5xl">
              50+
            </p>
            <p className="text-sm uppercase tracking-wider text-muted-foreground">
              Fragrances
            </p>
          </div>
          <div>
            <p className="mb-2 font-serif text-4xl text-foreground md:text-5xl">
              12h+
            </p>
            <p className="text-sm uppercase tracking-wider text-muted-foreground">
              De Tenue
            </p>
          </div>
          <div>
            <p className="mb-2 font-serif text-4xl text-foreground md:text-5xl">
              10K+
            </p>
            <p className="text-sm uppercase tracking-wider text-muted-foreground">
              Clients Satisfaits
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
