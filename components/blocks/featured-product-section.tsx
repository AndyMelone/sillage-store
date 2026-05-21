"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

export function FeaturedProductSection() {
  return (
    <section className="bg-secondary py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative aspect-square overflow-hidden rounded-3xl lg:aspect-4/5"
          >
            <Image
              src="/images/featured-perfume.jpg"
              alt="Oud Mystique - Parfum vedette"
              fill
              className="object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:py-8"
          >
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Parfum Vedette
            </p>
            <h2 className="mb-6 font-serif text-3xl text-foreground sm:text-4xl md:text-5xl">
              Oud Mystique
            </h2>
            <p className="mb-8 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Un voyage olfactif vers les contrées orientales les plus
              précieuses. Oud Mystique célèbre la noblesse du bois d{"'"}oud,
              sublimé par des épices rares et des résines précieuses. Une
              création d{"'"}exception pour les connaisseurs qui laisse un
              sillage puissant et raffiné.
            </p>

            <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6">
              <div>
                <p className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
                  Notes de tête
                </p>
                <p className="text-sm text-foreground">Safran, Cannelle</p>
              </div>
              <div>
                <p className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
                  Notes de coeur
                </p>
                <p className="text-sm text-foreground">Oud royal, Jasmin</p>
              </div>
              <div>
                <p className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
                  Notes de fond
                </p>
                <p className="text-sm text-foreground">Ambre, Benjoin</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <span className="font-serif text-3xl text-foreground">
                245,00 XOF
              </span>
              <Button
                asChild
                size="lg"
                className="h-12 uppercase tracking-wider text-sm sm:h-14"
              >
                <Link href="/produit/oud-mystique">
                  Découvrir
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
