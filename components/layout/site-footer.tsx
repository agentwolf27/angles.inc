import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div className="space-y-3">
          <p className="font-serif text-lg">{siteConfig.name}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {siteConfig.tagline}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Explore
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link className="hover:underline" href="/portfolio">
                Portfolio
              </Link>
            </li>
            <li>
              <Link className="hover:underline" href="/services">
                Services
              </Link>
            </li>
            <li>
              <Link className="hover:underline" href="/pricing">
                Pricing
              </Link>
            </li>
            <li>
              <Link className="hover:underline" href="/booking">
                Book
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Studio
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link className="hover:underline" href="/about">
                About
              </Link>
            </li>
            <li>
              <Link className="hover:underline" href="/testimonials">
                Testimonials
              </Link>
            </li>
            <li>
              <Link className="hover:underline" href="/contact">
                Contact
              </Link>
            </li>
            <li>
              <Link className="hover:underline text-muted-foreground" href="/admin/login">
                Admin
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Contact
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <a className="hover:text-foreground" href={`mailto:${siteConfig.email}`}>
                {siteConfig.email}
              </a>
            </li>
            <li>
              <a className="hover:text-foreground" href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>
                {siteConfig.phone}
              </a>
            </li>
            <li className="flex gap-4 pt-2">
              <a
                className="hover:text-foreground"
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
              <a
                className="hover:text-foreground"
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}
