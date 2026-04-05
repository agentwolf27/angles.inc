import { requireAdminProfile } from "@/lib/auth/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdminProfile();

  const [{ count: bookingCount }, { count: leadCount }, { count: payCount }] =
    await Promise.all([
      supabase.from("bookings").select("*", { count: "exact", head: true }),
      supabase.from("contact_inquiries").select("*", { count: "exact", head: true }),
      supabase.from("payments").select("*", { count: "exact", head: true }),
    ]);

  const cards = [
    { title: "Bookings", value: bookingCount ?? 0 },
    { title: "Contact leads", value: leadCount ?? 0 },
    { title: "Payments logged", value: payCount ?? 0 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          High-level counters — extend with charts or date filters when you grow.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.title} className="border-border/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {c.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tabular-nums">{c.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
