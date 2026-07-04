# Frontend

Next.js (App Router) + Tailwind + shadcn-style components. Talks to the
Pharos backend through a `/api/*` rewrite (see `next.config.mjs`), so the
browser never needs to know the backend's real Cloud Run URL.

## Design system

See `app/globals.css` for the full token set. Short version: deep night-sea
background, a warm "beacon" amber reserved for primary actions and health
signals, sea-glass teal for positive metrics. The signature element is
`components/beacon-status.tsx` — a status dot that sweeps like a lighthouse
beam when something's degraded, steady when it's not.

## Local setup

```bash
npm install
cp .env.example .env
# point NEXT_PUBLIC_API_URL at your local backend (http://localhost:8080)
# or your deployed Cloud Run URL

npm run dev
```

Visit `http://localhost:3000` — you'll be redirected to `/login`. Register
an account (this hits the backend's `/auth/register`), and you'll land on
`/dashboard`.

## What's implemented

- **Auth pages**: `/login`, `/register` — call the backend directly, store
  tokens in `localStorage` (see `lib/api.ts`).
- **Token refresh**: `apiFetch()` in `lib/api.ts` retries once with a
  refreshed access token on a 401, transparently, before giving up.
- **Dashboard shell**: sidebar nav + topbar with the live Beacon status
  indicator + a stat-card grid + a Recharts line chart, all on placeholder
  data shaped like what the real endpoints will return.

## What's next

- Wire `/dashboard` stat cards and the request-volume chart to real
  endpoints once the logging/analytics module exists on the backend.
- Add a `DataTable` (sortable/filterable) for the Logs page once there's
  real log data to show.
- Command palette (⌘K) for quick navigation, using `cmdk`.
- Replace `localStorage` token storage with httpOnly cookies once the
  backend sets them — more secure against XSS, worth doing before this
  goes anywhere near real user data.
