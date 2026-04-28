"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/use-auth-store";
import { getCustomer, addAddress, deleteAddress } from "@/lib/data/customer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, MapPin, Plus, Trash2, Home, Building2, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { HttpTypes } from "@medusajs/types";
import { Input } from "@/components/ui/input";

export default function AdressesPage() {
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);
  const [customer, setCustomer] = useState<HttpTypes.StoreCustomer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [newAddress, setNewAddress] = useState<HttpTypes.StoreCustomerAddress>({
    first_name: "",
    last_name: "",
    address_1: "",
    city: "",
    postal_code: "",
    country_code: "fr",
    company: "",
  } as any);

  useEffect(() => {
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
      setCustomer(data);
      setIsLoading(false);
    }
    loadCustomer();
  }, [isMounted, isAuthenticated]);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const updated = await addAddress(newAddress);
    if (updated) {
      setCustomer(updated);
      setIsAdding(false);
      setNewAddress({
        first_name: "",
        last_name: "",
        address_1: "",
        city: "",
        postal_code: "",
        country_code: "fr",
      } as any);
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    const ok = await deleteAddress(id);
    if (ok) {
      setCustomer({
        ...customer!,
        addresses: customer!.addresses?.filter(a => a.id !== id)
      });
    }
  };

  if (!isMounted || !isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  const addresses = customer?.addresses || [];

  return (
    <main className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/compte" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="size-4" />
            Retour au compte
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-zinc-900 text-white rounded-full flex items-center justify-center">
                <MapPin className="size-6" />
              </div>
              <div>
                <h1 className="text-4xl font-serif">Mes Adresses</h1>
                <p className="text-muted-foreground">Gérez vos lieux de livraison</p>
              </div>
            </div>
            {!isAdding && (
              <Button onClick={() => setIsAdding(true)} className="rounded-full gap-2 shadow-lg shadow-zinc-200">
                <Plus className="size-4" />
                Ajouter une adresse
              </Button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {isAdding ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="border-none shadow-xl shadow-zinc-200/50 rounded-3xl p-4">
                  <CardHeader>
                    <CardTitle className="font-serif text-2xl">Nouvelle Adresse</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddAddress} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Input 
                          placeholder="Prénom" 
                          value={newAddress.first_name || ""} 
                          onChange={e => setNewAddress({...newAddress, first_name: e.target.value})}
                          className="h-12 rounded-xl"
                          required
                        />
                        <Input 
                          placeholder="Nom" 
                          value={newAddress.last_name || ""} 
                          onChange={e => setNewAddress({...newAddress, last_name: e.target.value})}
                          className="h-12 rounded-xl"
                          required
                        />
                      </div>
                      <Input 
                        placeholder="Adresse" 
                        value={newAddress.address_1 || ""} 
                        onChange={e => setNewAddress({...newAddress, address_1: e.target.value})}
                        className="h-12 rounded-xl"
                        required
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input 
                          placeholder="Ville" 
                          value={newAddress.city || ""} 
                          onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                          className="h-12 rounded-xl"
                          required
                        />
                        <Input 
                          placeholder="Code postal" 
                          value={newAddress.postal_code || ""} 
                          onChange={e => setNewAddress({...newAddress, postal_code: e.target.value})}
                          className="h-12 rounded-xl"
                          required
                        />
                      </div>
                      <div className="flex gap-4 pt-4">
                        <Button type="submit" disabled={isSaving} className="flex-1 h-14 rounded-full text-lg">
                          {isSaving ? <Spinner className="mr-2" /> : "Enregistrer l'adresse"}
                        </Button>
                        <Button variant="ghost" onClick={() => setIsAdding(false)} className="h-14 px-8 rounded-full">
                          Annuler
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {addresses.length === 0 ? (
                  <div className="col-span-full py-12 text-center text-muted-foreground italic">
                    Aucune adresse enregistrée.
                  </div>
                ) : (
                  addresses.map((addr) => (
                    <motion.div key={addr.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <Card className="border-none shadow-lg shadow-zinc-200/50 rounded-3xl relative overflow-hidden group">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <div className="p-2 bg-zinc-100 rounded-lg">
                             {addr.company ? <Building2 className="size-4 text-zinc-500" /> : <Home className="size-4 text-zinc-500" />}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDelete(addr.id)}
                            className="text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-full"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </CardHeader>
                        <CardContent className="space-y-1">
                          <p className="font-bold">{addr.first_name} {addr.last_name}</p>
                          <p className="text-sm text-muted-foreground">{addr.address_1}</p>
                          <p className="text-sm text-muted-foreground">{addr.postal_code} {addr.city}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}
