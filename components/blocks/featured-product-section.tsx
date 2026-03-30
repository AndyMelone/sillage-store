"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

export function FeaturedProductSection() {
  return (
    <section className="py-20 bg-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative aspect-square lg:aspect-4/5"
          >
            <Image
              src="/images/featured-perfume.jpg"
              alt="Oud Mystique - Parfum vedette"
              fill
              className="object-cover"
            />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:py-8"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Parfum Vedette
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-6">
              Oud Mystique
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 text-lg">
              Un voyage olfactif vers les contrées orientales les plus
              précieuses. Oud Mystique célèbre la noblesse du bois d{"'"}oud,
              sublimé par des épices rares et des résines précieuses. Une
              création d{"'"}exception pour les connaisseurs qui laisse un
              sillage puissant et raffiné.
            </p>

            <div className="grid grid-cols-3 gap-6 mb-10">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  Notes de tête
                </p>
                <p className="text-sm text-foreground">Safran, Cannelle</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  Notes de coeur
                </p>
                <p className="text-sm text-foreground">Oud royal, Jasmin</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  Notes de fond
                </p>
                <p className="text-sm text-foreground">Ambre, Benjoin</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <span className="font-serif text-3xl text-foreground">
                245,00 €
              </span>
              <Button
                asChild
                size="lg"
                className="uppercase tracking-wider text-sm"
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
