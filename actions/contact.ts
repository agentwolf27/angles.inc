"use server";

import { revalidatePath } from "next/cache";
import { contactFormSchema } from "@/lib/validations/contact";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sendContactNotificationEmail } from "@/lib/resend";

export type ContactActionResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function submitContact(raw: unknown): Promise<ContactActionResult> {
  const parsed = contactFormSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please check your message.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const supabase = await createSupabaseServerClient();
  if (supabase) {
    const { error } = await supabase.from("contact_inquiries").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      message: parsed.data.message,
    });
    if (error) {
      console.error(error);
      return { ok: false, error: "Could not send inquiry. Try again later." };
    }
  }

  await sendContactNotificationEmail(parsed.data);
  revalidatePath("/admin/leads");
  return { ok: true };
}
