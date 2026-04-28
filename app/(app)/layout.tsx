import { CartDrawer } from "@/components/cart-drawer";
import Navbar from "@/components/ui/navbar";
import { StackedCircularFooter } from "@/components/ui/stacked-circular-footer";

import { StoreInitializer } from "@/components/store-initializer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <StoreInitializer />
      <Navbar />
      <main className="pt-24">{children}</main>

      <StackedCircularFooter />
      <CartDrawer />
    </>
  );
}
