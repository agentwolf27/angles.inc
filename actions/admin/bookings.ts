"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminProfile } from "@/lib/auth/admin";
import type { BookingStatus } from "@/types/database";

const statusSchema = z.enum(["new", "confirmed", "completed", "cancelled"]);

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus
): Promise<{ ok: boolean; error?: string }> {
  const parsed = statusSchema.safeParse(status);
  if (!parsed.success) return { ok: false, error: "Invalid status" };

  const { supabase } = await requireAdminProfile();

  const { error } = await supabase
    .from("bookings")
    .update({ status: parsed.data })
    .eq("id", bookingId);

  if (error) {
    console.error(error);
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/bookings");
  return { ok: true };
}
