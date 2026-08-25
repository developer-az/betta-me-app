# Production readiness

## Database

1. Create a Supabase project.
2. In the SQL editor, run `supabase/production-schema.sql`.
3. Run `supabase/diagnostics.sql` and confirm every table reports `ok`, RLS is on, and the auth trigger exists.
4. Set Auth → URL configuration to include your production domain and `/reset-password`.
5. Set env vars on the host:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`

Legacy root-level `*.sql` fix scripts are superseded by `supabase/production-schema.sql`. Prefer the new schema for greenfield deploys.

## In-app verification

Signed-in keepers can open **Account → Production status** (`/status`) to probe:

- Env configuration
- Auth API reachability
- Table access under RLS (`profiles`, `tanks`, `fish`, `water_readings`, `feeding_logs`, `water_changes`)
- Local storage and service worker support

## Product checklist

- [ ] Email confirmation and password reset work on the production domain
- [ ] SPA rewrite is configured (`vercel.json` already rewrites to `/index.html`)
- [ ] Stripe (or similar) replaces demo checkout before charging cards
- [ ] Affiliate tags appended to shop URLs if required by partners
- [ ] PWA icons and manifest verified on mobile
- [ ] RLS smoke-tested with two user accounts (no cross-read)

## Known demo behavior

Checkout provisions Pro/Care+ locally so feature gates can be evaluated without a payment processor. Connect Stripe before launch.
