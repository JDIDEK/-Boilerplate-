export type JasmineWork = {
  slug: string;
  number: string;
  title: string;
  tags: string[];
  image: string;
  hoverVideo?: string;
  transitionType: "project";
};

export type BreakItem = {
  number: string;
  title: string;
  href: string;
  previewImage: string;
};

export const jasmineWorks: JasmineWork[] = [
  {
    slug: "home-in-a-hot-pot",
    number: "01",
    title: "Home in a Hot Pot",
    tags: ["Concept", "Design", "Motion"],
    image: "/jasmine/media/hotpot-styleframe.webp",
    hoverVideo: "/jasmine/media/hotpot-hover.mp4",
    transitionType: "project",
  },
  {
    slug: "flow-studio-branding",
    number: "02",
    title: "FLOW",
    tags: ["Art Direction", "Concept", "Design"],
    image: "/jasmine/media/flow-stickers.webp",
    transitionType: "project",
  },
  {
    slug: "pre-college-2025",
    number: "03",
    title: "PreCollege '25",
    tags: ["Concept", "Design", "Motion"],
    image: "/jasmine/media/precollege-still.webp",
    hoverVideo: "/jasmine/media/precollege-hover.mp4",
    transitionType: "project",
  },
  {
    slug: "the-taste-gap-visual-essay",
    number: "04",
    title: "The Taste Gap",
    tags: ["Concept", "Design", "Motion"],
    image: "/jasmine/media/taste-gap.webp",
    transitionType: "project",
  },
];

export const breakItems: BreakItem[] = [
  {
    number: "01",
    title: "Avant-Garde 2025",
    href: "#break",
    previewImage: "/jasmine/media/avantgarde.webp",
  },
  {
    number: "02",
    title: "Pea",
    href: "#break",
    previewImage: "/jasmine/media/pea.webp",
  },
  {
    number: "03",
    title: "Graff Mayhem",
    href: "#break",
    previewImage: "/jasmine/media/graff.webp",
  },
  {
    number: "04",
    title: "Future Proof",
    href: "#break",
    previewImage: "/jasmine/media/future-proof.webp",
  },
  {
    number: "05",
    title: "Xenoflora",
    href: "#break",
    previewImage: "/jasmine/media/xenoflora.webp",
  },
];

export const navItems = [
  { label: "Home", href: "#home", transitionType: "home" },
  { label: "Works", href: "#works", transitionType: "project" },
  { label: "Break", href: "#break", transitionType: "break" },
  { label: "About", href: "#intro", transitionType: "about" },
] as const;

