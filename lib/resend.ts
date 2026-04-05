import { Resend } from "resend";
import { siteConfig } from "@/lib/site-config";

export function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function sendBookingConfirmationEmail(input: {
  to: string;
  bookingId: string;
  clientName: string;
  serviceLabel: string;
  packageLabel: string;
  preferredDate: string;
  depositPaid: boolean;
}): Promise<{ ok: boolean; error?: string }> {
  const resend = getResend();
  const from = process.env.RESEND_FROM_EMAIL;
  if (!resend || !from) {
    console.warn("[resend] Skipping email — RESEND_API_KEY or RESEND_FROM_EMAIL not set");
    return { ok: false, error: "Email not configured" };
  }

  try {
    await resend.emails.send({
      from,
      to: input.to,
      subject: `Booking request received — ${siteConfig.name}`,
      html: `
        <p>Hi ${input.clientName},</p>
        <p>Thanks for your request. We received your booking details and will confirm availability shortly.</p>
        <ul>
          <li><strong>Reference:</strong> ${input.bookingId}</li>
          <li><strong>Service:</strong> ${input.serviceLabel}</li>
          <li><strong>Package:</strong> ${input.packageLabel}</li>
          <li><strong>Preferred date:</strong> ${input.preferredDate}</li>
          <li><strong>Deposit:</strong> ${input.depositPaid ? "Received — thank you!" : "Not paid online — we may invoice separately."}</li>
        </ul>
        <p>— ${siteConfig.name}</p>
      `,
    });
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("[resend]", message);
    return { ok: false, error: message };
  }
}

export async function sendContactNotificationEmail(input: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}): Promise<{ ok: boolean }> {
  const resend = getResend();
  const from = process.env.RESEND_FROM_EMAIL;
  if (!resend || !from) {
    console.warn("[resend] Skipping contact notification");
    return { ok: false };
  }
  try {
    await resend.emails.send({
      from,
      to: siteConfig.email,
      replyTo: input.email,
      subject: `New inquiry from ${input.name}`,
      html: `<p>From: ${input.name} &lt;${input.email}&gt;</p>
             ${input.phone ? `<p>Phone: ${input.phone}</p>` : ""}
             <p>${input.message.replace(/\n/g, "<br/>")}</p>`,
    });
    return { ok: true };
  } catch (e) {
    console.error("[resend] contact", e);
    return { ok: false };
  }
}
