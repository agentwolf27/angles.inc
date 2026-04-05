import { Suspense } from "react";
import { getPortfolioData } from "@/lib/data/portfolio";
import { createPageMetadata } from "@/lib/seo";
import { PortfolioGallery } from "@/components/portfolio/portfolio-gallery";
import { SectionHeader } from "@/components/marketing/section-header";
import { FadeIn } from "@/components/motion/fade-in";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = createPageMetadata({
  title: "Portfolio",
  description:
    "Filterable photography portfolio: automotive, dealerships, restaurants, events, and commercial work.",
  path: "/portfolio",
});

function GallerySkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
      ))}
    </div>
  );
}

export default async function PortfolioPage() {
  const { items } = await getPortfolioData();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <FadeIn>
        <SectionHeader
          eyebrow="Selected work"
          title="Portfolio"
          description="Browse by category. Every frame is produced with the same standard—accurate color, intentional composition, and delivery that plugs into your channels."
        />
      </FadeIn>
      <div className="mt-14">
        <Suspense fallback={<GallerySkeleton />}>
          <PortfolioGallery items={items} />
        </Suspense>
      </div>
    </div>
  );
}
