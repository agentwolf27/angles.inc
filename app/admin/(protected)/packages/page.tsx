import { requireAdminProfile } from "@/lib/auth/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminPackagesPage() {
  const { supabase } = await requireAdminProfile();

  const { data, error } = await supabase
    .from("packages")
    .select(
      `
      id,
      slug,
      name,
      price_cents,
      deposit_cents,
      active,
      services ( name, slug )
    `
    )
    .order("sort_order", { ascending: true });

  if (error) {
    return <p className="text-destructive text-sm">{error.message}</p>;
  }

  const rows = data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl tracking-tight">Packages</h1>
        <p className="text-sm text-muted-foreground">
          Pricing shown on marketing pages and booking flow. Edit in Supabase or
          extend with admin forms.
        </p>
      </div>
      {!rows.length ? (
        <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          No packages. Run migrations + seed.
        </p>
      ) : (
        <div className="rounded-xl border border-border/80">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Deposit</TableHead>
                <TableHead>Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => {
                const p = row as {
                  id: string;
                  slug: string;
                  name: string;
                  price_cents: number;
                  deposit_cents: number;
                  active: boolean;
                  services:
                    | { name: string; slug: string }
                    | { name: string; slug: string }[]
                    | null;
                };
                const svc = Array.isArray(p.services)
                  ? p.services[0]
                  : p.services;
                return (
                  <TableRow key={p.id}>
                    <TableCell>{svc?.name ?? "—"}</TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>${(p.price_cents / 100).toLocaleString()}</TableCell>
                    <TableCell>${(p.deposit_cents / 100).toLocaleString()}</TableCell>
                    <TableCell>{p.active ? "Yes" : "No"}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
