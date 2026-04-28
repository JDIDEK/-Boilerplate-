export type FeaturedProject = {
  id: string;
  slug: string;
  number: string;
  title: string;
  category: string;
  year: string;
  summary: string;
  image: string;
  accent: string;
  steel: string;
  handle: string;
  detail: string;
  specs: string[];
};

export const featuredProjects: FeaturedProject[] = [
  {
    id: "atelier-santoku",
    slug: "atelier-santoku",
    number: "01",
    title: "Atelier Santoku",
    category: "Kitchen Blade",
    year: "2026",
    summary: "A compact chef knife balanced for fine slicing, herbs, and daily prep.",
    image: "/media/knife-workbench.jpg",
    accent: "from-[#f1efe6] via-[#9ba0a0] to-[#1f2423]",
    steel: "14C28N stainless steel",
    handle: "smoked oak and brass pin",
    detail:
      "Hand-ground bevels, a quiet matte finish, and a short forward balance make this blade feel quick without losing authority on the board.",
    specs: ["175 mm blade", "2.1 mm spine", "61 HRC", "Convex micro-bevel"],
  },
  {
    id: "forge-office",
    slug: "forge-office",
    number: "02",
    title: "Forge Office",
    category: "Petty Knife",
    year: "2025",
    summary: "A small utility knife for citrus, garnish work, and tight bench tasks.",
    image: "/media/craftsman-workshop.jpg",
    accent: "from-[#f6dca2] via-[#ad6c36] to-[#20110b]",
    steel: "AEB-L stainless steel",
    handle: "walnut, copper, black liner",
    detail:
      "Made for cooks who reach for one nimble tool dozens of times a day: thin geometry, a rounded choil, and a handle that locks naturally into pinch grip.",
    specs: ["120 mm blade", "1.8 mm spine", "60 HRC", "Full tang"],
  },
  {
    id: "table-gyuto",
    slug: "table-gyuto",
    number: "03",
    title: "Table Gyuto",
    category: "Chef Knife",
    year: "2025",
    summary: "A long, lean chef profile for confident board work and clean release.",
    image: "/media/knife-workbench.jpg",
    accent: "from-[#e8ece8] via-[#6d7773] to-[#111615]",
    steel: "52100 carbon steel",
    handle: "bog oak and nickel silver",
    detail:
      "A precise workhorse with a slightly lower tip, tuned for rock chopping and push cuts while keeping the blade face visually restrained.",
    specs: ["220 mm blade", "2.4 mm spine", "62 HRC", "Forced patina ready"],
  },
  {
    id: "field-paring",
    slug: "field-paring",
    number: "04",
    title: "Field Paring",
    category: "Table Tool",
    year: "2024",
    summary: "A pocket-scale blade for fruit, trimming, and service-side precision.",
    image: "/media/craftsman-workshop.jpg",
    accent: "from-[#efe4cc] via-[#916a48] to-[#1b1711]",
    steel: "Nitro-V stainless steel",
    handle: "linen micarta and brass tube",
    detail:
      "Small enough to disappear on a table, serious enough to carry an artisan finish: satin blade, softened spine, and confident edge retention.",
    specs: ["85 mm blade", "1.6 mm spine", "60 HRC", "Hidden lanyard tube"],
  },
];

export function getProjectBySlug(slug: string) {
  return featuredProjects.find((project) => project.slug === slug);
}
