"use client";

import { Facebook, Instagram, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function StackedCircularFooter() {
  return (
    <footer className="bg-background border-t border-zinc-100 py-16">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
        {/* Logo Section */}
        <Link href="/" className="group flex flex-col items-center gap-4 mb-10">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border border-zinc-50 shadow-sm transition-transform group-hover:scale-105">
            <Image
              src="/logo/sillage.webp"
              alt="Sillage"
              fill
              className="object-cover"
            />
          </div>
          <span className="font-serif text-3xl tracking-[0.4em] text-zinc-900 font-light">
            SILLAGE
          </span>
        </Link>

        {/* Navigation Simple */}
        <nav className="flex flex-wrap justify-center gap-x-10 gap-y-4 mb-10">
          <FooterLink href="/parfums">Parfums</FooterLink>
          <FooterLink href="/collections">Collections</FooterLink>
          <FooterLink href="/notre-histoire">Histoire</FooterLink>
        </nav>

        {/* Socials */}
        <div className="flex items-center gap-8 mb-12">
          <SocialIcon icon={<Instagram className="size-5" />} href="#" />
          <SocialIcon icon={<Facebook className="size-5" />} href="#" />
          <SocialIcon icon={<Twitter className="size-5" />} href="#" />
        </div>

        {/* Bottom */}
        <div className="text-center space-y-4">
          <p className="text-[10px] tracking-[0.2em] uppercase text-zinc-400 font-medium">
            © 2026 SILLAGE PARFUMERIE • DAKAR
          </p>
          <div className="flex justify-center gap-6 text-[9px] uppercase tracking-widest text-zinc-300">
            <Link
              href="/mentions-legales"
              className="hover:text-zinc-500 transition-colors"
            >
              Légal
            </Link>
            <Link
              href="/confidentialite"
              className="hover:text-zinc-500 transition-colors"
            >
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-xs uppercase tracking-widest font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
    >
      {children}
    </Link>
  );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <Link
      href={href}
      className="text-zinc-400 hover:text-zinc-900 transition-colors"
    >
      {icon}
    </Link>
  );
}
