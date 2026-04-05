import { getTestimonials } from "@/lib/data/testimonials";
import { createPageMetadata } from "@/lib/seo";
import { HomeHero } from "@/components/home/home-hero";
import { IntroServices } from "@/components/home/intro-services";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { HowItWorks } from "@/components/home/how-it-works";
import { FinalCta } from "@/components/home/final-cta";

export const metadata = createPageMetadata({
  title: "Professional photography studio",
  description:
    "Premium photography for automotive, dealerships, restaurants, events, and brands. Book online.",
  path: "/",
});

export default async function HomePage() {
  const testimonials = await getTestimonials(true);

  return (
    <>
      <HomeHero />
      <IntroServices />
      <FeaturedCategories />
      <TestimonialsSection testimonials={testimonials} />
      <HowItWorks />
      <FinalCta />
    </>
  );
}
