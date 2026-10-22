-- Como: schema, tables, grants and realtime.
-- After applying, add `como` to "Exposed schemas" in Supabase Dashboard → Project Settings → API.

create schema if not exists como;

grant usage on schema como to anon, authenticated, service_role;

create table como.words (
  id uuid primary key default gen_random_uuid(),
  spanish_word text not null unique,
  category text not null,
  level smallint not null check (level between 1 and 3),
  english text not null,
  example_sentence text,
  grammar_note text,
  description text
);

create table como.game_state (
  id uuid primary key,
  player_1_id uuid,
  player_2_id uuid,
  active_describer_id uuid,
  current_round_id uuid,
  current_word_id uuid references como.words (id),
  cards_per_round int not null default 10,
  cards_played int not null default 0,
  player_1_score int not null default 0,
  player_2_score int not null default 0,
  status text not null default 'waiting' check (status in ('waiting', 'playing', 'round_summary'))
);

create table como.round_cards (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null,
  describer_id uuid not null,
  word_id uuid not null references como.words (id),
  result text not null check (result in ('correct', 'skipped')),
  points int not null default 0,
  played_at timestamptz not null default now()
);

create index round_cards_round_id_idx on como.round_cards (round_id);

-- The single global game row.
insert into como.game_state (id) values ('00000000-0000-0000-0000-000000000001');

-- Open access (no RLS) for the two dummy accounts.
grant select, insert, update, delete on all tables in schema como to anon, authenticated, service_role;
alter default privileges in schema como grant select, insert, update, delete on tables to anon, authenticated, service_role;

-- Realtime: full rows on update so clients get every column.
alter table como.game_state replica identity full;
alter publication supabase_realtime add table como.game_state, como.round_cards;
