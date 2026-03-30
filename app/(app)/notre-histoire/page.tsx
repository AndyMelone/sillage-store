import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotreHistoirePage() {
  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      {/* Hero Section - 50/50 Split */}
      <section className="flex flex-col lg:flex-row min-h-[90vh]">
        <div className="w-full lg:w-1/2 relative h-[50vh] lg:h-auto">
          <Image
            src="/images/histoire/hero-lab.png"
            alt="Laboratoire artisanal Sillage"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-16 lg:py-0">
          <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-6 block">
            Notre Mission
          </span>
          <h1 className="font-serif text-4xl md:text-6xl tracking-tight text-foreground mb-8 leading-[1.1]">
            La haute parfumerie, <br />
            <span className="italic opacity-80">enfin accessible.</span>
          </h1>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed max-w-xl">
            <p>
              Chez <strong className="text-foreground font-medium">Sillage Parfums</strong>, notre objectif est de rendre la parfumerie <strong className="text-foreground font-medium">accessible à tous</strong>, y compris l'expérience de la parfumerie de niche, trop souvent réservée à une minorité.
            </p>
            <p>
              C'est pourquoi nous avons fait le choix de créer uniquement des inspirations de <strong className="text-foreground font-medium">parfums de niche</strong> et de collections privées. Sillage Parfums démocratise la niche en vous faisant payer <strong className="text-foreground font-medium italic">le jus, pas la marque.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy Section - Centered */}
      <section className="py-24 md:py-40 px-6 bg-white border-y border-border/40">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-8 block">
            Nos Valeurs
          </span>
          <h2 className="font-serif text-3xl md:text-5xl tracking-tight text-foreground mb-12">
            Ce que nous défendons
          </h2>
          <div className="space-y-10 text-xl text-muted-foreground leading-relaxed italic">
            <p>
              "Pour y parvenir, nous investissons dans ce qui compte vraiment : des <strong className="text-foreground font-medium not-italic underline decoration-primary/30 underline-offset-4">huiles et matières premières de haute qualité</strong>."
            </p>
            <p>
              Nous travaillons avec des laboratoires et fournisseurs exigeants afin de créer des inspirations de grands parfums avec une <strong className="text-foreground font-medium not-italic">ressemblance extrême</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Ingredients Section - Reverse 50/50 Split */}
      <section className="flex flex-col lg:flex-row-reverse min-h-[80vh]">
        <div className="w-full lg:w-1/2 relative h-[50vh] lg:h-auto">
          <Image
            src="/images/histoire/ingredients.png"
            alt="Ingrédients botaniques précieux"
            fill
            className="object-cover"
          />
        </div>
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-16 lg:py-0 bg-[#FAFAFA]">
          <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-6 block">
            La Qualité
          </span>
          <h2 className="font-serif text-3xl md:text-5xl tracking-tight text-foreground mb-8">
            L'excellence du sillage.
          </h2>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed max-w-xl">
            <p>
              Nous avons fait le choix de ne proposer que des <strong className="text-foreground font-medium">extrait de parfum</strong>, pour que chaque création soit plus dense, avec un beau sillage et une <strong className="text-foreground font-medium">excellente tenue</strong>.
            </p>
            <p>
              Sillage Parfums, c'est l'élégance et le caractère de la niche, enfin rendus accessibles, pour que vous puissiez porter des parfums qui vous ressemblent.
            </p>
            <div className="pt-8">
              <Link 
                href="/parfums" 
                className="inline-flex items-center gap-2 text-foreground font-medium group border-b border-foreground/20 pb-1 hover:border-foreground transition-all"
              >
                Découvrir la collection
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-32 px-6 bg-black text-white text-center">
        <h3 className="font-serif text-3xl md:text-5xl mb-8 opacity-90">
          Prêt à trouver votre sillage ?
        </h3>
        <Link 
          href="/parfums"
          className="inline-block bg-white text-black px-12 py-4 rounded-full font-medium hover:bg-white/90 transition-colors uppercase tracking-widest text-xs"
        >
          Parcourir la boutique
        </Link>
      </section>
    </div>
  );
}

