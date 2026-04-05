import { requireAdminProfile } from "@/lib/auth/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminPortfolioPage() {
  const { supabase } = await requireAdminProfile();

  const { data, error } = await supabase
    .from("portfolio_items")
    .select(
      `
      id,
      title,
      featured,
      image_url,
      portfolio_categories ( name )
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
        <h1 className="font-serif text-3xl tracking-tight">Portfolio</h1>
        <p className="text-sm text-muted-foreground">
          Read-only scaffold — add CRUD or manage rows in Supabase. Images can use{" "}
          <code className="text-xs">image_url</code> or Cloudinary public IDs.
        </p>
      </div>
      {!rows.length ? (
        <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          No portfolio items. Run <code className="text-xs">seed.sql</code>.
        </p>
      ) : (
        <div className="rounded-xl border border-border/80">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Featured</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => {
                const r = row as {
                  id: string;
                  title: string;
                  featured: boolean;
                  image_url: string;
                  portfolio_categories:
                    | { name: string }
                    | { name: string }[]
                    | null;
                };
                const cat = Array.isArray(r.portfolio_categories)
                  ? r.portfolio_categories[0]
                  : r.portfolio_categories;
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.title}</TableCell>
                    <TableCell>{cat?.name ?? "—"}</TableCell>
                    <TableCell>{r.featured ? "Yes" : "—"}</TableCell>
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
