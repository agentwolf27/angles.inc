import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Testimonial } from "@/types/database";

const FALLBACK: Testimonial[] = [
  {
    id: "t1",
    client_name: "Morgan Ellis",
    company: "Northline Motors",
    industry: "Automotive",
    quote:
      "Our online leads jumped after we standardized lot photography. Consistent, fast, and zero babysitting.",
    rating: 5,
    featured: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "t2",
    client_name: "Riley Chen",
    company: "Harbor & Hearth",
    industry: "Hospitality",
    quote:
      "Imagery finally matches how the dining room feels. Menu refreshes are painless now.",
    rating: 5,
    featured: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "t3",
    client_name: "Devon Ortiz",
    company: "Pulse Events",
    industry: "Events",
    quote:
      "Captures the energy of our nights without missing branding beats. Same-night selects saved our launch.",
    rating: 5,
    featured: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: "t4",
    client_name: "Samira Khan",
    company: "Fieldcraft Goods",
    industry: "Commercial",
    quote:
      "Studio day felt like an in-house creative partner. Shot list to delivery was seamless.",
    rating: 5,
    featured: false,
    sort_order: 4,
    created_at: new Date().toISOString(),
  },
];

export async function getTestimonials(featuredOnly = false): Promise<Testimonial[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return featuredOnly ? FALLBACK.filter((t) => t.featured) : FALLBACK;
  }

  let q = supabase.from("testimonials").select("*").order("sort_order", { ascending: true });
  if (featuredOnly) q = q.eq("featured", true);

  const { data, error } = await q;
  if (error || !data?.length) {
    return featuredOnly ? FALLBACK.filter((t) => t.featured) : FALLBACK;
  }
  return data as Testimonial[];
}
