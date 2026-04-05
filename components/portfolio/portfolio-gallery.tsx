"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import type { PortfolioItemView } from "@/lib/data/portfolio";
import {
  PORTFOLIO_TABS,
  type PortfolioCategorySlug,
  categorySlugForPortfolioTab,
} from "@/lib/constants/services";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function PortfolioGallery({ items }: { items: PortfolioItemView[] }) {
  const searchParams = useSearchParams();
  const [active, setActive] = useState<PortfolioCategorySlug>("all");
  const [lightbox, setLightbox] = useState<PortfolioItemView | null>(null);

  useEffect(() => {
    const cat = searchParams.get("cat");
    const match = PORTFOLIO_TABS.find((t) => t.slug === cat);
    if (match) setActive(match.slug);
  }, [searchParams]);

  const filtered = useMemo(() => {
    const slugs = categorySlugForPortfolioTab(active);
    if (!slugs) return items;
    return items.filter((i) => slugs.includes(i.category_slug));
  }, [items, active]);

  const featured = useMemo(
    () => filtered.filter((i) => i.featured).slice(0, 2),
    [filtered]
  );

  return (
    <div className="space-y-10">
      <Tabs
        value={active}
        onValueChange={(v) => setActive(v as PortfolioCategorySlug)}
        className="w-full"
      >
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-muted/60 p-1">
          {PORTFOLIO_TABS.map((t) => (
            <TabsTrigger
              key={t.slug}
              value={t.slug}
              className="rounded-full px-4 py-2 text-xs sm:text-sm"
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {featured.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          {featured.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setLightbox(item)}
              className="group relative aspect-[16/10] overflow-hidden rounded-2xl border border-border/80 text-left shadow-sm"
            >
              <Image
                src={item.image_url}
                alt={item.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.02]"
                sizes="(max-width:1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-0 p-6 text-white">
                <Badge variant="secondary" className="mb-2 bg-white/20 text-white">
                  Featured project
                </Badge>
                <h3 className="font-serif text-2xl">{item.title}</h3>
                {item.description ? (
                  <p className="mt-1 max-w-md text-sm text-white/85">
                    {item.description}
                  </p>
                ) : null}
              </div>
            </button>
          ))}
        </div>
      )}

      <div
        className="columns-1 gap-4 sm:columns-2 lg:columns-3"
        style={{ columnFill: "balance" as const }}
      >
        {filtered.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setLightbox(item)}
            className={cn(
              "group mb-4 block w-full break-inside-avoid overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm"
            )}
          >
            <div className="relative aspect-[3/4] w-full sm:aspect-auto sm:h-72">
              <Image
                src={item.image_url}
                alt={item.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
                sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
              />
            </div>
            <div className="p-3 text-left">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                {item.category_slug.replace(/-/g, " ")}
              </p>
              <p className="font-medium">{item.title}</p>
            </div>
          </button>
        ))}
      </div>

      <Dialog open={!!lightbox} onOpenChange={() => setLightbox(null)}>
        <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none sm:max-w-5xl">
          <DialogTitle className="sr-only">
            {lightbox?.title ?? "Image preview"}
          </DialogTitle>
          {lightbox ? (
            <div className="overflow-hidden rounded-2xl border border-border/80 bg-background shadow-2xl">
              <div className="relative aspect-[16/10] w-full max-h-[80vh]">
                <Image
                  src={lightbox.image_url}
                  alt={lightbox.title}
                  fill
                  className="object-contain bg-black"
                  sizes="100vw"
                />
              </div>
              <div className="p-5">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  {lightbox.category_slug}
                </p>
                <h3 className="font-serif text-2xl">{lightbox.title}</h3>
                {lightbox.description ? (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {lightbox.description}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
