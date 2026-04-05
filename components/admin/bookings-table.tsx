"use client";

import { useTransition } from "react";
import { updateBookingStatus } from "@/actions/admin/bookings";
import type { BookingStatus } from "@/types/database";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/admin/status-badge";

export type BookingRow = {
  id: string;
  created_at: string;
  client_name: string;
  client_email: string;
  preferred_date: string;
  location: string;
  status: BookingStatus;
  services: { name: string } | null;
  packages: { name: string } | null;
  custom_quote: boolean;
};

const STATUSES: BookingStatus[] = [
  "new",
  "confirmed",
  "completed",
  "cancelled",
];

export function BookingsTable({ rows }: { rows: BookingRow[] }) {
  const [pending, startTransition] = useTransition();

  function onStatusChange(id: string, status: BookingStatus) {
    startTransition(async () => {
      await updateBookingStatus(id, status);
    });
  }

  if (!rows.length) {
    return (
      <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        No bookings yet. They appear here when clients submit the booking flow.
      </p>
    );
  }

  return (
    <div className="rounded-xl border border-border/80">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Shoot</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((b) => (
            <TableRow key={b.id}>
              <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                {new Date(b.created_at).toLocaleString()}
              </TableCell>
              <TableCell>
                <div className="font-medium">{b.client_name}</div>
                <div className="text-xs text-muted-foreground">{b.client_email}</div>
              </TableCell>
              <TableCell className="text-sm">
                {b.custom_quote
                  ? "Custom quote"
                  : (b.services?.name ?? "—")}
                {b.packages?.name ? (
                  <div className="text-xs text-muted-foreground">
                    {b.packages.name}
                  </div>
                ) : null}
              </TableCell>
              <TableCell className="max-w-[200px] truncate text-sm">
                {b.preferred_date} · {b.location}
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <StatusBadge status={b.status} />
                  <Select
                    disabled={pending}
                    value={b.status}
                    onValueChange={(v) =>
                      onStatusChange(b.id, v as BookingStatus)
                    }
                  >
                    <SelectTrigger className="h-8 w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
