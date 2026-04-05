import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const stripe = getStripe();
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !whSecret) {
    return NextResponse.json(
      { error: "Stripe webhook not configured" },
      { status: 501 }
    );
  }

  const body = await request.text();
  const headerList = await headers();
  const signature = headerList.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, whSecret);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid payload";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const admin = createSupabaseServiceRoleClient();
  if (!admin) {
    return NextResponse.json(
      { error: "Service role not configured" },
      { status: 501 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.booking_id;
    if (bookingId && session.payment_intent) {
      const pi =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent.id;

      await admin
        .from("bookings")
        .update({
          deposit_paid: true,
          stripe_payment_intent_id: pi,
        })
        .eq("id", bookingId);

      const amount = session.amount_total ?? 0;
      await admin.from("payments").insert({
        booking_id: bookingId,
        stripe_payment_intent_id: pi,
        amount_cents: amount,
        currency: session.currency ?? "usd",
        status: "succeeded",
      });
    }
  }

  return NextResponse.json({ received: true });
}
