# Migrations

Three migrations are applied to and version-tracked in the Supabase project `vaidyalaya-seva`
(`mfnrnyzcsdqvzbewgsen`):

| Version | Name | Contents |
| --- | --- | --- |
| 20260711034705 | initial_schema | enums, profiles + role helper functions, projects, project_budget_items, project_metrics, before_after_pairs, project_media, testimonials, hospital_requests (+files/updates), volunteer/partnership/contact submissions, impact_stats, site_settings, updated_at triggers |
| 20260711034758 | rls_policies | RLS enabled on all tables; public read limited to published/approved/public rows; anon insert-only for public forms; staff/admin policies; storage buckets `public-media` (public) and `request-uploads` (private) with policies |
| 20260711034927 | seed_data | impact stats, site settings, VS-001 project (budget items, metrics, 11 before/after pairs, gallery, 2 approved testimonials) |

To regenerate the SQL files locally:

```bash
npx supabase login
npx supabase link --project-ref mfnrnyzcsdqvzbewgsen
npx supabase db pull   # writes migrations into supabase/migrations/
```
