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
  Store,
  Truck,
  UserCheck,
  UserPlus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, syncCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const [step, setStep] = useState<"info" | "shipping" | "payment" | "success">("info");
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<HttpTypes.StoreOrder | null>(null);

  const [shippingOptions, setShippingOptions] = useState<HttpTypes.StoreShippingOption[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string>("");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    city: "",
    address_1: "",
  });

  const [pickupSameAsInfo, setPickupSameAsInfo] = useState(true);
  const [pickupContact, setPickupContact] = useState({
    first_name: "",
    last_name: "",
    phone: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      getCustomer().then((customer) => {
        if (customer) {
          const addr = customer.addresses?.[0];
          setFormData({
            first_name: customer.first_name || addr?.first_name || "",
            last_name: customer.last_name || addr?.last_name || "",
            phone: customer.phone || addr?.phone || "",
            city: addr?.city || "",
            address_1: addr?.address_1 || "",
          });
        }
      });
    }
  }, [isAuthenticated]);

  const isRetrait = shippingOptions
    .find((o) => o.id === selectedOptionId)
    ?.name.toLowerCase()
    .includes("retrait");

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const cart = await updateCart({
      email: `${formData.phone}@sillage.sn`,
      shipping_address: {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        address_1: formData.address_1,
        city: formData.city,
        country_code: "sn",
      },
    });

    if (cart) {
      const options = await listShippingOptions();
      setShippingOptions(options);
      if (options.length > 0) setSelectedOptionId(options[0].id);
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
      await syncCart();
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

  const pickupName = pickupSameAsInfo
    ? `${formData.first_name} ${formData.last_name}`.trim()
    : `${pickupContact.first_name} ${pickupContact.last_name}`.trim();

  const pickupPhone = pickupSameAsInfo ? formData.phone : pickupContact.phone;

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
          <div className="space-y-8">
            {/* Steps Indicator */}
            <div className="flex justify-between max-w-md mx-auto mb-12 relative">
              <div className="absolute top-5 left-0 right-0 h-[2px] bg-zinc-200 z-0" />
              {steps.map((s, idx) => (
                <div key={s.id} className="flex flex-col items-center gap-2 relative">
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

            {/* ── STEP 1 : Informations ── */}
            {step === "info" && (
              <Card className="border-none shadow-xl shadow-zinc-200/50 rounded-3xl p-4">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">Vos informations</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Ces informations seront utilisées pour votre livraison.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleInfoSubmit} className="space-y-6">
                    {/* Nom & Prénom */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                          Prénom
                        </label>
                        <Input
                          placeholder="Aminata"
                          value={formData.first_name}
                          onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                          className="h-14 rounded-2xl bg-zinc-50/50 border-zinc-200 focus:ring-zinc-900 focus:border-zinc-900"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                          Nom
                        </label>
                        <Input
                          placeholder="Diallo"
                          value={formData.last_name}
                          onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                          className="h-14 rounded-2xl bg-zinc-50/50 border-zinc-200 focus:ring-zinc-900 focus:border-zinc-900"
                          required
                        />
                      </div>
                    </div>

                    {/* Téléphone */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        Numéro de téléphone
                      </label>
                      <div className="flex gap-3">
                        <div className="h-14 px-4 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center text-sm font-medium text-zinc-500 shrink-0">
                          🇸🇳 +221
                        </div>
                        <Input
                          placeholder="77 000 00 00"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="h-14 rounded-2xl bg-zinc-50/50 border-zinc-200 focus:ring-zinc-900 focus:border-zinc-900 flex-1"
                          required
                        />
                      </div>
                    </div>

                    {/* Ville & Adresse */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                          Ville / Commune
                        </label>
                        <Input
                          placeholder="Dakar / Plateau"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="h-14 rounded-2xl bg-zinc-50/50 border-zinc-200 focus:ring-zinc-900 focus:border-zinc-900"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                          Adresse (Quartier, Rue, Repère)
                        </label>
                        <Input
                          placeholder="Médina, Rue 10, près de..."
                          value={formData.address_1}
                          onChange={(e) => setFormData({ ...formData, address_1: e.target.value })}
                          className="h-14 rounded-2xl bg-zinc-50/50 border-zinc-200 focus:ring-zinc-900 focus:border-zinc-900"
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-16 rounded-full text-lg font-bold shadow-2xl shadow-zinc-200 bg-zinc-900 hover:bg-zinc-800 transition-all active:scale-[0.98]"
                      >
                        {isLoading ? <Spinner className="mr-2" /> : "Continuer vers la livraison"}
                      </Button>
                      <p className="text-[10px] text-center text-muted-foreground mt-4 uppercase tracking-widest font-medium">
                        Vos informations sont sécurisées
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* ── STEP 2 : Livraison ── */}
            {step === "shipping" && (
              <Card className="border-none shadow-xl shadow-zinc-200/50 rounded-3xl p-4">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">Mode de livraison</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Choisissez comment vous souhaitez recevoir votre commande.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {shippingOptions.map((option) => {
                      const isPickup = option.name.toLowerCase().includes("retrait");
                      const selected = selectedOptionId === option.id;
                      return (
                        <div
                          key={option.id}
                          onClick={() => setSelectedOptionId(option.id)}
                          className={cn(
                            "border-2 rounded-2xl p-5 flex items-center justify-between cursor-pointer transition-all",
                            selected
                              ? "border-zinc-900 bg-zinc-50 shadow-md"
                              : "border-zinc-100 hover:border-zinc-200",
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={cn(
                                "w-11 h-11 rounded-xl flex items-center justify-center transition-colors shrink-0",
                                selected ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-400",
                              )}
                            >
                              {isPickup ? (
                                <Store className="size-5" />
                              ) : (
                                <Truck className="size-5" />
                              )}
                            </div>
                            <div>
                              <p className="font-bold">{option.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {isPickup
                                  ? "À récupérer directement en boutique"
                                  : "Livré à votre adresse"}
                              </p>
                            </div>
                          </div>
                          <p className="font-bold shrink-0">
                            {option.amount === 0
                              ? "Gratuit"
                              : option.amount.toLocaleString("fr-FR", {
                                  style: "currency",
                                  currency: "XOF",
                                })}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Retrait en magasin — contact info */}
                  {isRetrait && (
                    <div className="mt-2 rounded-2xl border border-zinc-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-400">
                      {/* Store info */}
                      <div className="p-5 bg-zinc-50 flex items-start gap-4 border-b border-zinc-100">
                        <div className="size-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center shrink-0">
                          <MapPin className="size-5" />
                        </div>
                        <div>
                          <p className="font-bold text-sm">Showroom Sillage</p>
                          <p className="text-sm text-muted-foreground">Dakar, Sénégal</p>
                          <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mt-1">
                            Retrait sur rendez-vous
                          </p>
                        </div>
                      </div>

                      {/* Pickup contact toggle */}
                      <div className="p-5 space-y-4">
                        <p className="text-sm font-bold text-zinc-700">
                          Qui viendra récupérer la commande ?
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setPickupSameAsInfo(true)}
                            className={cn(
                              "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all text-center",
                              pickupSameAsInfo
                                ? "border-zinc-900 bg-zinc-50"
                                : "border-zinc-100 hover:border-zinc-200",
                            )}
                          >
                            <UserCheck
                              className={cn(
                                "size-6",
                                pickupSameAsInfo ? "text-zinc-900" : "text-zinc-400",
                              )}
                            />
                            <span className="text-[11px] font-bold uppercase tracking-wider">
                              Moi-même
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPickupSameAsInfo(false)}
                            className={cn(
                              "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all text-center",
                              !pickupSameAsInfo
                                ? "border-zinc-900 bg-zinc-50"
                                : "border-zinc-100 hover:border-zinc-200",
                            )}
                          >
                            <UserPlus
                              className={cn(
                                "size-6",
                                !pickupSameAsInfo ? "text-zinc-900" : "text-zinc-400",
                              )}
                            />
                            <span className="text-[11px] font-bold uppercase tracking-wider">
                              Autre personne
                            </span>
                          </button>
                        </div>

                        {pickupSameAsInfo ? (
                          <div className="flex items-center gap-3 p-4 rounded-2xl bg-green-50 border border-green-100">
                            <CheckCircle2 className="size-5 text-green-600 shrink-0" />
                            <div>
                              <p className="text-sm font-bold text-zinc-900">
                                {formData.first_name} {formData.last_name}
                              </p>
                              <p className="text-xs text-muted-foreground">{formData.phone}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4 animate-in fade-in slide-in-from-top-1 duration-300">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                  Prénom
                                </label>
                                <Input
                                  placeholder="Prénom"
                                  value={pickupContact.first_name}
                                  onChange={(e) =>
                                    setPickupContact({ ...pickupContact, first_name: e.target.value })
                                  }
                                  className="h-12 rounded-xl bg-zinc-50/50 border-zinc-200"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                  Nom
                                </label>
                                <Input
                                  placeholder="Nom"
                                  value={pickupContact.last_name}
                                  onChange={(e) =>
                                    setPickupContact({ ...pickupContact, last_name: e.target.value })
                                  }
                                  className="h-12 rounded-xl bg-zinc-50/50 border-zinc-200"
                                />
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                Téléphone
                              </label>
                              <Input
                                placeholder="77 000 00 00"
                                type="tel"
                                value={pickupContact.phone}
                                onChange={(e) =>
                                  setPickupContact({ ...pickupContact, phone: e.target.value })
                                }
                                className="h-12 rounded-xl bg-zinc-50/50 border-zinc-200"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleShippingSubmit}
                    disabled={isLoading || !selectedOptionId}
                    className="w-full h-14 rounded-full text-lg font-medium shadow-lg shadow-zinc-200"
                  >
                    {isLoading ? <Spinner className="mr-2" /> : "Continuer vers le paiement"}
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

            {/* ── STEP 3 : Paiement ── */}
            {step === "payment" && (
              <Card className="border-none shadow-xl shadow-zinc-200/50 rounded-3xl p-4">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">Paiement</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Confirmez votre commande — le paiement se fait à la réception.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Main message */}
                  <div className="p-8 bg-zinc-900 rounded-[2rem] text-center space-y-5 shadow-2xl shadow-zinc-200 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                    <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto backdrop-blur-md border border-white/10">
                      <CreditCard className="size-10 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-serif text-white">
                        Paiement à la récupération
                      </h3>
                      <p className="text-sm text-zinc-400 max-w-[260px] mx-auto leading-relaxed">
                        Le paiement en ligne est en cours de développement. Vous réglez à la
                        réception de votre commande.
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">
                        Aucun paiement requis maintenant
                      </span>
                    </div>
                  </div>

                  {/* How to pay */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-100 flex flex-col items-center text-center gap-3">
                      <div className="size-11 rounded-full bg-white flex items-center justify-center border border-zinc-100 shadow-sm">
                        <Truck className="size-5 text-zinc-900" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                          Livraison à domicile
                        </p>
                        <p className="text-xs font-medium mt-0.5">Payez au livreur</p>
                      </div>
                    </div>
                    <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-100 flex flex-col items-center text-center gap-3">
                      <div className="size-11 rounded-full bg-white flex items-center justify-center border border-zinc-100 shadow-sm">
                        <Store className="size-5 text-zinc-900" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                          Retrait en boutique
                        </p>
                        <p className="text-xs font-medium mt-0.5">Payez en magasin</p>
                      </div>
                    </div>
                  </div>

                  {/* Récap retrait si applicable */}
                  {isRetrait && (
                    <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-1 animate-in fade-in duration-300">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                        Retrait prévu par
                      </p>
                      <p className="font-bold text-zinc-900">{pickupName || "—"}</p>
                      {pickupPhone && (
                        <p className="text-sm text-muted-foreground">{pickupPhone}</p>
                      )}
                    </div>
                  )}

                  <div className="pt-2">
                    <Button
                      onClick={handlePaymentSubmit}
                      disabled={isLoading}
                      className="w-full h-16 rounded-full text-lg font-bold shadow-2xl shadow-zinc-200 bg-zinc-900 hover:bg-zinc-800 transition-all active:scale-[0.98]"
                    >
                      {isLoading ? <Spinner className="mr-2" /> : "Confirmer ma commande"}
                    </Button>
                  </div>
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

            {/* ── SUCCESS ── */}
            {step === "success" && order && (
              <div className="text-center space-y-10 py-12">
                <div className="w-24 h-24 bg-zinc-900 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-zinc-200 animate-in zoom-in duration-700">
                  <CheckCircle2 className="size-12" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-5xl font-serif">Merci pour votre commande !</h2>
                  <p className="text-xl text-muted-foreground">
                    Commande #{order.display_id || order.id.slice(0, 8)} confirmée.
                  </p>
                  <p className="text-muted-foreground">
                    Nous vous contacterons au{" "}
                    <span className="font-bold text-zinc-900">{formData.phone}</span> pour
                    organiser votre livraison.
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
                  <CardTitle className="font-serif text-xl">Récapitulatif</CardTitle>
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
                          {(item.price * item.quantity).toLocaleString("fr-FR", {
                            style: "currency",
                            currency: "XOF",
                          })}
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
