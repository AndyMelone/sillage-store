"use client";

import { Droplets, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

const stats = [
  { value: "50+", label: "Fragrances" },
  { value: "12h+", label: "De Tenue" },
  { value: "10K+", label: "Clients Satisfaits" },
  { value: "4.9/5", label: "Avis Clients" },
];

export function AboutSection() {
  return (
    <section className="bg-secondary py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <span className="mb-4 inline-block bg-white px-4 py-1 text-sm text-muted-foreground">
            Notre Philosophie
          </span>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            En Savoir Plus <span className="text-accent">Sur Nous</span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            Découvrez notre histoire, nos valeurs et notre vision de la
            parfumerie.
          </p>
        </motion.div>

        <div className="mb-0 grid grid-cols-1 gap-0 overflow-hidden bg-background md:grid-cols-2">
          <div className="relative min-h-96 w-full md:h-full">
            <Image
              src="/images/histoire/ingredients.png"
              alt="Ingrédients et flacon Sillage"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col divide-y divide-border">
            <div className="flex flex-col gap-2 p-6 md:p-8">
              <Droplets className="h-6 w-6 text-accent" />
              <h3 className="text-lg font-bold text-foreground">
                Ingrédients de Qualité
              </h3>
              <p className="text-sm text-muted-foreground">
                Nous utilisons les mêmes familles olfactives et ingrédients
                que les grandes maisons de parfumerie.
              </p>
            </div>
            <div className="flex flex-col gap-2 p-6 md:p-8">
              <Sparkles className="h-6 w-6 text-accent" />
              <h3 className="text-lg font-bold text-foreground">
                Sélection Exigeante
              </h3>
              <p className="text-sm text-muted-foreground">
                Une gamme de fragrances pensée pour un usage quotidien et une
                tenue longue durée.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-background p-5">
              <p className="font-heading text-2xl font-bold text-accent">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/notre-histoire"
            className="inline-flex items-center border border-foreground px-6 py-3 text-sm font-medium uppercase tracking-wider text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            Notre Histoire
          </Link>
        </div>
      </div>
    </section>
  );
}
