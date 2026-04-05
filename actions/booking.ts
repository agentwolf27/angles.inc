"use server";

import { revalidatePath } from "next/cache";
import { bookingFormSchema } from "@/lib/validations/booking";
import { resolveServicePackageIds } from "@/lib/data/services";
import { staticPackagesForService } from "@/lib/constants/booking-packages";
import { siteConfig } from "@/lib/site-config";
import { sendBookingConfirmationEmail } from "@/lib/resend";
import { getStripe } from "@/lib/stripe";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const CUSTOM_QUOTE_DEPOSIT_CENTS = 25_000;

function serviceLabel(slug: string): string {
  const labels: Record<string, string> = {
    automotive: "Automotive Photography",
    dealership: "Dealership Photography",
    restaurant: "Restaurant Photography",
    "dj-events": "DJ & Event Photography",
    "commercial-brand": "Commercial & Brand Photography",
  };
  return labels[slug] ?? slug;
}

export type BookingActionResult =
  | { ok: true; bookingId: string; checkoutUrl: string | null }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function submitBooking(
  raw: unknown
): Promise<BookingActionResult> {
  const parsed = bookingFormSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const data = parsed.data;
  if (!data.customQuote && !data.packageSlug) {
    return { ok: false, error: "Select a package or choose custom quote." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return {
      ok: false,
      error:
        "Booking database is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    };
  }

  const { service_id, package_id } = await resolveServicePackageIds(
    data.serviceSlug,
    data.packageSlug ?? null,
    data.customQuote
  );

  const { data: booking, error: insertErr } = await supabase
    .from("bookings")
    .insert({
      service_id,
      package_id,
      custom_quote: data.customQuote,
      preferred_date: data.preferredDate,
      preferred_time: data.preferredTime,
      location: data.location,
      project_notes: data.projectNotes ?? null,
      client_name: data.clientName,
      client_email: data.clientEmail,
      client_phone: data.clientPhone ?? null,
      status: "new",
      deposit_paid: false,
    })
    .select("id")
    .single();

  if (insertErr || !booking) {
    console.error(insertErr);
    return { ok: false, error: "Could not save booking. Please try again." };
  }

  const bookingId = booking.id as string;

  if (data.referenceFileUrls.length > 0) {
    await supabase.from("booking_files").insert(
      data.referenceFileUrls.map((url) => ({
        booking_id: bookingId,
        file_url: url,
        file_name: null,
      }))
    );
  }

  let depositCents = CUSTOM_QUOTE_DEPOSIT_CENTS;
  let packageLabel = "Custom quote";

  if (!data.customQuote) {
    if (package_id) {
      const { data: pkgRow } = await supabase
        .from("packages")
        .select("name, deposit_cents")
        .eq("id", package_id)
        .maybeSingle();
      if (pkgRow) {
        depositCents = pkgRow.deposit_cents as number;
        packageLabel = pkgRow.name as string;
      }
    } else if (data.packageSlug) {
      const pkgs = staticPackagesForService(
        data.serviceSlug,
        service_id ?? `svc-${data.serviceSlug}`
      );
      const pkg = pkgs.find((p) => p.slug === data.packageSlug);
      if (pkg) {
        depositCents = pkg.deposit_cents;
        packageLabel = pkg.name;
      }
    }
  }

  if (data.payDeposit) {
    const stripe = getStripe();
    if (!stripe) {
      return {
        ok: false,
        error:
          "Stripe is not configured (STRIPE_SECRET_KEY). Uncheck deposit or add keys.",
      };
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${siteConfig.url}/booking/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteConfig.url}/booking?cancelled=1`,
      customer_email: data.clientEmail,
      metadata: { booking_id: bookingId },
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: depositCents,
            product_data: {
              name: `${siteConfig.name} — session deposit`,
              description: `${serviceLabel(data.serviceSlug)} · ${packageLabel}`,
            },
          },
          quantity: 1,
        },
      ],
    });

    await supabase
      .from("bookings")
      .update({ stripe_session_id: session.id })
      .eq("id", bookingId);

    revalidatePath("/admin/bookings");

    await sendBookingConfirmationEmail({
      to: data.clientEmail,
      bookingId,
      clientName: data.clientName,
      serviceLabel: serviceLabel(data.serviceSlug),
      packageLabel,
      preferredDate: data.preferredDate,
      depositPaid: false,
    });

    return { ok: true, bookingId, checkoutUrl: session.url };
  }

  await sendBookingConfirmationEmail({
    to: data.clientEmail,
    bookingId,
    clientName: data.clientName,
    serviceLabel: serviceLabel(data.serviceSlug),
    packageLabel,
    preferredDate: data.preferredDate,
    depositPaid: false,
  });

  revalidatePath("/admin/bookings");

  return { ok: true, bookingId, checkoutUrl: null };
}
