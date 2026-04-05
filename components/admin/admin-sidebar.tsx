"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Camera,
  CreditCard,
  LayoutDashboard,
  MessageSquare,
  Package,
  Star,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/admin/leads", label: "Leads", icon: MessageSquare },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/portfolio", label: "Portfolio", icon: Camera },
  { href: "/admin/packages", label: "Packages", icon: Package },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star },
  { href: "/admin/availability", label: "Availability", icon: CalendarDays },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 border-r border-border/80 bg-sidebar md:flex md:flex-col">
      <div className="border-b border-border/80 p-4">
        <p className="font-serif text-lg">{siteConfig.name}</p>
        <p className="text-xs text-muted-foreground">Admin</p>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 p-2">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              pathname === l.href && "bg-sidebar-accent text-sidebar-accent-foreground"
            )}
          >
            <l.icon className="size-4" />
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-border/80 p-2">
        <Button asChild variant="ghost" className="w-full justify-start" size="sm">
          <Link href="/">View site</Link>
        </Button>
      </div>
    </aside>
  );
}
