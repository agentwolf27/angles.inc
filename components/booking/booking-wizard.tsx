"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { submitBooking } from "@/actions/booking";
import { isServiceSlug, type ServiceSlug } from "@/lib/constants/services";
import type { Package, Service } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

const STEPS = ["Service", "Package", "Schedule", "Details", "Review"] as const;

const TIME_OPTIONS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "Flexible / TBD",
];

export function BookingWizard({
  services,
  packagesByServiceSlug,
}: {
  services: Service[];
  packagesByServiceSlug: Record<string, Package[]>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [pending, startTransition] = useTransition();

  const [serviceSlug, setServiceSlug] = useState<ServiceSlug>("automotive");
  const [customQuote, setCustomQuote] = useState(false);
  const [packageSlug, setPackageSlug] = useState<string | null>(null);

  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [location, setLocation] = useState("");
  const [projectNotes, setProjectNotes] = useState("");

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [payDeposit, setPayDeposit] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const s = searchParams.get("service");
    const p = searchParams.get("package");
    if (s && isServiceSlug(s)) setServiceSlug(s);
    if (p) setPackageSlug(p);
  }, [searchParams]);

  const packages = packagesByServiceSlug[serviceSlug] ?? [];

  useEffect(() => {
    if (!customQuote && packages.length && !packageSlug) {
      setPackageSlug(packages[0]!.slug);
    }
  }, [customQuote, packages, packageSlug, serviceSlug]);

  const progress = useMemo(
    () => ((step + 1) / STEPS.length) * 100,
    [step]
  );

  function validateStep(): boolean {
    setError(null);
    if (step === 0) return true;
    if (step === 1) {
      if (!customQuote && !packageSlug) {
        setError("Pick a package or choose custom quote.");
        return false;
      }
      return true;
    }
    if (step === 2) {
      if (!preferredDate || !preferredTime.trim() || location.trim().length < 2) {
        setError("Date, time, and location are required.");
        return false;
      }
      return true;
    }
    if (step === 3) {
      if (clientName.trim().length < 2 || !clientEmail.includes("@")) {
        setError("Valid name and email are required.");
        return false;
      }
      return true;
    }
    return true;
  }

  function next() {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function back() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function uploadReferences(): Promise<string[]> {
    if (!files?.length) return [];
    const fd = new FormData();
    for (const f of Array.from(files)) {
      fd.append("files", f);
    }
    const res = await fetch("/api/upload-reference", {
      method: "POST",
      body: fd,
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error(j.error ?? "Upload failed");
    }
    const j = (await res.json()) as { urls: string[] };
    return j.urls;
  }

  function finalize() {
    startTransition(async () => {
      setError(null);
      let referenceFileUrls: string[] = [];
      if (files?.length) {
        try {
          referenceFileUrls = await uploadReferences();
        } catch (e) {
          setError(
            e instanceof Error
              ? e.message
              : "Could not upload files. Remove files or configure Cloudinary."
          );
          return;
        }
      }

      const payload = {
        serviceSlug,
        packageSlug: customQuote ? null : packageSlug,
        customQuote,
        preferredDate,
        preferredTime,
        location,
        projectNotes,
        clientName,
        clientEmail,
        clientPhone: clientPhone || undefined,
        payDeposit,
        referenceFileUrls,
      };

      const res = await submitBooking(payload);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      if (res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
        return;
      }
      router.push(`/booking/confirmation?ref=${res.bookingId}`);
    });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Booking
        </p>
        <h1 className="mt-2 font-serif text-3xl tracking-tight sm:text-4xl">
          Request a shoot
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Snappr-style flow for a solo studio—service, package, schedule, then
          details. Deposits are optional at checkout when Stripe is configured.
        </p>
        <Progress value={progress} className="mt-6 h-1.5" />
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
          {STEPS.map((label, i) => (
            <span
              key={label}
              className={cn(
                "rounded-full px-2 py-0.5",
                i === step && "bg-primary text-primary-foreground",
                i < step && "bg-muted-foreground/20 text-foreground"
              )}
            >
              {i + 1}. {label}
            </span>
          ))}
        </div>
      </div>

      {error ? (
        <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {step === 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {services.map((svc) => (
            <button
              key={svc.id}
              type="button"
              onClick={() => {
                setServiceSlug(svc.slug as ServiceSlug);
                setPackageSlug(null);
              }}
              className={cn(
                "rounded-xl border p-4 text-left transition hover:border-primary/50",
                serviceSlug === svc.slug && "border-primary ring-1 ring-primary"
              )}
            >
              <p className="font-medium">{svc.name}</p>
              {svc.description ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  {svc.description}
                </p>
              ) : null}
            </button>
          ))}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="custom"
              checked={customQuote}
              onCheckedChange={(c) => {
                setCustomQuote(c === true);
                if (c === true) setPackageSlug(null);
              }}
            />
            <Label htmlFor="custom">Custom quote (no preset package)</Label>
          </div>
          {!customQuote && (
            <div className="grid gap-3">
              {packages.map((pkg) => (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => setPackageSlug(pkg.slug)}
                  className={cn(
                    "rounded-xl border p-4 text-left transition hover:border-primary/50",
                    packageSlug === pkg.slug && "border-primary ring-1 ring-primary"
                  )}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-medium">{pkg.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ${(pkg.price_cents / 100).toLocaleString()}
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {pkg.description}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Preferred date</Label>
              <Input
                id="date"
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Preferred time</Label>
              <Select
                value={preferredTime}
                onValueChange={(v) => setPreferredTime(v ?? "")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="loc">Shoot location</Label>
            <Input
              id="loc"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Address, venue, or city"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Project details</Label>
            <Textarea
              id="notes"
              rows={4}
              value={projectNotes}
              onChange={(e) => setProjectNotes(e.target.value)}
              placeholder="Shot list, deliverables, usage, brand links…"
            />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cname">Full name</Label>
              <Input
                id="cname"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cemail">Email</Label>
              <Input
                id="cemail"
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cphone">Phone (optional)</Label>
            <Input
              id="cphone"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ref">Reference / inspiration files</Label>
            <Input
              id="ref"
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={(e) => setFiles(e.target.files)}
            />
            <p className="text-xs text-muted-foreground">
              Requires Cloudinary env vars. You can skip if not configured.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border/80 p-4">
            <Checkbox
              id="dep"
              checked={payDeposit}
              onCheckedChange={(c) => setPayDeposit(c === true)}
            />
            <Label htmlFor="dep" className="text-sm leading-snug">
              Pay deposit now with card (Stripe). Uncheck to request booking only.
            </Label>
          </div>
        </div>
      )}

      {step === 4 && (
        <Card className="border-border/80">
          <CardContent className="space-y-3 p-6 text-sm">
            <Row label="Service" value={serviceSlug} />
            <Row
              label="Package"
              value={
                customQuote
                  ? "Custom quote"
                  : packages.find((p) => p.slug === packageSlug)?.name ??
                    packageSlug ??
                    "—"
              }
            />
            <Row label="Date" value={preferredDate} />
            <Row label="Time" value={preferredTime} />
            <Row label="Location" value={location} />
            <Row label="Notes" value={projectNotes || "—"} />
            <Row label="Contact" value={`${clientName} · ${clientEmail}`} />
            <Row
              label="Deposit"
              value={payDeposit ? "Charge at checkout" : "Not charging now"}
            />
          </CardContent>
        </Card>
      )}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={back}
          disabled={step === 0 || pending}
          className="gap-1"
        >
          <ChevronLeft className="size-4" /> Back
        </Button>
        <div className="flex gap-2">
          {step < STEPS.length - 1 ? (
            <Button type="button" onClick={next} className="gap-1 rounded-full">
              Next <ChevronRight className="size-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={finalize}
              disabled={pending}
              className="rounded-full"
            >
              {pending ? "Submitting…" : "Submit request"}
            </Button>
          )}
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Prefer email?{" "}
        <Link className="underline" href="/contact">
          Contact form
        </Link>
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-border/60 py-2 sm:flex-row sm:justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right sm:max-w-[60%]">{value}</span>
    </div>
  );
}
