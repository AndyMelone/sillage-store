"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/use-auth-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Package, User, MapPin, Heart, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

export default function AccountPage() {
  const router = useRouter();
  const { isAuthenticated, phone, logout, checkAuth } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isMounted && !isAuthenticated) {
      router.push("/auth");
    }
  }, [isMounted, isAuthenticated, router]);

  if (!isMounted || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-secondary rounded-full mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const accountSections = [
    {
      title: "Mes Commandes",
      description: "Suivez vos commandes en cours et consultez votre historique",
      icon: <Package className="h-5 w-5" />,
      href: "/compte/commandes",
    },
    {
      title: "Mes Informations",
      description: "Gérez vos coordonnées et vos préférences",
      icon: <User className="h-5 w-5" />,
      href: "/compte/profil",
    },
    {
      title: "Adresses",
      description: "Gérez vos adresses de livraison",
      icon: <MapPin className="h-5 w-5" />,
      href: "/compte/adresses",
    },
    {
      title: "Liste de souhaits",
      description: "Consultez vos articles favoris",
      icon: <Heart className="h-5 w-5" />,
      href: "/wishlist",
    },
  ];

  return (
    <main className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="font-heading text-4xl font-bold tracking-tight mb-2">Mon compte</h1>
              <p className="text-muted-foreground">
                Bienvenue, {phone}
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Se déconnecter
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {accountSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link href={section.href} className="block h-full">
                  <Card className="hover:border-foreground/20 transition-all cursor-pointer group h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground mb-2 group-hover:bg-foreground group-hover:text-background transition-colors">
                          {section.icon}
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-transform group-hover:translate-x-1" />
                      </div>
                      <CardTitle className="font-heading font-bold text-xl">{section.title}</CardTitle>
                      <CardDescription>{section.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <span className="text-sm font-medium text-primary group-hover:underline">
                        Gérer
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
