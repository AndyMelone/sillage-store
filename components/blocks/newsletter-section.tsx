"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="bg-primary py-16 text-primary-foreground sm:py-20">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-4 text-xs uppercase tracking-[0.3em] opacity-70">
            Newsletter
          </p>
          <h2 className="mb-4 font-serif text-3xl sm:text-4xl">
            Recevez -10% sur votre première commande
          </h2>
          <p className="mb-8 opacity-70">
            Inscrivez-vous pour recevoir nos nouveautés, offres exclusives et
            conseils parfumés.
          </p>

          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-3 py-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <Check className="h-5 w-5" />
              </div>
              <p className="text-lg">Merci pour votre inscription !</p>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <Input
                type="email"
                placeholder="Votre adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 border-white/20 bg-white/10 text-primary-foreground placeholder:text-white/50"
                required
              />
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                className="h-12 whitespace-nowrap text-sm uppercase tracking-wider sm:h-14"
              >
                S{"'"}inscrire
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
