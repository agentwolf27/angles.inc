import Link from "next/link";
import { getServicesWithPackages } from "@/lib/data/services";
import { createPageMetadata } from "@/lib/seo";
import { SectionHeader } from "@/components/marketing/section-header";
import { FadeIn } from "@/components/motion/fade-in";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = createPageMetadata({
  title: "Pricing & packages",
  description:
    "Transparent packages by service category. Deposits secure your date; balances are invoiced per agreement.",
  path: "/pricing",
});

export default async function PricingPage() {
  const { services, packagesByServiceSlug } = await getServicesWithPackages();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <FadeIn>
        <SectionHeader
          eyebrow="Investment"
          title="Packages that scale with the brief"
          description="Starting points for each vertical—custom quotes stay available for multi-day productions, travel, and usage-heavy campaigns. A deposit is required to hold confirmed dates."
        />
      </FadeIn>

      <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-muted-foreground">
        <strong className="text-foreground">Deposits:</strong> Online booking can
        collect a card deposit via Stripe; otherwise we invoice per your contract.
        Custom quotes may use a different hold amount.
      </div>

      <div className="mt-14 space-y-16">
        {services.map((svc, si) => {
          const pkgs = packagesByServiceSlug[svc.slug] ?? [];
          if (!pkgs.length) return null;
          return (
            <section key={svc.id}>
              <FadeIn delay={si * 0.05}>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="font-serif text-2xl sm:text-3xl">{svc.name}</h2>
                    {svc.description ? (
                      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                        {svc.description}
                      </p>
                    ) : null}
                  </div>
                  <Button asChild variant="outline" className="rounded-full shrink-0">
                    <Link href={`/services/${svc.slug}`}>Service detail</Link>
                  </Button>
                </div>
              </FadeIn>
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {pkgs.map((pkg, pi) => (
                  <FadeIn key={pkg.id} delay={pi * 0.06}>
                    <Card className="h-full border-border/80">
                      <CardContent className="flex h-full flex-col gap-4 p-6">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-serif text-xl">{pkg.name}</h3>
                          <Badge variant="secondary">Popular</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {pkg.description}
                        </p>
                        <div>
                          <p className="text-3xl font-medium">
                            ${(pkg.price_cents / 100).toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Deposit from $
                            {(pkg.deposit_cents / 100).toLocaleString()}
                          </p>
                        </div>
                        <ul className="flex-1 space-y-2 text-sm text-muted-foreground">
                          {pkg.features.map((f) => (
                            <li key={f}>— {f}</li>
                          ))}
                        </ul>
                        <Button asChild className="rounded-full">
                          <Link
                            href={`/booking?service=${svc.slug}&package=${pkg.slug}`}
                          >
                            Book this package
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </FadeIn>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <FadeIn>
        <div className="mt-20 rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center">
          <h3 className="font-serif text-xl">Need a custom quote?</h3>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
            Multi-location shoots, retainers, dealership programs, and restaurant
            content calendars—tell us the scope and we&apos;ll respond with a
            structured proposal.
          </p>
          <Button asChild className="mt-6 rounded-full" variant="secondary">
            <Link href="/booking">Start with custom quote</Link>
          </Button>
        </div>
      </FadeIn>
    </div>
  );
}
