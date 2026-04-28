import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-6">
      <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground mb-6">
        Erreur 404
      </p>
      <h1 className="text-7xl md:text-9xl font-serif mb-6 leading-none">
        Introuvable
      </h1>
      <p className="text-muted-foreground text-lg max-w-md mb-12">
        {"La page que vous cherchez n'existe pas ou a été déplacée."}
      </p>
      <div className="flex gap-4">
        <Button asChild className="rounded-full px-8 h-14 text-base">
          <Link href="/">{"Retour à l'accueil"}</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full px-8 h-14 text-base">
          <Link href="/parfums">Nos fragrances</Link>
        </Button>
      </div>
    </main>
  );
}
