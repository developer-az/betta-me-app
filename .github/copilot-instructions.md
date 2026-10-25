# Betta Me

React + TypeScript care app for betta tanks, health, and water chemistry. Auth and data live in Supabase. Do not change the table columns, RLS policies, or the `handle_new_user` trigger unless a migration is explicitly requested.

## Setup

- `npm install`
- Copy `env.example` to `.env.local`. Either `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` or the legacy `REACT_APP_` names work.
- Schema: `supabase/migrations/20240101000000_initial_schema.sql`, then `supabase/migrations/20240101000001_indexes_and_realtime.sql`.

## Scripts

- `npm start` — Vite on port 3000
- `npm run build` — `tsc --noEmit` and Vite build into `dist/`
- `npm test` — Vitest

Guest mode works without a signed-in user. Cloud saves need a real Supabase project.

## What to leave alone

- Auth options on the Supabase client: persist the session, refresh tokens, and detect the session in the URL.
- Row level security. Users only read and write their own rows.
- The canonical schema file. It was moved from the repo root and should stay equivalent.

## Product checks

- Welcome page shows “Professional betta care”.
- Tank, fish, water, and the dashboard require a signed-in user or guest mode.
- Habitat, betta profile, and water tests save on the explicit button. Dragging a slider must not insert a row per tick.
- Fish and water writes include `tank_id`.
