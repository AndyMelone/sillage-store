"use client";

import {
  ChevronRight,
  Citrus,
  Droplets,
  Flame,
  Flower2,
  Gem,
  Heart,
  Loader2,
  Menu,
  Search,
  ShoppingCart,
  Star,
  TreePine,
  User,
  Wind,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
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
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { listCollections } from "@/lib/data/collections";
import { searchProducts } from "@/lib/data/products";
import { useAuthStore } from "@/store/use-auth-store";
import { useCartStore } from "@/store/use-cart-store";
import { useWishlistStore } from "@/store/use-wishlist-store";
import { HttpTypes } from "@medusajs/types";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Palette of icons to assign to collections dynamically
const COLLECTION_ICONS = [
  Gem,
  Flower2,
  TreePine,
  Citrus,
  Flame,
  Droplets,
  Wind,
  Star,
];

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
}

export default function Navbar({
  logo = {
    url: "/",
    src: "/logo/sillage.webp",
    alt: "Sillage logo",
    title: "Sillage",
  },
}: NavbarProps) {
  const [openSearch, setOpenSearch] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const { checkAuth, isAuthenticated } = useAuthStore();
  const { openCart, items } = useCartStore();
  const { itemIds: wishlistItems } = useWishlistStore();
  const [collections, setCollections] = useState<HttpTypes.StoreCollection[]>(
    [],
  );

  useEffect(() => {
    setMounted(true);
    checkAuth();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [checkAuth]);

  useEffect(() => {
    listCollections()
      .then(({ collections: cols }) => {
        setCollections(cols);
      })
      .catch(() => {});
  }, []);

  // Build dynamic menu with real collection
  const menu: MenuItem[] = [
    { title: "Parfums", url: "/parfums" },
    {
      title: "Collections",
      url: "/collections",
      items: collections.map((col, idx) => {
        const IconComp = COLLECTION_ICONS[idx % COLLECTION_ICONS.length];
        return {
          title: col.title,
          description:
            (col.metadata?.description as string) ||
            `Découvrez notre collection ${col.title}`,
          icon: <IconComp className="size-5" />,
          url: `/parfums?collection=${col.handle}`,
        };
      }),
    },
    { title: "Notre histoire", url: "/notre-histoire" },
  ];

  if (!mounted) return null;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 z-50 w-full px-3 transition-all duration-700 ease-in-out sm:px-8 lg:px-12",
        isScrolled ? "pt-2" : "pt-8",
      )}
    >
      <div
        className={cn(
          "mx-auto max-w-7xl rounded-full border border-transparent transition-all duration-700",
          isScrolled
            ? "bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl shadow-zinc-200/20"
            : "bg-transparent backdrop-blur-none",
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between transition-all duration-700",
            isScrolled ? "px-4 py-2 sm:px-6" : "px-3 py-0 sm:px-4",
          )}
        >
          {/* Logo */}
          <div className="flex min-w-0 flex-1 justify-start">
            <Link href={logo.url} className="group flex items-center gap-3">
              <div
                className={cn(
                  "relative h-10 w-10 overflow-hidden rounded-full border border-zinc-100 shadow-sm transition-all duration-700 sm:h-14 sm:w-14",
                  isScrolled ? "sm:h-10 sm:w-10" : "",
                )}
              >
                <Image
                  fill
                  src={logo.src}
                  className="object-cover"
                  alt={logo.alt}
                />
              </div>
              <span
                className={cn(
                  "hidden font-serif font-light tracking-[0.35em] transition-all duration-700 sm:block",
                  isScrolled ? "text-xl" : "text-2xl",
                )}
              >
                SILLAGE
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden lg:block">
            <ul className="flex items-center gap-2">
              {menu.map((item) => (
                <li key={item.title}>
                  {item.items ? (
                    <MenuWithSubItems
                      item={item}
                      pathname={pathname}
                      isScrolled={isScrolled}
                    />
                  ) : (
                    <Link
                      href={item.url}
                      className={cn(
                        "px-5 py-2 text-xs uppercase tracking-widest font-semibold transition-all duration-300 rounded-full hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50",
                        pathname === item.url
                          ? "text-zinc-900 dark:text-white"
                          : "text-zinc-500",
                      )}
                    >
                      {item.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Actions */}
          <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="hidden rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 sm:inline-flex"
              onClick={() => setOpenSearch(true)}
            >
              <Search className="size-4" />
            </Button>

            <Link href="/wishlist">
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <Heart
                  className={cn(
                    "size-4",
                    wishlistItems.length > 0 && "fill-zinc-900 dark:fill-white",
                  )}
                />
                {wishlistItems.length > 0 && (
                  <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-zinc-900 text-[9px] font-bold text-white dark:bg-white dark:text-zinc-900">
                    {wishlistItems.length}
                  </span>
                )}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
              onClick={openCart}
            >
              <ShoppingCart className="size-4" />
              {items.length > 0 && (
                <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-zinc-900 text-[9px] font-bold text-white dark:bg-white dark:text-zinc-900">
                  {items.length > 99 ? "99+" : items.length}
                </span>
              )}
            </Button>

            <div className="mx-1 hidden h-4 w-px bg-zinc-200 dark:bg-zinc-800 sm:block sm:mx-2" />

            {isAuthenticated ? (
              <Link href="/compte">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden rounded-full gap-2 font-bold text-[10px] uppercase tracking-widest md:flex"
                >
                  <User className="size-4" />
                  Espace
                </Button>
              </Link>
            ) : (
              <Link href="/auth">
                <Button
                  size="sm"
                  className="hidden rounded-full bg-zinc-900 px-6 font-bold text-[10px] uppercase tracking-widest text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 md:flex"
                >
                  Connexion
                </Button>
              </Link>
            )}

            {/* Mobile Menu Trigger */}
            <MobileMenu
              menu={menu}
              logo={logo}
              isAuthenticated={isAuthenticated}
            />
          </div>
        </div>
      </div>

      {/* Search Dialog */}
      <SearchDialog open={openSearch} setOpen={setOpenSearch} />
    </header>
  );
}

function MenuWithSubItems({
  item,
  pathname,
  isScrolled,
}: {
  item: MenuItem;
  pathname: string;
  isScrolled: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isActive = item.items?.some(
    (sub) => pathname === sub.url || pathname.includes(sub.url),
  );
  const itemCount = item.items?.length || 0;
  const useGrid = itemCount > 3;

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className={cn(
          "px-5 py-2 text-xs uppercase tracking-widest font-semibold transition-all duration-300 rounded-full flex items-center gap-1.5",
          isOpen || isActive
            ? "text-zinc-900 dark:text-white"
            : "text-zinc-500",
        )}
      >
        <Link href={item.url}>{item.title}</Link>
        <ChevronRight
          className={cn(
            "size-3 transition-transform duration-300",
            isOpen ? "rotate-90" : "",
          )}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute top-full pt-4 animate-in fade-in slide-in-from-top-2 duration-300",
            useGrid ? "left-1/2 -translate-x-1/2" : "left-1/2 -translate-x-1/2",
          )}
        >
          <div
            className={cn(
              "bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl rounded-3xl p-4",
              useGrid ? "w-130" : "w-80",
            )}
          >
            {/* Grid or List of collections */}
            <div
              className={cn(
                "max-h-100 overflow-y-auto custom-scrollbar",
                useGrid ? "grid grid-cols-2 gap-2" : "space-y-1",
              )}
            >
              {item.items?.map((sub) => (
                <Link
                  key={sub.title}
                  href={sub.url}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-2xl transition-all duration-200",
                    pathname === sub.url
                      ? "bg-zinc-100 dark:bg-zinc-900"
                      : "hover:bg-zinc-50 dark:hover:bg-zinc-900",
                  )}
                >
                  <div className="mt-0.5 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-900 dark:text-white shadow-sm shrink-0">
                    {sub.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">
                      {sub.title}
                    </p>
                    <p className="text-[10px] text-zinc-500 leading-relaxed mt-0.5 line-clamp-2">
                      {sub.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* View All Link */}
            <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <Link
                href="/parfums"
                className="flex items-center justify-center gap-2 py-2 text-[10px] uppercase tracking-widest font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900"
              >
                Voir toutes les collections
                <ChevronRight className="size-3" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MobileMenu({
  menu,
  logo,
  isAuthenticated,
}: {
  menu: MenuItem[];
  logo: any;
  isAuthenticated: boolean;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full lg:hidden">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex w-full flex-col border-none p-0 sm:max-w-xs"
      >
        <SheetHeader className="border-b p-6 text-left sm:p-8">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border">
                <Image
                  src={logo.src}
                  alt="logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-serif text-2xl tracking-[0.2em]">
                SILLAGE
              </span>
            </Link>
          </div>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <nav className="space-y-8">
            {menu.map((item) => (
              <div key={item.title}>
                {item.items ? (
                  <Accordion type="single" collapsible>
                    <AccordionItem value={item.title} className="border-none">
                      <AccordionTrigger className="py-2 font-serif text-xl tracking-wide hover:no-underline">
                        {item.title}
                      </AccordionTrigger>
                      <AccordionContent className="pt-4 space-y-3">
                        {item.items.map((sub) => (
                          <Link
                            key={sub.title}
                            href={sub.url}
                            className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 transition-colors"
                          >
                            <div className="p-2.5 bg-white dark:bg-zinc-800 rounded-xl shadow-sm">
                              {sub.icon}
                            </div>
                            <span className="font-bold text-sm">
                              {sub.title}
                            </span>
                          </Link>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ) : (
                  <Link
                    href={item.url}
                    className="block text-xl font-serif py-2 border-none tracking-wide"
                  >
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
        <div className="p-8 border-t mt-auto bg-zinc-50 dark:bg-zinc-900/50">
          {isAuthenticated ? (
            <Button
              asChild
              className="w-full rounded-full h-14 font-bold text-xs uppercase tracking-widest"
              variant="outline"
            >
              <Link href="/compte">Mon Espace</Link>
            </Button>
          ) : (
            <Button
              asChild
              className="w-full rounded-full h-14 font-bold text-xs uppercase tracking-widest"
            >
              <Link href="/auth">Connexion</Link>
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function SearchDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<HttpTypes.StoreProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      return;
    }
  }, [open]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const products = await searchProducts(query, 6);
        setResults(products);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (handle: string) => {
    setOpen(false);
    setQuery("");
    setResults([]);
    router.push(`/produit/${handle}`);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <div className="relative">
        <CommandInput
          placeholder="Rechercher une fragrance..."
          className="h-14 border-none text-base"
          value={query}
          onValueChange={setQuery}
        />
        {isSearching && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Loader2 className="size-4 animate-spin text-zinc-400" />
          </div>
        )}
      </div>
      <CommandList className="p-2 max-h-[60vh]">
        {query.length >= 2 && results.length === 0 && !isSearching && (
          <div className="py-8 text-center text-sm text-zinc-500">
            Aucun parfum trouvé pour &quot;{query}&quot;.
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-1">
            <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              {results.length} résultat{results.length > 1 ? "s" : ""}
            </p>
            {results.map((product) => (
              <button
                key={product.id}
                onClick={() => handleSelect(product.handle!)}
                className="w-full rounded-xl p-3 flex items-center gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-left"
              >
                <div className="relative size-12 rounded-lg overflow-hidden border bg-zinc-50 shrink-0">
                  <Image
                    src={product.thumbnail || "/placeholder.webp"}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{product.title}</p>
                  <p className="text-xs text-zinc-500">
                    {product.collection?.title || "Parfum"}
                  </p>
                </div>
                <div className="text-sm font-bold shrink-0">
                  {product.variants?.[0]?.calculated_price?.calculated_amount
                    ? (
                        product.variants[0].calculated_price.calculated_amount /
                        100
                      ).toLocaleString("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      })
                    : "—"}
                </div>
              </button>
            ))}
          </div>
        )}

        {query.length < 2 && !isSearching && (
          <div className="space-y-1">
            <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Suggestions
            </p>
            <button
              onClick={() => setQuery("Boisé")}
              className="w-full rounded-xl p-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-left text-sm"
            >
              Parfums Boisés
            </button>
            <button
              onClick={() => setQuery("Fruité")}
              className="w-full rounded-xl p-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-left text-sm"
            >
              Senteurs Fruitées
            </button>
            <button
              onClick={() => setQuery("Floral")}
              className="w-full rounded-xl p-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-left text-sm"
            >
              Notes Florales
            </button>
          </div>
        )}
      </CommandList>
    </CommandDialog>
  );
}
