export interface Product {
  id: number;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  image1: string;
  image2: string;
  category: string;
  family: "boise" | "floral" | "oriental" | "frais";
  gender: "homme" | "femme" | "unisexe";
  description: string;
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
  volume: string;
  concentration: string;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export const products: Product[] = [
  {
    id: 1,
    slug: "noir-absolu",
    name: "Noir Absolu",
    price: 185.0,
    image1: "/images/perfume1-front.jpg",
    image2: "/images/perfume1-back.jpg",
    category: "Eau de Parfum",
    family: "oriental",
    gender: "unisexe",
    description:
      "Une fragrance mystérieuse et envoûtante qui capture l'essence de la nuit. Noir Absolu est un parfum audacieux qui révèle une personnalité sophistiquée et magnétique. Ses notes profondes et sensuelles créent une aura de mystère irrésistible.",
    notes: {
      top: ["Bergamote", "Poivre noir", "Cardamome"],
      heart: ["Iris", "Oud", "Rose de Damas"],
      base: ["Ambre gris", "Musc blanc", "Bois de santal"],
    },
    volume: "100ml",
    concentration: "Eau de Parfum - 20%",
    isBestSeller: true,
  },
  {
    id: 2,
    slug: "oud-mystique",
    name: "Oud Mystique",
    price: 245.0,
    image1: "/images/perfume2-front.jpg",
    image2: "/images/perfume2-back.jpg",
    category: "Parfum Intense",
    family: "boise",
    gender: "homme",
    description:
      "Un voyage olfactif vers les contrées orientales les plus précieuses. Oud Mystique célèbre la noblesse du bois d'oud, sublimé par des épices rares et des résines précieuses. Une création d'exception pour les connaisseurs.",
    notes: {
      top: ["Safran", "Cannelle", "Encens"],
      heart: ["Oud royal", "Jasmin sambac", "Rose centifolia"],
      base: ["Ambre", "Benjoin", "Vétiver"],
    },
    volume: "100ml",
    concentration: "Parfum Intense - 30%",
    isBestSeller: true,
  },
  {
    id: 3,
    slug: "rose-eternelle",
    name: "Rose Éternelle",
    price: 165.0,
    image1: "/images/perfume3-front.jpg",
    image2: "/images/perfume3-back.jpg",
    category: "Eau de Parfum",
    family: "floral",
    gender: "femme",
    description:
      "L'élégance intemporelle de la rose dans toute sa splendeur. Rose Éternelle capture la beauté éphémère des jardins de Grasse au petit matin. Une ode à la féminité et à la grâce, délicate mais inoubliable.",
    notes: {
      top: ["Poire", "Litchi", "Bergamote"],
      heart: ["Rose de mai", "Pivoine", "Magnolia"],
      base: ["Musc", "Cèdre blanc", "Patchouli"],
    },
    volume: "100ml",
    concentration: "Eau de Parfum - 20%",
    isBestSeller: true,
  },
  {
    id: 4,
    slug: "fraicheur-divine",
    name: "Fraîcheur Divine",
    price: 145.0,
    image1: "/images/perfume4-front.jpg",
    image2: "/images/perfume4-back.jpg",
    category: "Eau de Toilette",
    family: "frais",
    gender: "unisexe",
    description:
      "Une explosion de fraîcheur méditerranéenne. Fraîcheur Divine évoque les matins d'été sur la côte amalfitaine, où les agrumes se mêlent aux embruns marins. Un parfum vivifiant et lumineux.",
    notes: {
      top: ["Citron de Sicile", "Bergamote", "Pamplemousse"],
      heart: ["Néroli", "Petit grain", "Menthe"],
      base: ["Cèdre blanc", "Musc", "Notes marines"],
    },
    volume: "100ml",
    concentration: "Eau de Toilette - 15%",
    isNew: true,
  },
  {
    id: 5,
    slug: "gentleman-blue",
    name: "Gentleman Blue",
    price: 195.0,
    image1: "/images/perfume5-front.jpg",
    image2: "/images/perfume5-back.jpg",
    category: "Eau de Parfum",
    family: "boise",
    gender: "homme",
    description:
      "L'essence de la masculinité moderne. Gentleman Blue incarne l'homme raffiné et confiant, alliant puissance et élégance. Un sillage boisé et aromatique qui laisse une empreinte mémorable.",
    notes: {
      top: ["Lavande", "Romarin", "Poivre rose"],
      heart: ["Sauge sclarée", "Géranium", "Iris"],
      base: ["Bois de cèdre", "Vétiver", "Cuir"],
    },
    volume: "100ml",
    concentration: "Eau de Parfum - 20%",
    isNew: true,
  },
  {
    id: 6,
    slug: "ambre-royal",
    name: "Ambre Royal",
    price: 220.0,
    originalPrice: 275.0,
    image1: "/images/perfume6-front.jpg",
    image2: "/images/perfume6-back.jpg",
    category: "Parfum",
    family: "oriental",
    gender: "femme",
    description:
      "Un trésor d'Orient enveloppé de mystère. Ambre Royal est une symphonie de résines précieuses et d'épices envoûtantes. Ce parfum d'exception révèle une sensualité captivante et un charisme irrésistible.",
    notes: {
      top: ["Orange sanguine", "Gingembre", "Safran"],
      heart: ["Ambre", "Oud", "Rose turque"],
      base: ["Benjoin", "Vanille de Madagascar", "Musc"],
    },
    volume: "100ml",
    concentration: "Parfum - 25%",
  },
  {
    id: 7,
    slug: "jasmin-nocturne",
    name: "Jasmin Nocturne",
    price: 175.0,
    image1: "/images/perfume3-front.jpg",
    image2: "/images/perfume3-back.jpg",
    category: "Eau de Parfum",
    family: "floral",
    gender: "femme",
    description:
      "La magie enivrante du jasmin à la tombée de la nuit. Jasmin Nocturne capture l'instant magique où les fleurs blanches libèrent leurs notes les plus intenses et sensuelles.",
    notes: {
      top: ["Néroli", "Mandarine verte", "Aldéhydes"],
      heart: ["Jasmin sambac", "Tubéreuse", "Ylang-ylang"],
      base: ["Santal", "Ambre blanc", "Musc"],
    },
    volume: "100ml",
    concentration: "Eau de Parfum - 20%",
  },
  {
    id: 8,
    slug: "vetiver-intense",
    name: "Vétiver Intense",
    price: 189.0,
    image1: "/images/perfume2-front.jpg",
    image2: "/images/perfume2-back.jpg",
    category: "Eau de Parfum",
    family: "boise",
    gender: "homme",
    description:
      "La quintessence du vétiver dans une interprétation contemporaine. Vétiver Intense révèle toute la complexité de cette racine noble, entre terre et fumée, force et subtilité.",
    notes: {
      top: ["Bergamote", "Citron vert", "Galbanum"],
      heart: ["Vétiver d'Haïti", "Géranium bourbon", "Cyprès"],
      base: ["Bois de gaïac", "Mousse de chêne", "Ambre gris"],
    },
    volume: "100ml",
    concentration: "Eau de Parfum - 20%",
  },
  {
    id: 9,
    slug: "nuit-blanche",
    name: "Nuit Blanche",
    price: 155.0,
    image1: "/images/perfume1-front.jpg",
    image2: "/images/perfume1-back.jpg",
    category: "Eau de Parfum",
    family: "oriental",
    gender: "unisexe",
    description:
      "Une fragrance pour les âmes nocturnes. Nuit Blanche accompagne les noctambules dans leurs aventures urbaines, entre lumières de la ville et secrets de la nuit.",
    notes: {
      top: ["Poivre noir", "Cardamome", "Absinthe"],
      heart: ["Encens", "Labdanum", "Iris"],
      base: ["Vanille", "Tonka", "Cuir fumé"],
    },
    volume: "100ml",
    concentration: "Eau de Parfum - 20%",
    isNew: true,
  },
];

export interface Collection {
  slug: "boise" | "floral" | "oriental" | "frais";
  name: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  heroImage: string;
  notes: string[];
  characteristics: {
    icon: string;
    label: string;
    value: string;
  }[];
}

export const collections: Collection[] = [
  {
    slug: "boise",
    name: "Boisé",
    title: "Collection Boisée",
    description: "Notes de santal, cèdre et oud",
    longDescription:
      "Plongez dans l'univers envoûtant des bois précieux. Notre collection boisée célèbre la noblesse du santal, la puissance du cèdre et le mystère de l'oud. Ces fragrances intemporelles évoquent les forêts anciennes et les rituels sacrés, créant une aura de sophistication masculine et de profondeur olfactive.",
    image: "/images/collection-woody.jpg",
    heroImage: "/images/collection-boise-hero.jpg",
    notes: ["Santal", "Cèdre", "Oud", "Vétiver", "Patchouli", "Bois de Gaïac"],
    characteristics: [
      { icon: "🌲", label: "Caractère", value: "Profond & Mystérieux" },
      { icon: "⏰", label: "Tenue", value: "8-12 heures" },
      { icon: "🎯", label: "Sillage", value: "Modéré à intense" },
      { icon: "👔", label: "Occasion", value: "Soirée & Affaires" },
    ],
  },
  {
    slug: "floral",
    name: "Floral",
    title: "Collection Florale",
    description: "Rose, jasmin et pivoine",
    longDescription:
      "Laissez-vous transporter dans les jardins les plus précieux du monde. Notre collection florale capture l'essence des fleurs les plus nobles : la rose de Grasse, le jasmin de Provence et la pivoine délicate. Chaque fragrance est une ode à la féminité et à l'élégance naturelle.",
    image: "/images/collection-floral.jpg",
    heroImage: "/images/collection-floral-hero.jpg",
    notes: [
      "Rose de Mai",
      "Jasmin Sambac",
      "Pivoine",
      "Magnolia",
      "Tubéreuse",
      "Ylang-Ylang",
    ],
    characteristics: [
      { icon: "🌸", label: "Caractère", value: "Élégant & Romantique" },
      { icon: "⏰", label: "Tenue", value: "6-8 heures" },
      { icon: "🎯", label: "Sillage", value: "Délicat à modéré" },
      { icon: "💃", label: "Occasion", value: "Quotidien & Romantique" },
    ],
  },
  {
    slug: "oriental",
    name: "Oriental",
    title: "Collection Orientale",
    description: "Ambre, vanille et épices",
    longDescription:
      "Embarquez pour un voyage sensoriel vers les terres d'Orient. Notre collection orientale marie les résines précieuses, les épices envoûtantes et les notes gourmandes de vanille et d'ambre. Ces parfums captivants créent une aura de sensualité et de mystère irrésistible.",
    image: "/images/collection-oriental.jpg",
    heroImage: "/images/collection-oriental-hero.jpg",
    notes: ["Ambre", "Vanille", "Safran", "Encens", "Benjoin", "Tonka"],
    characteristics: [
      { icon: "✨", label: "Caractère", value: "Sensuel & Envoûtant" },
      { icon: "⏰", label: "Tenue", value: "10-14 heures" },
      { icon: "🎯", label: "Sillage", value: "Intense" },
      { icon: "🌙", label: "Occasion", value: "Soirée & Occasion spéciale" },
    ],
  },
  {
    slug: "frais",
    name: "Frais",
    title: "Collection Fraîche",
    description: "Agrumes et notes vertes",
    longDescription:
      "Respirez l'air pur des matins méditerranéens. Notre collection fraîche célèbre la vivacité des agrumes, la légèreté des notes marines et la fraîcheur des herbes aromatiques. Ces parfums lumineux et énergisants sont parfaits pour illuminer votre quotidien.",
    image: "/images/collection-fresh.jpg",
    heroImage: "/images/collection-frais-hero.jpg",
    notes: [
      "Citron de Sicile",
      "Bergamote",
      "Néroli",
      "Menthe",
      "Notes Marines",
      "Thé Vert",
    ],
    characteristics: [
      { icon: "🍋", label: "Caractère", value: "Vivifiant & Lumineux" },
      { icon: "⏰", label: "Tenue", value: "4-6 heures" },
      { icon: "🎯", label: "Sillage", value: "Léger à modéré" },
      { icon: "☀️", label: "Occasion", value: "Quotidien & Été" },
    ],
  },
];

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}

export function getAllCollections(): Collection[] {
  return collections;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getAllProducts(): Product[] {
  return products;
}

export function getProductsByFamily(family: string): Product[] {
  if (family === "all") return products;
  return products.filter((p) => p.family === family);
}

export function getBestSellers(): Product[] {
  return products.filter((p) => p.isBestSeller);
}

export function getNewArrivals(): Product[] {
  return products.filter((p) => p.isNew);
}
