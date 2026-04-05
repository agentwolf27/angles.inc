import { requireAdminProfile } from "@/lib/auth/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminTestimonialsPage() {
  const { supabase } = await requireAdminProfile();

  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return <p className="text-destructive text-sm">{error.message}</p>;
  }

  const rows = data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl tracking-tight">Testimonials</h1>
        <p className="text-sm text-muted-foreground">
          Public site reads featured + ordered rows from this table.
        </p>
      </div>
      {!rows.length ? (
        <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          No testimonials. Run seed.
        </p>
      ) : (
        <div className="rounded-xl border border-border/80">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Featured</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(
                (t: {
                  id: string;
                  client_name: string;
                  industry: string | null;
                  quote: string;
                  featured: boolean;
                }) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.client_name}</TableCell>
                    <TableCell>{t.industry ?? "—"}</TableCell>
                    <TableCell>{t.featured ? "Yes" : "—"}</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
