import Link from "next/link";
import { FadeIn } from "@/components/motion/fade-in";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="border-t border-border/60 bg-primary py-20 text-primary-foreground sm:py-24">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <FadeIn>
          <h2 className="font-serif text-3xl tracking-tight sm:text-4xl md:text-5xl">
            Ready when your calendar is
          </h2>
          <p className="mt-4 text-primary-foreground/85">
            Share your shoot goals, location, and timing—we’ll confirm availability
            and next steps, usually within one business day.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-background text-foreground hover:bg-background/90"
            >
              <Link href="/booking">Start booking</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link href="/contact">Ask a question</Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
