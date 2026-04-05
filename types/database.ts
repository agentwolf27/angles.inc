export type BookingStatus = "new" | "confirmed" | "completed" | "cancelled";

export type ProfileRole = "admin" | "client";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: ProfileRole;
  created_at: string;
}

export interface Service {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface Package {
  id: string;
  service_id: string | null;
  slug: string;
  name: string;
  description: string | null;
  price_cents: number;
  deposit_cents: number;
  duration_minutes: number | null;
  features: string[];
  sort_order: number;
  active: boolean;
  created_at: string;
}

export interface PortfolioCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
}

export interface PortfolioItem {
  id: string;
  category_id: string;
  title: string;
  description: string | null;
  cloudinary_public_id: string | null;
  image_url: string;
  featured: boolean;
  sort_order: number;
  created_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  company: string | null;
  industry: string | null;
  quote: string;
  rating: number | null;
  featured: boolean;
  sort_order: number;
  created_at: string;
}

export interface Booking {
  id: string;
  service_id: string | null;
  package_id: string | null;
  custom_quote: boolean;
  preferred_date: string;
  preferred_time: string | null;
  location: string;
  project_notes: string | null;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  status: BookingStatus;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  deposit_paid: boolean;
  created_at: string;
  updated_at: string;
}

export interface BookingFile {
  id: string;
  booking_id: string;
  file_url: string;
  file_name: string | null;
  created_at: string;
}

export interface AvailabilityBlock {
  id: string;
  start_date: string;
  end_date: string;
  reason: string | null;
  created_at: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  created_at: string;
}

export interface Payment {
  id: string;
  booking_id: string | null;
  stripe_payment_intent_id: string | null;
  amount_cents: number;
  currency: string;
  status: string | null;
  created_at: string;
}
