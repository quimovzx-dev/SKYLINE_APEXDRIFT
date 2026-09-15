-- Run this in Supabase → SQL Editor → New query → Run

create table users (
  gdbp_number serial primary key,
  usr_name text not null unique,
  passwd text not null,
  created_at timestamp default now()
);

create table sessions (
  session_id serial primary key,
  gdbp_number integer references users(gdbp_number),
  login_time timestamp default now(),
  logout_time timestamp
);

create table game_stats (
  stat_id serial primary key,
  gdbp_number integer references users(gdbp_number),
  matches_played integer default 0,
  score integer default 0,
  time_spent_seconds integer default 0,
  played_at timestamp default now()
);
