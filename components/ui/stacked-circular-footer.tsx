import { Facebook, Instagram } from "lucide-react";
import { TikTok_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const quickLinks = [
  { href: "/", label: "Accueil" },
  { href: "/parfums", label: "Parfums" },
  { href: "/collections", label: "Collections" },
  { href: "/notre-histoire", label: "Notre Histoire" },
  { href: "/blog", label: "Blog" },
  { href: "/compte", label: "Mon Compte" },
];

const supportLinks = [
  { href: "/notre-histoire#faq", label: "Livraison" },
  { href: "/notre-histoire#faq", label: "Retours" },
  { href: "/notre-histoire#faq", label: "FAQ" },
  { href: "/auth", label: "Contact" },
];

export function StackedCircularFooter() {
  return (
    <footer className="border-t border-border bg-[#EDEDED]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <Link href="/" className="inline-flex items-center">
            <Image
              src="/logo/sillage.webp"
              alt="Sillage"
              width={300}
              height={100}
              className="h-10 w-auto object-contain"
            />
          </Link>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Des fragrances d&apos;exception inspirées des plus grandes maisons
            de parfumerie, à des prix accessibles.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <SocialIcon
              icon={<Instagram className="h-4 w-4" />}
              href="https://www.instagram.com/sillageparfumerie/?hl=fr "
            />
            <SocialIcon
              icon={<Facebook className="h-4 w-4" />}
              href="https://www.facebook.com/sillage.sn?locale=fr_FR"
            />
          </div>
        </div>

        <FooterColumn title="Liens Rapides" links={quickLinks} />
        <FooterColumn title="Assistance" links={supportLinks} />

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            Contact
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>contact@sillageparfums.com</li>
            <li>+221 78 175 73 73</li>
            <li>Dakar, Sénégal</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Sillage Parfumerie. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <Link href="/confidentialite" className="hover:text-accent">
              Confidentialité
            </Link>
            <Link href="/mentions-legales" className="hover:text-accent">
              Mentions légales
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
        {title}
      </h3>
      <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex h-9 w-9 items-center justify-center bg-white text-foreground transition-colors hover:bg-accent hover:text-white"
    >
      {icon}
    </Link>
  );
}
