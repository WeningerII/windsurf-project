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
- `rpg-sync-delete-queue-v1` — deleted document ids awaiting remote DELETE replay
- `rpg-campaign-sync-queue-v1` — campaign snapshot
- `rpg-campaign-sync-delete-queue-v1` — deleted campaign ids awaiting remote DELETE replay

When `navigator.onLine` is `false`, pushes are queued rather than attempted. If a locally removed row cannot be deleted remotely because the browser is offline or the DELETE fails, its id is recorded in the matching delete queue. On the `online` event, `sync()` is re-invoked, which folds queued state into the next merge, filters queued-deleted ids out of both local and remote inputs so they cannot be resurrected, replays DELETEs, and only then pushes the merged snapshot. Failed delete replay leaves both queues intact and reports an error state.

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

Each item below is a deliberate non-shipped extension. They are grouped together so a future implementer can read this section as a contract sketch instead of a wish list. None of them is on the active implementation track at the time of this RFC update.

### Cross-device delete tombstones

**Problem.** The local delete queues (`rpg-sync-delete-queue-v1`, `rpg-campaign-sync-delete-queue-v1`) protect this device's offline or failed deletes. But if device A deletes a row while device B is offline, when device B reconnects it pulls the remote table (which no longer contains the row) and merges with its still-present local copy. `mergeDocuments` and `mergeCampaigns` keep the local row because there is nothing remote to compare against — the deletion is silently undone on push.

**Sketch.**

- Add `deleted_at TIMESTAMPTZ NULL` to both `documents` and `campaigns`. When the column is non-null the row is a tombstone.
- DELETE flows become soft-deletes: `UPDATE … SET deleted_at = now()` instead of `DELETE FROM …`.
- RLS continues to scope `auth.uid() = user_id`. No policy changes are required because the column is owned by the same user.
- `fetchRemoteDocuments` / `fetchRemoteCampaigns` start including tombstones. The merge functions gain a third rule: if either side has `deleted_at` set, the row is removed locally and the local id is added to a tombstone-acknowledged set so it cannot resurface on the next merge.
- A scheduled Postgres job (or Supabase scheduled Edge Function) hard-deletes rows where `deleted_at < now() - interval '30 days'`. The window is intentionally generous so a device that has been offline for weeks can still observe the tombstone.
- Existing local delete queues continue to apply but now post tombstone updates rather than DELETEs. The local deletion UX is unchanged.
- Migration: a new SQL migration (`003_soft_deletes.sql`) adds the column with a partial index `(user_id) WHERE deleted_at IS NULL` so the hot-path read filter stays cheap.
- Rollout: the column ships first with no client behavior change. Once deployed, the client switches DELETE → soft-delete. Old clients still hard-delete; the cleanup job tolerates either shape.

### Per-document conflict UI

**Problem.** When two devices push divergent versions of the same document, the merge engine silently picks the higher `(version, updatedAt)` tuple. The losing edits are gone with no notification.

**Sketch.**

- Persist the loser snapshot. Extend `mergeDocuments` to surface a `conflicts: ConflictRecord[]` alongside the merged set. A `ConflictRecord` is `{ id, winning: Document, losing: Document, reason: 'version' | 'updatedAt' }`.
- `useSync` propagates conflicts through a new `onConflict(conflicts)` callback. Conflicts are stored in a `useState` slice in `useDocuments` keyed by document id; only the most recent conflict per id is retained.
- A new `ConflictBanner` component appears in the document header when a conflict is recorded. It exposes "Keep current", "Restore other version", and "Show diff" actions. "Restore other version" replays the losing snapshot through `setDocument` and bumps `version` again so the resolution itself becomes the next push.
- No schema change is required.
- Local-first invariant: conflicts are stored in `localStorage` under `rpg-conflicts-v1` so the banner survives reload even when offline.
- Suppression: if the loser's `updatedAt` is older than 5 minutes the conflict is auto-dismissed. The 5-minute window is deliberate — older edits on a stale tab are almost always the unintended write.

### Cross-account campaign sharing

**Problem.** Today each player who is a member of the same campaign has their own `campaigns` row scoped to their own `auth.uid()`. Updates by one member do not propagate to another.

**Sketch.**

- New `campaign_members` table:
  - `campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE`
  - `user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE`
  - `role TEXT CHECK (role IN ('owner', 'editor', 'viewer'))`
  - `accepted_at TIMESTAMPTZ` — null while the invite is pending
  - PRIMARY KEY `(campaign_id, user_id)`
- New `campaign_invites` table:
  - `token UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  - `campaign_id UUID NOT NULL`
  - `email TEXT NOT NULL`
  - `role TEXT CHECK (role IN ('editor', 'viewer'))`
  - `expires_at TIMESTAMPTZ NOT NULL`
- RLS rewrite on `campaigns` to allow `SELECT` and `UPDATE` when the requesting user has an `accepted_at IS NOT NULL` row in `campaign_members`. `DELETE` stays restricted to `role = 'owner'`. `INSERT` semantics do not change — a user always creates campaigns under their own id.
- Realtime publication continues to broadcast every `campaigns` row change; clients filter by membership in the local view.
- Client invitation flow: an "Invite player" modal in the campaign view writes to `campaign_invites` and shows the token-bearing URL the inviter copies out-of-band. Visiting the URL while signed in writes a row to `campaign_members` and sets `accepted_at`. The accepted-at semantic is what the RLS policy reads; merely receiving the invite token does not grant access.
- Out of scope of this sketch: an authenticated email-delivery path. The client surfaces the URL; the user delivers it.
- Per-character ownership remains scoped to `documents.user_id`. A campaign can list character ids that the requesting user does not own — those characters render as read-only references with the owning player's display name. This is intentional: the campaign is shared, the sheets stay personal.

### Server-side rules validation

**Problem.** The client trusts itself. A user can hand-edit local storage to bypass class-level requirements, ability-score caps, or HP totals. For sync, the trust boundary is RLS — the server happily stores whatever shape the client uploads.

**Sketch.**

- Use Supabase Edge Functions, not the client bundle. The same TypeScript validation modules already used by the React app (`src/utils/d20LegacyTemplate.ts`, `src/systems/pf2e/data-model.ts`, etc.) move to a new shared validation directory under `src/` consumable by both runtimes. The exact path is not pre-allocated here; it is created at the time the work lands so this RFC does not assert a path that does not yet exist.
- A new Edge Function `validate-document` receives `{ system_id, system_data }` and returns `{ ok: boolean, errors: ValidationError[] }`. Validation per system is handled by a registry keyed on `system_id`.
- Postgres trigger on `documents`: `BEFORE INSERT OR UPDATE FOR EACH ROW EXECUTE FUNCTION http_validate_document();`. The trigger calls the Edge Function via `pg_net`. On a non-OK response the trigger raises an exception, the write fails, and the client surfaces the validation error through the existing retry/error path (errors prefixed with `validation:` are non-retryable, parallel to the auth/RLS short-circuit list in `isRetryableError`).
- Local-first guarantee: validation happens on the server side of sync, not on the local edit path. A signed-out or offline user is never blocked by validation; their local edits replay against the server only when they sign in and reconnect. If the server then rejects them, the user sees the same conflict-style banner as the document conflict UI.
- Performance: the trigger runs synchronously on the request path. The Edge Function's cold-start is ~150ms in Supabase's published numbers; the sync path is already debounced 300ms so a one-time cost stacks with the existing delay.
- Boundaries: cross-document or campaign-wide validation (e.g., "no two PCs can claim the same magic item") is explicitly out of scope. The trigger validates a single row in isolation.

### Email verification and password reset UX

**Problem.** Supabase Auth supports both flows out of the box. The client surfaces neither. A user who forgets their password has no in-app recovery path.

**Sketch.**

- Extend `AuthContext` with two new handlers:
  - `sendPasswordResetEmail(email: string): Promise<{ error: string | null }>` wraps `supabase.auth.resetPasswordForEmail(email, { redirectTo: <SITE_URL>/reset-password })`.
  - `updatePassword(newPassword: string): Promise<{ error: string | null }>` wraps `supabase.auth.updateUser({ password: newPassword })`. Used both by the post-reset flow and by an in-app "Change password" surface.
- Add two route surfaces in the existing single-page-app shell:
  - `/forgot-password` — email entry form. On submit, calls `sendPasswordResetEmail` and shows a "check your inbox" confirmation regardless of whether the email exists. (Avoids account-enumeration via timing.)
  - `/reset-password` — landing target for the email link. Supabase appends an access token; the page calls `client.auth.exchangeCodeForSession()` then prompts for a new password and calls `updatePassword`.
- Email verification: Supabase project setting "Enable email confirmations" already controls this; no client change is strictly required because Supabase blocks unverified sign-ins. Surface the state by adding `user.email_confirmed_at` to `useAuth()`'s exposed user shape and rendering a banner ("Verify your email to enable cloud sync") in `Dashboard` when the user is signed in but unconfirmed. Resend uses `client.auth.resend({ type: 'signup', email })`.
- Out of scope: SMS / phone OTP, magic links. Both are Supabase-supported but multiply the surface area without changing the sync contract.
- Tests: extend `useSync` integration tests with an unconfirmed-email path that asserts (a) signed-in unconfirmed users still operate fully local-first and (b) sync attempts return the existing non-retryable auth-error code without bothering the retry queue.

## Maintenance

This RFC must be updated — not duplicated elsewhere — when any of the following change:

- Supabase schema (`supabase/migrations/**`)
- Sync engine primitives (`src/utils/syncEngine.ts`)
- Sync hooks (`src/hooks/useSync.ts`, `src/hooks/useCampaignSync.ts`)
- Retry policy (`src/utils/retry.ts`)
- Auth context (`src/contexts/AuthContext.tsx`)
- Netlify or CSP constraints that affect the Supabase connection

`docs/MASTER_PLAN.md` references this RFC under Historical Provenance. Its Active-implementation-track entries on sync are expected to link back here rather than re-describe the design.
