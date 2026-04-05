import { requireAdminProfile } from "@/lib/auth/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminPaymentsPage() {
  const { supabase } = await requireAdminProfile();

  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return <p className="text-destructive text-sm">{error.message}</p>;
  }

  const rows = data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl tracking-tight">Payments</h1>
        <p className="text-sm text-muted-foreground">
          Stripe webhook writes deposit rows here. Reconcile in Stripe Dashboard.
        </p>
      </div>
      {!rows.length ? (
        <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          No payments recorded yet.
        </p>
      ) : (
        <div className="rounded-xl border border-border/80">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Booking</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(
                (p: {
                  id: string;
                  created_at: string;
                  booking_id: string | null;
                  amount_cents: number;
                  currency: string;
                  status: string | null;
                }) => (
                  <TableRow key={p.id}>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(p.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {p.booking_id ?? "—"}
                    </TableCell>
                    <TableCell>
                      ${(p.amount_cents / 100).toFixed(2)} {p.currency.toUpperCase()}
                    </TableCell>
                    <TableCell>{p.status ?? "—"}</TableCell>
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
