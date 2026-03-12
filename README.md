# React Training - Icaro's Solution

This is the solution provided by Icaro at his last check-in.

## What changed

I replaced the static import of raw JSON data (`data.ts`) with a `fetch` call to a fake REST server powered by **json-server**. The app now loads trip data over HTTP at runtime instead of reading it from a hardcoded constant.

I also added two bulk-action buttons: **"Approve all expenses"** and **"Unapprove all expenses"**. Due to how json-server works with nested data, both flows need to:

1. Fetch the current trip object from the server.
2. Map all expenses to the target status (`"approved"` with today's date, or `"pending"` with `approvedAt: null`).
3. PATCH the entire modified trip back to the server.

This is because json-server treats the `trip` resource as a single object, so nested `expenses` can only be updated by patching the whole thing.

## Tooling

### json-server

[json-server](https://github.com/typicode/json-server) provides a full fake REST API backed by a plain `db.json` file. Any changes made through the API (e.g. PATCH requests) are persisted directly to `db.json`. No real backend needed.

The server runs on port **3001** and exposes:

- `GET /trip` — returns the trip with its expenses.
- `PATCH /trip` — updates the trip (used by the approve-all and unapprove-all flows).

### concurrently

[concurrently](https://github.com/open-cli-tools/concurrently) runs multiple commands in parallel in a single terminal. The `dev` script uses it to start both the Vite dev server and json-server at the same time:

```
"dev": "concurrently \"vite\" \"json-server db.json --port 3001\""
```

Just run `npm run dev` and both servers start together.

## Exercise

The exercise consists of using **React Query** (`@tanstack/react-query`) to simplify the communication with the server, both for:

- **Fetching** the trip data (replacing the manual `useEffect` + `useState` pattern).
- **Updating** the trip (replacing the manual approve-all and unapprove-all async functions with proper mutations).
- **Loading state** — use React `Suspense` with a spinner/fallback to show a loading indicator while the trip data is being fetched, instead of the manual `isLoading` state.
