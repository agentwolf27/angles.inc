import { Suspense } from "react";
import { getServicesWithPackages } from "@/lib/data/services";
import { createPageMetadata } from "@/lib/seo";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = createPageMetadata({
  title: "Book a shoot",
  description:
    "Request a photography session: choose service, package, schedule, and optional deposit.",
  path: "/booking",
});

function WizardFallback() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-16">
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

export default async function BookingPage() {
  const data = await getServicesWithPackages();

  return (
    <Suspense fallback={<WizardFallback />}>
      <BookingWizard
        services={data.services}
        packagesByServiceSlug={data.packagesByServiceSlug}
      />
    </Suspense>
  );
}
