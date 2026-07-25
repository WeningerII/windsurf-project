# Runbook: Local Data Backup & Recovery (browser-local characters)

On-call and support procedure for the data that actually matters to most users:
the **browser-local** character/campaign store. Written to be followed cold, by a
maintainer helping a user, or by a user reading it directly.

> **Read this before `supabase-backup-restore.md`.** That runbook covers the
> *optional* cloud copy. This one covers the **data of record**. Cloud sync is
> additive and off unless the user signed in on a deployment with Supabase
> configured (RFC 001), so for a default install there is **no server-side copy
> of anything** — the only backup that exists is the one the user exported.

---

## 1. Where the data lives

| Store | What | Notes |
|---|---|---|
| **IndexedDB** | the primary document collection | written async; the authoritative store when both exist |
| **localStorage** (`rpg-character-documents`) | mirror of the same collection | written synchronously, including at unload |
| **localStorage** (corrupt-payload backup key) | last payload that failed to parse | kept so a corrupt save is recoverable, cleared by "clear all" |
| **localStorage** (sync tombstones, opt-in flags) | deletion markers + preferences | not character data |

`src/utils/documentStorage.ts` reads **both** stores on load and MERGES them
per-document by `(version, updatedAt)` rather than preferring either wholesale —
they routinely diverge, because the unload-time flush commits localStorage
synchronously while the IndexedDB write is fire-and-forget and may not land.
**This merge is itself a recovery mechanism**: a session lost from one store is
usually still present in the other.

Nothing here is encrypted at rest. It is ordinary browser storage, and it is
subject to every ordinary way browser storage disappears (§3).

---

## 2. Taking a backup (the only real one)

**In the app:** the export action writes a single JSON file containing every
document. This is the backup. There is no automatic off-device copy.

The envelope is self-describing — an operator can identify a file without
opening the app:

```json
{ "version": "<storage version>", "documents": [ ... ], "lastModified": "<ISO 8601>" }
```

**What the export guarantees.** A full export→import cycle is **lossless**, and
that is a CI gate, not a hope: `src/__tests__/backupRestoreRoundTrip.test.ts`
round-trips a document for **each of the seven systems**, seeded from that
system's own registered default data model, and asserts deep equality of the
whole envelope including the system-specific payload. It also asserts:

- `createdAt` / `updatedAt` come back as **live `Date` values with the original
  instants** — a restore must not silently re-date every character to the moment
  of the restore;
- restoring a restore does not drift (safe to keep a backup chain);
- unicode, deep nesting, empty arrays/objects, `null`, and long strings survive.

**The one field a restore can lose:** `img`. On import, `sanitizeImgUrl`
(`src/utils/boundaryValidation.ts`) admits **only** `https:` and `data:image/*`
portrait URLs. An `http:` or otherwise-schemed portrait is dropped — deliberately,
so a restore cannot reintroduce a mixed-content or `javascript:` URL. The
character is restored; only that URL is not. This is pinned by a test so it stays
a decision rather than a surprise.

**Recommended cadence for users/maintainers**

| When | Action |
|---|---|
| before clearing site data, changing browsers, or a browser major-version wipe | export |
| before signing in/out of an account (sign-out can trigger a privacy wipe) | export |
| after a long session of meaningful edits | export |
| routinely | export weekly; keep the last few files, off-device |

---

## 3. Failure modes, and what each one actually means

| Symptom | Likely cause | Recovery |
|---|---|---|
| All characters gone after clearing browsing data | user/browser cleared site data — **both** stores go together | §4.1 (import a backup). No other path exists. |
| Characters gone in one browser, present in another | storage is per-origin **and per-browser/profile**; nothing syncs without sign-in | export from the good browser, import into the other (§4.1) |
| Gone after switching accounts | account switch performs a privacy wipe (`clearDocumentStorage`), which clears IndexedDB, localStorage, and the corrupt-payload backup | §4.1 only |
| Some characters missing, others fine | partial parse failure — malformed records are dropped, not silently accepted | §4.2 |
| Everything reverted to an older state | one store was a session behind and the merge resolved to it; or a restore overwrote newer local edits | §4.3 |
| Storage warnings / saves failing | quota exhausted or storage blocked (private mode, blocked cookies) | §4.4 |
| Cloud copy is wrong/lost, local is fine | this is not a local incident | `docs/runbooks/supabase-backup-restore.md` |

**Private/incognito mode is not a bug report.** Storage there is discarded at the
end of the session by design. Confirm the user is not in a private window before
investigating anything else.

---

## 4. Recovery procedures

### 4.1 Restore from an export file

1. Confirm the file is a backup: it must be JSON with a `documents` array (§2).
2. **Take an export of the CURRENT state first, even if it looks broken.** Import
   is additive-by-id, and a partly-populated current state is still evidence. This
   export is your undo.
3. Import the backup in the app.
4. Read the reported **dropped count**. `importDocumentsWithReport` returns how
   many records failed structural validation. **Zero is the only clean result.**
   A non-zero count means the backup file itself is damaged — go to §4.2 before
   telling the user they are restored.
5. Verify (§5).

### 4.2 Partial / damaged backup

A dropped record is one that is not a structurally valid document (missing or
non-string `id`/`name`/`systemId`, or a non-object `system` payload). The import
**drops it rather than letting malformed data masquerade as a character** — the
count is the signal.

1. Open the backup JSON. Locate the entries whose `documents[i]` lacks a
   non-empty `id`, `name`, `systemId`, or an object `system`.
2. If the defect is superficial (e.g. a missing `name`), repair those fields by
   hand and re-import. Timestamps are coerced leniently — a missing or invalid
   `createdAt`/`updatedAt` becomes "now" rather than failing the record — so do
   **not** hand-repair timestamps unless the original instants matter.
3. If `system` is truncated or unreadable, that character's mechanics are gone.
   Prefer an older backup file over a hand-reconstruction.
4. Re-import and confirm the dropped count is now 0.

### 4.3 Wrong/older data after a load or restore

1. Do **not** keep editing — every edit stamps `updatedAt` and makes the older
   snapshot look authoritative to the next merge.
2. Export immediately (captures whatever state is live).
3. Import the known-good backup. Per-document merge resolves by `version` then
   `updatedAt`, so a genuinely newer backup wins; a same-timestamp tie resolves to
   the synchronously-committed store.
4. If the user is signed in, remember the cloud copy will re-push. If the cloud
   copy is the *wrong* one, sign out (or unset `VITE_SUPABASE_URL` /
   `VITE_SUPABASE_ANON_KEY` and redeploy) **before** importing, then reconcile the
   cloud side via `docs/runbooks/supabase-backup-restore.md`.

### 4.4 Storage blocked or full

1. Confirm the browser is not in private mode and site data is not blocked.
2. Free space: browsers evict per-origin storage under pressure. Export first,
   then remove unused documents.
3. If IndexedDB is unavailable, localStorage remains authoritative and the app
   keeps working — degraded, not broken. Export more often until it is resolved.

---

## 5. Verify the recovery succeeded

Run all of these. No console or credential access is required.

1. **Count.** The number of characters shown matches the backup's
   `documents.length`, and the import reported **0 dropped**.
2. **All seven systems.** If the backup spanned multiple game systems, confirm at
   least one character of *each* system in the file opens on its sheet. The
   round-trip gate covers all seven, so a system-shaped hole is a real finding,
   not an expected limitation.
3. **Dates.** Spot-check that a restored character's created/updated dates match
   the original — not today. (If they show today, the export's timestamps were
   missing or invalid; see §4.2 step 2.)
4. **Mechanics, not just names.** Open one restored character and confirm
   system-specific state (abilities/resources/inventory) is present. The
   `system` payload is the part a naive backup would flatten.
5. **Portraits.** Any character whose portrait vanished had a non-`https`,
   non-`data:image/*` URL — expected (§2), not a failed restore.
6. **Persistence.** Reload the page and re-check the count. This proves the
   restore committed to storage rather than living only in memory.
7. **Then export again** and keep that file. The verified post-restore state is
   the new backup.

---

## 6. What this runbook deliberately does NOT promise

- **No automatic off-device backup.** The app never uploads anything on its own.
  Without sign-in there is no server-side copy to recover from, by design
  (local-first, RFC 001). Cleared site data with no export file is **unrecoverable**,
  and support should say so plainly rather than imply a hidden copy exists.
- **No point-in-time recovery of local data.** There are no local snapshots or
  version history. Recovery granularity is "whatever the user last exported".
- **No cross-device sync without sign-in.** Two browsers are two independent
  datasets.

## 7. Quick reference

| Need | Go to |
|---|---|
| User cleared site data | §4.1 — export file or nothing |
| Import reported dropped records | §4.2 |
| Data looks stale / reverted | §4.3 |
| Saves failing, storage warnings | §4.4 |
| Cloud copy is the problem | `docs/runbooks/supabase-backup-restore.md` |
| Proof the export format is lossless | `src/__tests__/backupRestoreRoundTrip.test.ts` |
