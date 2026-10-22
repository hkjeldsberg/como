# Como

Two-player real-time Spanish vocabulary game ("es como…"). See `PRD.md`.

## Setup

1. `cp .env.example .env.local` and fill in your Supabase URL, anon key, service role key and a dummy password.
2. In the Supabase SQL editor run, in order:
   - `supabase/migrations/20261022000000_como.sql` (schema `como`, tables, grants, realtime)
   - `supabase/seed.sql` (505 words)
3. Dashboard → Project Settings → API → **Exposed schemas**: add `como`.
4. Create the two players: `node --env-file=.env.local scripts/create-users.mjs`
5. `npm install && npm run dev`, open on two phones (Chrome, iPhone/Android).

## Word list

Source data lives in `supabase/words/*.json`. After editing, regenerate the seed with `node scripts/build-seed.mjs` (dedupes by `spanish_word`).
