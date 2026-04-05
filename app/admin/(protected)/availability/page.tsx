import { requireAdminProfile } from "@/lib/auth/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminAvailabilityPage() {
  const { supabase } = await requireAdminProfile();

  const { data, error } = await supabase
    .from("availability_blocks")
    .select("*")
    .order("start_date", { ascending: true });

  if (error) {
    return <p className="text-destructive text-sm">{error.message}</p>;
  }

  const rows = data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl tracking-tight">Availability blocks</h1>
        <p className="text-sm text-muted-foreground">
          Use for PTO or fully booked weeks. Booking UI can read these in a future
          iteration; today they document blackouts in admin.
        </p>
      </div>
      {!rows.length ? (
        <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          No blocks defined.
        </p>
      ) : (
        <div className="rounded-xl border border-border/80">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(
                (b: {
                  id: string;
                  start_date: string;
                  end_date: string;
                  reason: string | null;
                }) => (
                  <TableRow key={b.id}>
                    <TableCell>{b.start_date}</TableCell>
                    <TableCell>{b.end_date}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {b.reason ?? "—"}
                    </TableCell>
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
