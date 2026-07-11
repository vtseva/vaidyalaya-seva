# Vaidyalaya Seva

**Service with Compassion, Dignity and Care**

Public website and project-management platform for Vaidyalaya Seva — a joint initiative of
**Vikasa Tarangini** (India) and **VT Seva** (USA) improving public healthcare infrastructure.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS 4
- Supabase: PostgreSQL, Auth, Storage, Row Level Security
- Vercel hosting

## Features

**Public site** — Home, About, Project Library (search/filter/sort), standardized project detail
pages (executive summary, need, scope, itemized budget with calculated totals, before/after pairs,
metrics, testimonials, gallery), Impact dashboard (Mission 70 progress), Get Involved
(donate info + volunteer/CSR/government forms), 5-step hospital Request Support form with private
file uploads, Contact, Privacy, Terms.

**Dashboard** (staff login required) — overview, project CRUD + itemized budget editor +
publish workflow, hospital request review (status workflow + private attachments via signed URLs +
review notes), impact stat editing, form-submission inbox, site settings (admins), media uploader.

**Roles** — `super_admin`, `admin`, `editor` (stored in `profiles`, enforced via RLS + server checks).
No public self-registration; admins create users in Supabase Auth and add a `profiles` row.

## Local setup

```bash
npm install
cp .env.example .env.local   # fill in values from Supabase → Project Settings → API
npm run dev
```

### Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/publishable key (safe for browsers; RLS enforces access) |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for SEO metadata |

No service-role key is used anywhere in this app.

## Database

Migrations live in `supabase/migrations` (already applied to the production project):

1. `01_initial_schema.sql` — tables, enums, helper functions, triggers
2. `02_rls_policies.sql` — RLS for every table + storage buckets/policies
3. `03_seed_data.sql` — impact stats, site settings, VS-001 project with budget, pairs, metrics, testimonials

Storage buckets: `public-media` (public read; staff write) and `request-uploads`
(private; anonymous insert-only for the hospital request form; staff read via signed URLs).

### Creating the first super admin

Created via a one-time SQL bootstrap (documented, not a public form): insert a user into
`auth.users` (or use Supabase Dashboard → Authentication → Add user), then:

```sql
insert into public.profiles (id, full_name, role, active)
values ('<auth-user-uuid>', 'Name', 'super_admin', true);
```

### Adding staff users

Supabase Dashboard → Authentication → Add user (email + password or invite), then insert a
`profiles` row with role `admin` or `editor`. Deactivate by setting `profiles.active = false`
(content attribution is preserved; users are never hard-deleted).

## Site imagery

Images extracted from the source PDFs live in `public/images/`. New media uploaded by staff
(via /dashboard/seed-images or the request form) goes to Supabase Storage.

## Deployment

Deployed on Vercel. Set the three environment variables in Vercel → Project → Settings →
Environment Variables. `robots.txt` disallows `/dashboard` and `/login`; `sitemap.xml` is generated
from published projects.

## Manual configuration still required

- Custom domain (Vercel → Domains)
- Public contact email/phone/address (Dashboard → Site Settings)
- Donation instructions or payment links (Dashboard → Site Settings)
- Outbound email (acknowledgement emails on form submissions) — e.g. Resend/SMTP + a small
  server action hook; not configured in v1
- Spam protection (Cloudflare Turnstile) — form validation + RLS insert-only policies are in place;
  add Turnstile keys when available
- Analytics (Vercel Analytics / GA4)

## Known limitations (v1)

- News/blog module, testimonial public submission, custom field builder, CSV export, audit log
  table and request→project one-click conversion are deferred (documented next increments).
- Before/after pairs for VS-001 radiology/CR/ECG rooms are kept in the general gallery pending
  admin confirmation of unit pairing (source PDF ordering was ambiguous for pages 7–9).
- User management is done via the Supabase dashboard rather than an in-app `/admin/users` page.
- PDF report generation: use the browser's print on a project page (print-friendly); dedicated PDF
  export is a next increment.
