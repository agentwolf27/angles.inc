import Link from "next/link";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeader } from "@/components/marketing/section-header";
import { Button } from "@/components/ui/button";

export function IntroServices() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <FadeIn>
          <SectionHeader
            eyebrow="Services"
            title="One studio, multiple industries"
            description="Angles Studio is structured like a creative agency partner: clear packages, repeatable delivery, and room for custom productions when the brief demands it."
          />
          <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
            <li>Automotive & dealership programs</li>
            <li>Restaurant, food, and hospitality</li>
            <li>DJ, nightlife, and live events</li>
            <li>Commercial, product, and brand campaigns</li>
          </ul>
          <Button asChild className="mt-8 rounded-full" size="lg">
            <Link href="/services">Explore services</Link>
          </Button>
        </FadeIn>
        <FadeIn delay={0.12}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border/80 bg-muted">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900&q=80)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-background/90 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 rounded-xl bg-background/90 p-5 shadow-lg backdrop-blur">
              <p className="font-serif text-lg leading-snug">
                “We don’t decorate reality—we clarify it so buyers feel what you
                already know is true about your brand.”
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                — Creative direction note, Angles Studio
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
