import { z } from "zod";
import { SERVICE_SLUGS, type ServiceSlug } from "@/lib/constants/services";

const serviceEnum = z.string().refine(
  (s): s is ServiceSlug =>
    (SERVICE_SLUGS as readonly string[]).includes(s),
  "Invalid service"
);

export const bookingFormSchema = z.object({
  serviceSlug: serviceEnum,
  packageSlug: z.string().min(1).nullable().optional(),
  customQuote: z.boolean(),
  preferredDate: z.string().min(1, "Pick a date"),
  preferredTime: z.string().min(1, "Pick a time"),
  location: z.string().min(2, "Location is required"),
  projectNotes: z.string().optional(),
  clientName: z.string().min(2, "Name is required"),
  clientEmail: z.string().email(),
  clientPhone: z.string().optional(),
  payDeposit: z.boolean(),
  referenceFileUrls: z.array(z.string().url()).default([]),
});

export type BookingFormInput = z.infer<typeof bookingFormSchema>;
