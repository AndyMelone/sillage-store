"use client";

import { motion } from "motion/react";

export function AboutSection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
            Notre Philosophie
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-8">
            Qu{"'"}est-ce qu{"'"}une inspiration de parfum ?
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            Une recréation haut de gamme inspirée des parfums de luxe. Nous
            utilisons les mêmes familles olfactives et ingrédients de qualité
            que les grandes maisons, pour vous offrir des fragrances
            exceptionnelles à des prix accessibles.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            <span className="text-foreground font-medium">
              La même qualité,
            </span>{" "}
            jusqu{"'"}à{" "}
            <span className="text-accent font-semibold">90% moins cher.</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-3 gap-8 mt-16"
        >
          <div>
            <p className="font-serif text-4xl md:text-5xl text-foreground mb-2">
              50+
            </p>
            <p className="text-sm text-muted-foreground uppercase tracking-wider">
              Fragrances
            </p>
          </div>
          <div>
            <p className="font-serif text-4xl md:text-5xl text-foreground mb-2">
              12h+
            </p>
            <p className="text-sm text-muted-foreground uppercase tracking-wider">
              De Tenue
            </p>
          </div>
          <div>
            <p className="font-serif text-4xl md:text-5xl text-foreground mb-2">
              10K+
            </p>
            <p className="text-sm text-muted-foreground uppercase tracking-wider">
              Clients Satisfaits
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
