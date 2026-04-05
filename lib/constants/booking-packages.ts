import type { Package } from "@/types/database";

/** Offline / no-DB fallback packages aligned with seed.sql */
export function staticPackagesForService(
  serviceSlug: string,
  serviceId: string
): Package[] {
  const base = (slug: string, name: string, desc: string, price: number, dep: number, min: number, features: string[], ord: number): Package => ({
    id: `pkg-${serviceSlug}-${slug}`,
    service_id: serviceId,
    slug,
    name,
    description: desc,
    price_cents: price,
    deposit_cents: dep,
    duration_minutes: min,
    features,
    sort_order: ord,
    active: true,
    created_at: new Date().toISOString(),
  });

  switch (serviceSlug) {
    case "automotive":
      return [
        base("essential", "Essential", "Half-day creative session", 120000, 25000, 240, ["Up to 8 final images", "1 location", "Basic retouching"], 1),
        base("signature", "Signature", "Full-day production", 240000, 50000, 480, ["Up to 20 final images", "2 locations", "Advanced color & cleanup"], 2),
      ];
    case "dealership":
      return [
        base("lot-half-day", "Half-day lot", "Up to 25 vehicles", 95000, 20000, 240, ["Standard angles per SOP", "Web-ready exports"], 1),
        base("lot-full-day", "Full-day lot", "Up to 55 vehicles", 175000, 35000, 480, ["Priority scheduling", "Background consistency pass"], 2),
      ];
    case "restaurant":
      return [
        base("menu-refresh", "Menu refresh", "Hero dishes + interiors", 140000, 30000, 240, ["12 plated shots", "Interior sweep", "Social crops"], 1),
        base("full-story", "Full story", "Campaign-style coverage", 280000, 60000, 360, ["Chef portraits", "Lifestyle moments", "Extended gallery"], 2),
      ];
    case "dj-events":
      return [
        base("club-night", "Club night", "Up to 4 hours", 110000, 25000, 240, ["Performance + crowd", "Low-light optimized"], 1),
        base("festival-block", "Festival block", "Full event block", 220000, 50000, 480, ["Multi-stage coverage", "Rush selects add-on available"], 2),
      ];
    case "commercial-brand":
      return [
        base("half-day-studio", "Half-day studio", "Product or lifestyle", 180000, 40000, 240, ["Shot list planning", "High-res masters"], 1),
        base("campaign-day", "Campaign day", "Full production day", 360000, 75000, 480, ["BTS add-on", "Extended usage consultation"], 2),
      ];
    default:
      return [];
  }
}
