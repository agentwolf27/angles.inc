import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
        404
      </p>
      <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">
        Page not found
      </h1>
      <Button asChild className="rounded-full">
        <Link href="/">Return home</Link>
      </Button>
    </div>
  );
}
