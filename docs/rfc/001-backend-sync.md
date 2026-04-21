# RFC 001: Local-First Backend Sync

**Status:** Accepted (retrospective — implementation shipped before the RFC was written)
**Author:** consolidated from the March–April 2026 production-readiness audit
**Consolidated:** April 21, 2026

## Summary

The app is now local-first with an **optional** cloud sync backend on Supabase. When the user is signed out or Supabase env vars are unset, the app behaves exactly as the historical browser-local product: IndexedDB primary, localStorage fallback, dual-write persistence. When the user is signed in and Supabase is configured, character documents and campaigns are pushed/pulled/subscribed-to against Postgres tables with row-level-security scoped to `auth.uid()`.

This RFC exists because `docs/MASTER_PLAN.md` listed "backend sync/accounts" as a `Discovery track` gated on exactly such an RFC. The backend work shipped ahead of the gate. This document closes the gate in arrears and establishes the constraints any future sync changes must respect.

## Motivation

- **Cross-device continuity.** A player using one character on their phone at the table and on their laptop between sessions previously had to export/import JSON.
- **Campaign sharing.** Campaign metadata (member roster, notes) needs to live somewhere non-local if it is to be useful to multiple players in the same game.
- **Durability.** `localStorage` is user-wipeable, quota-limited, and easy to lose. IndexedDB helps but is still origin-scoped and subject to browser eviction. A cloud copy is a backup, not a replacement.

The `Non-Negotiable Constraint` that predates this RFC — "the app stays browser-local until a backend/sync track produces an explicit spec and implementation plan" — is retained in spirit: **browser-local remains the default and the offline fallback. Cloud sync is additive, never required.**

## Scope

In scope:

- Authenticated user sessions (Supabase Auth, email/password + OAuth providers)
- Per-user storage of character documents (`documents` table)
- Per-user storage of campaigns (`campaigns` table)
- Bidirectional sync with conflict resolution
- Realtime propagation of remote changes
- Offline queueing with reconnect replay
- Exponential-backoff retry on transient network failures

Out of scope:

- Multi-user shared editing of the same document (see _Future Work_)
- Server-side rules computation
- Server-side content loaders or SRD data hosting — content stays in the bundle
- Collaborative campaign editing by multiple authenticated users (each user still sees only their own rows)

## Design

### Auth

Supabase Auth. See `src/contexts/AuthContext.tsx`.

- Email + password signup / signin.
- OAuth providers (Google, GitHub) wired, redirecting back to the site origin.
- Session is exposed via `useAuth()` as `{ session, user, isLoading, isConfigured, ...handlers }`.
- When `isSupabaseConfigured()` returns `false` (env vars missing), auth is a no-op and every hook falls back to browser-local behavior.

### Storage schema

See `supabase/migrations/001_initial.sql` and `supabase/migrations/002_campaigns_realtime.sql`.

Two user-owned tables:

- `documents`: `id`, `user_id`, `name`, `system_id`, `system_data JSONB`, `created_at`, `updated_at`, `version INTEGER`.
- `campaigns`: `id`, `user_id`, `name`, `system_id`, `notes`, `character_ids UUID[]`, `created_at`, `updated_at`. **No `version` column** — campaigns are low-churn metadata.

Shared infrastructure:

- RLS is enabled on both with a single `auth.uid() = user_id` USING+CHECK policy.
- `update_updated_at()` trigger bumps `updated_at` on every row UPDATE.
- Indexes on `user_id` on both tables; `documents` also has `(updated_at DESC)`.
- Both tables are added to the `supabase_realtime` publication (the publication for `campaigns` was split into `002_campaigns_realtime.sql` so existing `001` deploys can catch up idempotently).

### Sync semantics

Engine primitives live in `@/src/utils/syncEngine.ts:1-404`. Hooks at `@/src/hooks/useSync.ts` and `@/src/hooks/useCampaignSync.ts`.

**Documents** — versioned merge:

1. On sign-in, `useSync` pulls remote rows, folds in any queued offline snapshot, merges with local, and emits the merged set through `onMerge` (wired to `useDocuments.addDocuments`).
2. Merge rule in `mergeDocuments`: incoming wins iff `version > existing.version`, or `version == existing.version AND updatedAt > existing.updatedAt`.
3. Local mutations stamp `updatedAt` and bump `version`.
4. Pushes are debounced 300ms.

**Campaigns** — timestamp-only merge:

1. `useCampaignSync` mirrors the document flow against the `campaigns` table.
2. `mergeCampaigns` is strictly last-writer-wins on `updatedAt` (no version column).
3. A sorted-member-list is folded into the `sameCampaignSignatures` hot-path compare so membership changes always count as dirty even if `updatedAt` collides within the same millisecond.

### Offline queue

Separate `localStorage` queues per entity, flushed on reconnect:

- `rpg-sync-queue-v1` — document snapshot
- `rpg-campaign-sync-queue-v1` — campaign snapshot

When `navigator.onLine` is `false`, pushes are queued rather than attempted. On the `online` event, `sync()` is re-invoked, which folds queued state into the next merge.

### Realtime

Each table has its own `postgres_changes` subscription keyed by the user's id. The handler just triggers a re-sync. Supabase realtime has its own channel reconnection logic so the client does not double-retry.

### Retry

See `src/utils/retry.ts`.

- Full-jitter exponential backoff: `random(0, min(maxDelay, initial * 2^n))`. Source: Marc Brooker, "Exponential Backoff And Jitter" (AWS Architecture Blog, 2015).
- Default production profile: 4 attempts, 500ms initial, 8000ms cap.
- Test profile: 1 attempt, 0ms delay — auto-selected when `import.meta.env.MODE === 'test'` so existing suites that mock failures don't wait multi-second delays.
- `isRetryableError` short-circuits on auth, RLS, schema, and config errors (message fragments: `invalid api key`, `jwt expired`, `jwt malformed`, `no authenticated`, `row-level security`, `duplicate key`, `violates`, `unauthorized`, `forbidden`, `not configured`). These will fail identically on every attempt; retrying hides the signal.

Only `fetchRemoteDocuments`, `pushDocument`, `pushDocuments`, `deleteRemoteDocument`, and the matching campaign variants are wrapped. `getCurrentUserId` (inside `toRemote`) is intentionally outside the retry — auth failures bubble up as non-retryable without waiting three round trips.

## Migration from browser-local

No explicit migration step is required. On first sign-in:

1. `useSync` pulls whatever is in the user's remote `documents` table (empty on a brand-new account).
2. Merges with whatever is already in local storage.
3. Pushes the merged set back.

The practical effect: the user's existing local documents become the seed of their cloud collection. The inverse also holds — signing in on a second device pulls whatever lives cloud-side and merges it with the new device's local collection.

A signed-out user continues to work purely browser-local; nothing is pushed and nothing is fetched.

## Netlify / runtime implications

Environment variables (surface in `.env`, never committed):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SENTRY_DSN` (optional — unrelated to sync but wired in the same bundle)

Netlify deploy:

- `netlify.toml` declares build command, SPA fallback redirect, CSP and security headers, and cache policies. The CSP must allow `connect-src` to the Supabase project domain. If the Supabase URL domain changes, the CSP `connect-src` must be updated.
- Realtime uses a WebSocket upgrade against `wss://<project>.supabase.co`. No special Netlify config is needed because WebSocket upstream is handled by Supabase, not Netlify.

Runtime:

- The Supabase JS client is bundle-splittable. See `vite.config.ts` chunk configuration.
- The app continues to work fully offline and fully signed-out. Every sync code path checks `getSupabaseClient()` and `useAuth().isConfigured` before taking any remote action.

## Security

- **RLS is the primary trust boundary.** The anon key ships to the browser; nothing in the client prevents a user from trying to read another user's rows. The `users_own_documents` and `users_own_campaigns` policies enforce `auth.uid() = user_id` on every SELECT/INSERT/UPDATE/DELETE.
- **JWT handling** is delegated entirely to the Supabase JS client. Tokens live in `localStorage` by default (Supabase convention).
- **CSP** locks `connect-src`, `script-src`, and friends per `netlify.toml`. `unsafe-eval` is not granted.
- **Rate limiting** is Supabase's responsibility; the client-side retry policy is bounded (4 attempts, ~7.5s worst case with default jitter) to avoid contributing to a herd.

## Accepted boundaries

- **Single-editor per account.** If the same user edits the same document on two devices simultaneously, the later `updatedAt` wins. There is no operational-transform or CRDT layer.
- **No shared editing across accounts.** RLS explicitly prevents it. Campaign membership is local-to-the-account: each player of a shared campaign has their own row.
- **Auth provider choices are the user's responsibility.** If email verification is disabled in the Supabase project, the client will not re-check it.
- **Realtime is best-effort.** If the WebSocket drops, the next explicit `sync()` call (on reconnect, on navigation, on visibility change in a future hook iteration) will reconcile. Nothing depends on realtime for correctness — it is a UX improvement, not a correctness primitive.

## Future work

- **Cross-account campaign sharing.** Would require an explicit `campaign_members` table, RLS rewrite, and an invitation flow. Out of scope for this RFC.
- **Per-document conflict UI.** Today a loss is silent (the older write simply does not land). If the product grows into genuine multi-device mid-session editing, a conflict-resolution modal becomes needed.
- **Server-side rules validation.** The client currently trusts itself. Server-side validation of character data against system rules would require Supabase Edge Functions.
- **Email verification / password reset UX.** The Supabase primitives exist; the client UX surfaces do not.

## Maintenance

This RFC must be updated — not duplicated elsewhere — when any of the following change:

- Supabase schema (`supabase/migrations/**`)
- Sync engine primitives (`src/utils/syncEngine.ts`)
- Sync hooks (`src/hooks/useSync.ts`, `src/hooks/useCampaignSync.ts`)
- Retry policy (`src/utils/retry.ts`)
- Auth context (`src/contexts/AuthContext.tsx`)
- Netlify or CSP constraints that affect the Supabase connection

`docs/MASTER_PLAN.md` references this RFC under Historical Provenance. Its Active-implementation-track entries on sync are expected to link back here rather than re-describe the design.
