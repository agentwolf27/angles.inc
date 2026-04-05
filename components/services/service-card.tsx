import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function ServiceCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="group h-full border-border/80 transition hover:border-primary/30 hover:shadow-md">
        <CardContent className="flex h-full flex-col gap-4 p-6">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif text-xl">{title}</h3>
            <ArrowUpRight className="size-5 shrink-0 text-muted-foreground transition group-hover:text-primary" />
          </div>
          <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
          <span className="text-xs font-medium uppercase tracking-wider text-primary">
            View service
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
