"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

export interface FaqItem {
  question: string;
  answer: string;
}

const defaultFaqs: FaqItem[] = [
  {
    question: "Quels types de parfums proposez-vous ?",
    answer:
      "Nous proposons une sélection curatée d'inspirations de parfums de niche, avec un accent fort sur la qualité des matières premières et la ressemblance olfactive.",
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
      "Vous pouvez nous contacter via notre page de contact, par email ou directement par WhatsApp. Nous répondons généralement sous 24h.",
  },
];

export function FaqSection({
  faqs = defaultFaqs,
  id,
}: {
  faqs?: FaqItem[];
  id?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id={id} className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 scroll-mt-24">
      <div className="text-center">
        <span className="inline-flex bg-white px-3 py-1 text-sm text-muted-foreground">
          FAQ
        </span>
        <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-foreground md:text-5xl">
          Questions <span className="text-accent">Fréquentes</span>
        </h2>
        <p className="mt-3 text-sm text-muted-foreground md:text-lg">
          Les réponses aux questions les plus courantes sur nos produits, la
          livraison et le support.
        </p>
      </div>

      <div className="mt-10 space-y-1.5">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <article key={faq.question} className="bg-secondary">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between px-4 py-4 text-left md:px-5"
              >
                <span className="text-base font-medium text-foreground md:text-xl">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-accent transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden px-4 transition-all duration-300 md:px-5 ${
                  isOpen ? "max-h-40 pb-4 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="max-w-5xl text-sm leading-relaxed text-muted-foreground md:text-base">
                  {faq.answer}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
