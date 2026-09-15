# Sky Dodger — GDBP Database + Game Project

A login system backed by a Supabase (Postgres) database, feeding into a
browser arcade game. Built to run entirely from GitHub + Vercel — no laptop
needed, everything can be edited from GitHub's web editor or a phone code app.

## 1. Set up the free database (Supabase)

1. Go to https://supabase.com → sign up free → "New project"
2. Once it's created, open the **SQL Editor** (left sidebar)
3. Paste the contents of `schema.sql` (in this repo) and click **Run**
   → this creates the `users`, `sessions`, and `game_stats` tables
4. Go to **Project Settings → API**. Copy:
   - `Project URL` → this is `SUPABASE_URL`
   - `service_role` key (NOT the anon key) → this is `SUPABASE_SERVICE_KEY`
     (keep this secret — never put it in frontend code)

## 2. Push this project to GitHub

- Create a new repo, upload all these files keeping the folder structure:
  - `/api/login.js`
  - `/public/login.html`
  - `package.json`
  - `schema.sql`

## 3. Deploy to Vercel

1. Go to https://vercel.com → "Add New Project" → import your GitHub repo
2. Before deploying, open **Environment Variables** and add:
   - `SUPABASE_URL` = (from step 1)
   - `SUPABASE_SERVICE_KEY` = (from step 1)
3. Click **Deploy**
4. Once live, visiting your Vercel URL directly will show a 404 — set
   `public/login.html` as your entry point by visiting `yoursite.vercel.app/login.html`,
   or rename it to `index.html` once you're happy with it.

## How it works so far

- `login.html` → user enters username + password
- Frontend calls `POST /api/login`
- The serverless function checks Supabase: new user → creates a row in
  `users` and returns a fresh `GDBP_NUMBER` (primary key); returning user →
  verifies their (hashed) password and returns their existing `GDBP_NUMBER`
- Every login also inserts a row into `sessions` with a timestamp
- The `GDBP_NUMBER` is stored in the browser (`localStorage`) so the game
  page knows who's playing

## Next up

`game.html` (the Sky Dodger arcade game) + `/api/save-score.js` to write
`matches_played`, `score`, and `time_spent_seconds` into `game_stats` after
each round. Ask for this next when ready.
