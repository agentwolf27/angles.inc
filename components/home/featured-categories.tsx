import Link from "next/link";
import Image from "next/image";
import { STATIC_CATEGORIES } from "@/lib/constants/services";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeader } from "@/components/marketing/section-header";

const PREVIEW: Record<string, string> = {
  automotive:
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80",
  dealerships:
    "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80",
  restaurants:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
  "dj-events":
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
  "commercial-branding":
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
};

export function FeaturedCategories() {
  return (
    <section className="border-y border-border/60 bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <FadeIn>
          <SectionHeader
            eyebrow="Portfolio"
            title="Work across industries"
            description="Dedicated galleries for every vertical—without losing the thread of one cohesive visual voice."
          />
        </FadeIn>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STATIC_CATEGORIES.map((cat, i) => (
            <FadeIn key={cat.slug} delay={i * 0.06}>
              <Link
                href={`/portfolio?cat=${cat.slug}`}
                className="group relative block overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition hover:shadow-md"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={PREVIEW[cat.slug] ?? PREVIEW.automotive}
                    alt=""
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width:768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-5">
                    <h3 className="font-serif text-xl text-white">{cat.name}</h3>
                    <p className="mt-1 text-sm text-white/80">
                      {cat.description}
                    </p>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
