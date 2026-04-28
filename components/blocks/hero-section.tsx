"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative flex min-h-150 items-center justify-center overflow-hidden pt-24 lg:pt-28">
      <div className="absolute inset-0">
        <Image
          src="/images/heros.png"
          alt="Collection de parfums de luxe"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-[10px] uppercase tracking-[0.35em] text-white/70 sm:mb-6 sm:text-xs"
        >
          La grande parfumerie à petit prix
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-serif text-4xl leading-tight tracking-wide text-white text-balance sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Découvrez Essence Parfums
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mx-auto mt-4 max-w-2xl text-base text-white/80 text-balance sm:mt-6 sm:text-lg"
        >
          Des fragrances d{"'"}exception inspirées des plus grandes maisons de
          parfumerie, à des prix accessibles.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 flex flex-col gap-3 justify-center sm:mt-10 sm:flex-row sm:gap-4"
        >
          <Button
            asChild
            size="lg"
            className="h-12 bg-white px-6 text-sm uppercase tracking-wider text-black hover:bg-white/90 sm:h-14 sm:px-8"
          >
            <Link href="/collections">
              Voir Collection
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 border-white/30 bg-white/10 px-6 text-sm uppercase tracking-wider text-white sm:h-14 sm:px-8"
          >
            <Link href="#best-sellers">Meilleures Ventes</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
