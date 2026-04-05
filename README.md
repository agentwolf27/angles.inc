# Angles Studio — Photography website & booking platform

Premium marketing site and **Snappr-style booking flow** for a solo photographer: multi-vertical positioning (automotive, dealerships, restaurants, events, commercial), portfolio with filters and lightbox, structured pricing, Supabase persistence, Stripe deposits, Cloudinary reference uploads, and Resend confirmations.

## Stack

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS v4**
- **shadcn/ui** (Base UI primitives) + **Framer Motion**
- **Supabase** (Postgres, Auth, RLS)
- **Stripe** Checkout (deposit) + webhook → `payments` + `bookings.deposit_paid`
- **Cloudinary** (server upload for booking references)
- **Resend** (client + internal notification emails)

## Quick start

```bash
cd angles.inc
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** If you have another `package-lock.json` above this folder, Next may warn about the workspace root. Running commands from **this** directory keeps the project self-contained.

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL (metadata, Stripe redirects) |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public data + booking/contact inserts |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** — Stripe webhook updates |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Deposits |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL` | Transactional email |
| `CLOUDINARY_*` / `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Reference uploads + optional `CloudinaryImage` |
| `ADMIN_EMAIL` | Optional — if set, only this email may open `/admin` (middleware); still require `profiles.role = admin` |

Without Supabase, **marketing pages** use built-in static fallbacks. **Booking** requires Supabase to persist rows.

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Run the SQL in `supabase/migrations/20260404000000_initial.sql` (SQL editor or CLI).
3. Run `supabase/seed.sql` for demo services, packages, portfolio, testimonials, and a sample availability block.
4. **Auth:** Enable Email provider. Create a user, then promote in SQL:

   ```sql
   update public.profiles
   set role = 'admin'
   where email = 'you@example.com';
   ```

5. If your Postgres version errors on `execute function` in triggers, try `execute procedure` for `handle_new_user` / `set_updated_at` (depends on PG minor version).

## Stripe webhook

- Endpoint: `POST /api/stripe/webhook`
- Events: at minimum `checkout.session.completed`
- Use the signing secret as `STRIPE_WEBHOOK_SECRET`
- Webhook handler uses **service role** to mark `deposit_paid` and insert `payments`

## Project structure (high level)

```
app/
  (site)/          # Public site (nav + footer)
  admin/           # Login + protected dashboard (route group)
  api/             # Stripe webhook, upload reference
actions/           # Server Actions (booking, contact, admin)
components/        # Layout, marketing, booking wizard, admin tables
lib/               # Supabase, Stripe, Resend, Cloudinary, data helpers, Zod
types/             # Shared TypeScript models
supabase/          # migrations + seed
```

## Customization

- **Brand & copy:** `lib/site-config.ts`
- **Service page content & portfolio tab map:** `lib/constants/services.ts`
- **Offline package matrix (matches seed):** `lib/constants/booking-packages.ts`

## Production checklist

- [ ] All env vars in hosting (Vercel, etc.)
- [ ] `NEXT_PUBLIC_SITE_URL` matches production domain
- [ ] Stripe live keys + webhook URL
- [ ] Resend domain verification
- [ ] Supabase RLS reviewed; service role never exposed to client
- [ ] Replace Unsplash placeholders with Cloudinary or your CDN URLs in DB

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

## License

Private / your usage — adjust as needed.
