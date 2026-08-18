import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FaqSection } from "@/components/blocks/faq-section";

const stats = [
  { value: "50+", label: "Fragrances" },
  { value: "12h+", label: "De Tenue" },
  { value: "10K+", label: "Clients Satisfaits" },
  { value: "4.9/5", label: "Avis Clients" },
];

const faqs = [
  {
    question: "Quels types de parfums proposez-vous ?",
    answer:
      "Nous proposons une sélection curatée d'inspirations de parfums de niche, avec un accent fort sur la qualité des matières premières et la ressemblance olfactive. Chaque création est choisie pour correspondre à nos standards d'exigence.",
  },
  {
    question: "Livrez-vous partout au Sénégal et à l'international ?",
    answer:
      "Oui, nous livrons à Dakar et dans le reste du Sénégal. Les options et frais de livraison sont calculés au moment du paiement selon votre localisation.",
  },
  {
    question: "Combien de temps prend la livraison ?",
    answer:
      "La livraison standard prend généralement 24 à 48h à Dakar, et jusqu'à quelques jours supplémentaires pour les autres régions.",
  },
  {
    question: "Puis-je retourner un produit ?",
    answer:
      "Oui, vous pouvez demander un retour dans les 14 jours suivant la livraison si le produit est inutilisé et dans son état d'origine.",
  },
  {
    question: "Comment puis-je vous contacter ?",
    answer:
      "Vous pouvez nous contacter via notre page de connexion/contact ou directement par WhatsApp. Nous répondons généralement sous 24h.",
  },
];

export default function NotreHistoirePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - 50/50 Split */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="flex flex-col lg:flex-row lg:min-h-150">
          <div className="w-full lg:w-1/2 relative h-[50vh] lg:h-auto">
            <Image
              src="/images/histoire/Parfum-histoire.jpg"
              alt="Laboratoire artisanal Sillage"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="w-full lg:w-1/2 flex flex-col justify-center px-0 py-10 lg:px-16 lg:py-0">
            <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-6 block">
              Notre Mission
            </span>
            <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-8 leading-[1.1]">
              La haute parfumerie, <br />
              <span className="text-accent">enfin accessible.</span>
            </h1>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed max-w-xl">
              <p>
                Chez{" "}
                <strong className="text-foreground font-medium">
                  Sillage Parfums
                </strong>
                , notre objectif est de rendre la parfumerie{" "}
                <strong className="text-foreground font-medium">
                  accessible à tous
                </strong>
                , y compris {"l'"}expérience de la parfumerie de niche, trop
                souvent réservée à une minorité.
              </p>
              <p>
                {
                  "C'est pourquoi nous avons fait le choix de créer uniquement des inspirations de"
                }{" "}
                <strong className="text-foreground font-medium">
                  parfums de niche
                </strong>{" "}
                et de collections privées. Sillage Parfums démocratise la niche
                en vous faisant payer{" "}
                <strong className="text-foreground font-medium">
                  le jus, pas la marque.
                </strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section - Centered */}
      <section className="py-24 md:py-40 px-4 sm:px-6 bg-background border-y border-border/40">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-8 block">
            Nos Valeurs
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-12">
            Ce que nous <span className="text-accent">défendons</span>
          </h2>
          <div className="space-y-10 text-xl text-muted-foreground leading-relaxed">
            <p>
              {'"'}Pour y parvenir, nous investissons dans ce qui compte
              vraiment : des{" "}
              <strong className="text-foreground font-medium underline decoration-accent/40 underline-offset-4">
                huiles et matières premières de haute qualité
              </strong>
              .{'"'}
            </p>
            <p>
              Nous travaillons avec des laboratoires et fournisseurs exigeants
              afin de créer des inspirations de grands parfums avec une{" "}
              <strong className="text-foreground font-medium">
                ressemblance extrême
              </strong>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Ingredients Section - Reverse 50/50 Split */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="flex flex-col lg:flex-row-reverse lg:min-h-125">
          <div className="w-full lg:w-1/2 relative h-[50vh] lg:h-auto">
            <Image
              src="/images/histoire/ingredients.png"
              alt="Ingrédients botaniques précieux"
              fill
              className="object-cover"
            />
          </div>
          <div className="w-full lg:w-1/2 flex flex-col justify-center px-0 py-10 lg:px-16 lg:py-0 bg-secondary">
            <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-6 block">
              La Qualité
            </span>
            <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-8">
              {"L'excellence du "}
              <span className="text-accent">sillage.</span>
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed max-w-xl">
              <p>
                Nous avons fait le choix de ne proposer que des{" "}
                <strong className="text-foreground font-medium">
                  extrait de parfum
                </strong>
                , pour que chaque création soit plus dense, avec un beau sillage
                et une{" "}
                <strong className="text-foreground font-medium">
                  excellente tenue
                </strong>
                .
              </p>
              <p>
                {
                  "Sillage Parfums, c'est l'élégance et le caractère de la niche, enfin rendus accessibles, pour que vous puissiez porter des parfums qui vous ressemblent."
                }
              </p>
              <div className="pt-8">
                <Link
                  href="/parfums"
                  className="inline-flex items-center gap-2 text-foreground font-medium group border-b border-foreground/20 pb-1 hover:border-accent hover:text-accent transition-all"
                >
                  Découvrir la collection
                  <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-background py-16 px-4 sm:px-6 md:py-24 border-b border-border/40">
        <div className="max-w-5xl mx-auto grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-secondary p-6 text-center">
              <p className="font-heading text-3xl font-bold text-accent">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <FaqSection faqs={faqs} id="faq" />

      {/* Bottom CTA */}
      <section className="py-32 px-6 bg-black text-white text-center">
        <h3 className="font-heading text-3xl md:text-5xl font-bold mb-8 opacity-90">
          Prêt à trouver votre sillage ?
        </h3>
        <Link
          href="/parfums"
          className="inline-block bg-accent text-accent-foreground px-12 py-4 font-medium hover:bg-white hover:text-black transition-colors uppercase tracking-widest text-xs"
        >
          Parcourir la boutique
        </Link>
      </section>
    </div>
  );
}
