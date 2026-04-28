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
  slug: string;
  number: string;
  title: string;
  href: string;
  previewImage: string;
  hoverVideo?: string;
};

export type AwardItem = {
  title: string;
  image: string;
  body: string;
};

export type JasmineProject = JasmineWork & {
  studies: string[];
  roles: string[];
  heroVideo?: string;
  detailTabs: Array<{
    label: string;
    body: string;
    image: string;
  }>;
  gallery: Array<{
    image: string;
    caption?: string;
  }>;
  process: Array<{
    media: string;
    type?: "image" | "video";
    body: string;
  }>;
  nextSlug: string;
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

export const curatedWorks: JasmineWork[] = [
  ...jasmineWorks,
  {
    slug: "pinc",
    number: "05",
    title: "PINC",
    tags: ["Branding", "Design", "Motion"],
    image: "/jasmine/media/work-pinc-still.webp",
    hoverVideo: "/jasmine/media/work-pinc-hover.mp4",
    transitionType: "project",
  },
  {
    slug: "national-ad-council",
    number: "06",
    title: "National Ad Council",
    tags: ["Concept", "Motion"],
    image: "/jasmine/media/work-nac.webp",
    hoverVideo: "/jasmine/media/work-nac-hover.mp4",
    transitionType: "project",
  },
  {
    slug: "telemundo",
    number: "07",
    title: "Telemundo",
    tags: ["Design", "Motion"],
    image: "/jasmine/media/work-telemundo.webp",
    transitionType: "project",
  },
  {
    slug: "vote-boldly",
    number: "08",
    title: "Vote Boldly",
    tags: ["Campaign", "Motion"],
    image: "/jasmine/media/work-vote.webp",
    hoverVideo: "/jasmine/media/work-vote-hover.mp4",
    transitionType: "project",
  },
  {
    slug: "moving-poster-shinichi-maruyama",
    number: "09",
    title: "Moving Poster",
    tags: ["Poster", "Motion"],
    image: "/jasmine/media/work-moving-poster.webp",
    hoverVideo: "/jasmine/media/work-moving-poster-hover.mp4",
    transitionType: "project",
  },
  {
    slug: "nature-abstraction",
    number: "10",
    title: "Nature + Abstraction",
    tags: ["Design", "Motion"],
    image: "/jasmine/media/work-nature.webp",
    transitionType: "project",
  },
  {
    slug: "einsteins-dreams-title-sequence",
    number: "11",
    title: "Einstein's Dreams",
    tags: ["Title", "Motion"],
    image: "/jasmine/media/work-einstein.webp",
    hoverVideo: "/jasmine/media/work-einstein-hover.mp4",
    transitionType: "project",
  },
  {
    slug: "demo-reel",
    number: "12",
    title: "Demo Reel",
    tags: ["Motion", "Reel"],
    image: "/jasmine/media/work-demoreel.webp",
    hoverVideo: "/jasmine/media/demoreel.mp4",
    transitionType: "project",
  },
];

export const breakItems: BreakItem[] = [
  {
    slug: "avant-garde-2025",
    number: "01",
    title: "Avant-Garde 2025",
    href: "/break",
    previewImage: "/jasmine/media/avantgarde.webp",
    hoverVideo: "/jasmine/media/break-avantgarde-hover.mp4",
  },
  {
    slug: "pea",
    number: "02",
    title: "Pea",
    href: "/break",
    previewImage: "/jasmine/media/pea.webp",
    hoverVideo: "/jasmine/media/break-pea-hover.mp4",
  },
  {
    slug: "graff-mayhem",
    number: "03",
    title: "Graff Mayhem",
    href: "/break",
    previewImage: "/jasmine/media/graff.webp",
    hoverVideo: "/jasmine/media/break-graff-hover.mp4",
  },
  {
    slug: "future-proof",
    number: "04",
    title: "Future Proof",
    href: "/break",
    previewImage: "/jasmine/media/future-proof.webp",
  },
  {
    slug: "xenoflora",
    number: "05",
    title: "Xenoflora",
    href: "/break",
    previewImage: "/jasmine/media/xenoflora.webp",
    hoverVideo: "/jasmine/media/break-xeno-hover.mp4",
  },
  {
    slug: "sleeping-creature-self-portrait",
    number: "06",
    title: "Sleeping Creature",
    href: "/break",
    previewImage: "/jasmine/media/avantgarde.webp",
    hoverVideo: "/jasmine/media/break-sleeping-hover.mp4",
  },
  {
    slug: "elemental-alphabet-rotoscope",
    number: "07",
    title: "Elemental Alphabet",
    href: "/break",
    previewImage: "/jasmine/media/break-elemental.webp",
    hoverVideo: "/jasmine/media/break-elemental-hover.mp4",
  },
  {
    slug: "12-principles-of-animation",
    number: "08",
    title: "12 Principles of Animation",
    href: "/break",
    previewImage: "/jasmine/media/break-12.webp",
    hoverVideo: "/jasmine/media/break-12-hover.mp4",
  },
  {
    slug: "nabe",
    number: "09",
    title: "Nabe",
    href: "/break",
    previewImage: "/jasmine/media/break-nabe.webp",
  },
  {
    slug: "haku-blossom",
    number: "10",
    title: "Haku Blossom",
    href: "/break",
    previewImage: "/jasmine/media/break-haku.webp",
    hoverVideo: "/jasmine/media/break-haku-hover.mp4",
  },
];

export const awardItems: AwardItem[] = [
  {
    title: "HOME IN A HOT POT",
    image: "/jasmine/media/award-hotpot.webp",
    body:
      "2025: Collision Award Gold Winner, Tokyo Film & Screenplay Awards, Best Hollywood Day Short Film Festival, New York Lift-Off Film Festival. 2026: LA Film & Documentary Awards Winner.",
  },
  {
    title: "PINC",
    image: "/jasmine/media/award-pinc.webp",
    body: "ADDY Professional Silver Award for elements of advertising, animation, special effects, or motion graphics.",
  },
  {
    title: "PRECOLLEGE '25",
    image: "/jasmine/media/award-precollege.webp",
    body: "ADDY Professional Silver Award for cross-platform integrated campaign work.",
  },
  {
    title: "VOTE BOLDLY",
    image: "/jasmine/media/award-vote.gif",
    body: "ADDY Student Silver Award 2025.",
  },
  {
    title: "NATIONAL AD COUNCIL",
    image: "/jasmine/media/award-nac.webp",
    body: "ADDY Student Silver Award 2025.",
  },
];

const hotpotProject: JasmineProject = {
  ...curatedWorks[0],
  studies: ["thesis"],
  roles: ["concept", "design", "motion"],
  heroVideo: "/jasmine/media/project-hotpot-final.mp4",
  detailTabs: [
    {
      label: "OVERVIEW",
      body:
        "A mixed-media animation exploring family dynamics through the metaphor of a shared hot pot meal. Told through visual metaphors and narration, the story unfolds using hand-crafted food elements and expressive typography.",
      image: "/jasmine/media/project-hotpot-early-02.webp",
    },
    {
      label: "CHALLENGE",
      body:
        "How do you capture family dynamics without the usual anthropomorphic characters? Early design and animation were all digital, which felt cold and lacked a tactile feeling.",
      image: "/jasmine/media/project-hotpot-early-03.webp",
    },
    {
      label: "REFLECTION",
      body:
        "Finalizing the mixed-media design style while keeping the message of family accessible is what made the project work.",
      image: "/jasmine/media/project-hotpot-styleframe5.webp",
    },
    {
      label: "SCRIPT",
      body:
        "Every family's a unique blend of ingredients. Simmering with potential. Loving, nurturing, and complex, with just a dash of spice.",
      image: "/jasmine/media/project-hotpot-early-01.webp",
    },
    {
      label: "AWARDS",
      body:
        "Collision Award Gold Winner, Tokyo Film & Screenplay Awards selected animation, New York Lift-Off Film Festival selected animation, LA Film & Documentary Awards Winner.",
      image: "/jasmine/media/hotpot-styleframe.webp",
    },
  ],
  gallery: [
    { image: "/jasmine/media/project-hotpot-styleframe2.webp" },
    { image: "/jasmine/media/project-hotpot-styleframe3.webp" },
    { image: "/jasmine/media/project-hotpot-styleframe1.webp" },
    { image: "/jasmine/media/project-hotpot-styleframe4.webp" },
    { image: "/jasmine/media/hotpot-styleframe.webp" },
  ],
  process: [
    { media: "/jasmine/media/project-process-img-1.webp", body: "Kelly Warner and Fiona Greenleaf in action for narration!" },
    { media: "/jasmine/media/project-process-team.webp", body: "Hot Pot helpers and production tests." },
    { media: "/jasmine/media/project-process-assets.webp", body: "Overview picture of elements used in the animation." },
    { media: "/jasmine/media/project-process-animatic.mp4", type: "video", body: "Early animatic." },
    { media: "/jasmine/media/project-process-background.webp", body: "Hand-painted backgrounds and color separation." },
  ],
  nextSlug: "flow-studio-branding",
};

export const jasmineProjects: JasmineProject[] = curatedWorks.map((work, index) => {
  if (work.slug === hotpotProject.slug) {
    return hotpotProject;
  }

  const next = curatedWorks[(index + 1) % curatedWorks.length];
  return {
    ...work,
    studies: ["visual language"],
    roles: work.tags.map((tag) => tag.toLowerCase()),
    heroVideo: work.hoverVideo,
    detailTabs: [
      {
        label: "OVERVIEW",
        body: `${work.title} is part of Jasmine Gunarto's curated motion and design work, built around expressive systems, narrative rhythm, and precise visual direction.`,
        image: work.image,
      },
      {
        label: "APPROACH",
        body: "The project balances concept, design language, and motion behavior into a focused visual sequence.",
        image: work.image,
      },
      {
        label: "ROLE",
        body: `Roles include ${work.tags.join(", ").toLowerCase()}.`,
        image: work.image,
      },
    ],
    gallery: [{ image: work.image }, { image: work.image }, { image: work.image }],
    process: [{ media: work.image, body: "Selected frame and visual development." }],
    nextSlug: next.slug,
  };
});

export function getJasmineProjectBySlug(slug: string) {
  return jasmineProjects.find((project) => project.slug === slug);
}

export const navItems = [
  { label: "Home", href: "/", transitionType: "home" },
  { label: "Works", href: "/works", transitionType: "project" },
  { label: "Break", href: "/break", transitionType: "break" },
  { label: "About", href: "/about", transitionType: "about" },
] as const;
