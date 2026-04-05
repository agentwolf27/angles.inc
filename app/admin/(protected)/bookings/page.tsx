import { requireAdminProfile } from "@/lib/auth/admin";
import { BookingsTable } from "@/components/admin/bookings-table";

export default async function AdminBookingsPage() {
  const { supabase } = await requireAdminProfile();

  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      id,
      created_at,
      client_name,
      client_email,
      preferred_date,
      location,
      status,
      custom_quote,
      services ( name ),
      packages ( name )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <p className="text-destructive text-sm">
        Could not load bookings: {error.message}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl tracking-tight">Bookings</h1>
        <p className="text-sm text-muted-foreground">
          Update status as you confirm, complete, or cancel jobs.
        </p>
      </div>
      <BookingsTable rows={(data ?? []) as never} />
    </div>
  );
}
