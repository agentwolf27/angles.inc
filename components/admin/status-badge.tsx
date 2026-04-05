import { Badge } from "@/components/ui/badge";
import type { BookingStatus } from "@/types/database";
import { cn } from "@/lib/utils";

const styles: Record<BookingStatus, string> = {
  new: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  confirmed: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/15 text-destructive",
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <Badge
      variant="secondary"
      className={cn("capitalize", styles[status])}
    >
      {status}
    </Badge>
  );
}
