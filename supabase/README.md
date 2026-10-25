# Database

The schema and auth trigger are unchanged. These files only relocate the canonical script and add indexes plus Realtime.

Run them in the Supabase SQL editor, in order, on a new project:

1. `migrations/20240101000000_initial_schema.sql` — `profiles`, `tanks`, `fish`, `water_readings`, `feeding_logs`, `water_changes`, row level security, and the `handle_new_user` trigger. This is the previous `supabase-schema.sql`, moved as-is.
2. `migrations/20240101000001_indexes_and_realtime.sql` — indexes and Realtime publication membership. It does not change columns, policies, or the auth trigger.

If the initial schema is already applied, run only the second file.

One-off `fix-*.sql` and `quick-*.sql` scripts were removed. Several of them dropped tables, disabled row level security, or replaced the auth trigger.
