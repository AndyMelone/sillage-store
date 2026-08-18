import { Star } from "lucide-react";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  rating: number;
}

const rowOne: Testimonial[] = [
  {
    quote:
      "Bluffée ! L'odeur est identique à l'original et tient toute la journée. Je reçois des compliments à chaque fois que je le porte.",
    author: "Mélanie Diop",
    role: "Cliente fidèle",
    rating: 5,
  },
  {
    quote:
      "Ce parfum est incroyable, riche, boisé et légèrement épicé. La tenue est excellente. Pour ce prix, c'est un vrai coup de cœur.",
    author: "Lionel Mendy",
    role: "Client",
    rating: 5,
  },
  {
    quote:
      "J'ai déjà racheté plusieurs parfums tellement ils sont réussis. La qualité est top, avec une grosse tenue et un beau sillage.",
    author: "Sophie Lam",
    role: "Cliente",
    rating: 5,
  },
  {
    quote:
      "Un vrai coup de cœur pour toute la famille. On sent que les matières premières utilisées sont de qualité.",
    author: "Ousmane Diallo",
    role: "Client",
    rating: 5,
  },
  {
    quote:
      "Commande reçue rapidement, très bien emballée. Le parfum est exactement à la hauteur de la description.",
    author: "Fatou Ndiaye",
    role: "Cliente",
    rating: 5,
  },
  {
    quote:
      "Je suis devenue fidèle à la marque après mon premier achat. Le sillage est vraiment impressionnant.",
    author: "Bineta Sarr",
    role: "Cliente",
    rating: 5,
  },
];

const rowTwo: Testimonial[] = [
  {
    quote:
      "Livraison rapide et flacon superbe. On sent que la qualité est au rendez-vous, exactement comme annoncé.",
    author: "Awa Fall",
    role: "Cliente",
    rating: 5,
  },
  {
    quote:
      "Le rapport qualité-prix est imbattable. Le sillage dure vraiment toute la journée, je recommande vivement.",
    author: "Karim Sy",
    role: "Client",
    rating: 5,
  },
  {
    quote:
      "Service client au top et parfum à la hauteur de mes attentes. Je commande régulièrement depuis un an.",
    author: "Nadia Ba",
    role: "Cliente",
    rating: 5,
  },
  {
    quote:
      "Les fragrances sont d'une justesse incroyable. Difficile de faire la différence avec l'original.",
    author: "Moussa Kane",
    role: "Client",
    rating: 5,
  },
  {
    quote:
      "Très satisfaite de mon coffret découverte, les échantillons m'ont permis de trouver mon parfum signature.",
    author: "Aissatou Diagne",
    role: "Cliente",
    rating: 5,
  },
  {
    quote:
      "Un service sérieux du début à la fin, et un parfum qui tient vraiment ses promesses sur la durée.",
    author: "Cheikh Gueye",
    role: "Client",
    rating: 5,
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="mr-4 w-80 shrink-0 border border-border bg-background p-5">
      <div className="mb-3 flex gap-0.5">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-accent text-accent" />
        ))}
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {testimonial.quote}
      </p>
      <div className="mt-5 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground">
          {initials(testimonial.author)}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            {testimonial.author}
          </p>
          <p className="text-xs text-muted-foreground">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({
  testimonials,
  direction,
}: {
  testimonials: Testimonial[];
  direction: "left" | "right";
}) {
  const items = [...testimonials, ...testimonials];
  return (
    <div className="group/row overflow-hidden">
      <div
        className={`flex w-max [@media(hover:hover)]:group-hover/row:paused ${
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
        }`}
      >
        {items.map((testimonial, i) => (
          <TestimonialCard key={`${testimonial.author}-${i}`} testimonial={testimonial} />
        ))}
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="overflow-hidden bg-secondary py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="mb-6 text-center text-sm text-muted-foreground">
          <span className="bg-white p-2">Témoignages</span>
        </p>
        <h2 className="mb-10 text-center font-heading text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl">
          Ce que disent nos <span className="text-accent">clients</span>
        </h2>
      </div>

      <div className="space-y-4">
        <MarqueeRow testimonials={rowOne} direction="left" />
        <MarqueeRow testimonials={rowTwo} direction="right" />
      </div>
    </section>
  );
}
