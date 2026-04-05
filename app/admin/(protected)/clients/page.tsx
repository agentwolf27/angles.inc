import { requireAdminProfile } from "@/lib/auth/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminClientsPage() {
  const { supabase } = await requireAdminProfile();

  const { data, error } = await supabase
    .from("bookings")
    .select("client_name, client_email, client_phone, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return <p className="text-destructive text-sm">{error.message}</p>;
  }

  const seen = new Set<string>();
  const unique: {
    client_name: string;
    client_email: string;
    client_phone: string | null;
    created_at: string;
  }[] = [];
  for (const row of data ?? []) {
    const r = row as (typeof unique)[number];
    if (seen.has(r.client_email)) continue;
    seen.add(r.client_email);
    unique.push(r);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl tracking-tight">Clients</h1>
        <p className="text-sm text-muted-foreground">
          Derived from booking emails — extend with a dedicated clients table later.
        </p>
      </div>
      {!unique.length ? (
        <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          No clients yet.
        </p>
      ) : (
        <div className="rounded-xl border border-border/80">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Last booking</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unique.map((c) => (
                <TableRow key={c.client_email}>
                  <TableCell className="font-medium">{c.client_name}</TableCell>
                  <TableCell>{c.client_email}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {c.client_phone ?? "—"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(c.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
