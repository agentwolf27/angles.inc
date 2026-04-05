import Link from "next/link";
import { getStripe } from "@/lib/stripe";
import { createPageMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";

export const metadata = createPageMetadata({
  title: "Booking received",
  description: "Your photography booking request was submitted.",
  path: "/booking/confirmation",
});

type Props = { searchParams: Promise<{ session_id?: string; ref?: string }> };

export default async function BookingConfirmationPage({ searchParams }: Props) {
  const sp = await searchParams;
  let paid = false;
  if (sp.session_id) {
    const stripe = getStripe();
    if (stripe) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sp.session_id);
        paid = session.payment_status === "paid";
      } catch {
        paid = false;
      }
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
        Thank you
      </p>
      <h1 className="mt-4 font-serif text-3xl tracking-tight sm:text-4xl">
        {paid ? "Deposit received" : "Request received"}
      </h1>
      <p className="mt-4 text-sm text-muted-foreground">
        {paid
          ? "Your deposit is on file. We’ll confirm the schedule and send next steps shortly."
          : "We’ll review availability and follow up by email—usually within one business day."}
      </p>
      {sp.ref ? (
        <p className="mt-6 rounded-lg border border-border/80 bg-muted/40 px-4 py-3 font-mono text-xs text-muted-foreground">
          Reference: {sp.ref}
        </p>
      ) : null}
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button asChild className="rounded-full">
          <Link href="/portfolio">Browse portfolio</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </div>
  );
}
