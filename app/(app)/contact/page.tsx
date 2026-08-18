"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";

const infoCards = [
  { icon: Mail, title: "Email", value: "contact@sillageparfums.com" },
  { icon: Phone, title: "Téléphone", value: "+221 78 175 73 73" },
  { icon: MapPin, title: "Adresse", value: "Dakar, Sénégal" },
];

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 md:pt-28 md:pb-24">
      <header className="text-center">
        <span className="inline-flex bg-secondary px-3 py-1 text-sm text-muted-foreground">
          Contact
        </span>
        <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-foreground md:text-5xl">
          Parlons-<span className="text-accent">en</span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground md:text-lg">
          Une question sur un parfum, une commande ou un partenariat ? Nous
          répondons généralement sous 24h.
        </p>
      </header>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {infoCards.map((card) => (
          <article key={card.title} className="bg-secondary p-6">
            <card.icon className="h-5 w-5 text-accent" />
            <h2 className="mt-3 text-lg font-semibold text-foreground">
              {card.title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{card.value}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <div className="bg-secondary p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-foreground">
            Envoyer un message
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Nous serions ravis d&apos;échanger avec vous.
          </p>

          {isSubmitted ? (
            <div className="mt-8 flex flex-col items-center justify-center gap-3 py-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Mail className="h-5 w-5" />
              </div>
              <p className="text-foreground">
                Merci, votre message a bien été envoyé !
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  name="name"
                  placeholder="Votre nom"
                  required
                  className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Adresse email"
                  required
                  className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
                />
              </div>
              <input
                type="text"
                name="subject"
                placeholder="Sujet"
                required
                className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
              />
              <textarea
                name="message"
                placeholder="Parlez-nous de votre demande..."
                rows={6}
                required
                className="w-full resize-y border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
              />
              <button
                type="submit"
                className="inline-flex bg-foreground px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-accent"
              >
                Envoyer le message
              </button>
            </form>
          )}
        </div>

        <div className="flex min-h-105 flex-col items-center justify-center gap-4 bg-secondary p-6">
          <div className="w-full border border-dashed border-border bg-background p-10 text-center">
            <p className="text-sm font-medium text-foreground">
              Horaires d&apos;ouverture
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Lun - Ven : 9h à 18h
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Sam : 10h à 14h
            </p>
            <p className="mt-6 text-xs text-muted-foreground">
              Pour toute demande urgente, ajoutez &quot;Urgent&quot; dans
              l&apos;objet de votre email.
            </p>
          </div>

          <div className="h-64 w-full overflow-hidden border border-border">
            <iframe
              title="Localisation de Parfumerie Sillage à Dakar"
              src="https://maps.google.com/maps?q=Parfumerie+Sillage+Dakar&output=embed"
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
