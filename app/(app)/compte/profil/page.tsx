"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { getCustomer, updateCustomer } from "@/lib/data/customer";
import { cn } from "@/lib/utils";
import { HttpTypes } from "@medusajs/types";
import { ArrowLeft, Check, Phone, User } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/use-auth-store";

export default function ProfilPage() {
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);
  const [customer, setCustomer] = useState<HttpTypes.StoreCustomer | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

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

  useEffect(() => {
    if (!isMounted || !isAuthenticated) return;
    async function loadCustomer() {
      const data = await getCustomer();
      if (data) {
        setCustomer(data);
        setFormData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
        });
      }
      setIsLoading(false);
    }
    loadCustomer();
  }, [isMounted, isAuthenticated]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");

    const updated = await updateCustomer(formData);
    if (updated) {
      setCustomer(updated);
      setMessage("Informations mises à jour avec succès !");
      setTimeout(() => setMessage(""), 3000);
    } else {
      setMessage("Erreur lors de la mise à jour.");
    }
    setIsSaving(false);
  };

  if (!isMounted || !isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            href="/compte"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="size-4" />
            Retour au compte
          </Link>

          <Card className="border-none shadow-xl shadow-zinc-200/50 rounded-3xl overflow-hidden">
            <CardHeader className="bg-zinc-50 border-b p-8">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-zinc-900 text-white rounded-full flex items-center justify-center">
                  <User className="size-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-serif">
                    Mes Informations
                  </CardTitle>
                  <CardDescription>
                    Gérez vos données personnelles
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Prénom
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                      <Input
                        value={formData.first_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            first_name: e.target.value,
                          })
                        }
                        className="pl-11 h-12 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Nom
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                      <Input
                        value={formData.last_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            last_name: e.target.value,
                          })
                        }
                        className="pl-11 h-12 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Téléphone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                    <Input
                      disabled
                      value={customer?.phone || ""}
                      className="pl-11 h-12 rounded-xl bg-zinc-50 text-zinc-500 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Le numéro de téléphone est utilisé pour votre connexion et
                    ne peut être modifié.
                  </p>
                </div>

                {message && (
                  <div
                    className={cn(
                      "p-4 rounded-xl text-sm flex items-center gap-3",
                      message.includes("succès")
                        ? "bg-green-50 text-green-700 border border-green-100"
                        : "bg-red-50 text-red-700 border border-red-100",
                    )}
                  >
                    {message.includes("succès") && <Check className="size-4" />}
                    {message}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-14 rounded-full text-lg font-medium shadow-lg shadow-zinc-200"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Spinner className="mr-2" />
                  ) : (
                    "Enregistrer les modifications"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
