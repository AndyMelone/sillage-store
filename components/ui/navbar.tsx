"use client";

import {
  Boxes,
  LayoutDashboard,
  Menu,
  Search,
  ShoppingCart,
  Sparkles,
} from "lucide-react";
import * as React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useCartStore } from "@/store/use-cart-store";
import { useWishlistStore } from "@/store/use-wishlist-store";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface NavbarProps {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  mobileExtraLinks?: {
    name: string;
    url: string;
  }[];
  auth?: {
    login: {
      text: string;
      url: string;
    };
    signup: {
      text: string;
      url: string;
    };
  };
}

export default function Navbar({
  logo = {
    url: "https://sillage.com",
    src: "/logo/sillage.webp",
    alt: "Sillage logo",
    title: "Sillage",
  },

  menu = [
    { title: "Parfums", url: "/parfums" },
    {
      title: "Collections",
      url: "/collections",
      items: [
        {
          title: "Boisé",
          description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
          icon: <Boxes className="size-5 shrink-0" />,
          url: "/collections/boise",
        },
        {
          title: "Fruité",
          description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
          icon: <LayoutDashboard className="size-5 shrink-0" />,
          url: "/collections/fruite",
        },
        {
          title: "Florale",
          description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
          icon: <Sparkles className="size-5 shrink-0" />,
          url: "/collections/florale",
        },
      ],
    },
    {
      title: "Notre histoire",
      url: "/notre-histoire",
    },
  ],

  auth = {
    login: { text: "Sign in", url: "#" },
    signup: { text: "Get Started", url: "#" },
  },
}: NavbarProps) {
  const [openSearch, setOpenSearch] = React.useState(false);
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const currentPath = mounted ? pathname : "";

  const { openCart, items } = useCartStore();
  const { itemIds: wishlistItems } = useWishlistStore();
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-background/60 backdrop-blur-md border-b border-border/40">
      <div className="mx-auto px-4 sm:px-8 md:px-16 lg:px-24 py-4">
        {/* Desktop Navbar */}
        <nav className="hidden items-center justify-between lg:flex gap-4">
          <div className="flex-1 flex justify-start">
            <Link href={logo.url} className="flex items-center gap-2">
              <Image
                width={100}
                height={100}
                src={logo.src}
                className="w-16 rounded-full"
                alt={logo.alt}
              />
            </Link>
          </div>

          <div className="flex items-center justify-center">
            <NavigationMenu className="**:data-radix-navigation-menu-viewport:rounded-3xl z-20">
              <NavigationMenuList className="">
                {menu.map((item) => renderMenuItem(item, currentPath))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex-1 flex items-center justify-end gap-2">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpenSearch(true)}
            >
              <Search className="size-4" />
            </Button>

            {/* Wishlist Button */}
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/wishlist">
                <Heart className="size-4" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background">
                    {wishlistItems.length}
                  </span>
                )}
                <span className="sr-only">Liste de souhaits</span>
              </Link>
            </Button>

            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={openCart}
            >
              <ShoppingCart className="size-4" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
              <span className="sr-only">
                Panier ({totalItems} {totalItems === 1 ? "article" : "articles"}
                )
              </span>
            </Button>

            {/* Auth Buttons */}
            <Button variant="outline" size="sm" asChild>
              <a href={auth.login.url}>{auth.login.text}</a>
            </Button>
          </div>
        </nav>

        {/* Mobile Navbar */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <a href={logo.url} className="flex items-center gap-2">
              <img
                src={logo.src}
                className="w-14 rounded-full"
                alt={logo.alt}
              />
            </a>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpenSearch(true)}
              >
                <Search className="size-4" />
              </Button>

              {/* Wishlist button mobile */}
              <Button variant="ghost" size="icon" className="relative" asChild>
                <Link href="/wishlist">
                  <Heart className="size-4" />
                  {wishlistItems.length > 0 && (
                    <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background">
                      {wishlistItems.length}
                    </span>
                  )}
                  <span className="sr-only">Liste de souhaits</span>
                </Link>
              </Button>

              {/* Cart button mobile */}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={openCart}
              >
                <ShoppingCart className="size-4" />
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
                <span className="sr-only">
                  Panier ({totalItems}{" "}
                  {totalItems === 1 ? "article" : "articles"})
                </span>
              </Button>

              {/* Menu Sheet */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>
                      <a href={logo.url} className="flex items-center gap-2">
                        <img
                          src={logo.src}
                          className="w-16 rounded-full"
                          alt={logo.alt}
                        />
                      </a>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="my-6 flex flex-col gap-6">
                    <div className="flex flex-col gap-4">
                      {menu.map((item) =>
                        renderMobileMenuItem(item, currentPath),
                      )}
                    </div>

                    <div className="flex flex-col gap-3">
                      <Button variant="outline" asChild>
                        <a href={auth.login.url}>{auth.login.text}</a>
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      <CommandDialog open={openSearch} onOpenChange={setOpenSearch}>
        <CommandInput placeholder="Search products, blogs, resources..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup className="text-gray-500" heading="Suggestions">
            <CommandItem className="text-gray-800 dark:text-gray-200">
              Senteur
            </CommandItem>
            <CommandItem className="text-gray-800 dark:text-gray-200">
              Boisé
            </CommandItem>
            <CommandItem className="text-gray-800 dark:text-gray-200">
              Fruité
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </header>
  );
}

const renderMenuItem = (item: MenuItem, pathname: string) => {
  const isActive =
    pathname === item.url || item.items?.some((sub) => pathname === sub.url);

  if (item.items) {
    return (
      <NavigationMenuItem key={item.title} className="text-muted-foreground">
        <NavigationMenuTrigger
          className={cn(
            "rounded-3xl transition-all duration-300",
            isActive &&
              "text-foreground after:content-[''] after:absolute after:bottom-1 after:left-4 after:right-8 after:h-0.5 after:bg-primary",
          )}
        >
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent className="rounded-3xl!">
          <ul className="w-80 p-3">
            {item.items.map((subItem) => {
              const isSubActive = pathname === subItem.url;
              return (
                <li key={subItem.title}>
                  <NavigationMenuLink asChild className="rounded-3xl!">
                    <a
                      className={cn(
                        "flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-accent-foreground",
                        isSubActive && "bg-muted text-accent-foreground",
                      )}
                      href={subItem.url}
                    >
                      {subItem.icon}
                      <div>
                        <div className="text-sm font-semibold">
                          {subItem.title}
                        </div>
                        {subItem.description && (
                          <p className="text-sm leading-snug text-muted-foreground">
                            {subItem.description}
                          </p>
                        )}
                      </div>
                    </a>
                  </NavigationMenuLink>
                </li>
              );
            })}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink asChild>
        <a
          className={cn(
            "group relative inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-accent-foreground",
            isActive &&
              "text-foreground after:content-[''] after:absolute after:bottom-1 after:left-4 after:right-4 after:h-0.5 after:bg-primary",
          )}
          href={item.url}
        >
          {item.title}
        </a>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem, pathname: string) => {
  const isActive =
    pathname === item.url || item.items?.some((sub) => pathname === sub.url);

  if (item.items) {
    return (
      <Accordion
        key={item.title}
        type="single"
        collapsible
        className="flex w-full flex-col"
      >
        <AccordionItem value={item.title} className="border-b-0">
          <AccordionTrigger
            className={cn(
              "py-0 font-semibold hover:no-underline transition-colors",
              isActive ? "text-primary" : "",
            )}
          >
            {item.title}
          </AccordionTrigger>
          <AccordionContent className="mt-2">
            {item.items.map((subItem) => {
              const isSubActive = pathname === subItem.url;
              return (
                <Link
                  key={subItem.title}
                  className={cn(
                    "flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-muted hover:text-accent-foreground",
                    isSubActive && "bg-muted text-primary",
                  )}
                  href={subItem.url}
                >
                  {subItem.icon}
                  <div>
                    <div className="text-sm font-semibold">{subItem.title}</div>
                    {subItem.description && (
                      <p className="text-sm leading-snug text-muted-foreground">
                        {subItem.description}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }

  return (
    <a
      key={item.title}
      href={item.url}
      className={cn(
        "font-semibold transition-colors",
        isActive ? "text-primary" : "",
      )}
    >
      {item.title}
    </a>
  );
};
