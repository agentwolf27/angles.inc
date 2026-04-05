import { Calendar, Camera, Send } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeader } from "@/components/marketing/section-header";

const steps = [
  {
    icon: Calendar,
    title: "Book your window",
    body: "Choose your service, package, and ideal date. Add references so we align before day one.",
  },
  {
    icon: Camera,
    title: "Shoot with intent",
    body: "On-site direction, efficient coverage, and consistent standards—whether it’s a lot, a kitchen, or a stage.",
  },
  {
    icon: Send,
    title: "Deliver & activate",
    body: "Organized exports for web, print, and social—ready for your CMS, ad platforms, and sales team.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <FadeIn>
          <SectionHeader
            eyebrow="Process"
            title="How it works"
            description="A simple, high-touch flow—modeled after premium booking experiences, built for a solo studio."
            align="center"
            className="mx-auto"
          />
        </FadeIn>
        <div className="mt-16 grid gap-10 md:grid-cols-3">
          {steps.map((s, i) => (
            <FadeIn key={s.title} delay={i * 0.1}>
              <div className="relative rounded-2xl border border-border/80 bg-card p-8 text-center shadow-sm">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <s.icon className="size-6" />
                </div>
                <h3 className="mt-6 font-serif text-xl">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
