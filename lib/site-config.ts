/**
 * Central branding — swap values here to re-theme the whole site.
 */
export const siteConfig = {
  name: "Angles Studio",
  photographerName: "Jordan Lee",
  tagline: "Professional photography for automotive, hospitality, events, and brands.",
  description:
    "Angles Studio delivers editorial-quality imagery for dealerships, restaurants, nightlife, and commercial teams—on schedule and on brand.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "hello@anglesstudio.com",
  phone: "+1 (555) 014-2277",
  social: {
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
  },
  ogImage: "/og-default.jpg",
} as const;

export type SiteConfig = typeof siteConfig;
