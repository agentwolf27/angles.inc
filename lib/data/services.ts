import { staticPackagesForService } from "@/lib/constants/booking-packages";
import { SERVICE_SLUGS } from "@/lib/constants/services";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Package, Service } from "@/types/database";

const FALLBACK_SERVICES: Service[] = SERVICE_SLUGS.map((slug, i) => ({
  id: `svc-${slug}`,
  slug,
  name: slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" "),
  description: null,
  sort_order: i,
  created_at: new Date().toISOString(),
}));

function fallbackPackagesBySlug(): Record<string, Package[]> {
  const map: Record<string, Package[]> = {};
  for (const s of FALLBACK_SERVICES) {
    map[s.slug] = staticPackagesForService(s.slug, s.id);
  }
  return map;
}

export async function getServicesWithPackages(): Promise<{
  services: Service[];
  packagesByServiceSlug: Record<string, Package[]>;
}> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return {
      services: FALLBACK_SERVICES,
      packagesByServiceSlug: fallbackPackagesBySlug(),
    };
  }

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });

  const { data: packages } = await supabase
    .from("packages")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (!services?.length) {
    return {
      services: FALLBACK_SERVICES,
      packagesByServiceSlug: fallbackPackagesBySlug(),
    };
  }

  const svcList = services as Service[];
  const pkgList = (packages ?? []) as Package[];
  const packagesByServiceSlug: Record<string, Package[]> = {};

  for (const s of svcList) {
    packagesByServiceSlug[s.slug] = pkgList.filter(
      (p) => p.service_id === s.id
    );
  }

  return { services: svcList, packagesByServiceSlug };
}

export async function resolveServicePackageIds(
  serviceSlug: string,
  packageSlug: string | null,
  customQuote: boolean
): Promise<{ service_id: string | null; package_id: string | null }> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    const svc = FALLBACK_SERVICES.find((s) => s.slug === serviceSlug);
    const sid = svc?.id ?? null;
    let pid: string | null = null;
    if (!customQuote && packageSlug && svc) {
      const pkgs = staticPackagesForService(serviceSlug, svc.id);
      pid = pkgs.find((p) => p.slug === packageSlug)?.id ?? null;
    }
    return { service_id: sid, package_id: pid };
  }

  const { data: svc } = await supabase
    .from("services")
    .select("id")
    .eq("slug", serviceSlug)
    .maybeSingle();

  if (customQuote || !packageSlug) {
    return { service_id: svc?.id ?? null, package_id: null };
  }

  const { data: pkg } = await supabase
    .from("packages")
    .select("id")
    .eq("slug", packageSlug)
    .eq("service_id", svc?.id ?? "")
    .maybeSingle();

  return { service_id: svc?.id ?? null, package_id: pkg?.id ?? null };
}
