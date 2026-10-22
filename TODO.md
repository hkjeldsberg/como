# IN PROGRESS
- [ ] Play-test on two real phones (touch drag, Android vibration)

# DONE
- [x] "Arcilla" clay theme: Fredoka, clay colors/shadows, new describer layout with paso/¡sí! buttons, clay lobby/login/guesser/summary/sheet; glass, mesh and dark mode removed. Verified in browser with 2 players + build/lint/typecheck.
- [x] Backend e2e (scratch script): sign-in both players, 505 words, slot claim, round start/guards, 10-card round, scoring, P2 realtime updates + inserts
- [x] Browser e2e with 2 players (localhost / 127.0.0.1): presence, describer card, swipe right/left, guesser flash, summary on both, word sheet + drag dismiss, role swap
- [x] Added `allowedDevOrigins` (127.0.0.1 + LAN) so other devices can load the dev server
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
