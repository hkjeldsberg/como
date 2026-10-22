## Product Requirements Document: Como

**Product:** Como (Web-based mobile application) — *"como"* = "like" in Spanish, as in "it's like…" when describing a word.
**Primary Objective:** A real-time, two-player vocabulary game designed for Spanish language practice, heavily inspired by Alias and Concept.
**Target Audience:** Two dedicated users (e.g., study partners) looking for an engaging, low-friction way to practice conversational Spanish and vocabulary recall.
**Target Browsers:** Chrome on iPhone and Android (mobile-first, portrait).

### 1. Product Overview

Como acts as a digital card game synchronized across two mobile devices. One player (The Describer) receives a target Spanish word and must convey its meaning to the second player (The Guesser) using only Spanish synonyms and descriptions. The application prioritizes an ultra-smooth, gesture-driven "Apple-design" interface, masking real-time database synchronization behind fluid, tactile animations.

### 2. Technical Stack & Architecture

* **Frontend Framework:** Next.js (App Router) with React and TypeScript.
* **Styling:** Tailwind CSS integrated with Shadcn UI primitives.
* **Animation & Gestures:** Framer Motion (specifically utilizing spring physics, `drag`, `useTransform`, and `layoutId`).
* **Backend & Sync:** Supabase (Database and Realtime subscriptions). All app tables live in a dedicated Postgres schema **`como`** (not `public`).
* **Authentication:** Hardcoded dummy accounts for frictionless entry.
* **Local Storage:** `localStorage` for persisting non-critical UI preferences (e.g., chosen avatar).

### 3. Authentication & State Strategy

Given the strict two-player constraint, traditional authentication flows are bypassed to maximize speed to gameplay.

* **Dummy Auth Model:** The application utilizes two pre-provisioned Supabase accounts (`player1@dummy.local` and `player2@dummy.local`). Their auth user IDs are stored in `game_state` (`player_1_id`, `player_2_id`).
* **One-Tap Login:** The entry screen features two large buttons: **"Play as Player 1"** and **"Play as Player 2"**. Tapping a button executes `supabase.auth.signInWithPassword()` instantly.
* **Global Game State:** A single `como.game_state` row in Supabase acts as the source of truth. Since only two users exist globally, the app does not need complex room creation, session IDs, or matchmaking logic. Both clients subscribe to this single row via Supabase Realtime to track whose turn it is, the active word, and the score.
* **Access:** No row-level security; both dummy accounts have open read/write access to `como` tables.

### 4. Core Gameplay Loop

1. **Lobby / Ready State:** Both players tap their respective login buttons. The screen shows both players as "Connected". Either player can tap "Start Round".
2. **The Round (fixed number of cards, default 10, no timer):**
* **Describer View:** The target Spanish word appears on a large, draggable card in the center of the screen, with its level (1–3 dots) shown.
* **Guesser View:** The screen displays a listening/waiting state with the Describer's avatar pulsing.


3. **Action & Input:**
* The Describer speaks Spanish out loud (assuming physical proximity or an open voice call) to describe the word.
* When the Guesser shouts the correct word, the Describer swipes the card right. The Describer earns points equal to the word's level (easy = 1, medium = 2, hard = 3).
* If the word is too difficult, the Describer swipes left to skip. Skips cost nothing (0 points).
* Every swipe (correct or skip) counts toward the round's card total. Each swipe inserts a `round_cards` row and advances `game_state.current_word_id`.


4. **Word Selection:** Each new card picks a random level (easy/medium/hard, equal odds), then a random word of that level not already played in the current round. Words may repeat across rounds.
5. **Real-time UI:** As the Describer swipes, the Guesser's screen instantly updates with a particle effect or color flash to indicate a point scored or skipped.
6. **Round End:** After the last card, `status` becomes `round_summary`. A modal slides up showing the round's points and the list of words encountered (correct/skipped). The roles swap, and either player taps "Next Round" to return to `playing`.
7. **No End Condition:** There is no target score or round limit; players keep playing as long as they like. Running totals per player persist in `game_state`.

### 5. "Apple-Design" UX & Animation Guidelines

The interface must feel native, tactile, and physically grounded, avoiding abrupt state changes.

* **Physics-Based Swiping:** The core word card must use Framer Motion's `drag` prop with tight spring physics (`stiffness: 400`, `damping: 25`). As the user drags the card left or right, a `useTransform` hook should incrementally rotate the card (e.g., `-10deg` to `10deg`) and fade in a green "Correct" or gray "Skip" overlay.
* **Haptic Feedback:** Bind `navigator.vibrate()` to key interactions. A subtle 10ms vibration when dragging crosses the threshold to register a swipe, and a heavier double-vibration on round end. Works on Android only; on iPhone (all browsers use WebKit) it silently no-ops. No fallback required.
* **Visual Theme — "Arcilla" (soft clay):** Fredoka font (600 for words/scores, 500 for labels). Flat lavender page (`#ebe5f5`) with neumorphic clay surfaces (`clay-sm`, `clay-lg`, `clay-pressed` shadows). Player 1 = peach `#ffb59a`, Player 2 = mint `#9fd8c8` (mint is also the "correct" color). No glass, gradients or backdrop-blur. Light mode only.
* **Describer Screen:** score pills → "carta N de 10" → 280×340 word card (category chip, word, level dots in the describer's color) → two 76px round buttons, "paso" and "¡sí!", which do the same as swiping left/right. Dragging right tints the card mint with a "¡sí! +N" chip; dragging left tints it gray with a "paso" chip.
* **Shared Element Transitions:** Use Framer Motion's `layoutId` so that when a word is guessed correctly, the text seamlessly shrinks and animates up into the Describer's score counter at the top of the screen.

### 6. Database Schema (Supabase)

To support the single-room real-time architecture. All tables are created in the **`como`** schema.

* **Schema setup:**
* `create schema como;` with `usage` granted to `anon`, `authenticated`, `service_role`, plus table privileges on its tables.
* Add `como` to **Exposed schemas** in Supabase API settings.
* Client initialized with `createClient(url, key, { db: { schema: 'como' } })`.
* Add `como.game_state` and `como.round_cards` to the `supabase_realtime` publication; Realtime subscriptions specify `schema: 'como'`.


* **Table: `como.words`**
* `id` (uuid)
* `spanish_word` (text) - for titles, the Spanish title (e.g., *El señor de los anillos*).
* `category` (text) - e.g., verbs, nouns, adjectives, food, travel, `movie`, `book`, `person`.
* `level` (smallint, 1–3) - 1 = easy (A1–A2), 2 = medium (B1), 3 = hard (B2). Also the point value.
* `english` (text) - English translation (or original title for movies/books).
* `example_sentence` (text, nullable) - Spanish example sentence. Not used for movie/book/person.
* `grammar_note` (text, nullable) - e.g., gender, irregular conjugation. Not used for movie/book/person.
* `description` (text, nullable) - short description for movie/book/person (e.g., "Argentine footballer").


* **Table: `como.game_state` (Single Row)**
* `id` (uuid, constant)
* `player_1_id` (uuid) - auth user ID of Player 1
* `player_2_id` (uuid) - auth user ID of Player 2
* `active_describer_id` (uuid, toggles between Player 1 and Player 2 each round)
* `current_round_id` (uuid) - new value generated at the start of each round
* `current_word_id` (uuid)
* `cards_per_round` (int, default 10)
* `cards_played` (int) - cards swiped in the current round
* `player_1_score` (int) - running total
* `player_2_score` (int) - running total
* `status` (text) - 'waiting', 'playing', 'round_summary'


* **Table: `como.round_cards` (History)**
* `id` (uuid)
* `round_id` (uuid) - matches `game_state.current_round_id` at time of play
* `describer_id` (uuid)
* `word_id` (uuid, references `words.id`)
* `result` (text) - 'correct', 'skipped'
* `points` (int) - word level if correct, 0 if skipped
* `played_at` (timestamptz, default `now()`)

Used for the end-of-round summary, excluding repeats within a round, and tracking progress over time.

### 7. Post-Round Learning (Vocabulary Reinforcement)

At the end of a round, players see a summary of the cards they played. Tapping a word expands a bottom sheet (using a spring-loaded drag-to-dismiss animation) revealing its English translation, an example sentence, and any relevant grammar rules. For movies, books and famous people, the sheet shows the original/English title and a short description instead.

### 8. Word Content (Seed Data)

* Generated seed set of **500 entries**, up to B2 level, delivered as a SQL seed file.
* Spread roughly evenly across the 3 levels.
* Mostly everyday vocabulary (nouns, verbs, adjectives, food, travel, etc.), plus a share of movie titles, book titles and famous people, which are also assigned a level by how well-known/hard to describe they are.
* Movie and book titles use their Spanish title.