import type { PortfolioCategory } from "@/types/database";

/** Public routes + content keys — aligned with Supabase `services.slug` seed. */
export const SERVICE_SLUGS = [
  "automotive",
  "dealership",
  "restaurant",
  "dj-events",
  "commercial-brand",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export interface ServicePageContent {
  slug: ServiceSlug;
  headline: string;
  subhead: string;
  forWhom: string[];
  included: string[];
  faqs: { q: string; a: string }[];
  sampleImageKeywords: string;
}

export const PORTFOLIO_CATEGORY_SLUGS = [
  "automotive",
  "dealerships",
  "restaurants",
  "dj-events",
  "commercial-branding",
  "all",
] as const;

export type PortfolioCategorySlug = (typeof PORTFOLIO_CATEGORY_SLUGS)[number];

/** Maps portfolio filter tabs to one or more DB category slugs */
export const PORTFOLIO_FILTER_MAP: Record<
  Exclude<PortfolioCategorySlug, "all">,
  string[]
> = {
  automotive: ["automotive"],
  dealerships: ["dealerships"],
  restaurants: ["restaurants"],
  "dj-events": ["dj-events"],
  "commercial-branding": ["commercial-branding"],
};

export function categorySlugForPortfolioTab(
  tab: PortfolioCategorySlug
): string[] | null {
  if (tab === "all") return null;
  return PORTFOLIO_FILTER_MAP[tab];
}

export const SERVICE_PAGES: Record<ServiceSlug, ServicePageContent> = {
  automotive: {
    slug: "automotive",
    headline: "Automotive & lifestyle imagery",
    subhead:
      "Hero frames, detail studies, and motion-ready assets for enthusiasts and private clients.",
    forWhom: [
      "Collectors and private sellers",
      "Aftermarket and tuning brands",
      "Editorial and creative campaigns",
    ],
    included: [
      "Location scouting assistance",
      "Multi-light or natural setups",
      "Color-managed RAW delivery",
      "Web and print export sets",
    ],
    faqs: [
      {
        q: "Do you shoot on location only?",
        a: "Most automotive work is on location. Studio options are available by request in select markets.",
      },
      {
        q: "How fast is turnaround?",
        a: "Proofs within 5–7 business days for standard sessions; rush available.",
      },
    ],
    sampleImageKeywords: "car, automotive, night city",
  },
  dealership: {
    slug: "dealership",
    headline: "Dealership & inventory photography",
    subhead:
      "Consistent, conversion-focused imagery that scales across your lot and digital channels.",
    forWhom: [
      "Single-rooftop and auto groups",
      "Used luxury specialists",
      "Fleet and commercial truck dealers",
    ],
    included: [
      "Standardized framing per SOP",
      "Background cleanup options",
      "VIN-organized delivery folders",
      "CMS-ready naming",
    ],
    faqs: [
      {
        q: "Can you match our brand guidelines?",
        a: "Yes—angle, crop, and post templates can mirror your OEM or group standards.",
      },
      {
        q: "Do you offer recurring lot days?",
        a: "Monthly or weekly on-site blocks are available for high-volume stores.",
      },
    ],
    sampleImageKeywords: "dealership, showroom, SUV",
  },
  restaurant: {
    slug: "restaurant",
    headline: "Restaurant & hospitality photography",
    subhead:
      "Appetizing food, ambient interiors, and team moments that fill reservations and delivery apps.",
    forWhom: [
      "Independent restaurants and bars",
      "Hotel F&B and boutique stays",
      "Ghost kitchens launching new menus",
    ],
    included: [
      "Styled hero dishes and menu flats",
      "Interior and patio coverage",
      "Staff and chef portraits on request",
      "Social crops (4:5, 9:16, 1:1)",
    ],
    faqs: [
      {
        q: "Do you work during service hours?",
        a: "Pre-service windows are ideal; closed days or slow lunches work well too.",
      },
      {
        q: "Can you coordinate with our chef?",
        a: "Yes—kitchen timeline planning is part of pre-production.",
      },
    ],
    sampleImageKeywords: "restaurant, food plating, interior",
  },
  "dj-events": {
    slug: "dj-events",
    headline: "DJ, nightlife & event photography",
    subhead:
      "Energy-forward coverage for clubs, festivals, private events, and artist promos.",
    forWhom: [
      "DJs and promoters",
      "Venues and hospitality groups",
      "Corporate and brand activations",
    ],
    included: [
      "Low-light optimized capture",
      "Crowd and performer coverage",
      "Same-night social selects (add-on)",
      "Gallery delivery with usage guidance",
    ],
    faqs: [
      {
        q: "Do you bring lighting?",
        a: "On-camera and small accent lighting as needed; venue rules permitting.",
      },
      {
        q: "How do rights work for artists?",
        a: "Licensing is defined per contract—promotional vs. commercial use clarified upfront.",
      },
    ],
    sampleImageKeywords: "concert, DJ, nightclub lights",
  },
  "commercial-brand": {
    slug: "commercial-brand",
    headline: "Commercial & brand photography",
    subhead:
      "Campaign-ready stills for product launches, lookbooks, and omnichannel marketing.",
    forWhom: [
      "In-house marketing teams",
      "Creative agencies",
      "DTC and lifestyle brands",
    ],
    included: [
      "Creative treatment and shot list",
      "Talent and prop coordination support",
      "High-res masters + brand exports",
      "Optional BTS for social",
    ],
    faqs: [
      {
        q: "Do you sign NDAs and contracts?",
        a: "Yes—standard MSA/SOW or yours, plus usage addenda as needed.",
      },
      {
        q: "Can you match existing art direction?",
        a: "Mood boards and reference packs are welcome in the booking flow.",
      },
    ],
    sampleImageKeywords: "product, brand, studio commercial",
  },
};

/** Display labels for portfolio tabs */
export const PORTFOLIO_TABS: { slug: PortfolioCategorySlug; label: string }[] = [
  { slug: "all", label: "All work" },
  { slug: "automotive", label: "Automotive" },
  { slug: "dealerships", label: "Dealerships" },
  { slug: "restaurants", label: "Restaurants" },
  { slug: "dj-events", label: "DJ / Events" },
  { slug: "commercial-branding", label: "Commercial" },
];

export function isServiceSlug(s: string): s is ServiceSlug {
  return (SERVICE_SLUGS as readonly string[]).includes(s);
}

/** Static shape for SSR when DB is empty — matches seed intent */
export const STATIC_CATEGORIES: Omit<
  PortfolioCategory,
  "id" | "sort_order"
>[] = [
  {
    slug: "automotive",
    name: "Automotive",
    description: "Private builds, editorial, and street stories.",
  },
  {
    slug: "dealerships",
    name: "Dealerships",
    description: "Inventory, showroom, and brand-consistent lots.",
  },
  {
    slug: "restaurants",
    name: "Restaurants",
    description: "Food, interiors, and hospitality storytelling.",
  },
  {
    slug: "dj-events",
    name: "DJ / Events",
    description: "Nightlife, festivals, and live energy.",
  },
  {
    slug: "commercial-branding",
    name: "Commercial / Branding",
    description: "Campaigns, products, and creative direction.",
  },
];
