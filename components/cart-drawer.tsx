"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCartStore } from "@/store/use-cart-store";
import { Minus, Plus, ShoppingBag, ShoppingCart, Trash2 } from "lucide-react";

export function CartDrawer() {
  const {
    isOpen,
    closeCart,
    items,
    removeItem,
    updateQuantity,
  } = useCartStore();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center gap-2 text-lg font-semibold">
            <ShoppingCart className="size-4" />
            Votre Panier
            {totalItems > 0 && (
              <span className="ml-1 rounded-full bg-foreground px-2 py-0.5 text-xs text-background">
                {totalItems}
              </span>
            )}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Consultez et gerez les articles de votre panier
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <div className="rounded-full bg-muted p-6">
              <ShoppingBag className="size-10 text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-medium">Votre panier est vide</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Ajoutez des articles pour commencer votre commande
              </p>
            </div>
            <Button onClick={closeCart} variant="outline" className="mt-4">
              Continuer mes achats
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 py-4">
              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-lg border bg-card p-3"
                  >
                    {item.image ? (
                      <div className="size-20 shrink-0 overflow-hidden rounded-md bg-muted">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="size-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex size-20 shrink-0 items-center justify-center rounded-md bg-muted">
                        <ShoppingBag className="size-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-medium leading-tight">
                            {item.name}
                          </h4>
                          <p className="mt-0.5 text-sm text-muted-foreground">
                            {item.price.toLocaleString("fr-FR", {
                              style: "currency",
                              currency: "EUR",
                            })}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="size-4" />
                          <span className="sr-only">Supprimer</span>
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-8"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="size-3" />
                          <span className="sr-only">Diminuer la quantite</span>
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-8"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="size-3" />
                          <span className="sr-only">Augmenter la quantite</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t pt-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span>
                    {totalPrice.toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Livraison</span>
                  <span className="text-muted-foreground">
                    Calcule a la commande
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex items-center justify-between font-semibold">
                  <span>Total</span>
                  <span>
                    {totalPrice.toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </span>
                </div>
              </div>
            </div>

            <SheetFooter className="flex flex-col gap-2 border-t pt-4">
              <Button className="w-full" size="lg">
                Passer la commande
              </Button>
              <Button variant="outline" className="w-full" onClick={closeCart}>
                Continuer mes achats
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
