import { createPageMetadata } from "@/lib/seo";
import { SERVICE_PAGES, SERVICE_SLUGS } from "@/lib/constants/services";
import { SectionHeader } from "@/components/marketing/section-header";
import { FadeIn } from "@/components/motion/fade-in";
import { ServiceCard } from "@/components/services/service-card";

export const metadata = createPageMetadata({
  title: "Services",
  description:
    "Automotive, dealership, restaurant, event, and commercial photography services.",
  path: "/services",
});

const BLURBS: Record<string, string> = {
  automotive:
    "Editorial and private-client automotive with cinematic lighting and disciplined color.",
  dealership:
    "High-volume inventory and showroom coverage with SOP-friendly consistency.",
  restaurant:
    "Food, interiors, and hospitality storytelling for menus and campaigns.",
  "dj-events":
    "Low-light expertise for clubs, festivals, and brand nights.",
  "commercial-brand":
    "Campaign-ready stills for products, lifestyle, and omnichannel marketing.",
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <FadeIn>
        <SectionHeader
          eyebrow="Capabilities"
          title="Services built for operators"
          description="Each vertical has its own delivery standards—shared craft, different constraints. Start with the lane that matches your business, then extend as needed."
        />
      </FadeIn>
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICE_SLUGS.map((slug, i) => {
          const page = SERVICE_PAGES[slug];
          return (
            <FadeIn key={slug} delay={i * 0.05}>
              <ServiceCard
                title={page.headline}
                description={BLURBS[slug] ?? page.subhead}
                href={`/services/${slug}`}
              />
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}
