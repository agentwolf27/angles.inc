import { getTestimonials } from "@/lib/data/testimonials";
import { createPageMetadata } from "@/lib/seo";
import { SectionHeader } from "@/components/marketing/section-header";
import { FadeIn } from "@/components/motion/fade-in";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export const metadata = createPageMetadata({
  title: "Testimonials",
  description: "Client reviews across automotive, hospitality, events, and commercial photography.",
  path: "/testimonials",
});

export default async function TestimonialsPage() {
  const list = await getTestimonials(false);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <FadeIn>
        <SectionHeader
          eyebrow="Clients"
          title="Words from the field"
          description="Operators, marketers, and founders who care how their brand shows up—online, on the lot, and in the room."
          align="center"
          className="mx-auto"
        />
      </FadeIn>
      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {list.map((t, i) => (
          <FadeIn key={t.id} delay={i * 0.05}>
            <Card className="h-full border-border/80">
              <CardContent className="flex h-full flex-col gap-4 p-6">
                <div className="flex gap-0.5 text-amber-500">
                  {Array.from({ length: t.rating ?? 5 }).map((_, j) => (
                    <Star key={j} className="size-4 fill-current" />
                  ))}
                </div>
                <p className="flex-1 text-sm leading-relaxed">“{t.quote}”</p>
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
  );
}
