"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import {
  addShippingMethod,
  completeCart,
  initiatePayment,
  listShippingOptions,
  updateCart,
} from "@/lib/data/cart";
import { getCustomer } from "@/lib/data/customer";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/use-auth-store";
import { useCartStore } from "@/store/use-cart-store";
import { HttpTypes } from "@medusajs/types";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  MapPin,
  ShoppingBag,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, syncCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const [step, setStep] = useState<"info" | "shipping" | "payment" | "success">(
    "info",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<HttpTypes.StoreOrder | null>(null);

  const [shippingOptions, setShippingOptions] = useState<
    HttpTypes.StoreShippingOption[]
  >([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string>("");

  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    address_1: "",
    address_2: "",
    city: "",
    country_code: "fr",
  });

  // Load customer data if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      getCustomer().then((customer) => {
        if (customer) {
          const addr = customer.addresses?.[0];
          setFormData({
            email: customer.email || customer.phone + "@sillageparfum.com",
            first_name: customer.first_name || addr?.first_name || "",
            last_name: customer.last_name || addr?.last_name || "",
            address_1: addr?.address_1 || "",
            address_2: addr?.address_2 || "",
            city: addr?.city || "",
            country_code: addr?.country_code || "fr",
          });
        }
      });
    }
  }, [isAuthenticated]);

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const cart = await updateCart({
      email: formData.email,
      shipping_address: {
        first_name: formData.first_name,
        last_name: formData.last_name,
        address_1: formData.address_1,
        address_2: formData.address_2,
        city: formData.city,
        country_code: formData.country_code,
      },
    });

    if (cart) {
      const options = await listShippingOptions();
      setShippingOptions(options);
      if (options.length > 0) {
        setSelectedOptionId(options[0].id);
      }
      setStep("shipping");
    }

    setIsLoading(false);
  };

  const handleShippingSubmit = async () => {
    setIsLoading(true);
    const cart = await addShippingMethod(selectedOptionId);
    if (cart) {
      await initiatePayment();
      setStep("payment");
    }
    setIsLoading(false);
  };

  const handlePaymentSubmit = async () => {
    setIsLoading(true);
    const result = await completeCart();
    if (result) {
      setOrder(result as any);
      setStep("success");
      await syncCart(); // Refresh cart store (should be empty)
    } else {
      alert("Erreur lors de la finalisation de la commande.");
    }
    setIsLoading(false);
  };

  if (items.length === 0 && step !== "success") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center mb-8">
          <ShoppingBag className="size-12 text-zinc-200" />
        </div>
        <h1 className="text-4xl font-serif mb-4">Votre panier est vide</h1>
        <p className="text-muted-foreground mb-10 max-w-sm">
          Vous devez ajouter des articles avant de passer commande.
        </p>
        <Button asChild className="rounded-full px-12 h-14 text-lg">
          <Link href="/parfums">Découvrir les parfums</Link>
        </Button>
      </div>
    );
  }

  const steps = [
    { id: "info", label: "Infos", icon: MapPin },
    { id: "shipping", label: "Livraison", icon: Truck },
    { id: "payment", label: "Paiement", icon: CreditCard },
  ] as const;

  return (
    <div className="min-h-screen bg-zinc-50/50 pt-24 pb-20 px-6 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full"
          >
            <ArrowLeft className="size-5" />
          </Button>
          <h1 className="text-4xl font-serif">Finaliser la commande</h1>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-start">
          {/* Main Flow */}
          <div className="space-y-8">
            {/* Steps Indicator */}
            <div className="flex justify-between max-w-md mx-auto mb-12 relative">
              <div className="absolute top-5 left-0 right-0 h-[2px] bg-zinc-200 z-0" />
              {steps.map((s, idx) => (
                <div
                  key={s.id}
                  className="flex flex-col items-center gap-2 relative"
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2 z-10",
                      step === s.id
                        ? "bg-zinc-900 border-zinc-900 text-white scale-110 shadow-lg"
                        : steps.findIndex((x) => x.id === step) > idx
                          ? "bg-green-500 border-green-500 text-white"
                          : "bg-white border-zinc-200 text-zinc-400",
                    )}
                  >
                    {steps.findIndex((x) => x.id === step) > idx ? (
                      <CheckCircle2 className="size-5" />
                    ) : (
                      <s.icon className="size-5" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-widest transition-colors",
                      step === s.id ? "text-zinc-900" : "text-zinc-400",
                    )}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {step === "info" && (
              <Card className="border-none shadow-xl shadow-zinc-200/50 rounded-3xl p-4">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">
                    Informations de livraison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleInfoSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          Prénom
                        </label>
                        <Input
                          placeholder="Jean"
                          value={formData.first_name}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              first_name: e.target.value,
                            })
                          }
                          className="h-12 rounded-xl"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          Nom
                        </label>
                        <Input
                          placeholder="Dupont"
                          value={formData.last_name}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              last_name: e.target.value,
                            })
                          }
                          className="h-12 rounded-xl"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Adresse
                      </label>
                      <Input
                        placeholder="123 Rue du Sillage"
                        value={formData.address_1}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address_1: e.target.value,
                          })
                        }
                        className="h-12 rounded-xl"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          Ville
                        </label>
                        <Input
                          placeholder="Abidjan"
                          value={formData.city}
                          onChange={(e) =>
                            setFormData({ ...formData, city: e.target.value })
                          }
                          className="h-12 rounded-xl"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          Code Postal
                        </label>
                        <Input
                          placeholder="00000"
                          value={formData.address_2}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address_2: e.target.value,
                            })
                          }
                          className="h-12 rounded-xl"
                          required
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-14 rounded-full mt-6 text-lg font-medium shadow-lg shadow-zinc-200"
                    >
                      {isLoading ? (
                        <Spinner className="mr-2" />
                      ) : (
                        "Continuer vers la livraison"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {step === "shipping" && (
              <Card className="border-none shadow-xl shadow-zinc-200/50 rounded-3xl p-4">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">
                    Mode de livraison
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {shippingOptions.map((option) => (
                      <div
                        key={option.id}
                        onClick={() => setSelectedOptionId(option.id)}
                        className={cn(
                          "border-2 rounded-2xl p-5 flex items-center justify-between cursor-pointer transition-all",
                          selectedOptionId === option.id
                            ? "border-zinc-900 bg-zinc-50 shadow-md"
                            : "border-zinc-100 hover:border-zinc-200",
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                              selectedOptionId === option.id
                                ? "bg-zinc-900 text-white"
                                : "bg-zinc-100 text-zinc-400",
                            )}
                          >
                            <Truck className="size-5" />
                          </div>
                          <div>
                            <p className="font-bold">{option.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Livraison standard
                            </p>
                          </div>
                        </div>
                        <p className="font-bold">
                          {option.amount === 0
                            ? "Gratuit"
                            : option.amount.toLocaleString("fr-FR", {
                                style: "currency",
                                currency: "XOF",
                              })}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={handleShippingSubmit}
                    disabled={isLoading || !selectedOptionId}
                    className="w-full h-14 rounded-full mt-6 text-lg font-medium shadow-lg shadow-zinc-200"
                  >
                    {isLoading ? (
                      <Spinner className="mr-2" />
                    ) : (
                      "Continuer vers le paiement"
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setStep("info")}
                    className="w-full rounded-full"
                  >
                    Retour aux infos
                  </Button>
                </CardContent>
              </Card>
            )}

            {step === "payment" && (
              <Card className="border-none shadow-xl shadow-zinc-200/50 rounded-3xl p-4">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">
                    Paiement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-8 bg-zinc-100 rounded-2xl text-center space-y-4 border-2 border-dashed border-zinc-200">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <CreditCard className="size-8 text-zinc-900" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold">Paiement Sécurisé</p>
                      <p className="text-sm text-zinc-500 italic">
                        L'intégration du paiement est simulée pour cette
                        démonstration.
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handlePaymentSubmit}
                    disabled={isLoading}
                    className="w-full h-14 rounded-full mt-6 text-lg font-medium shadow-lg shadow-zinc-200"
                  >
                    {isLoading ? (
                      <Spinner className="mr-2" />
                    ) : (
                      "Confirmer la commande"
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setStep("shipping")}
                    className="w-full rounded-full"
                  >
                    Retour à la livraison
                  </Button>
                </CardContent>
              </Card>
            )}

            {step === "success" && order && (
              <div className="text-center space-y-10 py-12">
                <div className="w-24 h-24 bg-zinc-900 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-zinc-200 animate-in zoom-in duration-700">
                  <CheckCircle2 className="size-12" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-5xl font-serif">
                    Merci pour votre commande !
                  </h2>
                  <p className="text-xl text-muted-foreground">
                    Commande #{order.display_id || order.id.slice(0, 8)}{" "}
                    confirmée.
                  </p>
                  <p className="text-muted-foreground">
                    Un email de confirmation a été envoyé à{" "}
                    <span className="font-bold text-zinc-900">
                      {order.email}
                    </span>
                    .
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                  <Button
                    asChild
                    className="rounded-full px-12 h-14 text-lg shadow-xl shadow-zinc-200"
                  >
                    <Link href="/">Retour à l'accueil</Link>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="rounded-full px-12 h-14 text-lg"
                  >
                    <Link href="/compte/commandes">Voir mes commandes</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Summary */}
          {step !== "success" && (
            <div className="sticky top-32 space-y-6">
              <Card className="border-none shadow-2xl shadow-zinc-200/50 rounded-3xl overflow-hidden">
                <CardHeader className="bg-zinc-50 border-b p-6">
                  <CardTitle className="font-serif text-xl">
                    Récapitulatif
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-6 max-h-[400px] overflow-auto pr-2 custom-scrollbar">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="relative size-20 shrink-0 rounded-2xl overflow-hidden border bg-zinc-50">
                          <Image
                            src={item.image || "/placeholder.webp"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <p className="text-sm font-bold leading-tight line-clamp-2">
                            {item.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Quantité: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-bold self-center">
                          {(item.price * item.quantity).toLocaleString(
                            "fr-FR",
                            { style: "currency", currency: "XOF" },
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sous-total</span>
                      <span className="font-medium">
                        {totalPrice.toLocaleString("fr-FR", {
                          style: "currency",
                          currency: "XOF",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Livraison</span>
                      <span className="text-zinc-900 font-medium">
                        Calculé à l'étape suivante
                      </span>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex justify-between text-2xl font-serif">
                      <span>Total</span>
                      <span className="font-bold">
                        {totalPrice.toLocaleString("fr-FR", {
                          style: "currency",
                          currency: "XOF",
                        })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
