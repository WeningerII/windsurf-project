# Runbook: Supabase Backup & Restore

On-call procedure for backing up and restoring the Supabase Postgres backend that
powers **optional** cloud sync (RFC 001). Written to be followed cold. Steps that
require console access or credentials the maintainer must provision are marked
**[NEEDS ACCESS]**.

> **First, the reassuring part.** Cloud sync is *additive, never required*
> (RFC 001). If Supabase is down or being restored, the app keeps working fully
> browser-local (IndexedDB + localStorage) for every user. A restore is about
> durability of the cloud copy, not about keeping the app online. Do not treat this
> as a total-outage incident unless local storage is also implicated.

---

## 1. What this backend is

- **Project:** one Supabase project. Its URL is the client's `VITE_SUPABASE_URL`;
  the browser holds only the **public anon key** (`VITE_SUPABASE_ANON_KEY`,
  `src/utils/supabaseClient.ts:3-4`). The **`service_role` key and DB password are
  server/admin-only** and must never appear in a `VITE_` var or in git (enforced by
  `scripts/check-secret-exposure.mjs` in `npm run verify`).
- **Trust boundary is RLS.** Every table is scoped `auth.uid() = user_id`. A restore
  is only correct if RLS and its policies come back intact (see Verify, §6).

### What lives in the database

The schema is defined by ordered migrations in `supabase/migrations/`, applied in
filename order:

| Migration | Adds |
|---|---|
| `001_initial.sql` | `documents` + `campaigns` tables, RLS + `auth.uid() = user_id` policies, `user_id` indexes (`documents` also `(updated_at DESC)`), `update_updated_at()` trigger, `documents` in the `supabase_realtime` publication |
| `002_campaigns_realtime.sql` | adds `campaigns` to the `supabase_realtime` publication (idempotent split so existing `001` deploys catch up) |
| `003_soft_delete.sql` | `deleted_at TIMESTAMPTZ` on both tables (soft-delete tombstones); **DROPS the `documents_updated_at`/`campaigns_updated_at` triggers and `update_updated_at()`** — the **client now owns `updated_at`** as the last-writer-wins conflict timestamp |
| `004_campaign_story.sql` | `campaigns.quests JSONB NOT NULL DEFAULT '[]'`, `campaigns.session_log JSONB NOT NULL DEFAULT '[]'` |

> **Critical restore note:** After `003`, there is intentionally **no
> `update_updated_at()` trigger**. If a schema restore silently reintroduces it,
> every cross-device push will overwrite `updated_at` at push time and can revert
> real edits (this is exactly the bug `003` fixed). Verify the trigger is **absent**
> after restore (§6).

### The two tables (row data)

- **`documents`**: `id`, `user_id`, `name`, `system_id`, `system_data JSONB`,
  `created_at`, `updated_at`, `version INTEGER`, `deleted_at`. Higher-churn; merge is
  versioned (`version`, then `updatedAt`).
- **`campaigns`**: `id`, `user_id`, `name`, `system_id`, `notes`,
  `character_ids UUID[]`, `created_at`, `updated_at`, `deleted_at`, `quests`,
  `session_log`. No `version` column; merge is last-writer-wins on `updated_at`.
- **`auth.users`** (Supabase-managed schema): the accounts. Row `user_id`s are FKs to
  these. A data-only restore of `documents`/`campaigns` into a project with a
  *different* `auth.users` set will orphan rows — see §5.4.

There are **no Storage buckets and no Edge Functions** in this backend today, so
backups cover Postgres only.

---

## 2. What to back up

1. **Schema** — reproducible from the migration files in git (`supabase/migrations/`).
   Git is your schema backup; a logical dump (below) is the belt-and-suspenders copy.
2. **Row data** — `public.documents` and `public.campaigns`.
3. **Auth** — `auth.users` (and `auth.identities` for OAuth logins). Needed if you
   ever restore into a *fresh* project and want existing users to keep syncing.
4. **RLS policies, indexes, publication membership** — captured by a full (schema +
   data) logical dump, or reproduced by re-running the migrations.

You do **not** need to back up: the anon key (regenerable), the client bundle (built
from git), or SRD/game data (bundled in the app, never in Postgres per RFC 001).

---

## 3. Backup cadence & PITR

**[NEEDS ACCESS — Supabase dashboard / billing tier determines what's available]**

- **Pro plan+**: enable **daily automated backups** (dashboard → Database → Backups).
  Retention per plan (typically 7 days on Pro).
- **PITR (Point-in-Time Recovery)**: a paid add-on giving ~2-minute-granularity
  recovery over a retention window (e.g. 7–28 days). **Strongly recommended** — it is
  the fastest, lowest-loss restore path. Enable it in dashboard → Database → Backups →
  Point in Time Recovery.
- **Free plan**: no automated backups. You **must** run scheduled logical dumps
  yourself (below) or the data is unprotected.

### Recommended cadence

| Mechanism | Cadence | Retention | Owner |
|---|---|---|---|
| Supabase automated daily backup | daily (managed) | plan default (≥7d) | Supabase |
| PITR | continuous (managed) | ≥7d (buy longer if churn is high) | Supabase |
| Off-site logical dump (`pg_dump`) | weekly, and before any migration | keep last 8 | maintainer cron / CI job |

The off-site dump matters because the managed backups live *inside* the same
Supabase project — they don't protect against project deletion or account loss.

### Manual logical backup (works on any plan)

**[NEEDS ACCESS — DB connection string / DB password from dashboard → Project
Settings → Database]**

```bash
# Connection string: dashboard -> Project Settings -> Database -> Connection string
# (use the pooler/direct URI; store it OUT of git, e.g. a secret manager)
export PGURI='postgresql://postgres:[PASSWORD]@db.<PROJECT_REF>.supabase.co:5432/postgres'

# 3a. Full dump: schema + data for the app tables (the everyday restore artifact)
pg_dump "$PGURI" \
  --format=custom \
  --no-owner --no-privileges \
  --table=public.documents \
  --table=public.campaigns \
  --file="rpg-supabase-$(date +%F).dump"

# 3b. Schema-only reference (diff against migrations to detect drift)
pg_dump "$PGURI" --schema-only --schema=public \
  --file="rpg-supabase-schema-$(date +%F).sql"

# 3c. Auth users (only if restoring into a FRESH project later)
pg_dump "$PGURI" --data-only \
  --table=auth.users --table=auth.identities \
  --file="rpg-auth-$(date +%F).sql"
```

Store dumps encrypted, off Supabase. Never commit them (the secret-exposure guard
and `.gitignore` cover `.env`, but dumps are your responsibility).

---

## 4. Choosing a restore path

| Situation | Use | Section |
|---|---|---|
| Bad data / accidental mass delete, project still exists | **PITR** to a timestamp just before the event | §5.1 |
| Corruption, want yesterday's known-good state | Restore from **automated daily backup** | §5.2 |
| Project lost/deleted, or migrating projects | **Logical restore** from `pg_dump` into a new project | §5.3 |
| Only schema is wrong / drifted | **Re-apply migrations** | §5.4 |

PITR and daily-backup restores are **destructive to current state** — they roll the
whole database back. Read §7 (rollback / abort) before running them.

---

## 5. Restore procedures

### 5.1 PITR restore (preferred — lowest data loss)

**[NEEDS ACCESS — Supabase dashboard, project Owner/Admin]**

1. **Freeze writes if feasible.** There is no maintenance flag in the app; the
   practical move is to communicate to users, or temporarily unset
   `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` in Netlify and redeploy so clients
   fall back to fully local (no pushes hit the DB mid-restore). This is optional but
   avoids racing writes.
2. Dashboard → **Database → Backups → Point in Time Recovery**.
3. Pick the **target timestamp** — the last moment *before* the incident. PITR
   granularity is ~2 minutes; err slightly earlier.
4. Confirm and start the restore. Supabase rewinds the database in place.
5. Wait for the project to report healthy.
6. If you unset env vars in step 1, **restore them** in Netlify and redeploy.
7. Go to **§6 Verify**.

### 5.2 Restore from an automated daily backup

**[NEEDS ACCESS — Supabase dashboard, project Owner/Admin]**

1. Optional write-freeze as in §5.1.1.
2. Dashboard → **Database → Backups**. Pick the desired daily snapshot.
3. Click **Restore**. Confirm (this **overwrites current data**).
4. Wait for healthy status → **§6 Verify**.

Data written after the snapshot timestamp is lost — that is why PITR is preferred
when available.

### 5.3 Logical restore into a fresh/target project

Use when the project itself is gone or you are migrating.

**[NEEDS ACCESS — new Supabase project + its DB connection string]**

1. **[NEEDS ACCESS]** Create the target Supabase project. Note its `PROJECT_REF`,
   URL, anon key, and DB password.
2. **Rebuild schema first** — do NOT rely on the dump's schema; run the migrations so
   RLS, policies, indexes, publication, and the *absence* of the updated_at trigger
   are exactly as designed:
   ```bash
   # Option A (recommended): Supabase CLI, applies supabase/migrations/ in order
   supabase link --project-ref <PROJECT_REF>
   supabase db push

   # Option B: psql each migration in filename order
   export PGURI_NEW='postgresql://postgres:[PW]@db.<PROJECT_REF>.supabase.co:5432/postgres'
   for f in supabase/migrations/00*.sql; do psql "$PGURI_NEW" -v ON_ERROR_STOP=1 -f "$f"; done
   ```
3. **Restore auth users** (only if preserving existing accounts):
   ```bash
   psql "$PGURI_NEW" -v ON_ERROR_STOP=1 -f rpg-auth-YYYY-MM-DD.sql
   ```
   If you skip this, restored `documents`/`campaigns` rows will reference users that
   don't exist — they'll be inaccessible under RLS (orphaned). See §5.4.
4. **Restore row data only** (schema already built in step 2):
   ```bash
   pg_restore --data-only --no-owner --no-privileges \
     --table=documents --table=campaigns \
     --dbname="$PGURI_NEW" rpg-supabase-YYYY-MM-DD.dump
   ```
   If FK ordering complains, restore `auth.users` (step 3) before this, and consider
   `--disable-triggers` (superuser) only if necessary.
5. **Repoint the app** at the new project:
   - Netlify env: update `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
   - **CSP**: `netlify.toml` `connect-src` lists `https://*.supabase.co` /
     `wss://*.supabase.co` wildcards, so a same-region `*.supabase.co` host needs no
     CSP change. If the project host is on a **different** domain, update
     `connect-src` (and per RFC 001 §Netlify, keep RFC 001 updated).
   - Redeploy Netlify so Vite re-inlines the new values.
6. Go to **§6 Verify**.

### 5.4 Schema-only repair (drift / missing policy)

If data is fine but schema drifted (e.g. a policy or index missing, or the
`update_updated_at` trigger crept back in):

1. Diff live schema against migrations:
   ```bash
   pg_dump "$PGURI" --schema-only --schema=public | diff - rpg-supabase-schema-KNOWNGOOD.sql
   ```
2. Re-apply the relevant migration(s). All migrations are written to **run
   idempotently** (`ADD COLUMN IF NOT EXISTS`, `DROP TRIGGER IF EXISTS`, etc.), so
   re-running `001`–`004` in order is safe and converges to the intended schema.
3. Go to **§6 Verify**.

---

## 6. Verify the restore succeeded

Run every check. **[NEEDS ACCESS — Supabase SQL editor or `psql`.]**

**6.1 Tables and columns exist**
```sql
select table_name, column_name from information_schema.columns
where table_schema='public' and table_name in ('documents','campaigns')
order by table_name, ordinal_position;
-- Expect documents: id,user_id,name,system_id,system_data,created_at,updated_at,version,deleted_at
-- Expect campaigns: id,user_id,name,system_id,notes,character_ids,created_at,updated_at,deleted_at,quests,session_log
```

**6.2 RLS is ENABLED and the ownership policies exist**
```sql
select relname, relrowsecurity from pg_class
where relname in ('documents','campaigns');           -- relrowsecurity must be TRUE for both

select tablename, policyname, cmd, qual, with_check from pg_policies
where schemaname='public' and tablename in ('documents','campaigns');
-- Expect users_own_documents / users_own_campaigns scoped to auth.uid() = user_id
```
If RLS is off or policies are missing, **stop** — the anon key would expose every
user's rows. Re-run §5.4.

**6.3 The updated_at trigger is ABSENT (post-003 invariant)**
```sql
select tgname, tgrelid::regclass from pg_trigger
where tgname in ('documents_updated_at','campaigns_updated_at');   -- expect ZERO rows
select proname from pg_proc where proname='update_updated_at';     -- expect ZERO rows
```
If any row comes back, drop them (re-apply `003_soft_delete.sql`).

**6.4 Realtime publication membership**
```sql
select tablename from pg_publication_tables where pubname='supabase_realtime'
and tablename in ('documents','campaigns');            -- expect BOTH present
```

**6.5 Row-count / spot sanity**
```sql
select count(*), count(*) filter (where deleted_at is null) as live from documents;
select count(*), count(*) filter (where deleted_at is null) as live from campaigns;
-- Compare live counts against the pre-incident expectation or the dump's row count.
select id, name, system_id, jsonb_typeof(system_data) from documents limit 3;
-- system_data must be a valid JSONB object, not text/null.
```

**6.6 End-to-end smoke test (the real proof)**
1. Set Netlify env to the restored project (if changed) and deploy, or point a local
   `.env` at it.
2. Sign in as a known test account. Confirm the account's documents/campaigns
   **pull down and appear** (sync merge on sign-in, RFC 001 §Migration).
3. Edit a document, confirm it pushes (network tab shows a successful upsert to the
   Supabase REST endpoint), reload, confirm persistence.
4. Sign in as a *different* account and confirm you **cannot** see the first
   account's rows (RLS boundary intact).
5. Confirm realtime: with two tabs on the same account, an edit in one appears in the
   other (best-effort per RFC 001 §Realtime — a manual reload also reconciles).

Restore is "verified" only after 6.1–6.6 all pass.

---

## 7. Rollback / abort path

**Before any destructive restore (§5.1, §5.2):**

- **Take a fresh logical dump first** (`§3` 3a) — this is your undo. A PITR/daily
  restore overwrites current state; without this dump the pre-restore data is gone.
- Note the exact current time (a PITR target back to "now-ε" if you need to undo a
  PITR that went too far).

**If a restore made things worse:**

1. **PITR again** to a timestamp just *after* the fresh dump you took, or *before*
   your bad restore action — PITR can move forward or back within the retention
   window.
2. If PITR is exhausted, **`pg_restore` the fresh dump** you took in the pre-flight
   step into the project (or a new one via §5.3).
3. If the app was repointed to a new project and that project is bad, the cleanest
   abort is to **revert the Netlify env vars** to the previous good project and
   redeploy — clients reconcile on next sign-in.
4. Throughout, remember users are unaffected locally; there is no data-loss pressure
   to rush. Prefer restoring to a **new** project and validating (§6) before cutting
   the Netlify env over, so the live project is never left half-restored.

**Post-restore hygiene:**
- If the DB password or `service_role` key may have been exposed during recovery,
  **rotate** them (dashboard → Project Settings → Database / API). The client only
  uses the anon key; rotating anon requires updating `VITE_SUPABASE_ANON_KEY` in
  Netlify + redeploy.
- Update RFC 001 if the schema, project domain, or CSP changed (RFC 001 §Maintenance
  requires it).
- Record the incident: what was restored, target timestamp, verification results.

---

## 8. Quick reference — credentials the maintainer must provision

| Item | Where | Used by |
|---|---|---|
| Supabase project Owner/Admin login | dashboard | PITR, daily-backup restore, SQL editor |
| DB connection string + DB password | Project Settings → Database | `pg_dump` / `pg_restore` / `psql` |
| `service_role` key (server-only) | Project Settings → API | admin scripting (never `VITE_`, never git) |
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | Netlify env | client sync; update on project change |
| Supabase CLI auth (`supabase login`) | local | `supabase db push` migration apply |

None of these are needed to *review* this runbook — only to *execute* a real backup
or restore.
