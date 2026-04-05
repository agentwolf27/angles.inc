import { siteConfig } from "@/lib/site-config";
import { createPageMetadata } from "@/lib/seo";
import { SectionHeader } from "@/components/marketing/section-header";
import { FadeIn } from "@/components/motion/fade-in";
import { ContactForm } from "@/components/contact/contact-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = createPageMetadata({
  title: "Contact",
  description: `Reach ${siteConfig.name} for photography inquiries and bookings.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <FadeIn>
            <SectionHeader
              eyebrow="Contact"
              title="Let’s talk about your next shoot"
              description="Share context—even rough—and we’ll reply with availability, a recommended package, and any prep items."
            />
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="mt-10 space-y-4 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Email:</span>{" "}
                <a className="underline" href={`mailto:${siteConfig.email}`}>
                  {siteConfig.email}
                </a>
              </p>
              <p>
                <span className="font-medium text-foreground">Phone:</span>{" "}
                <a className="underline" href={`tel:${siteConfig.phone}`}>
                  {siteConfig.phone}
                </a>
              </p>
              <div className="flex flex-wrap gap-3 pt-4">
                <Button asChild variant="outline" className="rounded-full">
                  <a href={siteConfig.social.instagram} target="_blank" rel="noreferrer">
                    Instagram
                  </a>
                </Button>
                <Button asChild variant="outline" className="rounded-full">
                  <a href={siteConfig.social.linkedin} target="_blank" rel="noreferrer">
                    LinkedIn
                  </a>
                </Button>
                <Button asChild className="rounded-full">
                  <Link href="/booking">Book online</Link>
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
        <FadeIn delay={0.12}>
          <ContactForm />
        </FadeIn>
      </div>
    </div>
  );
}
