import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  SERVICE_PAGES,
  SERVICE_SLUGS,
  isServiceSlug,
} from "@/lib/constants/services";
import { createPageMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { staticPackagesForService } from "@/lib/constants/booking-packages";
import { getServicesWithPackages } from "@/lib/data/services";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  if (!isServiceSlug(slug)) return {};
  const p = SERVICE_PAGES[slug];
  return createPageMetadata({
    title: p.headline,
    description: p.subhead,
    path: `/services/${slug}`,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  if (!isServiceSlug(slug)) notFound();

  const content = SERVICE_PAGES[slug];
  const { services, packagesByServiceSlug } = await getServicesWithPackages();
  const svc = services.find((s) => s.slug === slug);
  const packages =
    svc && packagesByServiceSlug[slug]?.length
      ? packagesByServiceSlug[slug]!
      : staticPackagesForService(slug, svc?.id ?? `svc-${slug}`);

  const unsplash =
    slug === "automotive"
      ? "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=80"
      : slug === "dealership"
        ? "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1600&q=80"
        : slug === "restaurant"
          ? "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80"
          : slug === "dj-events"
            ? "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1600&q=80"
            : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600&q=80";

  return (
    <>
      <section className="relative isolate min-h-[55vh]">
        <Image
          src={unsplash}
          alt=""
          fill
          className="object-cover brightness-[0.5]"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="relative z-10 mx-auto flex min-h-[55vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/80">
            Service
          </p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl font-medium tracking-tight text-white sm:text-5xl md:text-6xl">
            {content.headline}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/85">{content.subhead}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full">
              <Link href={`/booking?service=${slug}`}>Book this service</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-white/40 bg-white/10 text-white hover:bg-white/20"
            >
              <Link href="/pricing">View packages</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-20 px-4 py-16 sm:px-6 sm:py-24">
        <section className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl">Who it&apos;s for</h2>
            <ul className="mt-6 space-y-3 text-muted-foreground">
              {content.forWhom.map((line) => (
                <li key={line} className="flex gap-2 text-sm leading-relaxed">
                  <span className="text-primary">—</span>
                  {line}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl">What&apos;s included</h2>
            <ul className="mt-6 space-y-3 text-muted-foreground">
              {content.included.map((line) => (
                <li key={line} className="flex gap-2 text-sm leading-relaxed">
                  <span className="text-primary">—</span>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl sm:text-3xl">Sample work</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Replace these placeholders with Cloudinary-backed assets from your
            Supabase `portfolio_items` rows for this vertical.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80",
              "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
              "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80",
            ].map((src, i) => (
              <div
                key={i}
                className="relative aspect-[4/5] overflow-hidden rounded-xl border border-border/80"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="33vw"
                />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl sm:text-3xl">Packages</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {packages.map((pkg) => (
              <Card key={pkg.slug} className="border-border/80">
                <CardContent className="space-y-4 p-6">
                  <div>
                    <h3 className="font-serif text-xl">{pkg.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {pkg.description}
                    </p>
                  </div>
                  <p className="text-2xl font-medium">
                    ${(pkg.price_cents / 100).toLocaleString()}
                    <span className="text-sm font-normal text-muted-foreground">
                      {" "}
                      · deposit ${(pkg.deposit_cents / 100).toLocaleString()}
                    </span>
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {pkg.features.map((f) => (
                      <li key={f}>— {f}</li>
                    ))}
                  </ul>
                  <Button asChild className="w-full rounded-full sm:w-auto">
                    <Link
                      href={`/booking?service=${slug}&package=${pkg.slug}`}
                    >
                      Select in booking
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="max-w-2xl">
          <h2 className="font-serif text-2xl sm:text-3xl">FAQs</h2>
          <div className="mt-6 divide-y divide-border border-y">
            {content.faqs.map((faq) => (
              <details key={faq.q} className="group py-4">
                <summary className="cursor-pointer list-none font-medium outline-none marker:content-none [&::-webkit-details-marker]:hidden">
                  {faq.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border/80 bg-muted/40 p-8 text-center sm:p-12">
          <h2 className="font-serif text-2xl sm:text-3xl">
            Tell us about your production
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            Dates, locations, shot list, and references—all captured in our booking
            flow so we can respond with a clear plan.
          </p>
          <Button asChild size="lg" className="mt-6 rounded-full">
            <Link href={`/booking?service=${slug}`}>Start booking</Link>
          </Button>
        </section>
      </div>
    </>
  );
}
