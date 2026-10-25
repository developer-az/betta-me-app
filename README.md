# Betta Me

Betta Me is a production care platform for betta keepers: habitat setup, water chemistry, health scoring, care logs, and a partner shop with membership pricing.

## Product

- **Starter (free)** — one tank, health score, 7-day logs, core guides
- **Pro ($6.99/mo or $59/yr)** — history, water trend charts, PDF/CSV export, 10% shop discount
- **Care+ ($12.99/mo or $99/yr)** — disease protocols, expert library, 15% shop credit

Revenue comes from subscriptions and curated affiliate product links. Editorial recommendations are not paid placements.

## Tech stack

- React 19, TypeScript, Tailwind CSS, Framer Motion
- Vite, with route-level code splitting
- Supabase (PostgreSQL + Auth + RLS + Realtime)
- React Router

## Quick start

1. Copy `env.example` to `.env.local` and add your Supabase URL and anon key (`VITE_` or the existing `REACT_APP_` names).
2. Run `supabase/migrations/20240101000000_initial_schema.sql` in the Supabase SQL editor, then `supabase/migrations/20240101000001_indexes_and_realtime.sql`. See `supabase/README.md`.
3. `npm install`
4. `npm start`

The app runs at [http://localhost:3000](http://localhost:3000).

Add `/reset-password` to the Supabase Auth redirect allow list so password-reset emails can finish in the app.

## Scripts

- `npm start` — development server
- `npm run build` — typecheck and production build (`dist/`)
- `npm test` — test suite

## Data model

Tables: `profiles`, `tanks`, `fish`, `water_readings`, plus feeding and water-change logs. Row Level Security keeps records per user. The auth trigger still creates a profile when a user signs up. Realtime updates the open habitat when those tables change.

## Billing note

Checkout in this codebase provisions a plan locally so Pro and Care+ can be evaluated end-to-end. Connect Stripe Checkout (or another PCI-compliant processor) before taking live payments.
