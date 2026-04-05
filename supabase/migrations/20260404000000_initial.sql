-- Angles Studio — initial schema (Supabase / Postgres)
-- Run via Supabase CLI: supabase db push — or paste in SQL editor.

create extension if not exists "pgcrypto";

-- Profiles extend auth.users
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'client' check (role in ('admin', 'client')),
  created_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.packages (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references public.services (id) on delete set null,
  slug text not null,
  name text not null,
  description text,
  price_cents int not null,
  deposit_cents int not null default 0,
  duration_minutes int,
  features jsonb not null default '[]'::jsonb,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (service_id, slug)
);

create table public.portfolio_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  sort_order int not null default 0
);

create table public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.portfolio_categories (id) on delete cascade,
  title text not null,
  description text,
  cloudinary_public_id text,
  image_url text not null,
  featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  company text,
  industry text,
  quote text not null,
  rating int check (rating is null or rating between 1 and 5),
  featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create type public.booking_status as enum ('new', 'confirmed', 'completed', 'cancelled');

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references public.services (id) on delete set null,
  package_id uuid references public.packages (id) on delete set null,
  custom_quote boolean not null default false,
  preferred_date date not null,
  preferred_time text,
  location text not null,
  project_notes text,
  client_name text not null,
  client_email text not null,
  client_phone text,
  status public.booking_status not null default 'new',
  stripe_session_id text,
  stripe_payment_intent_id text,
  deposit_paid boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.booking_files (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id) on delete cascade,
  file_url text not null,
  file_name text,
  created_at timestamptz not null default now()
);

create table public.availability_blocks (
  id uuid primary key default gen_random_uuid(),
  start_date date not null,
  end_date date not null,
  reason text,
  created_at timestamptz not null default now(),
  check (end_date >= start_date)
);

create table public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings (id) on delete set null,
  stripe_payment_intent_id text,
  amount_cents int not null,
  currency text not null default 'usd',
  status text,
  created_at timestamptz not null default now()
);

create index idx_bookings_status on public.bookings (status);
create index idx_bookings_created on public.bookings (created_at desc);
create index idx_portfolio_items_category on public.portfolio_items (category_id);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger bookings_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce((new.raw_user_meta_data->>'role')::text, 'client')
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.packages enable row level security;
alter table public.portfolio_categories enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.testimonials enable row level security;
alter table public.bookings enable row level security;
alter table public.booking_files enable row level security;
alter table public.availability_blocks enable row level security;
alter table public.contact_inquiries enable row level security;
alter table public.payments enable row level security;

-- Helper: admin check
create or replace function public.is_admin(uid uuid)
returns boolean as $$
  select exists (
    select 1 from public.profiles p
    where p.id = uid and p.role = 'admin'
  );
$$ language sql security definer stable set search_path = public;

-- Public read marketing tables
create policy "Public read services" on public.services for select using (true);
create policy "Public read packages" on public.packages for select using (active = true);
create policy "Admins read all packages" on public.packages for select using (public.is_admin(auth.uid()));
create policy "Public read portfolio_categories" on public.portfolio_categories for select using (true);
create policy "Public read portfolio_items" on public.portfolio_items for select using (true);
create policy "Public read testimonials" on public.testimonials for select using (true);

-- Profiles: users read/update own
create policy "Users read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);

-- Bookings: anonymous insert for booking flow; no public select
create policy "Anyone can create booking" on public.bookings for insert with check (true);
create policy "Admins read bookings" on public.bookings for select using (public.is_admin(auth.uid()));
create policy "Admins update bookings" on public.bookings for update using (public.is_admin(auth.uid()));

create policy "Anyone can add booking files" on public.booking_files for insert with check (true);
create policy "Admins read booking files" on public.booking_files for select using (public.is_admin(auth.uid()));

create policy "Public read availability" on public.availability_blocks for select using (true);
create policy "Admins manage availability" on public.availability_blocks for all using (public.is_admin(auth.uid()));

create policy "Anyone can contact" on public.contact_inquiries for insert with check (true);
create policy "Admins read inquiries" on public.contact_inquiries for select using (public.is_admin(auth.uid()));

create policy "Admins read payments" on public.payments for select using (public.is_admin(auth.uid()));

-- Admins manage catalog (MVP: service role or edge functions in production)
create policy "Admins manage services" on public.services for all using (public.is_admin(auth.uid()));
create policy "Admins manage packages" on public.packages for all using (public.is_admin(auth.uid()));
create policy "Admins manage portfolio_categories" on public.portfolio_categories for all using (public.is_admin(auth.uid()));
create policy "Admins manage portfolio_items" on public.portfolio_items for all using (public.is_admin(auth.uid()));
create policy "Admins manage testimonials" on public.testimonials for all using (public.is_admin(auth.uid()));
