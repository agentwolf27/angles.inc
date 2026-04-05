import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { createPageMetadata } from "@/lib/seo";
import { SectionHeader } from "@/components/marketing/section-header";
import { FadeIn } from "@/components/motion/fade-in";
import { Button } from "@/components/ui/button";

export const metadata = createPageMetadata({
  title: "About",
  description: `Meet ${siteConfig.photographerName} — ${siteConfig.tagline}`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <FadeIn>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border/80">
            <Image
              src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=900&q=80"
              alt={siteConfig.photographerName}
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 50vw"
              priority
            />
          </div>
        </FadeIn>
        <div>
          <FadeIn delay={0.08}>
            <SectionHeader
              eyebrow="About the studio"
              title={`${siteConfig.photographerName}, founder of ${siteConfig.name}`}
              description="I built Angles Studio for clients who need agency-level consistency without agency overhead—especially where technical craft matters: metal, glass, food, and low light."
            />
          </FadeIn>
          <FadeIn delay={0.12}>
            <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                Over the past decade I&apos;ve shot for dealerships moving thousands
                of units, restaurants launching new concepts, nightlife brands
                scaling nationally, and product teams who can&apos;t afford muddy
                color or weak composition.
              </p>
              <p>
                My approach pairs disciplined exposure and color management with
                fast on-set direction—so stakeholders see usable assets quickly,
                not endless rounds of “we’ll fix it in post.”
              </p>
            </div>
            <div className="mt-10 rounded-xl border border-border/80 bg-muted/40 p-6">
              <h3 className="font-medium text-foreground">Industries served</h3>
              <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                <li>Automotive & dealerships</li>
                <li>Restaurants & hospitality</li>
                <li>DJ, events & nightlife</li>
                <li>Commercial & brand</li>
              </ul>
            </div>
            <Button asChild className="mt-8 rounded-full" size="lg">
              <Link href="/booking">Plan a shoot</Link>
            </Button>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
