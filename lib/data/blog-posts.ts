export interface BlogPost {
  slug: string;
  image: string;
  date: string;
  readTime: string;
  author: string;
  title: string;
  excerpt: string;
  content: string[];
  isNew?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "comment-bien-choisir-son-parfum",
    image: "/placeholders/perfume-luxury-gold.png",
    date: "22 Mars 2026",
    readTime: "6 min de lecture",
    author: "Équipe Sillage",
    title: "Comment bien choisir son parfum",
    excerpt:
      "Un guide pratique pour trouver la fragrance qui correspond vraiment à votre personnalité et à votre peau, du choix des notes de tête à la tenue dans le temps.",
    isNew: true,
    content: [
      "Choisir un parfum ne se résume pas à sentir un flacon en boutique. C'est un processus qui demande du temps, car chaque fragrance évolue différemment au contact de votre peau, de sa chimie et de votre température corporelle.",
      "Commencez toujours par identifier la famille olfactive qui vous attire naturellement : boisée, florale, orientale ou hespéridée. C'est souvent un bon point de départ pour restreindre le champ des possibles avant même de tester un produit.",
      "Une fois le flacon vaporisé, laissez passer au moins 15 à 20 minutes avant de juger. Les notes de tête, très volatiles, laissent rapidement place au cœur du parfum, puis au fond, qui est la signature qui restera sur votre peau plusieurs heures.",
      "Enfin, ne testez jamais plus de trois parfums à la suite : votre odorat se sature rapidement. Prenez le temps, faites des pauses, et surtout, faites confiance à votre ressenti plus qu'à la description marketing du produit.",
    ],
  },
  {
    slug: "guide-des-familles-olfactives",
    image: "/images/collection-woody.jpg",
    date: "18 Mars 2026",
    readTime: "5 min de lecture",
    author: "Équipe Sillage",
    title: "Le guide des familles olfactives",
    excerpt:
      "Boisé, floral, oriental, hespéridé... comprendre les grandes familles pour mieux s'y retrouver.",
    content: [
      "La classification olfactive est l'outil de base de tout amateur de parfum. Elle permet de regrouper les fragrances selon leurs caractéristiques dominantes et de mieux naviguer parmi des milliers de créations.",
      "La famille boisée évoque le santal, le cèdre ou le vétiver : chaleureuse et enveloppante, elle est souvent choisie pour sa profondeur et sa longévité sur la peau.",
      "La famille florale, la plus vaste, va de la rose à la fleur d'oranger en passant par le jasmin. Elle peut être légère et printanière ou au contraire opulente et capiteuse.",
      "La famille orientale, riche en épices, résines et vanille, dégage une sensualité affirmée, tandis que la famille hespéridée, portée par les agrumes, privilégie fraîcheur et légèreté.",
    ],
  },
  {
    slug: "notre-philosophie-inspiration-parfum",
    image: "/images/histoire/ingredients.png",
    date: "14 Mars 2026",
    readTime: "4 min de lecture",
    author: "Équipe Sillage",
    title: "Notre philosophie sur l'inspiration de parfum",
    excerpt:
      "Un regard transparent sur nos standards de qualité et notre façon de recréer les grandes fragrances.",
    content: [
      "Chez Sillage, une inspiration de parfum n'est jamais une copie approximative. C'est un travail rigoureux qui utilise les mêmes familles olfactives et des matières premières de qualité comparable à celles des grandes maisons.",
      "Nous travaillons avec des laboratoires exigeants pour analyser les compositions originales et en recréer la structure : notes de tête, de cœur et de fond, dans les mêmes proportions et le même équilibre.",
      "L'objectif n'est pas de vendre un nom de marque, mais un jus. C'est ce choix qui nous permet de proposer des créations d'une grande fidélité olfactive à des prix très largement inférieurs.",
    ],
  },
  {
    slug: "bien-conserver-ses-parfums",
    image: "/images/collection-floral.jpg",
    date: "9 Mars 2026",
    readTime: "7 min de lecture",
    author: "Équipe Sillage",
    title: "Bien conserver ses parfums",
    excerpt:
      "Lumière, chaleur, humidité : les bons gestes pour préserver la qualité de vos fragrances le plus longtemps possible.",
    content: [
      "Un parfum est une composition fragile. Mal conservé, il peut perdre en intensité et voir sa couleur ou son odeur évoluer prématurément.",
      "La lumière directe du soleil est l'ennemi numéro un : elle accélère l'oxydation des molécules odorantes. Privilégiez un rangement à l'abri de la lumière, idéalement dans son coffret d'origine.",
      "Évitez également la salle de bain, où les variations de température et d'humidité sont importantes. Une commode ou un dressing tempéré reste le meilleur endroit pour stocker vos flacons.",
      "Enfin, refermez toujours bien le bouchon après usage : l'oxygène est, avec la chaleur, l'un des principaux facteurs d'altération d'un parfum dans le temps.",
    ],
  },
  {
    slug: "appliquer-son-parfum-tenue-longue-duree",
    image: "/placeholders/perfume-vue-2.png",
    date: "3 Mars 2026",
    readTime: "5 min de lecture",
    author: "Équipe Sillage",
    title: "Comment appliquer son parfum pour une tenue longue durée",
    excerpt:
      "Les zones du corps, les gestes et les astuces pour faire durer votre sillage toute la journée.",
    content: [
      "La tenue d'un parfum ne dépend pas uniquement de sa concentration, mais aussi de la façon dont il est appliqué. Quelques gestes simples permettent de prolonger significativement sa présence sur la peau.",
      "Privilégiez les zones chaudes du corps où le sang circule proche de la surface : poignets, cou, derrière les oreilles et l'intérieur des coudes. Cette chaleur naturelle diffuse le parfum tout au long de la journée.",
      "Appliquez sur peau hydratée plutôt que sèche : une peau bien hydratée retient mieux les molécules odorantes qu'une peau sèche qui les absorbe trop rapidement.",
      "Évitez de frotter les poignets l'un contre l'autre après application, ce geste casse la structure des molécules de tête et altère la première impression olfactive du parfum.",
    ],
  },
  {
    slug: "histoire-parfumerie-de-niche",
    image: "/images/collection-oriental.jpg",
    date: "24 Février 2026",
    readTime: "6 min de lecture",
    author: "Équipe Sillage",
    title: "L'histoire de la parfumerie de niche",
    excerpt:
      "D'où vient la parfumerie de niche et pourquoi elle se distingue des grandes maisons commerciales.",
    content: [
      "La parfumerie de niche est née en réaction à l'industrialisation croissante des grandes maisons commerciales, en quête de créations plus audacieuses, plus personnelles et moins soumises aux impératifs marketing de masse.",
      "Là où un parfum commercial est pensé pour plaire au plus grand nombre, une création de niche assume des choix forts : des matières premières rares, des accords inattendus, une signature olfactive unique.",
      "Cette exigence a longtemps eu un coût très élevé, réservant la niche à une clientèle restreinte. C'est précisément ce constat qui a motivé la création de Sillage Parfums : rendre cette exigence accessible à tous.",
    ],
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
