import { STATIC_CATEGORIES } from "@/lib/constants/services";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { PortfolioCategory, PortfolioItem } from "@/types/database";

export type PortfolioItemView = PortfolioItem & { category_slug: string };

function staticFallback(): {
  categories: PortfolioCategory[];
  items: PortfolioItemView[];
} {
  const categories: PortfolioCategory[] = STATIC_CATEGORIES.map((c, i) => ({
    id: `static-cat-${c.slug}`,
    slug: c.slug,
    name: c.name,
    description: c.description ?? null,
    sort_order: i,
  }));

  const items: PortfolioItemView[] = [
    {
      id: "1",
      category_id: categories[0]!.id,
      title: "Midnight coupe",
      description: "Editorial street series",
      cloudinary_public_id: null,
      image_url:
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=80",
      featured: true,
      sort_order: 1,
      created_at: new Date().toISOString(),
      category_slug: "automotive",
    },
    {
      id: "2",
      category_id: categories[0]!.id,
      title: "Desert run",
      description: "Campaign stills",
      cloudinary_public_id: null,
      image_url:
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
      featured: false,
      sort_order: 2,
      created_at: new Date().toISOString(),
      category_slug: "automotive",
    },
    {
      id: "3",
      category_id: categories[1]!.id,
      title: "Showroom hero",
      description: "OEM-aligned framing",
      cloudinary_public_id: null,
      image_url:
        "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=80",
      featured: true,
      sort_order: 1,
      created_at: new Date().toISOString(),
      category_slug: "dealerships",
    },
    {
      id: "4",
      category_id: categories[2]!.id,
      title: "Chef's table",
      description: "Tasting menu coverage",
      cloudinary_public_id: null,
      image_url:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80",
      featured: true,
      sort_order: 1,
      created_at: new Date().toISOString(),
      category_slug: "restaurants",
    },
    {
      id: "5",
      category_id: categories[3]!.id,
      title: "Laser & crowd",
      description: "Club residency",
      cloudinary_public_id: null,
      image_url:
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80",
      featured: true,
      sort_order: 1,
      created_at: new Date().toISOString(),
      category_slug: "dj-events",
    },
    {
      id: "6",
      category_id: categories[4]!.id,
      title: "Product flat",
      description: "DTC launch",
      cloudinary_public_id: null,
      image_url:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80",
      featured: true,
      sort_order: 1,
      created_at: new Date().toISOString(),
      category_slug: "commercial-branding",
    },
  ];

  return { categories, items };
}

export async function getPortfolioData(): Promise<{
  categories: PortfolioCategory[];
  items: PortfolioItemView[];
}> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return staticFallback();

  const { data: categories, error: cErr } = await supabase
    .from("portfolio_categories")
    .select("*")
    .order("sort_order", { ascending: true });

  const { data: rawItems, error: iErr } = await supabase
    .from("portfolio_items")
    .select(
      `
      *,
      portfolio_categories ( slug )
    `
    )
    .order("sort_order", { ascending: true });

  if (cErr || iErr || !categories?.length || !rawItems?.length) {
    return staticFallback();
  }

  const items: PortfolioItemView[] = rawItems.map(
    (row: Record<string, unknown>) => {
      const cat = row.portfolio_categories as { slug: string } | null;
      const { portfolio_categories: _pc, ...rest } = row;
      return {
        ...(rest as unknown as PortfolioItem),
        category_slug: cat?.slug ?? "",
      };
    }
  );

  return { categories: categories as PortfolioCategory[], items };
}
