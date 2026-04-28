"use client";

import { useEffect, useState } from "react";
import { listOrders } from "@/lib/data/customer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, Package, ChevronRight, Calendar, CreditCard } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { HttpTypes } from "@medusajs/types";
import Image from "next/image";

export default function OrdersPage() {
  const [orders, setOrders] = useState<HttpTypes.StoreOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      const data = await listOrders();
      setOrders(data);
      setIsLoading(false);
    }
    loadOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-700";
      case "pending": return "bg-amber-100 text-amber-700";
      case "canceled": return "bg-red-100 text-red-700";
      default: return "bg-zinc-100 text-zinc-700";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

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

          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-zinc-900 text-white rounded-full flex items-center justify-center">
              <Package className="size-6" />
            </div>
            <div>
              <h1 className="text-4xl font-serif">Mes Commandes</h1>
              <p className="text-muted-foreground">Historique et suivi de vos achats</p>
            </div>
          </div>

          {orders.length === 0 ? (
            <Card className="border-dashed border-2 p-12 text-center">
              <Package className="size-12 mx-auto text-zinc-200 mb-4" />
              <h2 className="text-xl font-serif mb-2">Aucune commande trouvée</h2>
              <p className="text-muted-foreground mb-8">Vous n'avez pas encore passé de commande sur Sillage.</p>
              <Button asChild className="rounded-full px-8">
                <Link href="/parfums">Découvrir nos fragrances</Link>
              </Button>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order, idx) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="overflow-hidden border-none shadow-lg shadow-zinc-200/50 rounded-3xl group">
                    <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
                      {/* Products Summary */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between mb-2">
                           <span className={cn("text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full", getStatusColor(order.status))}>
                             {order.status}
                           </span>
                           <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                             <Calendar className="size-3" />
                             {new Date(order.created_at).toLocaleDateString("fr-FR")}
                           </span>
                        </div>
                        
                        <div className="flex -space-x-4 overflow-hidden">
                          {order.items?.map((item) => (
                            <div key={item.id} className="relative size-16 rounded-xl border-4 border-white overflow-hidden bg-zinc-100 shadow-sm">
                              <Image src={item.thumbnail || "/placeholder.webp"} alt={item.title} fill className="object-cover" />
                            </div>
                          ))}
                        </div>
                        
                        <div>
                           <h3 className="font-bold text-lg">Commande #{order.display_id || order.id.slice(0, 8)}</h3>
                           <p className="text-sm text-muted-foreground">
                             {order.items?.length} {order.items?.length === 1 ? "article" : "articles"} • 
                             <span className="font-semibold text-zinc-900 ml-1">
                                {(order.total / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                             </span>
                           </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-end">
                        <Button variant="outline" className="rounded-full gap-2 group-hover:bg-zinc-900 group-hover:text-white transition-all">
                          Détails
                          <ChevronRight className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}

import { cn } from "@/lib/utils";
