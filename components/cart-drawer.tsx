"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { useCartStore } from "@/store/use-cart-store";
import { Minus, Plus, ShoppingBag, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, updateQuantity, isLoading } =
    useCartStore();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col sm:max-w-md p-0 gap-0"
      >
        <SheetHeader className="p-6 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-xl font-serif">
              <ShoppingCart className="size-5" />
              Mon Panier
            </SheetTitle>
            {totalItems > 0 && (
              <span className="rounded-full bg-zinc-900 px-2.5 py-0.5 text-xs font-medium text-white">
                {totalItems} {totalItems === 1 ? "article" : "articles"}
              </span>
            )}
          </div>
          <SheetDescription className="sr-only">
            Consultez et gerez les articles de votre panier
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center p-6">
            <div className="w-24 h-24 rounded-full bg-zinc-50 flex items-center justify-center">
              <ShoppingBag className="size-10 text-zinc-300" />
            </div>
            <div className="space-y-2">
              <p className="text-xl font-serif">Votre panier est vide</p>
              <p className="text-sm text-muted-foreground max-w-[200px] mx-auto">
                Explorez nos collections et trouvez votre sillage signature.
              </p>
            </div>
            <Button
              onClick={closeCart}
              variant="outline"
              className="mt-4 rounded-full px-8"
            >
              Découvrir les parfums
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6">
              <div className="flex flex-col gap-6 py-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-zinc-50 border border-zinc-100">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center">
                          <ShoppingBag className="size-8 text-zinc-200" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between py-0.5">
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-serif text-base leading-tight group-hover:text-primary transition-colors">
                            {item.name}
                          </h4>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-6 -mr-2 text-zinc-300 hover:text-red-500 hover:bg-transparent"
                            onClick={() => removeItem(item.id)}
                            disabled={isLoading}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                        <p className="text-sm font-medium">
                          {item.price.toLocaleString("fr-FR", {
                            style: "currency",
                            currency: "XOF",
                          })}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center border rounded-full px-1 py-0.5 border-zinc-200">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 rounded-full hover:bg-zinc-100"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={isLoading}
                          >
                            <Minus className="size-3" />
                          </Button>
                          <span className="w-6 text-center text-xs font-semibold">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 rounded-full hover:bg-zinc-100"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={isLoading}
                          >
                            <Plus className="size-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-6 border-t bg-zinc-50/50 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span className="font-medium">
                    {totalPrice.toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "XOF",
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Livraison</span>
                  <span className="text-zinc-400 italic">
                    {"Calcule à l'étape suivante"}
                  </span>
                </div>
                <div className="pt-2 flex items-center justify-between font-serif text-lg">
                  <span>Total</span>
                  <span>
                    {totalPrice.toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "XOF",
                    })}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  className="w-full h-12 rounded-full text-base font-medium shadow-lg shadow-zinc-200"
                  size="lg"
                  asChild
                  disabled={isLoading}
                >
                  <Link href="/checkout" onClick={closeCart}>
                    {isLoading ? (
                      <Spinner className="mr-2" />
                    ) : (
                      "Passer à la commande"
                    )}
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full h-10 text-muted-foreground hover:text-foreground"
                  onClick={closeCart}
                >
                  Continuer mes achats
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
