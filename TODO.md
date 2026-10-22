# IN PROGRESS
- [ ] Apply migration + seed to Supabase, create users, play-test on two phones (needs Supabase credentials)

# DONE
- Read PRD.md and implement application
  - [x] Scaffold Next.js (App Router, TS, Tailwind) + shadcn, framer-motion, supabase-js
  - [x] SQL migration: `como` schema, tables, grants, realtime publication, game_state row
  - [x] Script to create the two dummy auth users
  - [x] Generate 500-word seed set → `supabase/seed.sql` (505 words, levels 171/163/171)
  - [x] Supabase client + game logic (start round, swipe, word picking, role swap)
  - [x] Login screen (Player 1 / Player 2)
  - [x] Lobby with presence ("Connected") + avatar/dark mode prefs
  - [x] Describer swipe card (spring drag, rotate, overlays, haptics, layoutId to score)
  - [x] Guesser view (pulsing avatar, flash/particles on swipe)
  - [x] Round summary modal + learning bottom sheet
  - [x] Verify: typecheck, lint, production build, login screen in browser

## Review
- Game screens (lobby, card, guesser, summary) not yet exercised end-to-end: no Supabase project/creds and no Docker for local Supabase.
- Concurrency: start round guarded on `status`, swipe guarded on `cards_played` (optimistic checks in the UPDATE).
