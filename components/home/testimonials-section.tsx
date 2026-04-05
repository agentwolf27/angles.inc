import Link from "next/link";
import { Star } from "lucide-react";
import type { Testimonial } from "@/types/database";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeader } from "@/components/marketing/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function TestimonialsSection({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  return (
    <section className="bg-muted/40 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <FadeIn>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeader
              eyebrow="Social proof"
              title="Trusted by operators who live and die by the visual"
              description="From showrooms to tasting menus to main stages—the bar is always the same: clarity, mood, and conversion."
            />
            <Button asChild variant="outline" className="shrink-0 rounded-full">
              <Link href="/testimonials">All testimonials</Link>
            </Button>
          </div>
        </FadeIn>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.slice(0, 3).map((t, i) => (
            <FadeIn key={t.id} delay={i * 0.08}>
              <Card className="h-full border-border/80 bg-card/80 backdrop-blur">
                <CardContent className="flex h-full flex-col gap-4 p-6">
                  <div className="flex gap-0.5 text-amber-500">
                    {Array.from({ length: t.rating ?? 5 }).map((_, j) => (
                      <Star key={j} className="size-4 fill-current" />
                    ))}
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-foreground">
                    “{t.quote}”
                  </p>
                  <div>
                    <p className="font-medium">{t.client_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {[t.company, t.industry].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
