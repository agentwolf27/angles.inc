import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10, "Please share a bit more detail"),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
