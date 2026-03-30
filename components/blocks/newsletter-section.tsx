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
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs uppercase tracking-[0.3em] opacity-70 mb-4">
            Newsletter
          </p>
          <h2 className="font-serif text-3xl md:text-4xl mb-4">
            Recevez -10% sur votre première commande
          </h2>
          <p className="opacity-70 mb-8">
            Inscrivez-vous pour recevoir nos nouveautés, offres exclusives et
            conseils parfumés.
          </p>

          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-3 py-4"
            >
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Check className="h-5 w-5" />
              </div>
              <p className="text-lg">Merci pour votre inscription !</p>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <Input
                type="email"
                placeholder="Votre adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-primary-foreground placeholder:text-white/50 h-12"
                required
              />
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                className="uppercase tracking-wider text-sm whitespace-nowrap"
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
