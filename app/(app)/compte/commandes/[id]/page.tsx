"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/use-auth-store";
import { getOrder } from "@/lib/data/customer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, Calendar, MapPin, Package, Truck } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { HttpTypes } from "@medusajs/types";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getOrderStatusColor, getOrderStatusLabel } from "@/lib/order-status";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);
  const [order, setOrder] = useState<HttpTypes.StoreOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

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
    async function loadOrder() {
      const data = await getOrder(id);
      if (!data) {
        setNotFound(true);
      } else {
        setOrder(data);
      }
      setIsLoading(false);
    }
    loadOrder();
  }, [isMounted, isAuthenticated, id]);

  if (!isMounted || !isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <main className="min-h-screen bg-background pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Package className="size-12 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-heading font-bold mb-2">Commande introuvable</h1>
          <p className="text-muted-foreground mb-8">
            Cette commande n&apos;existe pas ou ne vous appartient pas.
          </p>
          <Button asChild>
            <Link href="/compte/commandes">Retour à mes commandes</Link>
          </Button>
        </div>
      </main>
    );
  }

  const address = order.shipping_address;
  const shippingMethod = order.shipping_methods?.[0];
  const isPickup = shippingMethod?.name?.toLowerCase().includes("récupère") ||
    shippingMethod?.name?.toLowerCase().includes("retrait");

  return (
    <main className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/compte/commandes" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="size-4" />
            Retour à mes commandes
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight">
                Commande #{order.display_id || order.id.slice(0, 8)}
              </h1>
              <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="size-4" />
                {new Date(order.created_at).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <span className={cn("inline-flex self-start text-xs font-bold uppercase tracking-widest px-3 py-1.5", getOrderStatusColor(order.status))}>
              {getOrderStatusLabel(order.status)}
            </span>
          </div>

          <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
            {/* Items */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading font-bold text-xl">Articles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative size-20 shrink-0 overflow-hidden border border-border bg-secondary">
                      <Image
                        src={item.thumbnail || "/placeholder.webp"}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">{item.product_title || item.title}</p>
                      {item.variant_title && (
                        <p className="text-sm text-muted-foreground">{item.variant_title}</p>
                      )}
                      <p className="text-sm text-muted-foreground mt-1">
                        Quantité : {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold shrink-0">
                      {(item.unit_price * item.quantity).toLocaleString("fr-FR", {
                        style: "currency",
                        currency: "XOF",
                      })}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Delivery / Pickup */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading font-bold text-lg flex items-center gap-2">
                    {isPickup ? <MapPin className="size-4" /> : <Truck className="size-4" />}
                    {isPickup ? "Retrait" : "Livraison"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  {shippingMethod && (
                    <p className="font-medium text-foreground">{shippingMethod.name}</p>
                  )}
                  {address && (
                    <>
                      <p className="text-muted-foreground">
                        {address.first_name} {address.last_name}
                      </p>
                      {!isPickup && (
                        <p className="text-muted-foreground">
                          {address.address_1}, {address.city}
                        </p>
                      )}
                      {address.phone && (
                        <p className="text-muted-foreground">{address.phone}</p>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Totals */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading font-bold text-lg">Récapitulatif</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span className="font-medium">
                      {(order.subtotal ?? 0).toLocaleString("fr-FR", {
                        style: "currency",
                        currency: "XOF",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Livraison</span>
                    <span className="font-medium">
                      {(order.shipping_total ?? 0) === 0
                        ? "Gratuit"
                        : (order.shipping_total ?? 0).toLocaleString("fr-FR", {
                            style: "currency",
                            currency: "XOF",
                          })}
                    </span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-lg font-heading font-bold">
                    <span>Total</span>
                    <span>
                      {order.total.toLocaleString("fr-FR", {
                        style: "currency",
                        currency: "XOF",
                      })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
