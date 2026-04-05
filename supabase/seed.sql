-- Example seed — run after migration (SQL editor or `psql`).
-- Replace image_url values with your Cloudinary URLs or Supabase Storage paths.

insert into public.services (slug, name, description, sort_order) values
  ('automotive', 'Automotive Photography', 'Editorial and private-client automotive work.', 1),
  ('dealership', 'Dealership Photography', 'Inventory, showroom, and group standards.', 2),
  ('restaurant', 'Restaurant Photography', 'Food, interiors, and hospitality.', 3),
  ('dj-events', 'DJ & Event Photography', 'Nightlife, festivals, and brand activations.', 4),
  ('commercial-brand', 'Commercial & Brand Photography', 'Campaigns, products, and lookbooks.', 5)
on conflict (slug) do nothing;

-- Packages reference services by subquery
insert into public.packages (service_id, slug, name, description, price_cents, deposit_cents, duration_minutes, features, sort_order)
select s.id, v.slug, v.name, v.description, v.price_cents, v.deposit_cents, v.duration_minutes, v.features::jsonb, v.sort_order
from public.services s
join (values
  ('automotive', 'essential', 'Essential', 'Half-day creative session', 120000, 25000, 240, '["Up to 8 final images","1 location","Basic retouching"]', 1),
  ('automotive', 'signature', 'Signature', 'Full-day production', 240000, 50000, 480, '["Up to 20 final images","2 locations","Advanced color & cleanup"]', 2),
  ('dealership', 'lot-half-day', 'Half-day lot', 'Up to 25 vehicles', 95000, 20000, 240, '["Standard angles per SOP","Web-ready exports"]', 1),
  ('dealership', 'lot-full-day', 'Full-day lot', 'Up to 55 vehicles', 175000, 35000, 480, '["Priority scheduling","Background consistency pass"]', 2),
  ('restaurant', 'menu-refresh', 'Menu refresh', 'Hero dishes + interiors', 140000, 30000, 240, '["12 plated shots","Interior sweep","Social crops"]', 1),
  ('restaurant', 'full-story', 'Full story', 'Campaign-style coverage', 280000, 60000, 360, '["Chef portraits","Lifestyle moments","Extended gallery"]', 2),
  ('dj-events', 'club-night', 'Club night', 'Up to 4 hours', 110000, 25000, 240, '["Performance + crowd","Low-light optimized"]', 1),
  ('dj-events', 'festival-block', 'Festival block', 'Full event block', 220000, 50000, 480, '["Multi-stage coverage","Rush selects add-on available"]', 2),
  ('commercial-brand', 'half-day-studio', 'Half-day studio', 'Product or lifestyle', 180000, 40000, 240, '["Shot list planning","High-res masters"]', 1),
  ('commercial-brand', 'campaign-day', 'Campaign day', 'Full production day', 360000, 75000, 480, '["BTS add-on","Extended usage consultation"]', 2)
) as v(service_slug, slug, name, description, price_cents, deposit_cents, duration_minutes, features, sort_order)
  on s.slug = v.service_slug
on conflict (service_id, slug) do nothing;

insert into public.portfolio_categories (slug, name, description, sort_order) values
  ('automotive', 'Automotive', 'Private builds and editorial.', 1),
  ('dealerships', 'Dealerships', 'Lots, showrooms, inventory.', 2),
  ('restaurants', 'Restaurants', 'Food, dining rooms, hospitality.', 3),
  ('dj-events', 'DJ / Events', 'Nightlife and live moments.', 4),
  ('commercial-branding', 'Commercial / Branding', 'Campaign and product.', 5)
on conflict (slug) do nothing;

insert into public.portfolio_items (category_id, title, description, image_url, featured, sort_order)
select c.id, v.title, v.description, v.image_url, v.featured, v.ord
from public.portfolio_categories c
join (values
  ('automotive', 'Midnight coupe', 'Editorial street series', 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=80', true, 1),
  ('automotive', 'Desert run', 'Campaign stills', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80', false, 2),
  ('dealerships', 'Showroom hero', 'OEM-aligned framing', 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=80', true, 1),
  ('dealerships', 'Lot lineup', 'Group consistency', 'https://images.unsplash.com/photo-1489827908717-2d8276e8c8b2?w=1200&q=80', false, 2),
  ('restaurants', 'Chef''s table', 'Tasting menu coverage', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80', true, 1),
  ('restaurants', 'Golden hour patio', 'Hospitality lifestyle', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80', false, 2),
  ('dj-events', 'Laser & crowd', 'Club residency', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80', true, 1),
  ('dj-events', 'Festival mainstage', 'Outdoor energy', 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&q=80', false, 2),
  ('commercial-branding', 'Product flat', 'DTC launch', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80', true, 1),
  ('commercial-branding', 'Lookbook', 'Seasonal campaign', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80', false, 2)
) as v(cat_slug, title, description, image_url, featured, ord)
  on c.slug = v.cat_slug;

insert into public.testimonials (client_name, company, industry, quote, rating, featured, sort_order) values
  ('Morgan Ellis', 'Northline Motors', 'Automotive', 'Our online leads jumped after Jordan standardized our lot photography. Consistent, fast, and no hand-holding needed.', 5, true, 1),
  ('Riley Chen', 'Harbor & Hearth', 'Hospitality', 'Finally have imagery that matches how the room feels. Menu updates are painless now.', 5, true, 2),
  ('Devon Ortiz', 'Pulse Events', 'Events', 'Captures the energy of our nights without missing key branding moments. Same-night selects saved our launch.', 5, true, 3),
  ('Samira Khan', 'Fieldcraft Goods', 'Commercial', 'Studio day felt like working with an in-house creative partner. Shot list to delivery was seamless.', 5, false, 4);

-- Optional: block a holiday week
insert into public.availability_blocks (start_date, end_date, reason) values
  ('2026-12-24', '2026-12-28', 'Holiday');
