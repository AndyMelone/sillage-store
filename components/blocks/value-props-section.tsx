"use client";

import { Clock, Shield, Sparkles, Truck } from "lucide-react";
import { motion } from "motion/react";

const valueProps = [
  {
    icon: Clock,
    title: "Longue Tenue",
    description: "Tenue de 12+ heures garantie",
  },
  {
    icon: Shield,
    title: "Paiement Sécurisé",
    description: "Vos informations sont protégées",
  },
  {
    icon: Truck,
    title: "Livraison Rapide",
    description: "Expédition sous 24-48h",
  },
  {
    icon: Sparkles,
    title: "Qualité Premium",
    description: "Ingrédients de haute qualité",
  },
];

export function ValuePropsSection() {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {valueProps.map((prop, index) => (
            <motion.div
              key={prop.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <prop.icon className="h-8 w-8 mx-auto mb-4 opacity-80" />
              <h3 className="font-medium text-sm uppercase tracking-wider mb-2">
                {prop.title}
              </h3>
              <p className="text-sm opacity-70">{prop.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
