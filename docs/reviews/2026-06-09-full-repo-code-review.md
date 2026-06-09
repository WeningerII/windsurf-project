# Full-Repository Code Review

**Repo:** WeningerII/windsurf-project (multi-system RPG character sheet)
**Reviewed at:** commit `128726d`, 2026-06-09
**Method:** Twelve parallel deep-review passes over disjoint slices of the codebase (every production source file in `src/`, plus scripts, configs, CI, e2e, service worker, Supabase migrations, and a sampled audit of the 423-file `src/data` content layer). Every finding cites `file:line`, was verified against surrounding code and callers, and several were reproduced empirically (noted inline). Reviewer severities are preserved; cross-report duplicates are noted where two independent passes converged on the same defect.

---

## 1. Ground truth: automated gates

All of the repo's own quality gates pass on this commit, on a clean checkout:

| Check | Result |
|---|---|
| `tsc --noEmit` (strict mode) | 0 errors |
| ESLint (`--max-warnings 0`) | clean |
| Vitest | **136 files, 1,339 tests, all passing** (~60 s) |
| knip dead-code gate | clean (3 config hints: stale `netlify/**` patterns, `src/data/**` ignore no longer needed) |
| `npm audit` (production deps) | 0 vulnerabilities |
| `npm audit` (dev deps) | 1 advisory: `vitest` 4.x beta range — arbitrary file read/execute **only when the Vitest UI server is listening** (dev machine only; fix available by upgrading) |

The headline of this review follows directly from that table: **the repo's verification machinery is real and green, and most of what's wrong here is invisible to it** — rules-math that computes the wrong number confidently, sync protocols that lose data only across devices or sessions, license attributions that are syntactically valid and factually false, and tests that faithfully pin incorrect behavior.

## 2. Executive summary

This is a well-engineered codebase by most structural measures: strict TypeScript with almost no `any` in app code, disciplined immutability (clone-then-derive engines verified by dedicated non-mutation tests), a parse-don't-cast boundary at every untrusted edge, an event-sourced scene runtime, seeded deterministic combat RNG, provenance-tracked character templates, real CI that runs the same `verify` developers run, correct Supabase RLS, a strong CSP, and zero XSS sinks. The strengths sections of each chapter below are genuine, not politeness.

The serious problems cluster in six places:

1. **The sync layer can lose and resurrect user data by design** (Ch. A). No tombstones means cross-device deletion is impossible (deleted characters come back); every sync pushes the full collection and the realtime subscription reacts to the client's own writes, creating a self-sustaining sync loop; and a server-side `updated_at` trigger rewrites the very timestamps last-writer-wins depends on, so edits from one device get reverted by another. Three further High-severity races (IndexedDB-vs-localStorage split brain on startup, a no-op update cancelling the pending debounced save, per-entity `auth.getUser()` calls) compound it.

2. **One verified data-corruption bug in the 5e engine** (Ch. C, H1): for a class-less 2014 character with exhaustion ≥ 4, `prepareData` halves stored max HP *again on every save and every app launch* (reproduced: 50 → 25 → 12 → 6). Same family: PF2e class change deletes all manually trained skills (Ch. E, H1); `prepareData` silently reverts manual edits to d20 spell-slot totals, PF2e max HP, and Daggerheart HP.

3. **Cross-tenant data bleed on shared devices** (Ch. A H3 / Ch. B H-1, found independently by two passes): local stores are not user-namespaced and not cleared on sign-out, and the next account to sign in merges *and uploads* the previous user's characters into its own cloud account. RLS is correct; the leak happens above the database.

4. **Rules-math errors that print wrong numbers on sheets**: warlocks get 0 spell slots at every level (pact magic unmodeled); single-class Paladins/Rangers get multiclass floor() slots (wrong at every odd level); 2024 Paladins/Rangers get 0 slots at L1–2; Barbarian/Monk Unarmored Defense never reaches AC despite the compute register marking it "verified"; the 2024 Alert feat implements a rule that doesn't exist; M&M heavily-flawed powers cost 0 PP; Daggerheart doubles 4–9 don't crit and 1–3 "fumble" (no such rule — contradicting the project's own utility function); the new statblock prose parser sums versatile "or" damage alternatives so seven shipped monsters deal ~2–3× damage; the Daggerheart "native" combat resolver rolls 1d20 instead of 2d12 duality dice; and the M&M/Daggerheart resolvers, conditions, terrain, AoE, and combat-end detection are all unreachable dead code from the product path. Many of these are *pinned by tests* — the test suite encodes the bug.

5. **The PWA/deploy story undermines itself** (Ch. K): the service worker precaches only 3 shell URLs, so any cache-version bump strands offline users on a blank page; the SW caches SPA-rewritten HTML under stale asset URLs permanently; and — highest leverage — the CI-driven Netlify deploys very likely ship **without** the `netlify.toml` headers, meaning the CSP/HSTS the security posture leans on may not be live in production (verify with `curl -sI` against the deployed site; one-line fix: `netlify-config-path` on both deploy steps).

6. **The "only open-license SRD content" claim is currently false** (Ch. J): Mind Flayer and Elder Brain ship under fabricated `source: 'SRD 5.2'` attribution; 19 Golarion deities (Paizo Product Identity) ship as PF2e subclasses with invented mechanics; PHB-only subraces (including Lolth lore text) ship under `SRD 5.1`; ~280 of 335 3.5e "feats" are fabricated filler labeled `PHB`; and the open-content policy whitelist accepts closed-book citations ('PHB', "Hero's Handbook"), structurally defeating the gate. For a project whose README leads with the SRD-only claim, this is the highest non-code risk in the repo.

## 3. Priority queue (engineer-ready)

**P0 — data loss, corruption, legal:**
1. Fix the exhaustion≥4 compounding max-HP halving (idempotent `prepareData`) — Ch. C H1.
2. Sync-protocol epic: tombstones for deletes, push-only-when-changed, ignore self-originated realtime events, drop (or route around) the server `updated_at` trigger — Ch. A C1–C3, plus H1/H2 (startup store preference, no-op-update save cancellation).
3. Clear/namespace local stores on auth change; gate initial-sync upload — Ch. A H3 / Ch. B H-1.
4. License purge: remove/re-source the PI content, tighten the policy whitelist, add per-subrace `source` — Ch. J LC-1…LC-6, H-2.
5. PF2e class change wiping manually trained skills — Ch. E H1.

**P1 — wrong numbers users see, broken offline:**
6. Spell-slot derivation: pact magic, single-class half/third casters, 2024 L1–2 + rounding — Ch. C H2 / Ch. D H1–H3.
7. Combat seams: attack-seed nonce on the Attack button, versatile-damage prose parsing, single-range regex, PC initiative defaulting to flat 10 — Ch. G H1/H2/M5/M7, Ch. H H1/H2.
8. `prepareData` vs manual edits: d20 spell-slot totals, PF2e max HP, Daggerheart HP hydration — Ch. E H2/M1, Ch. F M6.
9. Deploy headers (`netlify-config-path`) + SW precache manifest + content-type guard on runtime caching — Ch. K H1–H3.
10. Unarmored Defense and the rest of the "computed but never wired" cluster (spell save DC, passive perception, 3.5e bonus spells) — wire or downgrade the compute-register claims — Ch. C H4/L4, Ch. E H2a.
11. Global keyboard shortcuts firing inside text inputs (Ctrl+Z reverts the document collection) and the no-confirm header delete — Ch. I H1/M1.
12. Equipment ID collisions (`potion-of-healing` heals 2d4+2 or 4d4+4 depending on access path) + strict duplicate-ID guard in index builders — Ch. J C-1/M-8.

The Medium/Low tiers in each chapter are independently actionable; none block the above.

## 4. Cross-cutting themes

- **Green gates ≠ correct rules.** At least nine findings are pinned by passing tests (warlock 0 slots, Alert INT-swap, Divine Smite dice, Daggerheart crit bands and damage model, multiclass max-die HP, PF2e condition-AC behavior, M&M Accurate cost, attack-parity dead assertion). The compute-register/test-pinning culture is the right machinery — the fix is recalibrating it against RAW, not adding more of it.
- **"Computed but never consumed" is the repo's signature failure mode.** Correct, documented, tested implementations of Unarmored Defense, spell save DC, passive perception, bonus spells, M&M/Daggerheart combat resolvers, PF2e dying/wounded, encumbrance, terrain, conditions-in-combat, and `isRoundConclusive` all exist and are dead from the product path. Wiring what already exists is cheap wins; until then, register statuses and commit messages overstate support.
- **`prepareData` as a write-back normalizer is dangerous.** Four independent chapters found prepare-time normalization destroying user state because derived values are persisted over their own inputs (exhaustion HP, d20 slots, PF2e HP/skills, Daggerheart HP/currency/loadout). Rule of thumb worth adopting: derive at read time, never write a derived value over its source, and make any migration one-shot and flagged.
- **Duplication has already drifted.** The same rule implemented twice with different behavior appears in every system slice (min-1-HP per-level vs global floor; toughness banding engine-vs-handler; spell-resolution maps PF2e-vs-d20; eager-vs-lazy resource loaders; four AC chains). Each is a current or imminent bug factory.
- **Failure paths are systematically quieter than success paths.** Swallowed loader `catch`es leaving silently empty catalogs, campaign saves with no error handling, import flows that report nothing when everything was dropped, sync queue writes that can throw uncaught in an effect, HIGH-severity errors never reaching Sentry. The test suite mirrors this (fetch/push failure and quota paths untested).
- **The last mile of otherwise-good systems is where the bugs live.** RLS correct → but local stores leak across tenants. Seeded RNG architecture correct → but one call site omits the nonce. SW lifecycle consent correct → but precache strategy can't survive a version bump. Policy filter real → but the whitelist accepts 'PHB'.

## 5. Finding counts (as labeled by each reviewing pass)

| Chapter | Area | Critical | High | Medium | Low | Legal |
|---|---|---|---|---|---|---|
| A | Persistence & sync | 3 | 4 | 8 | 6 | — |
| B | Security | — | 1 | — | 5 | — |
| C | D&D 5e / 2024 / 3.5e engines | — | 4 | 6 | 8 | — |
| D | Game-math utilities | — | 4 | 5 | 11 | — |
| E | PF2e / PF1e / d20-legacy | — | 3 | 6 | 14 | — |
| F | M&M 3e / Daggerheart | — | 2 | 8 | 11 | — |
| G | Combat rules engine | — | 4 | 9 | 9 | — |
| H | Scene/combat UI + UI kit | — | 2 | 5 | 11 | — |
| I | App shell & core components | — | 1 | 6 | 8 | — |
| J | Types & data layer | 1 | 5 | 8 | 5 | 6 |
| K | Build / CI / PWA infra | — | 5 | 9 | 12 | — |
| L | Test suite | — | 1 | 6 | 4 | — |
| | **Total** | **4** | **36** | **76** | **104** | **6** |

≈226 findings as filed; ≈215 unique after cross-report convergences (attack-seed nonce, versatile prose parser, cross-tenant bleed, spell slots, typed-penalty fold, Daggerheart currency clamp, theme cast, keyboard shortcuts each found by two passes — treated as corroboration, not double-counting in the priorities above).

Chapters follow, in full, with per-area assessments, every finding, and strengths.

---

# Chapter A — Persistence & Sync Review — windsurf-project

## Overall assessment

The local persistence layer (debounced writes, version tokens, flush-on-pagehide, parse-don't-cast hydration) is thoughtfully built, but the sync layer has structural correctness problems: it is a snapshot-merge engine with no tombstones, an unconditional full-collection push on every sync, and a realtime subscription that reacts to the client's own writes — together these produce deleted-entity resurrection and a self-sustaining sync loop. A second systemic problem is split-brain between the three places a collection lives (localStorage, IndexedDB, Supabase): the save path treats localStorage as authoritative while the load path prefers IndexedDB, and the server has a trigger that silently rewrites the very `updated_at` timestamps the client's last-writer-wins merge depends on. Finally, the version-token mechanism in `useDebouncedPersistence` can be invalidated by a no-op update, silently dropping the last pending save. Individually several of these are edge-case-ish; combined (frequent syncs from the loop + drop-pending-save + stale-IDB-preferred load) they form realistic, silent data-loss paths.

## Critical

### C1. Deleted entities are resurrected by any other device's sync (no tombstones)
`src/hooks/useEntitySync.ts:110-134`, `src/utils/syncEngine.ts:182-194, 404-409`
`sync()` merges `local` with `remote`, and `mergeDocuments`/`mergeCampaigns` keep any doc that exists locally but not remotely (`!existing` → kept), then `adapter.push(merged)` re-uploads it. So when device A deletes a character (locally and via `deleteRemoteDocument`), device B — which still holds the doc in its state/localStorage — will re-add it on its next sync (which the realtime DELETE event itself triggers) and push it back to the server, undoing the delete everywhere. The per-device delete queue only covers deletions made *by that device*; remote deletions are also never applied locally because `onMerge` is `addDocuments`/`addCampaigns` (App.tsx:66,107), which are upsert-only and cannot remove entries. Net effect: cross-device deletion is effectively impossible.
**Fix:** keep tombstones (deleted ids + deletion time) locally and/or a `deleted_at` column remotely; have `onMerge` replace (not upsert) the collection, and treat "missing from remote but previously synced" as a remote deletion.

### C2. Self-triggering realtime sync loop: every sync pushes, every push re-fires the subscription
`src/hooks/useEntitySync.ts:134, 237-239`, `src/utils/syncEngine.ts:256-284, 461-489`, migrations enable realtime on both tables
`sync()` unconditionally `await adapter.push(merged)` even when nothing changed, and the `postgres_changes` subscription (filtered only by `user_id`, which matches the client's *own* upserts — Supabase does not suppress self-originated changes) calls `sync()` on every event. So: sync → upsert N rows → N UPDATE events delivered back → `onChange` → sync → push → … an unbounded fetch/full-collection-upsert loop at roughly network round-trip frequency, on every signed-in device, for both the documents and campaigns channels. `isSyncingRef` only suppresses events that arrive *during* a sync; events from the final push arrive after it completes. Besides bandwidth/battery/Supabase-quota burn, this loop continuously restamps server `updated_at` (see C3) and continuously exercises the H2 drop-pending-save window. Confidence: high on mechanism; medium on real-world damping (requires realtime channel actually connected).
**Fix:** skip the push when `merged` is signature-equal to fetched `remote`; debounce/ignore realtime events for some window after own pushes; push only locally-changed entities.

### C3. Campaign last-writer-wins is broken by the server's `updated_at` trigger — edits get reverted
`src/utils/syncEngine.ts:317-318, 397-412` + `supabase/migrations/001_initial.sql` (`update_updated_at` trigger)
The client sends `updated_at: campaign.updatedAt.toISOString()` and merges with "local wins only if strictly newer", but the DB trigger overwrites `updated_at = now()` on every UPDATE. Since every sync pushes *all* campaigns (C2 makes this constant), every synced campaign's remote timestamp becomes "time of last push", not "time of last real edit". Consequence: an edit made on device A is older than the server stamp produced by any subsequent push from device B (or by the sync loop itself), so the next merge resolves in favor of the *stale remote content* and reverts A's edit locally and remotely. Even single-device, a client clock a few seconds behind the server can lose a quick second edit. Documents are mostly shielded by `version`, but their equal-version `updatedAt` tie-break (syncEngine.ts:190) is subject to the same skew.
**Fix:** drop the trigger (client owns `updated_at` in this protocol) or carry a separate client-edit timestamp/version column for campaigns and merge on that.

## High

### H1. Startup prefers possibly-stale IndexedDB over newer localStorage — last edits of the previous session silently reverted
`src/utils/documentStorage.ts:87-108, 130-153`, `src/hooks/useDocuments.ts:128-141`, `src/utils/indexedDBAdapter.ts:78-103`
`saveDocuments` writes localStorage synchronously and mirrors to IDB fire-and-forget ("localStorage is still the source of truth"), but `loadDocumentsAsync` returns IDB *unconditionally* when non-empty, and `useDocuments` replaces state with it. The pagehide/beforeunload flush makes this divergence routine: the flush's `idbSaveDocuments` first `await openDB()`, so during unload the IDB transaction frequently never starts, while the localStorage write commits. Next launch: correct data renders from localStorage, then the async IDB load (no local edits yet, empty history → guard passes) swaps in the stale snapshot; the next edit persists that stale collection over localStorage. For signed-out users this is unrecoverable, silent loss of the previous session's last edits.
**Fix:** merge IDB and localStorage with `mergeDocumentCollections` (version/updatedAt-aware) instead of replacing, or store a monotonic `lastModified` in both stores and prefer the newer.

### H2. A no-op update invalidates the pending debounced save — the last edit is never persisted
`src/hooks/useDocuments.ts:177-194`, `src/hooks/useDebouncedPersistence.ts:43-46, 80`
`applyDocumentsUpdate` calls `persistence.beginVersion()` *before* knowing whether the updater changes anything. If `sameDocumentSignatures` short-circuits (returns `prev`), no new `persist` is scheduled, but the version was bumped — so a still-pending persist from a real edit ≤300 ms earlier fails the `version !== versionRef.current` check and is dropped; `flush()` on unmount/pagehide is then a no-op too. The realistic trigger is `onMerge: addDocuments` from sync (App.tsx:66): a sync/realtime merge that changes nothing (extremely frequent given C2) landing within 300 ms of a user edit permanently cancels that edit's save. The edit stays only in memory and is lost on tab close.
**Fix:** only bump the version when a write is actually scheduled (e.g., have `applyDocumentsUpdate` discard the token on the no-change branch by restoring `versionRef`, or make `beginVersion` lazy inside the changed branch — the StrictMode double-bump is harmless since both invocations persist the same value).

### H3. Local stores are not namespaced per user — switching accounts merges and uploads the previous user's data
`src/utils/documentStorage.ts:13`, `src/utils/campaignStorage.ts:4`, `src/utils/syncEngine.ts:7-10`, `src/hooks/useEntitySync.ts:107-134`
All storage keys (`rpg-documents-v2`, queues, etc.) are global. Sign-out leaves user A's characters in localStorage/IDB; when user B signs in on the same browser, the initial sync merges A's documents with B's remote and `push(merged)` writes A's characters into B's account (`user_id` is stamped as B in `toRemote`). Both a privacy leak and data pollution in both directions. Confidence: high (nothing in AuthProvider/App clears or scopes local data on auth change). [Same as security H-1]
**Fix:** key local stores by user id (or clear local caches on account *switch* with explicit user consent), and refuse to push entities that were last synced under a different user.

### H4. `auth.getUser()` is called once per entity on every push — N parallel auth round-trips
`src/utils/syncEngine.ts:87-100, 154, 373`
`toRemote`/`toRemoteCampaign` each call `getCurrentUserId()`, and `pushDocuments` maps it over the whole collection with `Promise.all`. supabase-js `auth.getUser()` performs a network request to the auth server per call, so a 100-character collection issues 100 simultaneous auth requests per push — and C2 makes pushes continuous. This invites 429s, which `retryWithBackoff` then retries (the 429 message matches no non-retryable fragment), amplifying the storm and flipping sync into persistent `error`.
**Fix:** resolve the user id once per push (or use `getSession()`/cached `user.id` from the auth context) and pass it into the mappers.

## Medium

### M1. localStorage quota failure aborts the IndexedDB write too — large collections can never be persisted anywhere
`src/utils/documentStorage.ts:87-107`
`saveDocuments` throws on `saveToLocalStorage` failure *before* reaching the `idbSaveDocuments` call, so once the collection exceeds the ~5 MB localStorage quota, every save fails entirely even though IndexedDB (the advertised "larger storage") could hold it. The app's own UI hard-codes the 5 MB ceiling (App.tsx:32). The user sees an error banner but has no way to save short of deleting characters.
**Fix:** attempt the IDB write regardless of localStorage outcome and only surface an error when both fail; treat IDB as primary as the docstrings claim.

### M2. Clear-all relies on a swallowed best-effort IDB clear — "permanently deleted" characters can resurrect
`src/utils/documentStorage.ts:194-202`, `src/hooks/useDocuments.ts:252-264`
`clearDocumentStorage` removes localStorage synchronously but `idbClearDocuments().catch(() => {})`. If the IDB clear fails (or the tab closes before it commits), the next launch's IDB-preferred load (H1) restores the full "deleted" collection — directly contradicting the confirm dialog's "cannot be undone". For signed-in users the restored docs are then re-pushed remotely (C1 family).
**Fix:** await the IDB clear and surface failure; or write an explicit "cleared" marker checked by `loadDocumentsAsync`.

### M3. Multi-tab use clobbers edits: full-collection load-once/write-all with no cross-tab invalidation
`src/hooks/useDocuments.ts:112-145`, `src/hooks/useCampaigns.ts:10-13`, `src/utils/sceneStorage.ts:75-92`
Each tab loads the collection once at mount and thereafter writes its entire in-memory array on every change. Two open tabs silently overwrite each other's edits (last writer wins at whole-collection granularity); there is no `storage` event listener or BroadcastChannel to reconcile. `upsertScene`/`deleteScene` also do non-atomic read-modify-write of the whole key.
**Fix:** listen for `storage` events and merge (the version-aware mergers already exist), or guard with a per-tab dirty check on `lastModified`.

### M4. IndexedDB transactions miss `onabort`/`onblocked` — quota aborts leave promises unsettled and the user warning never fires
`src/utils/indexedDBAdapter.ts:84-102, 112-125, 164-178` (and `openDB` at 8-25)
A transaction aborted by the engine (e.g., `QuotaExceededError`) fires `abort`, which does not always surface through `tx.onerror`; in that case `idbSaveDocuments`' promise never settles, so neither `noteIdbSaveSuccess` nor `noteIdbSaveFailure` runs — the 3-strikes warning toast in documentStorage.ts:33-39 can be silently bypassed exactly when storage is failing, and the IDB mirror rots (feeding H1). `openDB` also ignores `onblocked`, which would hang a future version upgrade.
**Fix:** add `tx.onabort = () => { db.close(); reject(tx.error ?? new DOMException('aborted')); }` to every readwrite transaction, and an `onblocked` handler in `openDB`.

### M5. Campaign saves have no error handling — quota errors are thrown inside a timer and vanish
`src/hooks/useCampaigns.ts:15-17`, `src/utils/campaignStorage.ts:39-46`
Unlike `useDocuments.persist` and `useScenes.persist` (both try/catch → error state), `useCampaigns.persist` calls `saveCampaigns` bare. A `QuotaExceededError` inside the debounce timer becomes an uncaught exception: no error banner, no toast, and the campaign edits silently stop persisting. Same pattern for the sync queues: `queueSnapshot` (`syncEngine.ts:199-205, 414-417`) does an unguarded `setItem` of the *entire* collection (which also roughly doubles localStorage pressure), and is called outside any try at `useEntitySync.ts:99`.
**Fix:** wrap campaign persist like the other two hooks; wrap `queueSnapshot` and surface/queue-trim on failure.

### M6. Auth identity churn re-runs initial sync and resubscribes realtime on every token refresh
`src/contexts/AuthContext.tsx:22-24, 56-71`, `src/hooks/useEntitySync.ts:147-151, 232-240`
`onAuthStateChange` replaces the session object on every `TOKEN_REFRESHED`/`SIGNED_IN` event (hourly, and on tab refocus in some supabase-js versions), giving `user` a new identity; `sync` and both subscription effects depend on it, so each refresh tears down/recreates the realtime channels and re-runs the "initial sync on sign-in" effect — a full fetch+merge+push per refresh per entity type, compounding C2/C3. The provider also creates a fresh context value object every render, re-rendering all consumers.
**Fix:** depend on `user?.id` (a stable string) in `useEntitySync`'s effects; memoize the context value.

### M7. Remote events arriving during an in-flight sync are silently dropped
`src/hooks/useEntitySync.ts:96`
`sync()` returns early when `isSyncingRef.current` is true, with no "re-run after" flag. A realtime change delivered while a sync is running is never applied until some later trigger, so a device can sit indefinitely with stale data while believing it is `idle`/synced. (Also `subscribe()` at syncEngine.ts:279/484 passes no status callback, so `CHANNEL_ERROR`/`TIMED_OUT` leaves the app silently without realtime at all.)
**Fix:** set a `pendingResyncRef` when skipping, and re-invoke `sync()` in the `finally`; log/surface channel status.

### M8. Corrupted localStorage payload silently becomes "no characters" and is overwritten by the next save
`src/utils/documentStorage.ts:51-72, 113-119`
A JSON-parse failure of `rpg-documents-v2` returns `null` → `loadDocuments()` returns `[]` with only a dev-mode console.warn. If IDB is also unavailable, the user sees an empty app with no explanation, and the first subsequent save replaces the (possibly hand-recoverable) corrupted blob. No backup copy is taken before overwrite.
**Fix:** on parse failure, stash the raw blob under a `rpg-documents-v2.corrupt` key and surface a toast/error.

## Low

### L1. StrictMode double-invocation corrupts undo/redo history (dev only)
`src/hooks/useDocuments.ts:186-191, 266-302` (StrictMode on in main.tsx:31)
`undo`/`redo` perform side effects (`setHistoryFuture`, `setDocuments`, `persistence.persist`) inside the `setHistoryPast` updater, and the add/delete path calls `pushHistorySnapshot` un-guarded inside the updater — the codebase's own microtask guard (`queueHistorySnapshot`) exists precisely because updaters double-run under StrictMode, but these paths skip it. In dev, one undo pushes two future entries.
**Fix:** move side effects out of the updaters (use the same begin/queue pattern), or guard with the existing microtask flag.

### L2. retry.ts: substring classification misfires
`src/utils/retry.ts:51-69`
`'jwt expired'` is non-retryable even though supabase-js auto-refreshes tokens (a retry moments later would succeed — instead the sync flips to `error`); conversely broad fragments like `'violates'` are fine, but transient 429/`Too Many Requests` (likely under H4) is retried with only 4 attempts and then surfaces as a generic error. Minor edge behavior, mechanism otherwise solid.

### L3. errorLogger: HIGH-severity errors never reach Sentry; prod console logs include raw context
`src/utils/errorLogger.ts:68-80, 83-104`
Only `CRITICAL` calls `sendToMonitoring`, so HIGH (e.g., failed data loads) is invisible in production monitoring; `console.error(..., context)` in prod can emit user content for any caller that passes documents in `context` (the `withErrorLogging` wrapper carefully avoids this, but direct `errorLogger.log` callers are unconstrained). Sentry usage itself is correct (`sendDefaultPii: false`, DSN-gated).

### L4. Import silently drops invalid records, and an all-invalid import gives zero feedback
`src/utils/documentStorage.ts:180-188`, `src/App.tsx:290-304`
`importDocuments` filters out malformed docs without reporting; `handleImportDocument` only toasts when `imported.length > 0`, so importing a structurally-valid file whose records all fail validation shows nothing at all.
**Fix:** return dropped count from `importDocuments` and toast it (including the zero-imported case).

### L5. useKeyboardNavigation ignores `metaKey` — all shortcuts dead on macOS; Escape fires everywhere
`src/hooks/useKeyboardNavigation.ts:14-26`
Matching checks only `event.ctrlKey`, so Cmd+Z/Cmd+N never match for Mac users (and Ctrl+Z while typing in a text field triggers a global document-level undo, since there is no editable-target guard). Escape (App.tsx:316-322) flushes saves and exits the sheet even when pressed to dismiss a native dialog or cancel an IME composition.

### L6. Misc type-safety/robustness nits
- `useTheme.ts:21` casts the stored string to `Theme` unvalidated; a tampered value containing a space makes `classList.add` throw on mount.
- `AuthContext.tsx:17-20` — `getSession().then(...)` with no `.catch`; a rejection leaves `isLoading` stuck `true` forever (blocking any loading-gated UI).
- `dataLoader.ts` — inconsistent failure policy: 5e-2014/pf spells/monsters catch and return `[]`, all other loaders let chunk-load failures propagate to callers (behavior differs by system when offline after a deploy).
- `documentSignature.ts:25-44` — set-based comparison ignores multiplicity; two collections of equal length with duplicated ids can compare "equal". Only reachable if duplicate ids ever enter the collection (confidence: low).

## Strengths

- **Disciplined "parse, don't cast" boundary** (`boundaryValidation.ts`) applied consistently at every untrusted edge — storage hydration, import, sync queues, and remote rows — so malformed records degrade gracefully instead of poisoning state; date coercion correctly rehydrates the JSON-serialized `Date` fields everywhere.
- **The shared `useDebouncedPersistence` lifecycle design is genuinely good**: one well-commented implementation of debounce + version tokens + unmount/pagehide/visibilitychange flushing reused by all three collection hooks (and covered by tests), instead of three divergent copies.
- **Offline handling has real substance**: queued snapshots and delete queues with replay on reconnect, `navigator.onLine` checks before pushes, full-jitter retry with a documented non-retryable classifier, and honest sync-state surfacing (`error`/`offline`/pending counts) in the UI.

---

# Chapter B — Security Review: Local-First TTRPG PWA (windsurf-project)

## Executive Summary

The application's security posture is **good for a local-first PWA**, with a notably strong defensive baseline: a real Content-Security-Policy with `script-src 'self'` (no `unsafe-eval`/`unsafe-inline` for scripts), correct row-level security on both Supabase tables, no `service_role` key anywhere in the repo, disciplined PII hygiene in error logging (Sentry `sendDefaultPii: false`, call-args stripped), and a clean supply chain (all 625 lockfile deps from npmjs, install scripts limited to a checksum-verified Node bootstrap). React's auto-escaping plus the absence of `dangerouslySetInnerHTML`/`innerHTML`/markdown rendering means there is **no live XSS vulnerability** despite heavy user-generated content (names, notes, homebrew). The most serious issue is **not** a remote one: the browser-local stores (documents, campaigns, scenes) are global to the browser profile — not namespaced per user and not cleared on sign-out — while the sync engine bidirectionally merges local data into whichever account signs in next, producing **cross-tenant data contamination on shared devices / account switches**. RLS correctly prevents an arbitrary remote attacker from reading other tenants' rows over the network; the cross-tenant exposure here is gated on co-located account switching, which is why it lands at High rather than Critical. The remaining items are hardening gaps (unvalidated `img` URL sink, broad `img-src`/wildcard CSP sources, GitHub Actions pinned by tag, dev-script `new Function`).

## Findings by Severity

### HIGH

#### H-1. Local data is not user-scoped and not cleared on sign-out → cross-tenant data bleed on account switch
**Files:**
- `src/contexts/AuthContext.tsx:52-54` — `signOut` calls only `client.auth.signOut()`; no local-store clear.
- `src/utils/documentStorage.ts:13` (`'rpg-documents-v2'`), `src/utils/campaignStorage.ts:4` (`'rpg-campaigns-v1'`), `src/utils/sceneStorage.ts:4` (`'rpg-scenes-v1'`) — global storage keys with no user id.
- `src/hooks/useEntitySync.ts:95-144` — `sync()` merges `entitiesRef.current` (local) with `remote` and pushes the **union** back to the cloud (`adapter.push(merged)` at line 134).
- `src/utils/syncEngine.ts:87-100,148-160` — `toRemote()` stamps `user_id = current authenticated user` onto every pushed row, re-owning local rows to the new user.

**Exploit scenario (who can do what to whom):** A shared device (family tablet, library/classroom machine, hot-desk). User A signs in, syncs characters/campaigns; their data persists in `localStorage`/IndexedDB after sign-out because nothing clears it. User B then signs in on the same browser profile. The initial sync (`useEntitySync` effect at line 147-151) reads User A's still-resident local documents into `entitiesRef.current`, merges them with User B's remote rows, calls `onMerge` (User B now *sees* User A's private characters and campaign notes in the UI), and then `push(merged)` **uploads User A's data into User B's cloud account** under User B's `user_id`. The contamination is bidirectional and persists server-side in User B's account even after the session ends. This is exactly the "cross-tenant data access" the threat model names as the worst outcome, achieved without any RLS bypass — the sync layer hands one tenant's data to another above the database boundary.

**Concrete fix:**
1. On `signOut` (and on detecting a different `user.id` than the last-synced one), call `clearDocumentStorage()` / `clearCampaignStorage()` / `clearSceneStorage()` and reset in-memory state **before** the new session's initial sync runs.
2. Namespace the local storage keys and the four sync-queue keys by user id (e.g. `rpg-documents-v2:${userId}`), and persist the "owning" user id alongside each store so a mismatched owner is discarded rather than merged.
3. Gate the initial-sync push so locally-resident, never-synced rows are not blindly uploaded to a freshly authenticated different account (e.g. only push rows whose prior synced-owner matches the current user, or require explicit "import local data into this account" consent).

### LOW / Hardening

#### L-1. Unvalidated `img` URL rendered as `<img src>` (no XSS, minor beacon/SSRF-style gap)
**File:** `src/systems/mam3e/components/MamHeader.tsx:31-39` renders `<img src={document.img}>`; the value is accepted as any string at `src/utils/boundaryValidation.ts:104` and there is **no UI that writes `img`** — it can only arrive via `importDocuments()` (untrusted JSON) or a synced row. Not XSS (`<img src>` does not execute `javascript:`/SVG script; `alt={document.name}` is React-escaped), and CSP `img-src` already permits arbitrary `https:`. Residual risk: a maliciously crafted imported/synced document can cause an outbound request to an attacker-chosen host on render (tracking/exfil-of-presence). **Fix:** validate the `img` value against an allowlist scheme (`https:` and/or `data:image/...` only; reject `http:`, `javascript:`, `vbscript:`, and other schemes) in `parseCharacterDocument`, and consider tightening `img-src` (see L-2).

#### L-2. Broad CSP source lists
**File:** `netlify.toml:78`. `img-src 'self' data: https:` allows image loads from any HTTPS origin (amplifies L-1); `connect-src ... https://*.supabase.co wss://*.supabase.co` and `https://*.sentry.io` use subdomain wildcards. These are defensible given env-driven URLs, but **hardening:** pin `connect-src` to the exact Supabase project host and Sentry ingest host at build time, and narrow `img-src` to `'self' data:` (plus the specific avatar host if remote avatars are ever needed). `style-src 'unsafe-inline'` is standard for the component libraries and low risk; leave as-is.

#### L-3. Session JWT in `localStorage` (accepted risk, dependent on CSP)
`@supabase/supabase-js` stores the session token in `localStorage` by default (`src/utils/supabaseClient.ts:12-18`, default `createClient` options). Any XSS would read it. This is **adequately mitigated today** by the strong `script-src 'self'` CSP and the absence of XSS sinks, so it is informational — but it is the reason H-1's local-store discipline and the CSP must not regress. No action required beyond keeping CSP strict.

#### L-4. `new Function()` on remotely-fetched text in a dev/build script
**File:** `src/scripts/srd-coverage.ts:143` evaluates array literals extracted from content fetched over the network (GitHub raw URLs, lines 40-58). This script is a `tsx` CLI tool for regenerating coverage docs and is **not part of the shipped bundle**, so it is not a runtime vulnerability — but it executes third-party-hosted code on a maintainer's machine. **Hardening:** parse with `JSON.parse` after sanitizing, or pin the upstream sources to specific commit SHAs rather than `main`.

#### L-5. GitHub Actions pinned by mutable tag, not SHA
**File:** `.github/workflows/ci.yml` — `actions/checkout@v4`, `actions/setup-node@v4`, `actions/upload-artifact@v4`, `codecov/codecov-action@v5`, `nwtgck/actions-netlify@v2` are all tag-pinned. A compromised/retagged action could run in CI. The trigger is `pull_request` (not `pull_request_target`), and the `verify` job that runs untrusted PR code carries no secrets in its env, so there is **no PR-based secret-exfil path** (Netlify tokens live only in the `deploy-*` jobs gated on `push`/same-repo PRs). **Hardening:** pin actions to full commit SHAs and enable Dependabot for Actions.

## Verified-Safe (checked and sound)

- **RLS — both tables covered with correct policies.** `documents` (`supabase/migrations/001_initial.sql:15-21`) and `campaigns` (`:39-45`) each have `ENABLE ROW LEVEL SECURITY` plus a `FOR ALL` policy with **both** `USING (auth.uid() = user_id)` and `WITH CHECK (auth.uid() = user_id)`, correctly scoping select/insert/update/delete and blocking `user_id` spoofing on write. These are the only two app tables. No policy permits reading or writing another user's rows.
- **No `SECURITY DEFINER` functions.** `update_updated_at()` (`001:52-58`) runs SECURITY INVOKER and only sets `updated_at`.
- **Realtime respects RLS.** Both tables are added to `supabase_realtime` (`001:69`, `002`); the client channel filter `user_id=eq.${userId}` (`syncEngine.ts:273,478`) uses the server-issued session UUID (not user-controllable, not injectable), and RLS governs delivery regardless.
- **No `service_role` / secret leakage.** Only `VITE_SUPABASE_ANON_KEY` is read (`supabaseClient.ts:3-4`), which is correctly public. Repo-wide grep for `service_role`, `sk-`, JWTs (`eyJ…`), and `API_KEY` found only docs/comments/lockfile-token-package noise. `.env`/`.env.*` are gitignored (`.gitignore:21-23`); git history shows only `.env.example` was ever added (no real env file or JWT committed).
- **No XSS sinks in app code.** Zero `dangerouslySetInnerHTML`, `innerHTML` writes (the two hits are test assertions reading `container.innerHTML`), `insertAdjacentHTML`, or `document.write`. No markdown/HTML renderer in dependencies. All user content (campaign names/notes, character names) is rendered via JSX text or `textarea value=` (e.g. `CampaignManager.tsx:175,254,350`) — React-escaped. The only dynamic anchor is a static `href="#main-content"` skip link (`App.tsx:365`).
- **No injection vectors.** No string-built Supabase queries (`.or()`/`.filter()` string interpolation absent — all queries use `.eq()`/`.select()` with bound values); no runtime `eval`/`new Function`/`setTimeout(string)`; the only `new RegExp` uses are in tests and a non-shipped dev script.
- **Service worker does not leak authenticated data.** `public/service-worker.js:48-50` early-returns on any cross-origin request, so Supabase REST/Realtime responses (`*.supabase.co`) are **never** cached; only same-origin GET app-shell/static assets are cached. No `Authorization`-bearing or per-user response is stored, so no cross-user cache leakage on shared devices, and the SW never caches opaque cross-origin responses.
- **Security headers present.** `netlify.toml` sets HSTS (preload), `X-Frame-Options: DENY` + `frame-ancestors 'none'`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, a locked-down `Permissions-Policy`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, and a script CSP with **no** `unsafe-inline`/`unsafe-eval`.
- **PII/logging hygiene.** `src/utils/errorLogger.ts:149-153` deliberately strips raw call args before forwarding to Sentry; `src/main.tsx:11-22` initializes Sentry with `sendDefaultPii: false` and `enabled: PROD`. No `console.log` of tokens or user data in shipped code (the dev-only trace at `errorLogger.ts:72-74` is `import.meta.env.DEV`-gated; the rest are CLI scripts/validators).
- **PWA manifest safe.** `public/manifest.webmanifest` uses `start_url: "/"` and `scope: "/"` with no credentials/query params; no scope-hijack surface.
- **Supply chain clean.** `package.json` deps are all mainstream (`@supabase/supabase-js`, `react`, `lucide-react`, `clsx`, etc.) with no typosquats; the only `preinstall` hook (`scripts/check-node-version.mjs`) just validates the Node version, and the Node bootstrap (`scripts/runtime/ensure-node-runtime.mjs`) downloads Node over HTTPS **with SHA-256 checksum verification against the official `SHASUMS256.txt`** (lines 106-124) — no arbitrary code execution.

---

# Chapter C — Code Review: D&D 5e (2014), D&D 5e (2024), D&D 3.5e slices + `systems/shared`

## Overall assessment

This slice is well-architected: a shared 5e engine base with small 2014/2024 subclasses, template applicators that clone-then-sync with provenance tracking, and an unusually disciplined "compute register + test pin" culture. The core math that is wired up (ability mods, proficiency bonus, multiclass slot table contents, 3.5e BAB/saves/grapple, exhaustion disadvantage, condition IR) is correct and matches its tests — all 112 in-scope engine tests pass. The problems are concentrated in three areas: (1) derived values that are computed by the wrong rule (single-class half/third-caster slots, 2024 Alert initiative, Divine Smite dice) where the tests pin the wrong behavior; (2) a non-idempotent `prepareData` that permanently corrupts stored max HP for class-less 2014 characters with exhaustion ≥ 4; and (3) a large cluster of "canonical RAW" helpers (unarmored defense, spell save DC, passive perception, 3.5e bonus spells, encumbrance) that are tested and even marked `verified` in the compute register but are never wired into any engine or sheet, so the sheet silently omits or mis-renders those values.

## High

### H1. Exhaustion ≥ 4 halves stored max HP again on every save/load — compounding data corruption
`src/systems/dnd5e/shared/engine.ts:112-132`, `src/systems/dnd5e/engine.ts:4-10`, `src/hooks/useDocuments.ts:112-145,211-228`
For a 2014 document with `classLevels: []` (every freshly created character until a class template is applied), `prepareData` seeds `maxHP` from the *stored* `hitPoints.max` and then halves it for exhaustion ≥ 4. Because `useDocuments` persists the *prepared* document (both on every update and on every app launch via `loadDocuments → prepareDocumentsWithEngines → persist`), the halving is applied to an already-halved value each cycle. Empirically verified: max 50 → 25 → 12 → 6 across three `prepareData` calls; on the sheet, a character's maximum HP silently shrinks every reload/edit with no user action. Fix: make the transform idempotent — store the unhalved max (or a separate `baseMaxHP`) and apply the exhaustion modifier only at derive time, never writing the derived value back over its own input.

### H2. Single-class half/third casters get multiclass (floor) spell slots — wrong slot counts on the sheet
`src/utils/spellSlots.ts:278-317` (called from `src/systems/dnd5e/shared/engine.ts:163-173`)
`compute5eSpellSlots` always floors (`paladin/ranger: floor(level/2)`, `EK/AT: floor(level/3)`) and reads the multiclass table, but the 5e rule is that a single-classed character uses their class table (equivalent to rounding *up*). Verified: solo Paladin 5 renders 3 first-level / 0 second-level slots (PHB: 4/2); Paladin 3 renders 2 (PHB: 3); Eldritch Knight Fighter 7 renders 3/0 (PHB: 4/2). The tests (`dnd5e2014EngineMath.test.ts:352-355`, `spellSlots.test.ts`) only assert even levels where floor coincides with the class table, so the bug is untested. Fix: when only one slot-contributing class exists, use its per-class `spellcasting.spellSlots` table (already present in the class data, e.g. `src/data/dnd/5e-2014/classes/ranger/index.ts:327`) or round up; keep floor for true multiclass. Note while fixing: the 2014 *paladin* data table itself is shifted one level late (`src/data/dnd/5e-2014/classes/paladin/index.ts:344-349` gives 0 slots at L2; PHB: 2) — currently unused, but it would re-break the fix if consumed as-is.

### H3. 2024 Alert feat implements an INT-swap instead of "+ Proficiency Bonus" — contradicts the app's own SRD 5.2 data
`src/systems/dnd5e-2024/engine.ts:7-36` vs `src/data/dnd/5e-2024/feats/origin.ts:12-22`
The engine computes initiative as `max(dexMod, intMod)` for Alert, with a comment "the Alert feat allows swapping DEX for INT" — but the project's own SRD 5.2 feat data (and the actual 2024 rules) say "Initiative Proficiency: Add your Proficiency Bonus to Initiative rolls." A level-5 DEX 14 / INT 10 character with Alert shows initiative +2 on the Overview card instead of +5, and the same wrong math is applied in `applyInitiativeModifiers` (also affecting any plain `dex` ability check, see L3). The test `dnd5e-2024-engine.test.ts:79-86` pins the wrong behavior. Fix: `initiative = dexMod + (hasAlertFeat ? profBonus(totalLevel) : 0)` and update the test.

### H4. Barbarian/Monk Unarmored Defense never applied to AC, yet the compute register marks it "verified"
`src/utils/armorClass.ts:35-64` (no unarmored-defense hook), dead helpers at `src/utils/derivedCombatMath.ts:41-48`, register claim at `docs/compute-register/dnd5e-2014.ts:108-128`
`compute5eAC` knows only `10 + Dex` when unarmored; `dnd5eUnarmoredDefenseBarbarian/Monk` exist as canonical, test-pinned functions but have zero non-test callers, and the barbarian/monk class features carry no `modifiers` the effects resolver could use. An unarmored Barbarian (DEX 14 / CON 16) shows AC 12 instead of 15 on the sheet and in scene combat (which reads the stored AC). The register entries are `status: 'verified'` with a testRef to the pure helper — misleading, since the register's own legend says unwired quantities should be `missing`. Fix: detect the unarmored-defense feature in `applySubsystemRules` (both editions) and take the max of the applicable formulas; or downgrade the register status until wired.

## Medium

### M1. Divine Smite radiant dice off by one slot level (data + activity + tests all pin the wrong dice)
`src/systems/dnd5e/shared/activities.ts:296-311`, `src/data/dnd/5e-2014/special-abilities/divine-smites.ts:14-69`
The activity's mechanical note emits `${slotLevel}d8` and the data's `baseDamage` matches (1st-level slot → "1d8"). SRD 5.1: 2d8 for a 1st-level slot +1d8 per higher level, max 5d8 — so a 2nd-level smite should read 3d8, not the "2d8" pinned by `dnd5eActivities.test.ts:144-147`. The 4th-level smite also misses the 5d8 cap interaction. Fix: `Math.min(slotLevel + 1, 5)`d8 in `buildDivineSmiteActivity` and correct the data/descriptions/tests.

### M2. A multiclass dip's first level is seeded with the *max* hit die
`src/utils/templateShared.ts:36-52`, `src/utils/classTemplate.ts:497-511` (mode `'add'`)
`seedHitDieRolls` gives index 0 the max die for *every* class, but only the character's very first level grants max HP; a new class's first level should use the average (e.g. wizard dip = 4, not 6). Verified: Fighter 3 + add Wizard 1 seeds wizard rolls `[6]`. `classTemplate.test.ts:144-145` pins the inflated value. Every multiclass character's max HP is inflated by `(max − avg)` per extra class. Fix: pass "is character's first class" into `seedHitDieRolls` and seed `averageHitDieRoll` at index 0 for added classes.

### M3. Per-level minimum-1-HP rule implemented as a global floor (and differently from 3.5e)
`src/systems/dnd5e/shared/engine.ts:113-127` vs `src/systems/dnd35e/engine.ts:108-115`
2014/2024 PHB: each level's roll + Con adds a minimum of 1 HP. The 5e engine instead sums raw `roll + con` per level and floors the *total* at `totalLevel`, so mixed positive/negative levels under-count (e.g. Con −2, rolls [10,1,1] → engine 6, RAW 10). The 3.5e engine does the per-die `Math.max(1, …)` correctly — the same rule implemented two different ways across files. The 5e test name "ensures minimum 1 HP per die" (`dnd5e-engine.test.ts:56`) describes the per-die rule while only exercising a single-die case, masking the divergence. Fix: clamp per level as 3.5e does.

### M4. 2024 system reuses 2014 prepared-spell formulas and 2014-shaped backgrounds
`src/data/dnd/5e-2024/classes/*/index.ts` (`preparedCasterFormula: '<ability>_modifier + <class>_level…'` consumed by `src/systems/dnd5e/shared/spellPreparation.ts:43-102`), `src/data/dnd/5e-2024/backgrounds/*.ts`, claim at `src/systems/dnd5e-2024/data-model.ts:44-50`
In the 2024 rules every caster's prepared-spell count comes from a fixed per-level table and does not depend on the ability modifier; the 2024 data reuses the 2014 `ability + level` formulas, so the "Prepare up to N spells" limit on the 2024 Spells tab is wrong whenever the caster's stat isn't at the table's assumed value (and 2024 Bard/Sorcerer are prepared casters with table values, not `cha + level`). Similarly, the 2024 backgrounds are 2014-shaped: Acolyte still grants a 2-language choice and the "Shelter of the Faithful" feature, and none grant the SRD 5.2 ability-score increases or origin feats — despite `data-model.ts`'s own comment "Backgrounds grant origin feats." Fix: per-class prepared tables for 2024 and 2024-format background grants (or correct the data-model comment and surface the manual boundary). Confidence: high on rules, medium on intended product scope.

### M5. Resource-load failures are swallowed, leaving empty catalogs and silently degraded handlers
`src/systems/dnd5e/shared/useDnd5eSheetResources.ts:119-121,133-135,143-145`; downstream `src/systems/dnd5e/shared/useDnd5eTemplateHandlers.ts:179-183,264-267`
Every loader promise ends in `.catch(() => { /* ignore teardown-time loader cancellation in tests */ })`, which also eats genuine production failures: classes/species/backgrounds stay `[]` with no error state, and `handleSpeciesChange`/`handleBackgroundChange` then take the `update({ speciesId })` fallback — setting the id *without applying the template* (no ASI, traits, languages), with no indication anything was skipped. Fix: set an error state (the controller already has the pattern for `classTemplateError`) and/or log via the existing errorLogger; keep the swallow only for an explicit cancellation signal.

### M6. Contribution ledger re-implements the AC chain (4th copy) and omits resolver AC bonuses, so the breakdown doesn't sum to the displayed AC
`src/systems/dnd5e/shared/contributionLedger.ts:48-165` vs `src/utils/armorClass.ts:35-64`, `src/systems/dnd5e/shared/engine.ts:185-192`
`buildArmorClassEntries`/`getArmorClassDexContribution` duplicate the armor/dex-cap rules from `compute5eAC`, and the ledger never emits entries for the `resolveCharacterEffects(...).bonus('ac')` term the engine adds (magic `acBonus` items, feat/feature modifiers). A character with a Ring of Protection shows ledger entries totaling 1 less than the AC on the sheet — exactly the provenance drift the ledger exists to prevent. Fix: emit ledger entries from the resolver's `result.ledger` (it already carries item-source provenance, see `equipParity.test.ts`) instead of re-deriving.

## Low

### L1. `prepareData` mutates the input document's `deathSaves` (shared reference), diverging from its own non-mutation tests
`src/systems/dnd5e/shared/engine.ts:69-75,79-93`
The shallow clone copies `hitPoints`/`spellcasting` but not `deathSaves`; `normalizeDeathSaves(clonedDoc)` then writes clamped values onto the object shared with the caller's document (React state / persisted doc). The "returns a new document … without mutating" tests only assert `hitPoints`/AC/initiative, and the JSON-comparison test passes only because default values are already in range. Same pattern: 3.5e `prepareData` leaves `equipment`/`spellsPerDay` shared but never mutates them — fine today, fragile tomorrow. Fix: clone `deathSaves` in the spread.

### L2. Engine HP fallback counts one level for a class with `level > 1` but empty `hitDieRolls`; hit-dice pools matched by array index
`src/systems/dnd5e/shared/engine.ts:117-119` — a hand-made/imported `{level: 5, hitDieRolls: []}` contributes a single `die + con` (the `Math.max(maxHP, totalLevel)` floor partially hides it).
`src/systems/dnd5e/shared/engine.ts:141-161` — `previousHitDice[index]` matching by position transfers spent-dice counts between classes when a class is removed/reordered and both share a die size (e.g. removing Fighter hands its spent count to a d10 Paladin). Match by classId or `(die, position-of-class)` instead.

### L3. `checkId === 'dex'` conflates a plain DEX ability check with initiative
`src/systems/dnd5e/shared/engine.ts:250-252,291-292`
Initiative modifiers/advantage hooks fire on any `rollCheck(doc, 'dex')`. Currently latent — the 5e sheet only rolls `save-*` and skill ids — but any future ability-check roll button would inherit the 2024 Alert behavior on plain DEX checks. Introduce a distinct `'initiative'` check id.

### L4. Dead "canonical RAW" math cluster: tested helpers with zero production callers
`src/utils/derivedCasterMath.ts` (5e spell save DC, spell attack, passive perception, concentration DC, cantrip tiers — none shown on any sheet), `src/utils/derivedCombatMath.ts` (unarmored defense → H4; `iterativeAttackBonuses` duplicating the live `getIterativeAttackBonuses` in `src/systems/d20-legacy/d20LegacySheetShared.ts:118-129`), `src/utils/dnd5eMovement.ts`, `src/systems/dnd35e/derivedMath.ts` (XP/feat/ASI/HP-state/concentration helpers), `src/systems/shared/d20-helpers.ts:77-175` (`d20HeavyLoad`/`d20CarryingCapacity`/`d20EncumbrancePenalties`/`d20LiftDragLimits`/`d20BonusSpells`). The user-visible consequences: 5e sheets show no spell save DC/attack or passive perception; 3.5e casters never receive bonus spells for high ability scores (the helper exists, the engine's `buildD20LegacySpellSlotTotals` merge never adds it). Either wire these into the engines/sheets or mark them `missing` in the compute registers; delete the duplicate iterative-attack implementation.

### L5. Duplicated size-modifier table; duplicated proficiency-bonus formula
`src/systems/shared/d20-helpers.ts:6-16` (`SIZE_MODS`, unused) vs `src/utils/armorClass.ts:68-78` (`SIZE_AC_MOD`, live) — identical tables maintained twice. `src/systems/dnd5e/shared/useDnd5eSheetController.ts:34` re-implements `Math.ceil(d.level / 4) + 1` instead of importing `profBonus` from the engine (currently identical; drift-prone).

### L6. 3.5e engine omissions consistent with "partial" support but worth tracking
`src/systems/dnd35e/engine.ts:179-195` — the generic attack roll is `BAB + STR + resolver` with no size modifier (a Small character should get +1; the engine *does* apply size to AC and grapple). `src/utils/armorClass.ts:100` — touch AC uses uncapped Dex while wearing max-dex armor (RAW caps Dex for touch AC too; confidence: medium). Skill checks ignore armor check penalty/synergy, and max-rank enforcement (`dnd35eMaxSkillRanks`) is test-only.

### L7. Controller recomputes catalog-sized derived structures on every render
`src/systems/dnd5e/shared/useDnd5eSheetController.ts:81-112`
`new Map(spells…)`, `new Map(equipmentItems…)`, always-prepared sources, prepared-caster summaries (which run `Function()` formula evaluation per caster) and eligible feature options are rebuilt on every keystroke-driven re-render once catalogs (hundreds of spells/items) are loaded. Wrap in `useMemo`; the inputs are all stable references from state.

### L8. `toggleSkillProficiency` discards proficiency provenance
`src/systems/dnd5e/shared/useDnd5eSheetActionHandlers.ts:93-110`
Cycling a class/species-granted skill rewrites `source` to `['manual']` (and cycling to "none" deletes the record entirely), breaking the source-tracking that the species/class/background templates rely on for clean removal (`removeSkillSource` no longer finds the class's source). Merge `'manual'` into the existing source list instead of replacing it.

## Strengths

- **Immutability discipline in the mutation layer is excellent**: every template applicator (`classTemplate`, `featTemplate`, `speciesTemplate`, `backgroundTemplate`, feature options) clones first, tracks previous derived grants in `templateState`, and removes-then-reapplies symmetrically — re-selection, retargeting, and removal round-trip cleanly, with persistence tests proving it.
- **The condition IR and "manual boundary" honesty pattern** (`rules/conditions/dnd5eConditions.ts`, activities) is a standout: deterministic effects auto-apply, situational ones surface as labeled notes instead of silently mis-applying, and the engine sources its roll-mode decisions from the shared catalog rather than bespoke branches.
- **Test infrastructure intent is unusually strong** — the compute-register + engine-math pinning approach (`dnd5e2014EngineMath.test.ts`, `d20LegacyEngineMath.test.ts`) makes the RAW formula the unit of verification; the gaps found above are mostly cases where the register's status or a test's name outran the actual wiring, which the same infrastructure makes easy to fix.

---

# Chapter D — Code Review: Pure-Logic Layer (utils, constants, validation)

## Overall assessment

The shared-math layer is mostly clean and well factored: ability modifiers use `Math.floor` correctly everywhere, the 5e multiclass slot table, 3.5e/PF1e save/BAB progressions, Daggerheart tier/threshold math, and all engine d20 rolls (`Math.floor(Math.random()*n)+1`) are RAW-correct and unbiased. The serious problems are concentrated in three places: 5e spell-slot derivation (single-class half-casters, the 2024 edition, and warlock pact magic are all wrong or missing), PF2e level-1 class proficiency profiles (three classes diverge from the CRB), and hit-point seeding (max die and PF1e favored-class bonus applied to every class row instead of one). Several of these wrong behaviors are pinned by the project's own unit tests, so the tests encode the bug rather than the rule. The template apply/remove machinery is impressively careful about provenance and idempotency, with only narrow asymmetries (background feature removal, species `uses` dropping).

## High

**H1. Single-class half/third casters get multiclass floor() rounding — wrong slot counts on Paladin/Ranger sheets**
`src/utils/spellSlots.ts:278-300` (used by `src/systems/dnd5e/shared/engine.ts:165` for every 5e character). `compute5eSpellSlots` always sums `floor(level/2)` for paladin/ranger and looks up the multiclass table, but per SRD the multiclass table applies only with 2+ casting classes; a single-class paladin uses the Paladin table. A Paladin 3 sheet shows 2 first-level slots (RAW: 3); Paladin/Ranger 5 shows 3×1st/0×2nd (RAW: 4×1st/2×2nd) — wrong at every odd level. The class data tables (e.g. `src/data/dnd/5e-2014/classes/paladin/index.ts:344`) are never consulted by the engine. Fix: when only one casting class is present, read the class's own `spellcasting.spellSlots` table (or use `ceil(level/2)` / `ceil(level/3)` for single-class half/third casters).

**H2. 2024 edition: Paladin/Ranger level 1–2 get zero slots; 2014 rounding contaminates the 2024 system**
`src/utils/spellSlots.ts:284-298`. The same `floor()` math is applied to `dnd-5e-2024` documents (shared engine base). In the 2024 rules paladins/rangers cast from level 1 (their own data table even says `1: [2, 2, ...]` at `src/data/dnd/5e-2024/classes/paladin/index.ts:353`), and the 2024 multiclass rule rounds half-caster levels *up*. A 2024 Paladin 1 sheet shows 0 spell slots while its own class table grants 2. Fix: per-edition caster-level rounding plus the single-class table fix from H1.

**H3. Warlock Pact Magic is not modeled at all — warlock sheets show 0 spell slots at every level**
`src/utils/spellSlots.ts:261,296` returns 0 slots for warlock ("pact… not included"), `SpellcastingInfo` (`src/types/core/character.ts:186-210`) has no pact-slot fields, and no other code computes pact slots (`isPactMagic` in class data is read only by the offline validator). The test `src/__tests__/utils/spellSlots.test.ts:10-13` pins warlock 5 → 0 slots as intended behavior. A core SRD class is silently unusable: no slot count, no short-rest recovery (`dnd5eRest.ts` resets only the standard 1–9 grid). Fix: add a pact-slot structure (count/level by warlock level, short-rest recovery) or surface an explicit "manual" banner instead of rendering zeros.

**H4. PF2e level-1 class profiles diverge from the CRB for Alchemist, Barbarian, and Monk**
`src/utils/pf2eTemplate.ts:181-186` (alchemist `reflex: 'trained'` — CRB: expert), `:188-194` (barbarian `perception: 'trained'` — CRB: expert), `:249-254` (monk `perception: 'expert'` — CRB: trained). Because the engine computes totals as `level + tier bonus` (`src/systems/pf2e/engine.ts:147`), every alchemist's Reflex save and every barbarian's Perception are 2 too low, and every monk's Perception is 2 too high, at all levels. No test pins these three values. Fix the three tier entries. (confidence: medium-high — verified against CRB class entries from memory; all other 9 profiles check out.)

## Medium

**M1. `seedHitDieRolls` grants max hit die to the first level of *every* class row — multiclass and prestige HP inflated**
`src/utils/templateShared.ts:36-52`, called from `src/utils/classTemplate.ts:507` and `src/utils/d20LegacyTemplate.ts:325,345`. Index 0 always gets `hitDieFaces`, but RAW (5e, 3.5e, PF1e alike) maxes only character level 1; later classes' first level is rolled/average. A Fighter 2 / Wizard 3 gets `[10,6] + [6,4,4]` (wizard L1 maxed, +2 HP); every prestige class entered mid-career also gets a maxed first HD. Tests pin the wrong value (`src/__tests__/utils/classTemplate.test.ts:145`, `d20LegacyTemplate.test.ts:158`). Fix: pass "is first class row" into `seedHitDieRolls` and seed the average for non-first rows.

**M2. PF1e favored-class +1 HP/level applied to every class in a multiclass build**
`src/utils/d20LegacyTemplate.ts:352` defaults `favoredClassBonus: 'hp'` for each created class row; `src/systems/pf1e/engine.ts:109` then adds `+level` HP per row marked `'hp'`, and there is no UI to change it (only the skill-FCB badge is displayed). RAW: one favored class per character. A PF1e Fighter 5/Wizard 5 gets +10 HP instead of +5. Fix: default added rows to a `'none'`-like value (type currently allows only `'hp' | 'skill' | 'other'`) or apply the bonus only to the first row.

**M3. 5e species traits lose their `uses` tracking — Breath Weapon / Relentless Endurance have no use counter and never recover on rest**
`src/utils/speciesTemplate.ts:350-357` (`buildSpeciesFeatures` copies id/name/source/description only), while species data carries `uses` (`src/data/dnd/5e-2014/species/dragonborn.ts:40`, `half-orc.ts:46`) and the d20-legacy twin *does* copy it (`d20LegacyTemplate.ts:186-194`). Rest recovery (`dnd5eRest.ts:3-20`) keys off `feature.uses`, so these racial features silently become untracked text. Fix: copy `uses: trait.uses ? { ...trait.uses } : undefined` like the d20 version.

**M4. 5e Unarmored Defense never reaches the sheet — canonical formulas are dead code**
`src/utils/derivedCombatMath.ts:41-48` defines barbarian/monk Unarmored Defense, but nothing outside tests imports them; 5e AC is always `compute5eAC` (10+Dex when unarmored, `src/systems/dnd5e/shared/engine.ts:185`). An unarmored monk's or barbarian's sheet AC omits Wis/Con. Several sibling functions are likewise test-only (`dnd5eSpellSaveDC`, `pf2eMultipleAttackPenalty`, `dnd5eConcentrationDC`, …), and `src/systems/d20-legacy/d20LegacySheetShared.ts:118` re-implements `iterativeAttackBonuses` (currently numerically equivalent, classic drift seed). Fix: wire the canonical functions into the engines/sheets or mark them explicitly as not-yet-consumed.

**M5. PF2e proficiency tiers are frozen at level-1 baselines — saves, perception, and spell DC under-scale from level 7+**
`src/utils/pf2eTemplate.ts:556-566,612-636` set tiers once from the class profile and preserve `existing?.proficiency.tier || 'trained'` for spellcasting; the engine only recomputes `level + tierBonus`. Casters never become expert/master/legendary (spell DC −2 from L7, −4 from L15, −6 at L19), fighters never reach weapon master, etc., and no UI exists to hand-edit save/perception/spellcasting tiers. confidence: medium — this may be an accepted "partial automation" boundary, but unlike other manual boundaries it isn't documented in `documentationCopy.ts`. Fix: add tier-progression tables per class level, or document/expose manual tier editing.

## Low

**L1. Background feature removal uses OR-matching where the add-side uses AND**
`src/utils/backgroundTemplate.ts:356-360` keeps features only when `id !== prev.id && source !== prev.source` (i.e. removes on id *or* source match), while the duplicate-guard at `:408-411` matches on id *and* source. Switching backgrounds can delete an unrelated feature that merely shares an id or a source string. Fix: `!(f.id === prev.id && f.source === prev.source)`.

**L2. `compute5eSpellSlots` throws on partial/legacy `spellSlots` objects**
`src/utils/spellSlots.ts:312` does `existingSlots[key].used` without a guard; a persisted document whose `spellcasting.spellSlots` is missing a level key (boundaryValidation deliberately does not deep-check `system`) crashes `prepareData` instead of self-healing. Fix: `existingSlots?.[key]?.used ?? 0`.

**L3. `dice.ts` is dead code with latent parsing bugs**
`src/utils/dice.ts:18` — the regex is unanchored (`"x2d6y"`, `"attack 2d6 fireball"` parse), `"2d6 + 3"` silently drops the modifier (whitespace not allowed), and `rollDice(0)`/`d0` returns 1 per die. No production importer (only `__tests__/utils/dice.test.ts`); the engines and the seeded resolver roll correctly on their own. Fix: anchor the regex (`/^\s*(\d+)?d(\d+)\s*([+-]\s*\d+)?\s*$/i`), reject `sides < 1` — or delete the module.

**L4. `validateHitPoints` lets NaN through and never checks `current <= max`**
`src/utils/validation.ts:50-63` — all three comparisons are false for NaN, so `NaN` HP validates. Note the whole module's `validateCharacter` has no production callers (test-only). Fix: `Number.isFinite` guards; consider deleting if intentionally dead.

**L5. `armorClass.ts` PF2e doc-header contradicts the implementation**
`src/utils/armorClass.ts:17-19` says "Armored: armorClass + min(DEX, cap) + proficiency" but the code (`:125`) computes `10 + armorClass + …` (item bonus semantics, matching engine and tests). A future reader "fixing" the code to match the header would break PF2e AC by 10. Fix the comment.

**L6. 3.5e/PF1e touch AC ignores the armor's max-Dex cap**
`src/utils/armorClass.ts:100` uses uncapped `dexMod` for touch AC; RAW the armor's Max Dex Bonus caps Dex-to-AC generally, touch included. Only affects high-Dex characters in restrictive armor (touch AC reads slightly high).

**L7. `constants/hit-dice.ts` claims 3.5e/PF1e applicability but holds 5e-only values**
`src/constants/hit-dice.ts:1` — 3.5e wizard is d4, rogue d6, ranger d8, none of which match the table. Currently only the 5e engine consumes it (the d20 templates correctly use per-system `classData.hitDie`), so this is a labeled trap, not an active bug. Fix the comment or namespace it `DND5E_HIT_DICE`.

**L8. `EMPTY_SLOTS` early-return shares nested slot objects across characters**
`src/utils/spellSlots.ts:302` — `{ ...EMPTY_SLOTS }` is a shallow copy; all nine `{max,used}` objects are shared module state for every zero-caster-level result (e.g. all warlocks). Current writers update immutably (`activities.ts:195`), so this is latent aliasing only. Fix: build fresh objects like the non-zero path.

**L9. `buildAutomatedFeat` aliases the catalog's `modifiers` array into the character document**
`src/utils/featTemplate.ts:884` — `modifiers: feat.modifiers` shares the imported `FeatDefinition` array; an in-place mutation on the character would corrupt the shared catalog for every later character. Fix: clone (`[...(feat.modifiers ?? [])]`).

**L10. `getSpellSlotsAtClassLevel(table, 0)` returns level-1 slots**
`src/utils/classSpellcasting.ts:9` clamps `classLevel - 1` to index 0, so a 0-level row would read level-1 slots instead of none. All current callers pass ≥1; cheap to guard with an early return.

**L11. Daggerheart currency normalization silently destroys overflow wealth**
`src/utils/daggerheartInventory.ts:74-77` — carrying-cap clamping (1 chest max) is RAW, but `normalizeDaggerheartCurrency` discards anything above the cap with no remainder or warning. Consider preserving the excess or surfacing a note. [Same as M&M/DH review L7]

## Strengths

- **Provenance-tracked template apply/remove is genuinely robust**: skill/tool/language proficiencies carry `source` arrays, `templateState` snapshots derived grants, and apply→remove→re-apply round-trips are idempotent across class, species, background, feat, and PF2e archetype templates — and every template deep-clones via `structuredClone` before mutating, so shared catalog data is never corrupted (the one alias found is L9).
- **The core arithmetic is right where it's hardest to spot**: `abilityMod` floors correctly for negative modifiers, the 5e multiclass slot table is a character-perfect SRD transcription, 3.5e/PF1e save/BAB progressions and Daggerheart tier/threshold/proficiency math all match RAW, and the seeded RNG plus all engine d20s use the unbiased `floor(random()*n)+1` form.
- **Boundary philosophy is sound**: `boundaryValidation.ts` documents and implements a clear "parse, don't cast" envelope check, `spellCatalog` alias resolution is cycle-safe, and `dnd5eRest` implements short/long rest recovery (hit-dice half-pool minimum 1, exhaustion step-down, feature `uses` reset) exactly per the 2014 rules.

---

# Chapter E — Code Review: PF2e, PF1e, d20-legacy slices

## Overall assessment

The three slices are in good shape architecturally: engines are pure and immutably-cloned, the headline math (PF2e proficiency `level + tier` with untrained = 0, four degrees of success with nat-20/1 step shifts, PF1e BAB/save progressions, CMB/CMD, iterative attacks, favored-class bonuses, prestige-class spellcasting advancement) is correct and well pinned by tests. The serious problems are not in the formulas but in the interaction between the sheets' manual-edit affordances and `prepareData`, which runs on every `updateDocument` and silently reverts or destroys user input (d20 spell-slot totals, PF2e max HP), and one genuine data-loss bug where changing a PF2e class deletes all manually trained skills. There is also a cluster of "computed but never consumed" rules code (bonus spells from high ability, spell attack/DC proficiency, derived-math modules) that leaves scope-relevant rules unimplemented while tests suggest otherwise.

## High

**H1. PF2e class change deletes all manually trained skill proficiencies — `src/utils/pf2eTemplate.ts:325-345` and `:533-536`**
`removeProficiencySource` deletes a proficiency entry whenever its remaining `source` array is empty — including entries that never had a `source`. Skills trained via the sheet's cycle button (`usePf2eMutationHandlers.ts:60-75` creates `{ ...current, tier }` with no `source`) are therefore deleted wholesale by the `Object.keys(sys.skillProficiencies).forEach(... removeProficiencySource(..., previousClass.name))` loop that runs on any class change or clear. User-visible impact: switch a level-10 character from wizard to fighter and every hand-trained skill (Athletics expert, Stealth master, etc.) vanishes from the saved document. The template test only covers the class-sourced skill (`arcana`), so this path is untested. Fix: in `removeProficiencySource`, only delete when the named source was actually present (`if (!existing.source?.includes(source)) return;`), and/or have `cycleSkillTier` record a `'manual'` source.

**H2. d20-legacy manual spell-slot totals and added slot levels are reverted by `prepareData` on every update — `src/utils/classSpellcasting.ts:21-38` (`mergeVancianSpellSlots`), `src/systems/pf1e/engine.ts:121-128`, `src/systems/dnd35e/engine.ts:123-128`, vs. `useD20LegacyMutationHandlers.ts:142-155, 229-241`**
`mergeVancianSpellSlots` sets `total = totals[level] ?? 0`, i.e. totals come only from the class tables; the existing total is discarded (only `used` is preserved). Every sheet update is piped through `prepareDocumentWithEngine` (`src/hooks/useDocuments.ts:211-226`), so the Spell Slots editor exposed by `D20SpellsTab` (`onSetSpellSlotTotal`, "Add Level") is a no-op: typed totals snap back to the table value, and rows added via "Add Level" (including level 0, or any row on a non-caster) snap to `0/0`. Combined with H2a below, this means a PF1e/3.5e caster can never display correct spells/day for a high casting stat — neither automatically nor manually. Fix: either treat the class-table value as a floor (`total = Math.max(existingTotal, tableTotal)` won't survive level-down; better: store a `manualBonus` per level, or only merge totals for levels present in the table and preserve user totals above them).

**H2a. Bonus spells from high ability and level-0 slots are absent from the Vancian pipeline — `src/systems/shared/d20-helpers.ts:172-175`, `src/utils/d20LegacySpellcasting.ts:208-267`, `src/data/pathfinder/1e/classSpellSlotTables.ts`**
`d20BonusSpells` correctly implements the SRD bonus-spell table and is pinned by `d20LegacyEngineMath.test.ts:510-525`, but no production code calls it — `buildD20LegacySpellSlotTotals` sums raw class tables only. The PF1e tables also have no spell-level-0 row, so orisons/cantrips never appear. A 16-Int PF1e wizard 3 shows 2/1 slots instead of 3/2 (+0-level), and H2 blocks the manual workaround. Fix: add the casting-ability mod (class key ability is available on `CharacterClass`) into `buildD20LegacySpellSlotTotals`, and add level-0 rows to the tables.

## Medium

**M1. PF2e "Max HP" input silently reverts; no way to apply manual HP adjustments — `src/systems/pf2e/engine.ts:191-194` vs `Pf2eOverview.tsx:58-67`**
`prepareData` unconditionally overwrites `hitPoints.max` with `ancestryHP + level × (hitDie + conMod)` (falling back to d8 when no class), and every update is re-prepared (H2 plumbing). The editable Max HP field in the overview therefore reverts on the next render, and there is no misc/bonus field, so Toughness-style feats or item HP can never be reflected. Fix: remove the input or add a `hitPoints.maxBonus` field the engine adds on top (the d20 sheet gets this right by making max read-only and giving saves a preserved `misc` field).

**M2. PF2e Class DC hardcodes trained proficiency and a guessed key ability — `src/systems/pf2e/components/Pf2eOverview.tsx:110-112`, `getPf2eSheetChoiceState.ts:44-49`**
Class DC renders as `10 + level + 2 + abilityMod(classDcScore)`: the +2 (trained) never advances even though most classes reach expert/master class DC at higher levels, and when `keyAbility` is unset the code silently substitutes the character's highest ability score (`Math.max(...Object.values(baseAttributes))`), masking missing data with an inflated DC. Fix: track a class-DC `Pf2eProficiency` in the data model (cycle badge like saves), and show "—" instead of guessing when there is no key ability.

**M3. PF2e spell attack/DC proficiency is computed but never consumed and can never advance — `src/systems/pf2e/engine.ts:212-224`, `data-model.ts:43-53`**
`spellcasting.proficiency.total` is recomputed each prepare from a tier that defaults to `'trained'` and has no UI to change it (grep shows no consumer anywhere — no spell attack or spell DC is displayed in `Pf2eSpellsTab` or elsewhere). A level-20 caster is stored as trained (should be legendary by 19). Scope item "spell attack/DC progression" is effectively unimplemented. Fix: surface spell attack/DC in the spells tab with a cycleable tier badge, or derive the tier from class level.

**M4. PF2e status penalties to AC are mismodeled: frightened/sickened ignored, clumsy swallowed by armor dex caps — `src/systems/pf2e/engine.ts:168-179`, `src/utils/armorClass.ts:122-125`**
Per CRB, frightened/sickened are status penalties to "all your checks and DCs" including AC, and clumsy penalizes AC directly. The engine instead only models clumsy, by reducing the Dex *score* before the armor cap is applied — so a clumsy 2 character in full plate (dex cap 0) loses nothing (pinned in `pf2e-engine.test.ts:116-142`), and a frightened 2 character keeps full AC (pinned at `:164-186`). The divergence is deliberate (tests pin it) but produces wrong AC at the table whenever these very common conditions are active. Fix: subtract the worst applicable status penalty (`getPf2eConditionStatusPenalty(conditions, 'dex')` extended with an AC scope) after the capped-Dex AC is computed. Confidence: high that it diverges from RAW; the tests show it is intentional.

**M5. d20-legacy class Level input is dead until class options happen to load — `src/systems/d20-legacy/components/D20ClassesSection.tsx:165-180`, `useD20LegacyTemplateHandlers.ts:94-99`, `useD20LegacySheetResources.ts` (no eager `loadOptions`)**
Unlike the PF2e resources hook (which eagerly calls `loadOptions()` on mount, `usePf2eSheetResources.ts:145-147`), the d20 hook only loads classes when a `<select>` gets focus. `handleClassLevelChange` early-returns when `classes.find(...)` misses, so opening an existing PF1e/3.5e sheet and typing a new level in the Level input does nothing, with no error, until the user happens to focus a class dropdown. Fix: eagerly `loadOptions()` on mount (matching PF2e) or add `onFocus={onLoadOptions}` to the level input. Confidence: medium (verified by code path; not run).

**M6. PF2e `applyDamage` mishandles negative amounts and drifts from sibling engines — `src/systems/pf2e/engine.ts:304-321` vs `pf1e/engine.ts:225-229`, `dnd35e/engine.ts:221-225`**
PF1e/3.5e/5e engines explicitly treat negative damage as healing (tested at `pf1e-engine.test.ts:350-356`, `dnd35e-engine.test.ts:366`), but PF2e lacks the guard: with temp HP present, `Math.min(hp.temp, remaining)` with negative `remaining` *increases* temp HP (e.g. `applyDamage(doc, -5)` with temp 10 yields temp 15). No production caller currently passes negatives to the PF2e engine (only the 5e action handlers call `applyDamage`), so impact is latent, but any future shared combat resolver will hit it. Fix: copy the `amount < 0` healing branch.

## Low

**L1. PF2e archetype templates grant all features regardless of level and enforce no dedication rules — `src/utils/pf2eTemplate.ts:855-881`, `Pf2eArchetypesTab.tsx:69-117`**
Toggling an archetype adds every feature (each labeled "Level N" in the UI) to a level-1 character, and nothing models the dedication-feat cost or the "two feats before a second dedication" rule. Persistence itself is correct and well tested (`pf2e-archetype-persistence.test.ts`). Fix: filter `archetypeTemplateFeatures` by `feature.level <= sys.level` (mirroring the class template) as a first step.

**L2. PF2e shield bonus applies while merely equipped, not raised — `src/utils/armorClass.ts:115-131`**
The module header says "raised shield adds shieldBonus" but the code adds it whenever `equipped`, permanently inflating AC by +2 for any shield owner; PF2e requires the Raise a Shield action each round. Correct for PF1e in `computeD20LegacyAC`, wrong for PF2e. Fix: add a `raised` flag on PF2e shield items or exclude shields from static AC. Confidence: medium (may be an accepted simplification, but the comment contradicts the code).

**L3. d20 spells tab resolves tracked spells against the class-filtered list, causing false "Unresolved" badges — `src/systems/d20-legacy/components/D20SpellsTab.tsx:73-86`**
`spellById` is built from `browseableSpells` (filtered by current class spell lists) rather than all loaded spells, so spells tracked before a class change, or off-list spells, render "Unknown level / Unresolved" even though the loader has them. `Pf2eSpellsTab.tsx:62-65` correctly builds its map from the full `spells` array — duplication drift. Fix: build `spellById` from `spells`.

**L4. Resolver typed-bonus fold drops same-type penalties when a bonus exists — `src/rules/resolver/resolve.ts:158-171`**
For d20 `{bonusType}` stacking, the fold keeps `Math.max` of signed values per type, so a +2 enhancement bonus and a −2 enhancement penalty resolve to +2 instead of 0; in 3.5/PF1e a penalty and bonus of the same type both apply. The PF2e bucket fold immediately below (`:176-188`) handles best-bonus-plus-worst-penalty correctly. Fix: mirror the bucket logic (max of positives + min of negatives) for named types. [Duplicate of rules-engine L1]

**L5. PF1e/3.5e attack rolls omit the size modifier; PF1e CMB ignores the Tiny-uses-Dex rule — `src/systems/pf1e/engine.ts:148-150, 186-198`**
`attack` is BAB + Str (+resolver), with no `SIZE_MODS` term, and CMB always uses Str although Tiny-or-smaller creatures use Dex. Both are test-pinned as BAB+Str, so intentional simplifications, but a Small PC's attack is understated by 1. Fix: add `SIZE_MODS[data.sizeCategory]` to the attack modifier; branch CMB on size rank.

**L6. PF2e bulk thresholds off by one — `src/systems/pf2e/components/Pf2eInventoryTab.tsx:31-35`**
RAW: encumbered when Bulk *exceeds* 5 + Str mod; the code uses `totalBulk >= encumbered`, flagging a character at exactly 5 + Str. Same for the 10 + Str maximum. Fix: use `>`.

**L7. Unstable `mutationHandlers` dependency makes the trait effect run every render — `src/systems/d20-legacy/useD20LegacySheetController.ts:106-113`**
`useD20LegacyMutationHandlers` returns a fresh object literal each render, so this effect re-fires on every render (benign today only because `setSelectedTraitId('')` bails on equal state and `loadTraitOptions` is guarded). Fix: depend on `mutationHandlers.setSelectedTraitId` (a stable `useState` setter) instead of the whole object.

**L8. `useLazyResource` and the options-loader are duplicated verbatim between PF2e and d20-legacy — `usePf2eSheetResources.ts:27-72, 101-147` vs `useD20LegacySheetResources.ts:23-68, 87-125`**
~70 identical lines; M5 shows they have already drifted (eager vs lazy `loadOptions`). Fix: extract a shared `useLazyResource`/`useSystemOptions` hook.

**L9. Dead rules modules: derived math and carrying capacity exist only for tests — `src/systems/pf2e/derivedMath.ts`, `src/systems/pf1e/derivedMath.ts`, `src/systems/shared/d20-helpers.ts:77-175`**
The dying/wounded/recovery track, encounter XP budgets, concentration DCs, HP-state, and carrying-capacity helpers are exported, documented, and pinned by tests, but no sheet or engine consumes any of them (grep confirms test-only imports). Self-described as "compute register" groundwork, so this is intentional scaffolding, but the PF2e sheet offers no dying/wounded tracking while a complete, tested implementation sits unused. Fix: wire them into the overview/conditions UI or mark them clearly as future-facing.

**L10. PF2e generic "lore" entry pollutes the skills grid and rolls against the wrong store — `src/systems/pf2e/constants.ts:10`, `Pf2eSkillsTab.tsx:57`, `engine.ts:254-259`**
`SKILL_ABILITIES` includes `lore: 'int'`, so a cyclable generic "Lore" row renders above the real per-lore section; cycling it writes to `skillProficiencies['lore']` while actual lores live in `loreProficiencies`, and `rollCheck('lore')` reads the former. Fix: drop `lore` from `SKILL_ABILITIES` (it's separately declared in `definition.ts` skills, which can stay for registry purposes) or route it to lore proficiencies.

**L11. Rest mechanics are 5e-flavored house rules — `src/systems/pf2e/usePf2eMutationHandlers.ts:130-155`, `useD20LegacyMutationHandlers.ts:70-93`**
PF2e "long rest" restores full HP (RAW: Con mod × level, min level) and "short rest" heals `level/2` HP (no such PF2e mechanic; Refocus's +1 focus point is the only RAW part); 3.5/PF1e rest heals similarly rather than 1 HP/level/night. Focus/slot recovery is right. Intentional simplification (confidence medium), but worth a note in support docs or a `recoveryFormula` per system.

**L12. Engine docstring promises item bonuses on PF2e skill checks that are never applied — `src/systems/pf2e/engine.ts:97, 240-296`**
The header claims "Skills = ability mod + proficiency + item bonuses", but `rollCheck` never consults `resolveCharacterEffects` (the resolver is used only for AC), so skill-boosting items do nothing on rolls. Fix: add `.bonus(\`check.${attr}\`)`/`.bonus('skill.x')` plumb-through or amend the comment.

**L13. Multiclass HP seeds max hit die for every class's first level — `src/utils/templateShared.ts:36-52`**
`seedHitDieRolls` gives index 0 the max roll per class row, but only the character's very first level is maxed under 3.5/PF1e rules; a fighter 1/wizard 1 gets 6 instead of ~4 from the wizard die. Minor, player-favoring, editable via rolls.

**L14. Hardcoded PF1e prestige-class id set risks drift from data — `src/systems/d20-legacy/components/D20ClassesSection.tsx:42-54`**
The component keeps its own 7-id set for `<optgroup>` grouping while 3.5e uses a data-driven predicate (`isDnd35eProductPrestigeClassId`); adding a PF1e prestige class to data will silently mis-group it. Fix: export a predicate from `src/data/pathfinder/1e/prestige-classes` like the 3.5e catalog does.

## Strengths

- **Core math is right and genuinely test-pinned.** PF2e proficiency (untrained = 0, no level), degree-of-success with nat-20/1 step shifts, per-bucket PF2e bonus stacking (highest bonus + worst penalty per bucket, buckets sum), PF1e BAB/save progressions, CMB/CMD signs, iterative attacks capped at 4, and the prestige-class spellcasting-advancement machinery (mystic theurge dual tracks, lore-master, dragon disciple) all match RAW and have meaningful tests, including persistence round-trips.
- **Disciplined immutability and provenance.** Engines clone before deriving (verified by non-mutation tests), template applicators work on `structuredClone`s, and the source-tagged proficiency/feature-signature system makes template add/remove largely idempotent and reversible (archetype idempotency test is a good example).
- **Sensible lazy-loading architecture.** The warm-on-hover tab preloading, system-id-guarded async loaders with stale-response protection, and lazy browser panels are consistent across both sheets and avoid the classic stale-async-set-state bugs.

---

# Chapter F — Code Review: M&M 3e + Daggerheart slices

## Overall assessment

Both system slices are architecturally clean: engines are pure (clone-then-derive, pinned by mutation-safety tests), mutation handlers are consistently immutable, and the Daggerheart normalization/passive-bonus layer is genuinely well-factored. The main problems are rules-math divergences, several of which contradict the project's *own* sibling utilities and doc-comments: the Daggerheart engine's crit/fumble logic disagrees with `getDaggerheartDualityOutcome` in the same codebase, its `applyDamage` implements a d20-style HP-pool/DR model while the correct threshold math sits unused in `daggerheartDerived.ts`, and the M&M cost engine omits the reduced-cost-per-rank rule so heavily flawed powers become free. A second tier of issues is silent data normalization that can overwrite or exceed legitimate user state (Daggerheart HP hydration, loadout-limit bypass on import). React-level issues are minor (index keys, `Date.now()` ids, swallowed loader errors). All 127 related tests pass — every divergence below is code-and-tests vs. rules/own-utilities, not a broken build.

## High

**H1 — Daggerheart doubles are only a crit at 10+, and low doubles are reported as a fumble that doesn't exist**
`src/systems/daggerheart/engine.ts:90-91`
`isCritSuccess = hopeDie === fearDie && hopeDie >= 10` and `isCritFail = hopeDie === fearDie && hopeDie <= 3`. In Daggerheart, *any* matched Duality Dice is a critical success; there is no fumble. The codebase's own `getDaggerheartDualityOutcome` (`src/utils/daggerheartDerived.ts:196-202`, pinned by `daggerheartEngineMath.test.ts:198-204`) says exactly that, and even this function's own flavor string (line 102) calls all doubles "Critical!" while `isCritical` stays false for doubles 4–9 and `isFumble` turns true for 1–3. Users rolling double 4–9 lose the crit (Hope gain/Stress clear/crit damage prompts); double 1–3 shows a red "NAT 1!" badge. `daggerheart-engine.test.ts:1031-1043` pins the wrong behavior. Fix: `const outcome = getDaggerheartDualityOutcome(hopeDie, fearDie); isCritical = outcome === 'critical'; isFumble = false;` and update the test.

**H2 — M&M power cost omits the minimum-cost rule; flawed powers become free (or are clamped from negative)**
`src/systems/mam3e/powerMath.ts:67-68`
`costPerRank * rank + flatCost` clamped with `Math.max(0, …)`. Per the Hero's Handbook, when modifiers reduce an effect below 1 point/rank, the cost becomes 1 point per 2 ranks (then per 3, etc., rounded up) — it never reaches 0. Example: Damage 10 (base 1) + Limited (−1/rank) should cost 5 PP; the app charges 0, and a second flaw drives the raw total negative before the clamp. This corrupts the central PP budget (`powerPoints.spent.powers`, `ppOver` flag) and lets builds pass validation for free. No test pins the sub-1 case. Fix: in `calculatePowerPointCost`, when `costPerRank < 1`, compute `Math.ceil(rank / (2 - costPerRank)) + flatCost` (min final cost 1), and mirror it in `buildMam3ePowerCostLedgerEntries` (`src/systems/mam3e/contributionLedger.ts:100-111`) which reports the same `details.costPerRank`.

## Medium

**M1 — Daggerheart `applyDamage` is a d20 HP-pool + ablative-DR model, contradicting the system's own threshold math**
`src/systems/daggerheart/engine.ts:107-137`
Raw damage is subtracted point-for-point from `hitPoints.current` after armor "absorbs" damage 1:1 — a 7-damage hit kills a 6-HP level-1 PC outright. Daggerheart instead marks 1/2/3 HP via Major/Severe thresholds, with each armor slot reducing marked HP by one; that exact math exists, documented and tested, in `getDaggerheartHpMarked`/`getDaggerheartHpMarkedAfterArmor` (`src/utils/daggerheartDerived.ts:124-135, 181-188`) but is never called by the engine. Tests pin the pool model (`daggerheart-engine.test.ts:1139-1152`, `daggerheartEngineMath.test.ts:130-148`). No UI calls Daggerheart's `applyDamage` today (only the dnd5e sheet uses its engine's), so impact is latent — but it is the engine's public damage contract and will silently corrupt characters when scenes/encounters wire it. Fix: `applyDamage` should compute `getDaggerheartHpMarkedAfterArmor(getDaggerheartHpMarked(amount, majorThreshold, severeThreshold), armorSlotsMarked, armorScore)` and decrement HP by marked slots.

**M2 — Perception-range powers are counted in the Ranged Attack + Effect PL cap**
`src/systems/mam3e/engine.ts:214-218`
The ranged-cap filter includes `power.range === 'perception'`, adding perception effect rank to `dex + ranged-combat`. Perception-range attacks require no attack check, so they are capped only at effect rank ≤ PL — which the code already checks separately (lines 232-241). A PL10 hero with Dex 10 + Ranged Combat 8 and a legal rank-3 perception power gets a false "Ranged Attack + Effect: 21 exceeds 20" warning. The existing test (`mam3eEngineMath.test.ts:400-422`) uses Dex 0, masking this. Fix: drop `|| power.range === 'perception'` from the ranged filter.

**M3 — Toughness damage progression: second Staggered should Incapacitate; Bruised never applies its −1 penalty**
`src/systems/mam3e/engine.ts:54-58` (and duplicate at `src/systems/mam3e/useMam3eMutationHandlers.ts:203-208`); `src/systems/mam3e/engine.ts:114, 270-274`
Two related gaps in the condition track that the conditions tab drives directly: (a) the code models "second Dazed → Staggered" but a second Staggered result just re-sets `staggered = true`; per the Damage rules it should incapacitate. (b) `bruised` is counted but never subtracts from `defenses.toughness.total` or the `rollCheck('toughness')` modifier, so Toughness saves rolled from the sheet ignore the cumulative −1 per bruise. Fix: escalate `staggered → incapacitated` in both copies, and subtract `conditionTrack.bruised` when computing/rolling Toughness (or at least in `rollCheck`).

**M4 — Negative skill/defense ranks are accepted and produce negative PP costs and defense totals**
`src/systems/mam3e/engine.ts:160-172, 136-143`; `src/systems/mam3e/useMam3eSheetController.ts:95-101`; `src/systems/mam3e/useMam3eMutationHandlers.ts:174-179`
`min={0}` on the inputs only blocks the spinner; typing "-8" persists (`parseNum` parses negatives), and the engine sums raw ranks: −8 skill ranks yields `Math.ceil(-8/2) = −4` PP — a refund — and negative defense ranks both refund points and lower totals. Negative *ability* ranks are legitimate in M&M; negative purchased skill/defense ranks are not. Fix: clamp to ≥ 0 in `updateDefenseRank`/`onSkillRankChange` and defensively in `prepareData`.

**M5 — Modifier catalog data contradicts itself and RAW where it feeds cost math**
`src/data/mutants-and-masterminds/3e/modifiers/flaws.ts:119-128, 253-262, 319-328`; `extras.ts:15-24` (consumed by `powerMath.ts`)
(a) `permanent`, `continuous-flaw`, and `instant` all have `costPerRank: 0` while their own `effects` text says "Reduces cost by 1 per rank" — these duration flaws currently give no discount, overcharging any power that takes them. (b) `accurate` is `costPerRank: 1`, but Accurate is a *flat* extra (1 flat point per rank of Accurate); as modeled, Blast 4 + Accurate 2 costs +8 PP instead of +2 (this exact overcharge is pinned in `mam3e-reference-surface-persistence.test.ts:85` and `mam3e-engine.test.ts:131`). Fix: set the duration flaws to `costPerRank: -1`, and Accurate to `costPerRank: 0, flatCost: 1`. Confidence: high for (a) (self-contradiction), medium-high for (b).

**M6 — Daggerheart HP hydration overwrites any legitimate 6/6 HP state on every prepare**
`src/utils/daggerheartNormalization.ts:280-290` (called from `engine.prepareData`, i.e., on every document update)
The "hydrate legacy starter sheet" HP rewrite is *not* gated by `looksLikeLegacyStarterState`: whenever a class resolves and `hitPoints` equals the default `{6,6}`, HP is reset to class base. A Bard/Rogue (start 5) whose max was raised to 6 (import from another tool, manual JSON edit, future advancement support) snaps back to 5/5 *every save* while at full HP, and recurs forever. Today the sheet doesn't expose a max-HP editor, which limits exposure to imported/edited documents — but the loss is silent and persistent. Fix: gate the HP/evasion hydration on `looksLikeLegacyStarterState` (like the template application) or on a one-time migration flag.

**M7 — Normalization defaults every non-vault domain card to 'loadout' with no LOADOUT_LIMIT check**
`src/utils/daggerheartNormalization.ts:185`
`location: entry.location === 'vault' ? 'vault' : 'loadout'` means a legacy/imported document with 8 location-less cards becomes an 8-card loadout. The mutation layer scrupulously enforces the 5-card cap (`useDaggerheartMutationHandlers.ts:252-309`, tested), but nothing repairs pre-existing violations, and all 8 cards' passive bonuses then apply to evasion/thresholds/spellcast (`daggerheartDerived.ts:366-379`). The UI just renders "Loadout 8/5". Fix: when normalizing, spill cards beyond `LOADOUT_LIMIT` into the vault (stable order), or surface a violation the way M&M surfaces `plViolations`.

**M8 — Risk It All: matched dice should clear ALL marked HP/Stress, not nothing** (confidence: medium)
`src/utils/daggerheartDerived.ts:296-304` (pinned by `daggerheartEngineMath.test.ts:291-296`)
`getDaggerheartRiskItAll` returns `{ survives: true, clears: 0 }` for a critical; the SRD's Risk It All death move treats matching dice as the *best* outcome — stay up and clear all marked HP and Stress. As written, a crit is strictly worse than any Hope result. Fix: return a `clears: 'all'` sentinel (or take marked totals as input) for the critical branch.

## Low

**L1 — M&M advantages are a dead-end surface: no rename, no rank editing, no catalog insert**
`src/systems/mam3e/components/MamSkillsAdvantagesTab.tsx:104-147`; `MamAdvantageBrowserTab.tsx` (browse-only); `useMam3eSheetController.ts:157-160` (no insert callback)
"Add Advantage" creates `{ id, name: 'New Advantage' }` with no way to edit name or rank anywhere, and the Advantages DB tab can't insert. Since ranked advantages cost `rank` PP (engine.ts:152-157), users can never represent Equipment 4, Improved Initiative 2, etc.

**L2 — `Date.now()` ids collide on rapid double-add for powers and advantages**
`src/systems/mam3e/useMam3eMutationHandlers.ts:161-165`; `MamSkillsAdvantagesTab.tsx:140`
Two adds in the same millisecond yield duplicate ids; `updatePowerById`/`removePower` then mutate/delete *both* entries, and React keys collide. Use a counter/`crypto.randomUUID()`.

**L3 — Index keys on removable, editable lists cause focus jumps**
`src/systems/mam3e/components/MamComplicationsTab.tsx:43` (`key={index}` with two inputs per row); `src/systems/daggerheart/components/DaggerheartCharacterBasicsSection.tsx:86` (experiences)
Deleting row N while editing row N+1 reuses the DOM node and the caret lands in the wrong entry. Complications already have optional ids; experiences need stable ids (they're bare strings).

**L4 — mam3e lazy resource loads swallow rejections; tabs hang on "Click to load..." forever**
`src/systems/mam3e/useMam3eSheetResources.ts:43-69, 146-173`
`void loadArchetypes()` etc. leave failures as unhandled rejections with `loaded` false and no retry/error UI. The Daggerheart counterpart correctly tracks `optionsState: 'error'` and renders a message (`DaggerheartSheetHeader.tsx:133-137`) — copy that pattern.

**L5 — d20 vocabulary leaks into Daggerheart roll results**
`src/components/DiceRollButton.tsx:58-59` renders "NAT 20!"/"NAT 1!" for `isCritical`/`isFumble`, so a Daggerheart matched-12s crit shows "NAT 20!" on a 2d12 roll (and matched 1s show "NAT 1!", see H1). Conversely the M&M engine never sets `isCritical` on a natural 20 (`mam3e/engine.ts:248-282`), so real M&M crits are never highlighted. Make the labels come from the engine's flavor, not hardcoded d20 strings.

**L6 — Unclamped resource inputs in the Daggerheart header**
`src/systems/daggerheart/components/DaggerheartSheetHeader.tsx:170-240`; `engine.ts:67-69`
`prepareData` clamps current HP/Stress/Armor only at the top (`Math.min`), so typed negatives persist; Hope has no max although the system caps it at 6. Also `DaggerheartCharacterBasicsSection.tsx:55` uses `parseNum(value, -3)` so blanking a trait silently writes −3. Add `Math.max(0, …)` in `prepareData` and clamp hope to 0–6.

**L7 — Currency normalization silently destroys wealth past 1 chest**
`src/utils/daggerheartInventory.ts:73-77`
`Math.min(MAX_…)` after carry-rollup drops the excess (250 handfuls → 1 chest 5 bags; 100 handfuls of value vanish) on every `prepareData`, with no warning. Carrying caps are SRD, but deleting recorded value on load is lossy — either block at input time or surface the overflow.

**L8 — Unchecked double-casts plumb M&M powers through the Spell type**
`src/utils/dataLoader.ts:426-440` (`as unknown as Spell[]`), `src/systems/mam3e/components/MamPowerBrowserTab.tsx:67` (`spell as unknown as Power`)
The loader lies about the element type and the browser un-lies; any shape drift in the powers module compiles silently and surfaces as `undefined.split` at runtime in `humanizeMamToken`. A `mamPowerToSpellSummary` adapter with real types would close the hole. (The accidental duplicate push of every power via `allPowers` + per-type arrays is currently rescued only by `finalizeLoadedItems` deduping at `dataLoader.ts:64-74`.)

**L9 — Duplication drift hot-spots**
- Toughness-failure banding duplicated: `mam3e/engine.ts:42-71` vs `useMam3eMutationHandlers.ts:193-226` (both share M3's bugs; fix must touch both — or the hook should call the engine).
- Skill→ability mapping triplicated: `mam3e/engine.ts:7-24`, `definition.ts:36-53`, `MamSkillsAdvantagesTab.tsx:9-30`.
- Daggerheart passive-condition trio (`getActivePassiveDomainCards`/`getLoadoutDomainCounts`/`doesPassiveConditionApply`) copied verbatim between `contributionLedger.ts:116-165` and `utils/daggerheartDerived.ts:347-430` — the ledger will silently diverge from derived stats when one is edited.
- Flaw catalog ships duplicate pairs `quirk`/`quirk-flaw` and `unreliable`/`unreliable-flaw` (`flaws.ts`), both selectable in the UI.

**L10 — PL cap validation under-counts attack bonuses and skips skill caps**
`src/systems/mam3e/engine.ts:197, 213`
Close/Ranged attack bonus ignores Close Attack/Ranged Attack advantage ranks and Accurate/Inaccurate modifiers, so over-cap builds using those pass silently; skill caps (rank ≤ PL+5, bonus ≤ PL+10) aren't validated at all. Acceptable as partial validation, but worth a note in `plViolations` docs.

**L11 — `enhanced-trait` defense contribution is unreachable from the UI**
`src/systems/mam3e/engine.ts:121-127`
The defense bonus requires `power.descriptors` naming a defense, but `MamPowersTab` has no descriptor editor and `createEmptyMam3ePower` sets none — the branch only fires for hand-authored data. Either expose descriptors or document the limitation. Also, unknown `checkId` in both engines' `rollCheck` silently rolls at +0 (`mam3e/engine.ts:257-274`, `daggerheart/engine.ts:79-82`).

## Strengths

- **Disciplined immutability and purity throughout the mutation path**: both engines clone before deriving (verified by dedicated non-mutation tests), every sheet handler builds new arrays/objects, and the contribution ledgers are proven side-effect-free via serialize-before/after assertions — no shared-object corruption was found anywhere in either slice.
- **No d20 leakage where it matters most**: M&M ability ranks are used directly as modifiers (never `(score-10)/2`), the "10 +" lives correctly in the attack DC rather than the defense stat, Toughness DC is 15+rank with correct degree banding; Daggerheart evasion is class-based (not 10+dex), thresholds are armor-base+level, and tier/proficiency/loadout/burden/consumable caps all match the SRD and are enforced in both handlers and UI with tests.
- **Excellent normalization and reference-surface design**: the Daggerheart legacy-document normalizer (diacritic-insensitive lookups, subclass→class recovery, manual-fallback preservation) and the M&M "reference-only archetype/complication" pattern are both carefully tested round-trip through export/import, and the domain-card automation metadata is held to an auditable whitelist by the engine test suite.

---

# Chapter G — Code Review: `src/rules` combat engine, `src/registry`, `src/scene`

## Overall assessment

The engine has a genuinely clean architecture: a small system-tagged IR (`EffectInstance`) feeds one pure resolver, per-system attack resolvers reuse it, a participant layer derives order-independent seeded sub-streams, and outcomes land on the grid only via validated event-sourced `apply-damage` intents — no input mutation, no `Math.random` in the combat path, and the determinism invariants are well tested. The risk is concentrated at the seams, not the core: the statblock-prose parser produces wrong damage on shipped SRD data, the headline "per-click seed" fix was applied to only one of the two handlers it claims to fix, and the M&M/Daggerheart "native resolvers" plus multi-target/area/terrain/conditions machinery are unreachable from any product path, so the scene combat loop is effectively 5e-rules-for-everyone (PF2e degrees, Daggerheart duality dice, and M&M crits are absent where combat actually runs). Tests are intent-revealing and green, but they pin the simplified behavior rather than RAW in several of these spots.

## High

**H1. Single-attack seed is still pinned on a miss — the bug commit 9bb2ff6 claims to fix is half-fixed**
`src/components/SceneManager.tsx:343` (vs. comment at `:102-104`)
The commit message and the in-code comment both say a per-click nonce was added "to both the attack and run-round seeds," but the diff and current code only add `attackNonce.current++` to `handleRunRound` (`:357`). `handleCombatAttack` still seeds with `` `${seed}:attack:${selectedScene.events.length}` ``; a miss appends no event, so `events.length` never advances and re-clicking Attack replays the byte-identical miss forever (until some unrelated event lands). Gameplay-visible: the manual Attack button can get permanently stuck on a miss — exactly the symptom the commit describes. Fix: include the same nonce in the attack seed (the existing comment already promises this behavior).

**H2. Prose damage parser sums versatile "or" alternatives — shipped monsters deal ~2-3x damage**
`src/rules/combatants/monsterCombatant.ts:65-79`
The global regex `\((\d+)d(\d+)...\)\s*([a-z]+)?\s*damage` collects *every* parenthesized clause, including mutually exclusive versatile alternatives. Verified against shipped data: the 2024 Hobgoblin longsword ("Hit: 5 (1d8 + 1) slashing damage, or 6 (1d10 + 1) ... if used with two hands") parses to `1d8+1d10+2` (~12 avg vs. 5.5 RAW), and the 2024 Druid quarterstaff parses three clauses into `1d6+1d8+1d8+2` (~14.5 avg vs. 3.5). At least 7 prose-only actions in `src/data/dnd/5e-2024/monsters/**` hit this. Fix: truncate the description at the first `", or N (XdY"` alternative (keeping legitimate `"plus N (XdY)"` rider damage), or parse only the first damage clause plus `plus`-joined clauses.

**H3. Daggerheart resolver rolls 1d20, not the 2d12 Hope/Fear duality dice**
`src/rules/resolver/daggerheartResolution.ts:72`
`resolveDaggerheartAttack` rolls `rng.rollDie(20)` vs. Evasion. Daggerheart attacks are 2d12 (Hope die + Fear die): the sum is the total, matching dice are a critical success, and the higher die determines "with Hope/with Fear" — none of which is modeled, even as result fields. `attackResolution.ts:19` itself describes Daggerheart as "2d12". Gameplay-visible: wrong probability distribution (uniform 1-20 vs. triangular 2-24) and no hook for the Hope/Fear economy, in the commit billed as the "native" Daggerheart resolver. Fix: roll two d12s from the rng, expose `{ hopeDie, fearDie, isCritical, withHope }`, and treat matching dice as a crit/auto-success per SRD.

**H4. PF2e (and 3.5e/PF1e) combat runs under 5e crit rules; the promised degree-of-success layering does not exist**
`src/rules/resolver/attackResolution.ts:17, 99-128`; `src/rules/combatants/characterCombatant.ts:41-47`
The header says PF2e degrees are "layered on top by the caller when a DC is supplied," but no caller in the combat pipeline does: PF2e characters/monsters flow through `buildCharacterCombatant` → scene bridge → `resolveAttack`, which crits only on a natural 20 and doubles *only the dice*. PF2e RAW: beating AC by 10 is a critical hit, nat 20 upgrades a degree, and a crit doubles the *entire* damage (the sheet-roll path in `src/systems/pf2e/engine.ts:64` implements degrees, so the codebase knows the rule). 3.5e/PF1e similarly lose threat ranges, confirmation, and ×2/×3 multipliers on total damage. Fix: accept an optional system/crit-model parameter in `resolveAttack` (degree-of-success for PF2e, multiplier model for 3.5/PF1) or layer it in `characterCombatant`/the bridge as documented.

## Medium

**M1. M&M resolver has no natural-20 crit or natural-1 auto-miss**
`src/rules/resolver/mam3eResolution.ts:88-93`
`isHit = attackTotal >= targetDefense` only. M&M 3e RAW: a natural 20 always hits and is a critical (effect DC +5); a natural 1 always misses. The d20-family resolver models nat 20/1; the M&M one silently drops both, so high-defense targets are unhittable and crits never raise the Toughness DC. Fix: check the natural roll and add +5 to `saveDC` on a crit. (The shortfall→condition thresholds at `:75-81` do match both RAW and the existing `Mam3eEngine.applyToughnessFailure` — verified.)

**M2. The M&M/Daggerheart resolvers, multi-target/area resolution, terrain collection, and `isRoundConclusive` are dead code in the product**
`src/rules/resolver/mam3eResolution.ts`, `daggerheartResolution.ts`, `participantResolution.ts:77-178`, `terrain/sceneTerrain.ts:102`, `tactical/roundDriver.ts:151`
Grep confirms only tests and `rules/index.ts` reference them. In the actual product, `resolveCombatStats` (SceneManager.tsx:294-325) returns `undefined` for M&M/Daggerheart documents (`buildCharacterCombatant` returns `unsupported`), so those systems' tokens silently cannot fight despite the "native combat resolvers" commit; AoE, cleave, functional terrain, and combat-end detection are likewise never exercised. Consequence: monsters with Multiattack collapse to exactly one attack per round (`primaryAttackAction` picks the first parseable single attack, `executeTacticalTurn` attacks once), badly under-damaging RAW. Fix: wire system-dispatching into `SceneCombatStats`/the bridge (or mark these exports experimental), and parse/execute Multiattack counts.

**M3. Conditions and terrain never reach the combat path**
`src/rules/combat/sceneCombat.ts:28-35`; `src/rules/tactical/roundDriver.ts:28-38`
`SceneCombatStats`/`RoundCombatant` carry no conditions, and the bridge never populates `resolveAttack`'s `context`, so the condition IR (Phase 2/3) affects sheet rolls (`src/systems/dnd5e/shared/engine.ts:284`) but not grid combat: a poisoned/prone/restrained combatant attacks normally in `runSceneRound`. Terrain effects (`collectTerrainEffectsAt`) similarly never fold into attack or damage. This is a phased-adoption gap rather than a bug, but it is a player-visible asymmetry between the sheet and the grid for the same condition. Fix: add optional `conditions` to `SceneCombatStats`, compile via `collectDnd5eConditionEffects`, and pass `context.conditions`/terrain tags in the bridge.

**M4. 5e character attack bonus uses STR only, contradicting the file's own contract; all PCs swing a d6**
`src/rules/combatants/characterCombatant.ts:13, 104-115, 237`
The header states "5e: proficiency bonus (by level) + STR/DEX mod," but `baseAttackBonus` always uses STR — a DEX rogue (STR 8) gets prof−1 instead of prof+DEX, and the same STR-only assumption applies to 3.5e/PF1e/PF2e (no finesse/ranged handling). Additionally `weaponDie` defaults to 6 and the only production caller (SceneManager.tsx:313, 390) never passes one, so every PC deals 1d6+STR regardless of equipment. Gameplay-visible: dex-based PCs are crippled on the grid. Fix: take `max(STR, DEX)` for finesse-agnostic baseline (or read the equipped weapon), and derive `weaponDie` from equipment where present.

**M5. Single-range attacks ("range 120 ft.") parse to reach 1 cell**
`src/rules/combatants/monsterCombatant.ts:82-87`
The range regex requires the `N/M` form (`/range (\d+)\s*\/\s*\d+\s*ft/`); single-range prose ("Ranged Spell Attack: +5 to hit, range 30 ft." — present in shipped `src/data/dnd/5e-2014/monsters/cr-2-5.ts:292`, and standard for spell attacks) falls through to the 5-ft default. Verified: Fire Bolt-style prose yields `reachCells: 1`, so caster monsters must stand adjacent to act in the round driver. Fix: also match `/range (\d+)\s*ft/` when the dual form is absent.

**M6. Engine combat never advances the scene round or turn machinery**
`src/components/SceneManager.tsx:352-378`; `src/scene/runtime.ts:259-264`; `src/rules/tactical/roundDriver.ts:96`
`handleRunRound` emits only `apply-damage` events; no `advance-turn`/`turn.advanced` is ever produced, so `state.round` stays 1 forever and `activeTokenId` never moves — the initiative tracker is permanently desynced from autonomous combat, and the `round` fed to `runSceneRound` (and into per-turn seeds) is always 1 (only the click-nonce keeps rounds from replaying identically). `runCombatRound` documents round-increment as the caller's job, and no caller does it. Fix: emit `advance-turn` events per turn record (or a round-complete event) when applying a round's intents.

**M7. PCs never roll initiative; encounter initiative defaults them to a flat 10**
`src/scene/encounterBuilder.ts:343-359`
`buildInitiativeEntries` rolls d20+DEX only for newly generated monster tokens; every pre-existing token (the party) gets `existing ?? 10`. Gameplay-visible: all PCs clump at 10 in tokenId-alphabetical order, and monsters with positive DEX beat them more often than RAW. The character documents (and their DEX) are available to the UI which placed those tokens. Fix: roll seeded initiative for tokens with a character `refId` too, or accept a caller-supplied roll per existing token.

**M8. Manual attacks ignore reach entirely while autonomous turns enforce it**
`src/rules/combat/sceneCombat.ts:104-143`
`resolveSceneAttack` resolves any attacker against any target with no distance/reach check, while the same module's `runSceneRound` (via `scoreTargets.inReach`) refuses unreachable targets. A melee goblin can be ordered to hit a target across the map; the two code paths in one file enforce different rules. Fix: compare `gridDistance(attacker.position, target.position)` against `attackerStats.reach` and return an honest "out of reach" log.

**M9. `set-die` is declared in the IR but silently ignored by the resolver**
`src/rules/ir/types.ts:61`; `src/rules/resolver/resolve.ts:134-236`
`foldTarget` handles add/subtract/set/multiply/min/max/add-die/advantage/disadvantage/note; `set-die` matches no branch, contributes nothing, yet still appears in the ledger as if applied. RFC 003's worked flow explicitly says "damage → weapon die (set-die)", so a compiler following the RFC would silently lose its weapon die with no error (the resolver elsewhere prides itself on failing closed *visibly*, e.g. unknown condition kinds). Fix: implement it (set-die establishes the dice term) or remove it from `EffectOperation` until supported.

## Low

**L1. Named-bonus-type fold drops typed penalties when a same-type bonus exists**
`src/rules/resolver/resolve.ts:158-171` — `Math.max` over *signed* values per `bonusType` means a −2 enhancement penalty coexisting with a +2 enhancement bonus vanishes; d20/PF RAW applies penalties alongside the highest bonus (the PF2e bucket branch at `:176-188` gets this right; the bonusType branch doesn't). No compiler currently emits typed penalties, so latent. Fix: mirror the PF2e branch (max of bonuses + min of penalties per type). Confidence: medium.

**L2. Participant seed derivation is collision-prone and nonce-free for duplicate targets**
`src/rules/resolver/participantResolution.ts:29-38, 77-91` — ids are joined with unescaped `::`/`->` (actor `"a->b"` + target `"c"` collides with `"a"` + `"b->c"`), and `resolveMultiTargetAttack` never uses its own `nonce` parameter, so listing the same target twice (two strikes at one foe) yields identical rolls. Practical risk is low (UUID/slug ids), but the documented "own stream per pair" invariant is violable. Fix: length-prefix or hash the parts; pass the target index as nonce.

**L3. `critOn < 20` would make non-20 naturals auto-hit**
`src/rules/resolver/attackResolution.ts:99-102` — `isHit = isCriticalHit || …` means with `critOn: 19` a natural 19 auto-hits even when the total misses AC; in 5e an expanded crit range does not auto-hit (only nat 20 does). Latent: nothing sets `critOn` today. Also `:125-128` doubles the already-rolled dice rather than rolling fresh crit dice — same mean, different distribution than RAW "roll twice". Fix: separate `autoHitOn` (20) from `critOn`; roll crit dice.

**L4. `npc`/`object` are factions hostile to everything**
`src/rules/combat/sceneCombat.ts:41-52`; `src/rules/tactical/targetScoring.ts:84-86` — `isHostile` is plain faction inequality, so the moment NPC/object tokens become stat-resolvable they will attack and be attacked by both sides. Today unreachable (UI's `resolveCombatStats` only handles monster/character). Fix: an explicit hostility matrix or ally-set.

**L5. `cloneMarker` shares the `effects` array by reference**
`src/scene/runtime.ts:568-573` — clones copy `position` but not `effects`, so the same array object is aliased between event payloads, `initialState`, and every folded state; a consumer mutating folded marker effects would corrupt the event log retroactively. Fix: spread `effects: marker.effects?.map(e => ({...e}))`.

**L6. `buildCharacterCombatant` accepts but ignores `options.faction`**
`src/rules/combatants/characterCombatant.ts:187-196` — the option is declared and passed by tests (`characterCombatant.test.ts:148`) but never read; faction is later derived from token kind in the bridge. Remove the option or honor it.

**L7. Structured/prose normalization is all-or-nothing**
`src/rules/combatants/monsterCombatant.ts:97-112` — an action with structured `damage` but missing `attackBonus` (or vice versa) discards the structured half and reparses prose wholesale; prose without parseable numbers then yields no attack at all. Also flat-damage prose ("Hit: 1 piercing damage") parses to an attack with zero damage — no such statblock ships today (verified), but 5e SRD has them (Frog). Fix: merge field-by-field.

**L8. `tokensInArea` tests only the origin cell of multi-cell tokens**
`src/rules/resolver/areaTargeting.ts:50-52` — a Large/Huge creature whose origin cell is outside a burst is excluded even when its body overlaps it. Fix: test the full footprint (`token.size`).

**L9. M&M `targetDefense` contract is ambiguous**
`src/rules/resolver/mam3eResolution.ts:25-34` — the doc says "Target's active defense (Dodge/Parry)" while M&M's attack DC is 10 + defense rank, and the data model stores `{ rank, total }` (`src/systems/mam3e/data-model.ts:48-49`); with no production caller, future wiring can plausibly feed either. The exported `Mam3eDefenseKind` type is also unused. Fix: document/rename to `defenseClass` and state the 10+rank expectation. Confidence: medium.

## Strengths

- **Determinism discipline is real and verified**: a correctly implemented mulberry32 (measured ≤~2% deviation in-stream and across derived seeds), order-independent per-participant sub-streams with replay invariants pinned by tests, RNG-before-event so the event log replays purely, and no `Math.random` anywhere in the combat path.
- **Honest manual boundaries instead of faked rules**: situational condition effects become `note`+`manualBoundary` rows, unsupported systems return reasons rather than wrong numbers, unknown condition kinds and terrain operations fail closed — a consistent and unusual degree of epistemic honesty in a rules engine.
- **Clean layering with pure functions**: IR → resolver → attack resolvers → participant layer → tactical → bridge → event-sourced scene fold, with no input mutation (verified in the round driver and bridge) and the ledger as a free projection of the same primitive, exactly as RFC 003 intends; the 200-test suite runs green and documents intent well.

---

# Chapter H — Code Review: Scene/Combat System, Scene UI, and UI Component Library

## Overall assessment

The scene system's event-sourced core (`src/scene/runtime.ts`) is well-designed: validate-then-apply folding, defensive cloning, and a versioned debounced persistence layer make scene state hard to corrupt. However, the recent combat wiring has two significant correctness bugs: the per-click seed nonce that commit `9bb2ff6` claims to add to "both the attack and run-round seeds" was only added to Run Round, so the exact bug described in that commit (re-clicking Attack replays the identical miss) still exists; and the new statblock prose parser sums "X damage, or Y damage (two-handed)" alternatives, roughly doubling damage for seven versatile attacks in shipped 2024 data. There are also several smaller state-machine and stale-UI-state issues (round inflation with empty initiative, initiative inputs clobbered by a sync effect, dead/stale combat targets). The UI component library is thin and mostly sound; no XSS sinks were found (no `dangerouslySetInnerHTML`/`innerHTML` anywhere in app code).

## High

### H1. Manual Attack seed has no nonce — repeated attacks after a miss replay the identical roll
**`src/components/SceneManager.tsx:343`** (cf. `:357`, `:100-104`)
`handleCombatAttack` seeds with `` `${seed}:attack:${selectedScene.events.length}` ``. A miss — and also a 0-damage hit, since `attackToDamageIntent` (src/rules/resolver/sceneCombat.ts:25-27) returns no intent when `damage <= 0` — appends no event, so `events.length` is unchanged and `participantRng(seed, attackerId, targetId)` produces byte-identical rolls on every re-click. The `attackNonce` ref was added with a comment explicitly describing the Attack button ("otherwise re-clicking Attack would reproduce the same miss") but is only consumed in `handleRunRound` (line 357); commit `9bb2ff6`'s message claims both seeds were fixed, but its diff only touches the round seed. User impact: an Awakened Shrub (the exact fixture from the commit) that misses or rolls 1d4−1 = 0 can never land a different roll via the Attack button until some other event changes the log.
**Fix:** include `attackNonce.current++` in the attack seed, e.g. `` `${seed}:attack:${selectedScene.events.length}:${attackNonce.current++}` ``.

### H2. Prose damage parser sums "…, or N (XdY+Z) … two hands" alternatives — versatile monsters deal ~double (or triple) damage
**`src/rules/combatants/monsterCombatant.ts:65-76`** (consumed at `:158-198`)
`parseAttackFromDescription` collects every `(\d+d\d+…) damage` clause in the description, and `monsterDamageEffects` emits dice/modifier effects for **all** of them. That is correct for "plus 16 (3d10) radiant damage" riders, but wrong for one-of alternatives. Shipped data is affected: 7 actions across `src/data/dnd/5e-2024/monsters/humanoids/cr-0-5.ts`, `humanoids/cr-6-10.ts`, and `fey/cr-6-10.ts` (none of which carry structured `attackBonus`/`damage` fields, so prose is the only source). Example: the Warlord's Longsword "Hit: 10 (1d8 + 4) slashing damage, or 11 (1d10 + 4) … two hands" becomes 1d8+1d10+8; the Druid's Quarterstaff (`humanoids/cr-0-5.ts:626`, three "or" alternatives) becomes 1d6+1d8+1d8+2 — roughly triple. User-visible: silently inflated hits from common monsters in scene combat.
**Fix:** truncate the description at the first `, or ` alternative (or stop collecting damage clauses once an `\bor\b` separator precedes the next match), keeping genuine `plus` riders.

## Medium

### M1. "Next Turn" with tokens but no initiative inflates the round counter on every click
**`src/scene/runtime.ts:259-264`** (event built at `:210-215`, reachable via `InitiativeTracker.tsx:29`)
With an empty initiative list, `getNextInitiativeTokenId` returns `undefined`, validation passes (`nextTokenId` is only validated when truthy), and apply evaluates `state.initiative[0]?.tokenId === event.payload.nextTokenId` → `undefined === undefined` → `round += 1`. The Next Turn button is only disabled when there are zero tokens, so placing one token and clicking Next Turn three times shows "Round 4" without initiative ever being set; the bogus round also feeds the Run Round seed (`:round:${state.round}:`) and is persisted in the event log.
**Fix:** in the `turn.advanced` case, only increment when `event.payload.nextTokenId != null` (or guard `state.initiative.length > 0`).

### M2. Initiative inputs are silently reverted by the state-sync effect
**`src/components/SceneManager.tsx:213-235`**
The effect unconditionally overwrites `initiativeValues[tokenId]` with the folded state's value for every token in `state.initiative`, and it runs whenever `state` **or `selectedTokenId`** changes. Flow: an encounter rolls initiative → user types a new value (e.g. "18") → user clicks a token on the grid to pick an attacker (changes `selectedTokenId`) or any event is appended (moving a token, an attack hitting) → the typed value snaps back to the stored one before "Set Order" is pressed. During combat (events appended constantly) edits are effectively un-typeable.
**Fix:** seed defaults only for unknown tokens (`next[entry.tokenId] ??= String(entry.value)`), or track a "dirty" flag per input and only sync non-dirty entries; drop `selectedTokenId` from this concern by splitting the deselect logic into its own effect.

### M3. Manual attack path has no liveness guards, and `combatTargetId` goes stale on death/scene switch
**`src/rules/combat/sceneCombat.ts:112-122`, `src/components/SceneManager.tsx:327-334`, `src/components/scene/CombatPanel.tsx:40-43`**
`resolveSceneAttack` never checks `hp.current > 0` for attacker or target, and `combatReadyIds` ignores HP. Consequences: (a) a downed (0 HP) selected token can still attack; (b) when the chosen target dies it disappears from the target `<Select>` options (filtered at CombatPanel.tsx:40-42) but `combatTargetId` is never cleared, so the select renders blank while the Attack button stays enabled (`canAttack` only checks `combatReadyIds`) and clicking it beats the corpse, appending damage events and "X hits Y for N" log lines; (c) a pre-HP legacy/imported character token resolves stats but has no `hp`, so `token.damaged` apply (runtime.ts:241-247) silently discards damage while the log claims a hit — the token is unkillable. Run Round is consistent (skips downed/HP-less); the manual path is not. Also `combatTargetId`/`combatLog` persist across scene switches, showing another scene's log.
**Fix:** return a "target is down" outcome from `resolveSceneAttack` when either side has `hp.current <= 0` (or no `hp`); clear `combatTargetId`/`combatLog` when the selection dies or `selectedSceneId` changes.

### M4. Manual attack ignores reach/distance, unlike the auto-round
**`src/rules/combat/sceneCombat.ts:124-131`** — `resolveSceneAttack` resolves a hit regardless of grid distance, even though `SceneCombatStats.reach` is resolved and the tactical executor (`tacticalExecutor.ts:75-87`) refuses out-of-reach targets with `move-to-engage`. A reach-1 melee shrub can hit a target 10 cells away via the Attack button, but the same pairing in Run Round only "moves to engage". Inconsistent rules application visible to users. Confidence: medium (could be an intentional DM override, but nothing in the UI labels it as such).
**Fix:** compute Chebyshev distance between tokens and return an "out of reach" outcome (or surface an explicit "force attack" affordance).

### M5. Every render re-folds every scene's full event log; grid fully re-renders per keystroke
**`src/components/SceneManager.tsx:703-704`, `src/components/SceneGridView.tsx:18-19, 45-101`, `src/components/SceneManager.tsx:186-200`**
The scene list sidebar calls `foldSceneEvents(scene)` inline for all scenes on every render, and SceneManager re-renders on every keystroke of its ~15 controlled inputs. Event-sourced logs grow without bound (every move/attack/round appends events), so cost is O(total events across all scenes) per keystroke. `SceneGridView` is unmemoized and rebuilds `tokensByCell` plus width×height cells (with an O(cells×markers) `markers.find`) each time, and `pendingEncounterSelections` is a fresh array identity each render, defeating the `encounterPlan` useMemo. Typing in the scene-name field will visibly lag once a few scenes have long combat histories.
**Fix:** memoize per-scene fold summaries (e.g. `useMemo` keyed on `scenes`), wrap `SceneGridView` in `React.memo` with stable callbacks, and memoize `pendingEncounterSelections`.

## Low

### L1. Prose attack parser misses other legitimate SRD formats (silent +0/0-damage degradation)
**`src/rules/combatants/monsterCombatant.ts:59-94`** — The regexes require ASCII `+/-`, the phrase "to hit", parenthesized dice, and `range N/M ft`. Real SRD prose that fails: flat damage ("Hit: 1 piercing damage" — Bat/Rat), Unicode minus "−" (already present in 7 places in this repo's spell/equipment data, though not yet in monsters), actual 2024-format "Melee Attack Roll: +4, reach 5 ft." (no "to hit"), and single-range "range 60 ft.". All currently shipped monster fixtures parse, so impact is limited to future/imported data — but failures reproduce the exact "+0 to hit / for 0" symptom commit `23b8f94` set out to fix, silently. **Fix:** accept `[+\-−]`, an alternation for `Attack Roll:\s*([+-]\d+)`, a flat-damage fallback (`Hit:\s*(\d+)\s+\w+ damage`), and `range (\d+)(?:/\d+)? ft`. Confidence: high on the gaps, medium on near-term impact.

### L2. Run Round / Attack log can diverge from applied state; intent failures swallowed
**`src/components/SceneManager.tsx:363-377`, `:346-349`** — In `handleRunRound`, `result.issues` from each `resolveSceneAction` are discarded and `setActionIssues([])` then clears any message, so a failed intent drops damage silently while `outcome.log` (built unconditionally from the simulation) still reports the hit; `handleCombatAttack` similarly logs `outcome.log` even when `emitSceneAction` fails. **Fix:** surface per-intent issues and annotate or suppress log lines whose events were rejected.

### L3. Clearing an initiative input silently drops that token from initiative
**`src/components/SceneManager.tsx:476-482`** — `Number.parseFloat('')` is NaN and the entry is filtered out, so "Set Order" removes the token from initiative (and from Run Round's primary ordering) with no feedback. **Fix:** fall back to the previous/default value instead of filtering, or flag the row as invalid.

### L4. `appendSceneEvent` throws inside a `setState` updater — divergence becomes a crash
**`src/hooks/useScenes.ts` (`appendSceneEvent`), `src/scene/runtime.ts:107-116`** — The runtime helper throws on validation failure, and useScenes calls it inside the `setScenes` updater. SceneManager always resolve-validates against its prop snapshot first, so this only fires if snapshot and store diverge (e.g. concurrently imported/corrupted scene) — but then the user's click takes down the React tree to the ErrorBoundary instead of showing an action issue. **Fix:** catch in the updater and route to the hook's `error` state. Confidence: medium (no concrete trigger today).

### L5. Monsters added in separate encounter batches get duplicate display names
**`src/scene/encounterBuilder.ts:141-169`** — `monsterTotals`/`monsterOrdinals` are scoped to one build, so adding "2 Goblins" twice yields two tokens named "Goblin 1" and two named "Goblin 2" (token ids stay unique). Combat logs ("Goblin 1 hits Goblin 1…") become ambiguous. **Fix:** seed the ordinal from existing same-`refId` token names in the folded state.

### L6. Scene import silently drops invalid scenes (or does nothing) with no feedback
**`src/components/SceneManager.tsx:553-575`** with `collectValidScenes` in `src/utils/sceneStorage.ts` — structurally invalid scenes are skipped during parse; if all candidates are invalid, `importScenes` returns `[]`, `onAddScenes` no-ops, and `setActionIssues([])` clears any prior message — the import appears to succeed while importing nothing. **Fix:** report "imported N of M scenes" / error when zero.

### L7. ConfirmDialog focus trap is escapable and background is not inert
**`src/components/ui/ConfirmDialog.tsx:39-67`** — The Tab handler only wraps when `document.activeElement` is exactly the first/last focusable; after clicking the backdrop (focus on `body`), Tab moves into background content, which is also never `aria-hidden`/`inert` for screen readers; focus is not restored if the component unmounts while open. Escape/initial-focus/restore-on-close all work. **Fix:** on Tab with focus outside the dialog, focus the first element; mark the app root inert while open.

### L8. `TabsTrigger` renders `<button>` without `type="button"`
**`src/components/ui/Tabs.tsx:72`** — Default button type is `submit`; inside a form, switching tabs would submit it. No current usage places Tabs inside the one `<form>` (SignIn), so this is latent in a shared library component. **Fix:** add `type="button"` (allow override via props spread order).

### L9. Theme read from localStorage is an unvalidated cast
**`src/hooks/useTheme.ts` (initializer), `src/components/ui/ThemeToggle.tsx:21-23`** — `localStorage.getItem(...) as Theme` accepts any string; a corrupted value puts an arbitrary class on `<html>` and renders an icon-less ThemeToggle (no branch matches). It self-heals on the next click (`cycle` falls through to `'light'`). **Fix:** validate against `['light','dark','system']` on read.

### L10. SceneGridView: multi-cell tokens render at anchor only; no overlap rules for manual placement; ARIA grid structure
**`src/components/SceneGridView.tsx:107-114, 37-66`; `src/scene/runtime.ts:293-324`** — Encounter building reserves a size×size footprint (encounterBuilder.ts:395-412), but the grid draws a size-2+ monster as a single 7×7-px chip in its anchor cell, and `place-token`/`move-token` validation checks only bounds, so other tokens can be placed/moved onto an occupied footprint — the engine's positions and what the user sees disagree for large monsters. Separately, `role="grid"` has `gridcell` children without `role="row"` wrappers and every cell is `tabIndex={0}` even when `onCellActivate` is absent (120 tab stops on a default grid). **Fix:** render the footprint (grid-area span), validate overlap on place/move (or accept stacking explicitly), add row wrappers and roving tabindex.

### L11. Duplication and test-only exports
- `positiveIntegerOrDefault` duplicated: `src/components/SceneManager.tsx:899-902` vs `src/scene/runtime.ts:289-291`.
- Coordinate-key helper duplicated: `coordinateKey` (`src/components/SceneGridView.tsx:148-150`) vs `cellKey` (`src/scene/encounterBuilder.ts:414-416`).
- `loadScene`/`upsertScene` (`src/utils/sceneStorage.ts:71-89`) and `isRoundConclusive` (`src/rules/tactical/roundDriver.ts:151`, re-exported from `src/rules/index.ts:83`) are used only by tests — notably the UI never calls `isRoundConclusive`, so combat has no "combat over" surface; Run Round stays enabled forever among 2+ stat-resolvable tokens even when one faction (or everyone) is down.

## Strengths

- **Disciplined event sourcing.** Every mutation goes through intent → validate → event → fold, with validation re-run on append and defensive cloning throughout (`runtime.ts`); `handleRunRound` and `buildEncounterSceneEvents` correctly thread a working scene copy so multi-event sequences get consistent sequence numbers.
- **Thoughtful determinism design.** Per-participant RNG sub-streams keyed by `(seed, actor, target)` make outcomes independent of target order; the round driver derives per-turn seeds; encounter initiative gets per-token streams — the seeding architecture is right even where one call site (H1) misuses it.
- **Robust persistence layer.** `useDebouncedPersistence` versions writes to drop stale flushes, and flushes on unmount/pagehide/visibility-hidden; `sceneStorage` parses-not-casts on hydration so one malformed record can't poison the store.

---

# Chapter I — Code Review: App shell, root components, and `components/sheet/*`

## Overall assessment

The area is in good shape architecturally: a clean document-centric core (`App.tsx` orchestrates `useDocuments`/`useCampaigns`/`useScenes` + sync hooks), system-agnostic presentational components, and a debounced persistence layer with pagehide/visibility flushes that is genuinely careful about data loss. Rendering is XSS-safe (no `dangerouslySetInnerHTML`, no `as any` in scope), effects consistently use cancellation flags, and boundary validation ("parse, don't cast") guards import/load paths. The biggest risks are concentrated in `App.tsx`'s global keyboard shortcuts (which fire while typing and can silently revert documents), a destructive no-confirm delete in the header, the Point Buy planner's silent overwrite semantics, and per-keystroke O(all-data) serialization work wired into `App.tsx` effects. The catalog "browser" components are duplicated scaffolding of one another and render unvirtualized full datasets, which is tolerable today but will degrade as SRD content grows.

## High

### H1. Global keyboard shortcuts fire while typing in inputs; Ctrl+Z hijacks native text undo and reverts the whole document collection
**Files:** `src/App.tsx:315-356`, `src/hooks/useKeyboardNavigation.ts:13-29`
The window-level `keydown` handler matches only key+modifiers and never checks whether the event originated in an editable element (`input`/`textarea`/`contentEditable`) or `event.isComposing`. Pressing Ctrl+Z while typing in any text field (character name in `SheetHeader`, campaign notes textarea, search boxes, even the sign-in password field) calls `event.preventDefault()` — suppressing the browser's native text undo — and instead runs `useDocuments().undo()`, which restores the previous snapshot of the **entire character collection** (`useDocuments.ts:266-283`). The user thinks they un-typed a character; in reality document state was silently reverted (possibly an HP/spell-slot change made minutes earlier), and the focused field's text doesn't visibly change if it isn't document-bound. Similarly, Escape pressed in any sheet input (or to dismiss a native select/IME) triggers "back to character list" navigation.
**Fix:** In `useKeyboardNavigation`, bail out early when `event.target` is an editable element (except perhaps Escape blurring the field) and when `event.isComposing`; alternatively require shortcuts to opt into firing inside inputs.

## Medium

### M1. Header "Delete character" is one click with no confirmation
**Files:** `src/components/AppHeader.tsx:143-152`, `src/App.tsx:232-235, 384`
Every other destructive action in the app ("Clear All Characters", "Delete Campaign", "Delete Scene") routes through `showConfirm`, but the trash button in the sheet header calls `onDelete` → `deleteDocument(id)` directly and immediately navigates back to the list. A misclick (it sits beside Import/Export icons) deletes the open character instantly. Undo can recover it, but undo is non-obvious in the moment and a subsequent edit truncates the redo path.
**Fix:** Route `handleDeleteDocument` through the same `showConfirm` dialog used for the other destructive actions, or show an "Undo" action in the deletion toast.

### M2. Point Buy planner silently misrepresents and then overwrites existing ability scores
**File:** `src/components/sheet/AbilityScoreGrid.tsx:54-60, 100-110, 119-127, 244-250`
`buildPointBuyDraft` falls back to an all-8s draft whenever current attributes aren't a valid 27-point-buy set (e.g., any leveled character with a 16+, racial bonuses, or rolled stats). Two consequences: (1) switching to the "Point Buy" tab immediately *displays* all scores as 8 (line 246-247 reads the draft) while the stored values are unchanged — misleading; (2) the first click on any single +/- button commits `onUpdate({...attributes, ...draft})` (line 126), overwriting **all six** stored ability scores with the 8-based draft, not just the one the user touched. For an existing character this destroys their scores without warning (recoverable only via undo). The unit test only covers the already-valid all-10s case.
**Fix:** When current attributes are not point-buy-valid, show an explicit "scores will be reset to 8s for planning — Apply to commit" state, and/or require an explicit "Apply" button (as Standard Array already does) instead of committing on every +/- click.

### M3. Per-keystroke full-data serialization in App effects (sync-queue parse + storage-usage stringify)
**File:** `src/App.tsx:116-119, 173-191`
Both blocks re-run on **every** `documents`/`campaigns` state change — i.e., every keystroke in a controlled sheet field (name, HP, etc., since sheets call `updateDocument` per change) and every keystroke in campaign notes (`CampaignManager.tsx:351` calls `onUpdateCampaign` per keystroke). (1) `getPendingSyncCount()` re-reads and `JSON.parse`s + re-validates the entire queued-documents and queued-campaigns snapshots from localStorage (`syncEngine.ts:207-246, 419-451`) — when signed-in with a populated queue this is megabytes of parsing per keystroke on the main thread. (2) `storageUsageBytes` `JSON.stringify`s the *entire* document collection and constructs a `Blob` per keystroke. Together with `useDocuments`' own snapshot cloning, typing in a sheet does several full-collection serializations per character typed.
**Fix:** Debounce/`useDeferredValue` both computations; have the sync layer expose a cheap counter (queue lengths stored separately) instead of parsing payloads; compute storage usage only when the list view is visible or on persistence events.

### M4. Exports use `data:` URIs, which Chrome caps (~2 MB) — "Export All" can silently fail right when it matters
**File:** `src/App.tsx:193-199, 248-260`
`triggerJsonDownload` builds `data:application/json;charset=utf-8,${encodeURIComponent(payload)}`. Percent-encoding inflates the payload ~1.5-3x, and Chromium rejects anchor `data:` URLs beyond ~2 MB. The app explicitly supports up to ~5 MB of character data and tells users near the limit to "Export and remove unused characters" (`CharacterListView.tsx:105-110`) — exactly the situation where this export will silently do nothing (the `catch` won't fire; the click just no-ops). Confidence: medium (depends on browser version, but the Blob approach is strictly safer).
**Fix:** Use `const url = URL.createObjectURL(new Blob([jsonPayload], {type: 'application/json'}))`, click, then `URL.revokeObjectURL(url)`.

### M5. Campaign persistence failures are unhandled and invisible
**Files:** `src/hooks/useCampaigns.ts:15-17` (adjacent, wired from App), `src/utils/campaignStorage.ts:38-45`, `src/App.tsx:359-360`
`saveCampaigns` calls `localStorage.setItem` bare — on quota exhaustion (plausible given documents share the same 5 MB origin quota) it throws inside the debounced persistence callback, where nothing catches it: an uncaught exception, no error state, no banner. Contrast `useDocuments.persist` (`useDocuments.ts:102-108`), which catches and surfaces the error. `App.tsx` only surfaces `error ?? sceneError`, so campaign edits (incl. notes) can silently stop persisting; users discover the loss on next reload.
**Fix:** Wrap the `persist` callback in try/catch, add an `error` field to `useCampaigns`, and include it in `appError` in `App.tsx`.

### M6. Catalog row selection is mouse-only (clickable `div`s, no keyboard/AT access)
**Files:** `src/components/EquipmentBrowser.tsx:119-124`, `src/components/MonsterBrowser.tsx:148-153`, `src/components/SpellBrowser.tsx:200-205`
The primary action of these browsers — selecting an item/spell/monster into the sheet — is an `onClick` on a plain `div` with no `role`, `tabIndex`, or key handling. Keyboard and screen-reader users cannot add equipment or spells at all (FeatBrowser, by contrast, uses real `<button>`s). Related: keyboard-focusable but *invisible* controls in `CharacterCard.tsx:63-66` (clone, `opacity-0` until hover) and `CampaignManager.tsx:265-273` (remove member), and the unlabeled damage/heal amount input (`DamageHealControl.tsx:27-42`, placeholder "±" only).
**Fix:** Use `<button type="button">` for the cards (or add `role="button"`, `tabIndex={0}`, Enter/Space handlers); add `focus-visible:opacity-100` to hover-revealed buttons; add `aria-label="Damage or heal amount"` to the input.

## Low

### L1. `DiceRollButton`: unhandled roll rejection and overlapping dismiss timers
**File:** `src/components/DiceRollButton.tsx:21-31`
If `onRoll()` rejects, the `try/finally` resets `rolling` but the rejection escapes `handleRoll` (an `onClick` handler) as an unhandled promise rejection with zero user feedback. Separately, each roll schedules an independent 4 s `setTimeout(() => setResult(null))` without clearing the previous one: roll again within 4 s and the *first* timer dismisses the *second* result early; the timer is also never cleaned up on unmount.
**Fix:** Add a `catch` (toast or inline error), store the timer id in a ref, clear it before scheduling and in an unmount cleanup.

### L2. Wrong XP shown for fractional CRs in the Monster filter
**File:** `src/components/MonsterBrowser.tsx:45-48`
`cr * 100` yields "CR 0.125 (12.5 XP)", "CR 0.25 (25 XP)", "CR 0.5 (50 XP)". Correct 5e values are 25, 50, and 100 XP (and CR 0 is 0/10 XP, not 0 via formula). The data already carries `experiencePoints`, so the formula is unnecessary as well as wrong.
**Fix:** Look up XP from the monsters in that CR bucket (`monster.experiencePoints`) or a proper CR→XP table; also render fractional CRs as 1/8, 1/4, 1/2.

### L3. Ctrl+N "Create new character" is a reserved browser shortcut
**File:** `src/App.tsx:323-330`
Chrome/Edge do not deliver Ctrl+N to pages (it opens a new window); the advertised shortcut silently doesn't work in the most common browsers, and on macOS none of the `ctrl` shortcuts map to Cmd (`useKeyboardNavigation` checks only `ctrlKey`, not `metaKey`).
**Fix:** Pick a non-reserved combo (e.g., Alt+N) and treat `metaKey` as the primary modifier on macOS.

### L4. `EquippedItemsSection` keys unequip/attune by `itemId`, not slot; unused `onEquip` prop
**File:** `src/components/EquippedItemsSection.tsx:33-44, 85, 107`
The callbacks pass `item.itemId`; the 5e handler then filters/maps **all** equipment entries with that id (`useDnd5eSheetActionHandlers.ts:258-272`), so two identical items in different slots (ring1/ring2) would be unequipped/attuned together. Today's equip flow replaces per-slot so duplicates are hard to create (hence Low / confidence medium), but the API invites the bug. Also `onEquip` is declared in `Props` but never destructured/used — dead code.
**Fix:** Pass the `slot` (unique per entry) through the callbacks; remove `onEquip` or implement it.

### L5. Unvirtualized full-dataset browsers with per-keystroke haystack rebuilding
**Files:** `src/components/SpellBrowser.tsx:48-80, 198-278`; `MonsterBrowser.tsx:25-43`; `EquipmentBrowser.tsx:32-43`; same pattern in the MaM browsers
With no filters active these render every entry (~220+ spell cards for 5e-2014) as full multi-row cards, and each keystroke re-joins/lowercases the entire searchable text for every item (and `searchTerm.toLowerCase()` is recomputed inside the loop, twice in `EquipmentBrowser`/`MonsterBrowser`). Acceptable at current data sizes, but it is the listed scaling risk for "hundreds of spells/feats/monsters".
**Fix:** Hoist the lowercased term, precompute per-item haystacks in a `useMemo` keyed on the dataset, wrap the search term in `useDeferredValue`, and consider windowing or pagination for the result list.

### L6. Number inputs trust `min`/`max` attributes that don't constrain typed input
**Files:** `src/components/CurrencyEditor.tsx:39-47` (negative currency persists), `src/components/InventoryManager.tsx:110-121` (quantity 0/negative → negative total weight), `src/components/RestControls.tsx:47-55` (no upper bound on exhaustion)
HTML `min`/`max` only affect spinners/validation styling; typed values like `-50` are parsed and written straight into the character document.
**Fix:** Clamp in the change handlers (`Math.max(0, ...)` etc.), as `DeathSavesTracker` already does.

### L7. No error boundary around the lazy system sheet; redundant double `ErrorBoundary` at the root
**Files:** `src/components/SystemSheetRenderer.tsx:24-36`, `src/App.tsx:425, 589-597`, `src/main.tsx:30-38`
A chunk-load failure of one system's lazy `SheetComponent` (stale deploy, flaky offline cache) propagates to the app-root `ErrorBoundary`, replacing the entire UI including the header/back navigation; "Try Again" cannot recover a rejected `React.lazy` module in-session, so the only path is a full reload. Meanwhile the root is wrapped in `ErrorBoundary` twice (main.tsx and inside `App`), which is harmless duplication.
**Fix:** Wrap `<SystemSheetRenderer>` in its own `ErrorBoundary` with a "reload sheet / back to list" fallback; drop one of the root boundaries.

### L8. Dead code / duplication roll-up
- `src/components/MonsterStatBlock.tsx:152-156` — the `'—'` branch is unreachable (guarded by `languages.length > 0`); line 62-63 renders "+-2" for negative HP modifiers.
- `EquipmentBrowser`/`FeatBrowser`/`SpellBrowser`/`MonsterBrowser` re-implement identical search-bar/filter/clear/result-count scaffolding; the three MaM browsers do the same — a shared `CatalogBrowser` shell would remove ~300 duplicated lines.
- `GameSystemSelector.tsx:86-96` and `SystemStatusDashboard.tsx:56-66` duplicate `supportBadgeStyles`/`supportBadgeLabels` (and near-duplicate category icon maps); `SystemStatusDashboard.tsx:95-103`'s hardcoded initial-state system list must be kept manually in sync with `KNOWN_SYSTEM_IDS` (a missing key would throw at line 195).
- `src/components/CharacterCard.tsx:68` — `e.stopPropagation()` is unnecessary (the clone button is not nested in the open button).

## Strengths

- **Serious data-loss hygiene in the persistence layer:** debounced writes carry version tokens to drop stale writes, flush on unmount/`pagehide`/`beforeunload`/`visibilitychange`, and `App.handleReturnToList` explicitly flushes all three collections before navigation; import/load paths validate per-record instead of casting.
- **Clean effect discipline and no security sinks in scope:** every async effect uses a cancellation flag, the service-worker update flow correctly distinguishes first-install from user-consented updates, and there is no `dangerouslySetInnerHTML`, unsafe `href`, or `as any` anywhere in the reviewed components.
- **Consistent accessible patterns in the newer components** (MaM browsers, dialogs, toasts): labeled inputs, `aria-live` result counts, focus restoration and a focus trap in `ConfirmDialog` — the older browsers just need to be brought up to the same standard.

---

# Chapter J — Code Review: `src/types` + `src/data` audit

## Overall assessment

The type layer is clean TypeScript (strict mode, no `any` in `src/types`, `tsc --noEmit` passes) and the newer content pipelines (Daggerheart, 5e-2024 spells, M&M powers) are well-built with consistent per-entry source attribution. However, the unified `Character` model is effectively dead code while real persistence flows through `CharacterDocument` + per-system black boxes, the equipment domain has three drifted, overlapping type families with genuinely colliding IDs that resolve to *different stat blocks* depending on access path, and persisted documents carry no working schema-version/migration story. Most seriously, the bundled content does not live up to the repo's own open-content policy: Product Identity monsters and deities ship under false "SRD" attributions, and the 3.5e feat corpus contains ~280 fabricated entries mass-labeled `source: 'PHB'` — which the policy whitelist then waves through.

## Legal / Compliance

**LC-1. WotC Product Identity monsters shipped with false `source: 'SRD 5.2'` attribution**
`src/data/dnd/5e-2024/monsters/aberrations/cr-6-10.ts:6-10` (`mind-flayer-2024`, "Mind Flayer") and `cr-11-plus.ts:8` (`elder-brain-2024`, "Elder Brain"). Mind flayers/illithids and elder brains are among WotC's explicitly declared Product Identity and appear in no SRD (5.1 or 5.2); both entries claim `source: 'SRD 5.2'`, so `openContentPolicy.ts` passes them as compliant. The SRD manifest doubles down: `docs/srd-manifest/dnd5e-2024.ts:395-397` lists both as `status: 'encoded', source: 'SRD 5.2'`, violating the manifest's own "CITED, NEVER INVENTED / mark flagged" rule (`docs/srd-manifest/types.ts:14-19`). Fix: delete both statblocks (or rename/rework into generic aberrations), correct the manifest entries to `excluded` with a PI note. Confidence: high.

**LC-2. Full Golarion pantheon (Paizo Product Identity) encoded as PF2e cleric subclasses with invented mechanics**
`src/data/pathfinder/2e/classes/cleric.ts:109-472` ships 19 deities (Abadar, Asmodeus, Calistria, Cayden Cailean, Desna, Erastil, Gorum, Iomedae, Irori, Lamashtu, Nethys, Norgorber, Pharasma, Rovagug, Sarenrae, Shelyn, Torag, Urgathoa, Zon-Kuthon) as subclasses under `source: 'Core Rulebook'`. Golarion deity names are declared Product Identity under Paizo's OGL declarations (and "Reserved Material" under ORC); additionally the granted mechanics (e.g. `cleric.ts:123` "+1 status bonus to Diplomacy and Deception checks") are invented, not CRB rules. Fix: replace deities with generic doctrine/domain subclasses or system-agnostic placeholders ("deity slot" chosen by the GM). Confidence: high on the PI status; high that the mechanics are fabricated.

**LC-3. 5e-2014 species files ship PHB-only subraces (incl. Lolth lore) under `source: 'SRD 5.1'`**
SRD 5.1 includes exactly one subrace per race (High Elf, Hill Dwarf, Lightfoot Halfling, Rock Gnome). Yet `src/data/dnd/5e-2014/species/elf.ts:93-173` ships Wood Elf and "Dark Elf (Drow)" — with the PHB drow flavor text naming the PI goddess **Lolth** at `elf.ts:172` — plus `dwarf.ts:87` (Mountain Dwarf), `halfling.ts:73` (Stout), `gnome.ts:42` (Forest Gnome), all under the file-level `source: 'SRD 5.1'` (`elf.ts:7`). Because `Subrace` (`src/types/character-options/species.ts:46-53`) has no `source` field, `isOpenContentCompliant` can only check the top-level species and is structurally blind to nested violations. Fix: remove non-SRD subraces (and the Lolth sentence), and add per-subrace `source` so the policy can see nesting. Confidence: high.

**LC-4. Non-SRD monsters labeled `source: 'SRD'` in 5e-2014**
`src/data/dnd/5e-2014/monsters/cr-2-5.ts:255-257` ("Flameskull" — a Forgotten Realms monster, not in SRD 5.1) and `cr-2-5.ts:530-532` ("Banshee" — MM 2014, not in SRD 5.1), both `source: 'SRD'` which the policy accepts for `dnd-5e-2014` (`openContentPolicy.ts:28`). Also suspect for SRD 5.2 membership: "Warlord" (`5e-2024/monsters/humanoids/cr-6-10.ts:96-100`), "Orc" and "Grimlock" in 5e-2024. Fix: verify each against the actual SRD index; remove or re-source. Confidence: high for Flameskull, medium-high for Banshee, medium for the 5.2 trio.

**LC-5. Policy whitelist accepts closed-book citations ('PHB', "Hero's Handbook"), defeating the SRD-only intent**
`src/utils/openContentPolicy.ts:36` allows `'SRD 3.5', 'PHB 3.5', 'PHB', "Player's Handbook 3.5"` for `dnd-3.5e`, and `:48` allows "Hero's Handbook" for mam3e. The PHB and Hero's Handbook are the commercial Product Identity books — citing them neither establishes open-content provenance nor matches the stated "SRD/OGL/ORC/CC-BY only" policy; concretely, all 335 entries in `src/data/dnd/3.5e/feats/general.ts` cite `source: 'PHB'` and sail through the filter (see H-2: most are fabricated). Fix: restrict allowed sources to actual SRD designations ('SRD 3.5', 'M&M 3e SRD'), then re-source or purge whatever fails. Confidence: high.

**LC-6. 37 3.5e magic items have no source attribution at all**
`src/data/dnd/3.5e/equipment/magic-items.ts` (37 ids, zero `source` fields — the only data file in the repo with this property). With `allowMissingSourceFor: []`, the policy filter drops them, and they're additionally omitted from both `getEquipment` (`3.5e/equipment/index.ts:19-27`) and `loadDnd35eEquipment` (`src/utils/dataLoader.ts:330-338`) — so they're unreachable dead content that still ships in the bundle. Fix: add `source: 'SRD 3.5'` and wire them in, or delete the file. Confidence: high.

## Critical

**C-1. Same equipment ID resolves to different, conflicting items depending on access path**
`potion-of-healing` is defined three times with conflicting data: `adventuring-gear.ts:1120` (type `'gear'`, heals 2d4+2 — correct SRD), `magic-items.ts:88-99` (type `'consumable'`, text says **4d4+4**, which is Potion of *Greater* Healing's dice — wrong), and `potions.ts:27` (local `Potion` shape). `plate-armor-plus-1/2` exist in both `armor.ts:263/276` and `magic-items.ts:651/664` (different names: "Plate Armor +1" vs "+1 Plate Armor"); `wand-of-lightning-bolts` is defined twice *within* `magic-items.ts` (:241, :1135). The data-side index `dnd5eEquipmentById` (`5e-2014/equipment/index.ts:26-33`) is last-write-wins (magic-items copy), while `dataLoader.ts`'s `dedupeById` (:50-62) is first-wins (adventuring-gear copy) — so the loader and the by-ID index disagree about what `potion-of-healing` *is*, and `equipmentStats.total` double-counts. Fix: dedupe at the source files, and make `dedupeById`/index builders throw (or at least dev-warn like `powerById` does at `mutants-and-masterminds/3e/powers/aggregations.ts:42-44`) on duplicate ids.

## High

**H-1. The documented "single source of truth" `Character` interface is dead; real characters live in a parallel model**
`src/types/core/character.ts:31-87` defines `Character` ("Single source of truth for all character data") but its only consumer is `validateCharacter` (`src/utils/validation.ts:65`), which no production code calls. Actual persistence/UI flows through `CharacterDocument<SystemDataModel>` (`core/document.ts:28`) + per-system models (`systems/dnd5e/data-model.ts` etc.) that re-declare overlapping fields (`savingThrowProficiencies`, `HitPoints`, …). Two character models invite drift and mislead contributors (the JSDoc actively claims authority). Fix: delete `Character` (keeping the genuinely shared sub-types `Feature`, `Feat`, `SpellSlots`, `EquippedItem`, …) or re-document it as legacy.

**H-2. ~280 fabricated 3.5e "feats" shipped as real content, plus 17 duplicate feat IDs across files**
`src/data/dnd/3.5e/feats/general.ts` holds 335 entries; after the ~55 real SRD feats it degenerates into invented filler — "Backstab" (`general.ts:699-705`, description "Skilled at backstabbing.", benefit "Extra backstab damage"), "Bird Call", "Bridge Building", "Camping", "Cartography", "Athletics II", skills-as-feats ("Acrobatics", "Alchemy"), and 3.0-only "Ambidexterity" — all `source: 'PHB'` (the 3.5 SRD has ~109 feats total). Several are *also* duplicated in `combat.ts` (:6, :25, :71 vs `general.ts:619/699/803`) and `magic.ts:133` vs `metamagic.ts:6`, and both arrays are aggregated in `feats/index.ts:11-19`. The pf1e/pf2e feat indexes show this was already cleaned elsewhere ("Fabricated placeholder files removed", `pathfinder/1e/feats/index.ts:2`). Fix: apply the same purge to 3.5e; keep only SRD-verifiable feats.

**H-3. 3.5e/PF1e class data carries mechanically wrong 5e-style save proficiencies, with a correct shadow table hardcoded elsewhere**
Every 3.5e and pf1e class file sets 5e-style two-ability `savingThrowProficiencies` (e.g. wizard `['int','wis']` at `src/data/dnd/3.5e/classes/wizard/index.ts:18`, barbarian `['str','con']` — 3.5e has only Fort/Ref/Will keyed to con/dex/wis; an INT or STR save doesn't exist). The engines ignore this field and use a separate hardcoded, *correct* table `DND35E_CLASS_PROFILES` in `src/utils/d20LegacyTemplate.ts:38-49`. So the data field is wrong *and* unused — a drift trap for any future generic consumer of `CharacterClass.savingThrowProficiencies` (`types/character-options/classes.ts:23`). Fix: move good/poor save + BAB progressions into the 3.5e/pf1e class data (extend the type) and delete the bogus 5e-style values.

**H-4. All 3.5e/PF1e per-level spell durations flattened to fixed values**
`Duration` (`src/types/core/common.ts:64-77`) provides `rounds/minutes/hours/days-per-level` variants, but zero of the 555 3.5e and 134 pf1e spell entries use them; e.g. Bane — "1 min./level" in the SRD — is encoded `{ type: 'minutes', minutes: 1 }` (`src/data/dnd/3.5e/spells/level-1.ts:27-30`), and `formatDuration` (`src/utils/formatters.ts:53-56`) will render "1 minute". Systemically wrong reference data for the two Vancian systems. Fix: batch-convert durations to the `-per-level` variants from the SRD text (the union already supports it).

**H-5. M&M archetypes and PF2e heritages are shoehorned into D&D-shaped types, forcing fabricated values**
`src/data/mutants-and-masterminds/3e/archetypes/battlesuit.ts:13-27` types a M&M archetype as `CharacterClass` with `hitDie: 'd8'` and `savingThrowProficiencies: ['int','str']` — M&M 3e has no hit dice and no ability-keyed saves; these are invented values existing only to satisfy required fields. Similarly `src/data/pathfinder/2e/ancestries/dwarf.ts:46-81` invents heritages ("Forge-Blessed", "Stonecunning", "Ironclad", "Mountainborn" — CRB has Ancient-Blooded/Death Warden/Forge/Rock/Strong-Blooded) that grant ability boosts, which PF2e heritages never do (confidence: high on names, high on no-boost rule). Fix: give M&M archetypes their own reference-only type (matching the documented reference-only boundary in `docs/srd-manifest/_exclusions.ts:47-53`) and re-source PF2e heritages from the CRB.

## Medium

**M-1. No effective schema versioning/migration for persisted character documents**
`CharacterDocument.version?: number` (`core/document.ts:48`) is optional and never set at creation (`src/App.tsx:220-227`); the storage envelope pins `'2.0'` but a mismatch only triggers a dev-only `console.warn('…attempting migration…')` with no actual transform (`src/utils/documentStorage.ts:61-63`). The system payload (`system: T` black box) has no version either, and it *is* changing (recent additive fields: `EquippedItem.attackBonus/acBonus` in `core/character.ts:222-235`, `SceneToken.hp`, `SceneMarker.effects`). Discipline so far is "additive only" by comment; one non-additive change will corrupt local-first user data silently. `SceneDocument.version: 1` (`core/scene.ts:140`) is the right pattern. Fix: stamp `version` at creation, add a tiny ordered-migration runner keyed on it.

**M-2. Three drifted equipment type families + types declared inside data files**
Family A: `Item/Weapon/Armor/Shield/MagicItem` (`types/equipment/items.ts`, object cost, `DiceRoll` damage). Family B: legacy `GearItem/WeaponItem/ArmorItem` + `DnD35e*` (`types/equipment/{gear,weapons,armor}.ts`, `cost: string | number`, `damage?: string | {dice,type}`, `armorClass: number | string`). Family C: ad-hoc interfaces inside data files — `Potion`, `WondrousItem`, `MagicWeapon`, `MagicArmor` (`5e-2014/equipment/potions.ts:11-23` etc., `source: {book,page}` objects, `type: 'potion'` not in `ItemType`), plus `PowerModifier` (`mam modifiers/extras.ts:3`), `Complication`, `Pf2eBackgroundDefinition`, `PrestigeClass` (`3.5e/prestige-classes/index.ts:21-29`). 24 IDs exist in both family A and family C files and are re-exported side-by-side from the same barrel (`5e-2014/equipment/index.ts:74-77`), so consumers can receive two different objects for one ID. The barrel `types/equipment/index.ts:1-7` doesn't even re-export `items.ts`. Fix: pick family A as canonical, fold C's extra fields into it, delete B or mark deprecated, move all interfaces out of `src/data`.

**M-3. Loader casts lie about 3.5e equipment shape**
`loadDnd35eEquipment` (`src/utils/dataLoader.ts:333-337`) funnels `DnD35eWeapon[]` (string costs like `'15 gp'`) through `unknown[]` and asserts `as Item[]` (object `cost: {amount,currency}`). Anything downstream doing `item.cost.amount` on 3.5e data breaks at runtime despite green types (cf. `getEquipmentByPriceRange`, `5e-2014/equipment/index.ts:92-101`, same assumption). Fix: return a discriminated union or normalize cost at load time.

**M-4. 3.5e spells duplicated per class instead of using `levelsByClass`**
`cure-light-wounds-cleric-35e` and `cure-light-wounds-druid-35e` are separate full entries (`3.5e/spells/level-1.ts`), "True Seeing" exists 4×, "Dispel Magic" 3× — even though `Spell.classes` + `levelsByClass` (`types/magic/spells.ts:71-72`) exist precisely to model shared spells (and 5e data uses them correctly). 555 ids overstate coverage stats, and one rules fix must be applied N times. Fix: merge per-class clones into single entries with `levelsByClass`.

**M-5. Category enums drifted: M&M powers mis-keyed as 'spells' in the catalog**
`SystemContentCategoryId` (`types/system-catalog.ts:5-20`) lacks `'powers'` while `OpenContentCategory` (`openContentPolicy.ts:3-19`) and `ManifestCategory` (manifest types) include it; consequently `systemCatalogMetadata.ts:213` registers M&M powers as `productCategory('spells', 'Powers', …)`. Any code filtering catalog summaries by category id gets semantically wrong results. Fix: add `'powers'` to `SystemContentCategoryId` (or derive all three enums from one source).

**M-6. Daggerheart class→domain join is stringly-typed display names**
`DaggerheartClass.domains: [string, string]` (`types/daggerheart.ts:85`) holds capitalized display names (`['Grace', 'Codex']`, `data/daggerheart/1.0/classes/index.ts:49`) while `DaggerheartDomain.id`/`DomainCard.domain` use the lowercase `DaggerheartDomainId` union; the engine papers over it with `normalizeDomainId` (`systems/daggerheart/getDaggerheartSheetState.ts:181`). Fix: type the tuple as `[DaggerheartDomainId, DaggerheartDomainId]` and render display names from the domain record.

**M-7. Legacy garbled `dnd35ePrestigeClasses` exported alongside normalized ones**
`3.5e/prestige-classes/index.ts:33-296` exports abbreviated `PrestigeClass` objects with un-suffixed ids (`'assassin'` vs product `'assassin-35e'`), `source: 'DMG'` (fails the policy whitelist), Pathfinder-isms in 3.5e data ("Stealth 8 ranks" — 3.5e has Hide/Move Silently), wrong prerequisites (blackguard "Perform 2 ranks"), and features truncated at level 3. Only the normalized `CharacterClass` versions are product-consumed (`dataLoader.ts:320-321`). Dead, wrong, and policy-violating data kept alive by an export. Fix: delete the legacy block and its `PrestigeClass` interface.

**M-8. Index builders silently last-write-win on duplicate IDs**
`buildSpellCatalog.spellsById` (`utils/spellCatalog.ts:95-101`), `dnd5eMonstersById` (`5e-2014/monsters/index.ts:24-30`), `dnd5eEquipmentById` (`equipment/index.ts:26-33`), `daggerheartDomainCardsById` — all overwrite on collision; only M&M's `powerById` warns (`powers/aggregations.ts:42-44`). Given C-1 proved real collisions occur, this is a live hazard, not theoretical. Fix: a shared `indexByIdStrict` helper that throws in dev/CI.

## Low

**L-1. Dead exported types/values**
`ArmorClassCalculation` and `SavingThrow` (`types/mechanics/combat.ts:28-37, 46-53`), `SpellSlotArray` (`types/character-options/classes.ts:163-184`), and `CR_TO_XP` (`types/creatures/monsters.ts:130-165`) have no consumers outside their defining files (test dirs excluded). Fix: remove or wire into the knip gate.

**L-2. JSDoc examples don't match their own types**
`types/magic/spells.ts:23-28` example uses `damage: { diceRoll: { count: 8, sides: 6, bonus: 0 }, damageType: 'fire' }` — the real shape is `SpellDamage{ base: DiceRoll{count,die,notation}, type }`; copy-pasting the example fails to compile. Fix: correct the example.

**L-3. Dice/notation contradictions in data**
SRD rat bite does flat 1 damage; `5e-2014/monsters/cr-0-1.ts:26` encodes `dice: { count: 1, die: 'd4', notation: '1' }` — notation contradicts count/die (the `'d1'` member of `DiceType` exists for exactly this). Fix: `{count: 1, die: 'd1', notation: '1'}`.

**L-4. `Choice`/`startingGold` field abuse in PF2e classes**
`pf2e/classes/cleric.ts:21-27` uses `skillProficiencies: { count: 2, options: ['religion'] }` (choose 2 from a 1-item list) and `startingGold: { dice: '15', multiplier: 1 }` (`'15'` is not a dice expression). Typechecks, but consumers honoring `Choice.count` or rolling `dice` will misbehave. Fix: model "trained in X plus N free skills" and flat starting wealth explicitly.

**L-5. No ID branding/namespacing convention**
Entity ids are bare `string` everywhere; conventions vary per system (`fire-bolt`, `bane-cleric-35e`, `mind-flayer-2024`, `daggerheart-weapon-primary-...`), and the same id (`club`, `cleric`) recurs across systems — safe today because every store is per-system, but nothing in the types enforces that invariant. Fix (cheap): branded id types or at least documented per-system prefix rules.

## Strengths

- **Real compliance engineering exists and mostly works**: per-entry `source` on ~all data, a runtime policy filter (`openContentPolicy.ts`) wired into the loader and catalog, an explicit denominator manifest with `flagged/excluded` semantics (`docs/srd-manifest/types.ts`), and visible past cleanups (5e-2014 ships exactly Grappler + Acolyte; 2024 spell index renames "Tenser's…" to its SRD name; pf feat indexes record removal of fabricated files). The violations found are gaps in execution, not absence of design.
- **Strict-mode discipline**: `tsc --noEmit` passes with `strict: true`, zero `any` in `src/types`, discriminated unions used well (`Duration`, `Range`, `SceneEvent`), and the scene layer is a properly versioned, replayable event log (`SceneDocument.version: 1`, pure fold, deterministic seeds).
- **Daggerheart and M&M pipelines are the model to copy**: builder-function data files with single-sourced attribution constants, normalized automation tagging, lowercase id unions, and (M&M) the only duplicate-ID guard in the codebase.

---

# Chapter K — Infrastructure Review — rpg-character-sheet (local-first TTRPG PWA)

## Overall assessment

This is an unusually disciplined infra setup for a side project: CI literally runs the same `npm run verify` developers run, the doc-drift/generated-docs/runtime-pinning tooling is genuinely non-vacuous (the reviewer executed the offline checks to confirm they pass and do real work), and the Node bootstrap pipeline does checksum-verified, atomic runtime installs. The weak points cluster in three places: (1) the hand-rolled service worker, whose precache strategy cannot actually deliver the "offline local-first" promise and which interacts badly with the Netlify SPA rewrite; (2) the deploy path, where CI-driven Netlify deploys likely ship without any of the carefully-written headers/redirects in `netlify.toml`; and (3) the `src/scripts/generators`, which have bit-rotted against a data layout that no longer exists and will corrupt or pollute the source tree if run. The e2e suite is broad but has a few flake-papering and synthetic-event patterns that let it pass without the underlying feature working.

## High

**H1. Offline support breaks after every cache-version bump; built assets are never precached** — `public/service-worker.js:4-9`
`APP_SHELL` is only `['/', '/index.html', '/manifest.webmanifest']`; no hashed JS/CSS is ever precached and there is no build-time manifest injection. When `CACHE_NAME` is bumped (v3 → v4), the activate handler (lines 17-28) deletes the old cache containing all runtime-cached assets, and the new cache holds only the 3 shell URLs. The waiting SW can activate *without* user consent (when all tabs close), so the next offline launch serves precached `index.html` whose `/assets/index-*.js` request misses cache, hits a rejected `fetch` (no `.catch`, line 79) and renders a blank page until the user happens to be online. The `CACHE_URLS` proactive-caching handler (lines 91-113) that could mitigate this is dead code — nothing in `src/` ever posts that message (verified by grep). Fix: inject the build asset list into the SW at build time (or adopt Workbox/`vite-plugin-pwa` precache manifest), and/or re-warm current `index.html` assets in the `activate` handler before deleting old caches.

**H2. Runtime cache can be poisoned with HTML stored under asset URLs (SW × Netlify SPA rewrite)** — `public/service-worker.js:75-88` + `netlify.toml:27-30`
The asset handler is cache-first and caches any same-origin GET with `status === 200`, with no content-type or path check. The Netlify rewrite `/* -> /index.html 200` applies to any non-existent file, including stale `/assets/*.js` chunk URLs after a deploy. So an open tab lazy-loading an old chunk receives `index.html` with a 200, the SW caches that HTML under the chunk URL *forever* (cache-first, only purged on a manual `CACHE_NAME` bump), and the import fails with a MIME error instead of a clean 404 that calling code could detect/retry. The dead `CACHE_URLS` handler has the same missing guard (`response.ok` is true for the rewritten HTML, line 102). Fix: in the SW, only runtime-cache responses whose `Content-Type` matches the request destination (or restrict caching to `/assets/` plus explicit shell paths), and add a Netlify rule excluding `/assets/*` from the SPA fallback (e.g. a 404 rule before the catch-all).

**H3. CI-driven Netlify deploys likely ship without security headers, caching rules, or the SPA redirect** — `.github/workflows/ci.yml:89-98, 115-124` vs `netlify.toml:10-11` (confidence: medium)
Both deploy jobs use `nwtgck/actions-netlify@v2` with only `publish-dir: './dist'`. That action deploys via the Netlify API; file-based config is applied only if `netlify.toml` is part of the deploy (it is not in `dist/`) or if the action's `netlify-config-path` input is set (it is not), or if `_headers`/`_redirects` files exist in the publish dir (they do not). The comment in `netlify.toml` lines 10-11 ("headers... ARE applied to every deploy regardless of whether the build ran here or in CI") is therefore very likely wrong for the primary deploy path — meaning production runs without CSP, HSTS, X-Frame-Options, immutable caching for `/assets/*`, and the `max-age=0` rule for `/service-worker.js` (browsers then fall back to default SW update heuristics). Fix: add `netlify-config-path: ./netlify.toml` to both deploy steps, or emit `_headers`/`_redirects` into `dist/`; then verify headers on a deployed URL (`curl -sI`).

**H4. `generate:spell` corrupts the index file it tries to update** — `src/scripts/generators/generate-spell.ts:239-241`
`lines[arrayLineIndex].replace('[', ...)` is applied to the line found by `line.includes('Spell[] = [')`. The first `[` on that line is the one in the `Spell[]` type annotation, so `export const evocationLevel1Spells: Spell[] = [];` becomes `export const evocationLevel1Spells: Spell[\n  newSpell,] = [];` — syntactically broken TS, every time. Additionally, the spell template (lines 81-103) interpolates `name`, `description`, and material text into single-quoted strings with no escaping, so canonical D&D names like "Mordenkainen's Sword" generate unparseable files. Fix: anchor the replace to `= [` (or regenerate the whole index from directory contents) and escape `'`/`\` in all interpolated strings (compare `generate-srd-manifests.ts:131-133`, which does this correctly).

**H5. All three spell generators target a data layout that no longer exists; one crashes, one pollutes the tree** — `src/scripts/generators/generate-spell-indexes.ts:35-74`, `generate-all-system-indexes.ts:100-171`, `generate-spell.ts:195-216`
The real data is flat per-level files (`src/data/dnd/5e-2014/spells/cantrips.ts`, `level-1.ts`, ..., same for pf1e/pf2e — verified on disk), aggregated by a hand-maintained `spells/index.ts`. The generators still assume the legacy `level-N/school/` folder tree: `npm run generate:indexes` crashes immediately (`createLevelIndex` does `writeFileSync` into `spells/cantrips/index.ts` without `mkdir`; the parent directory does not exist); `npm run generate:all-systems` *does* `mkdir` first and would create ~85 obsolete folders with empty `Spell[]` index files and READMEs alongside the live flat files (which knip would then flag, breaking `check:dead-code`); `npm run generate:spell` writes a spell file into a folder nothing imports — a silent no-op for the product. The 3.5e comment in `generate-all-system-indexes.ts:91-92` shows the team knows the layout moved. Fix: rewrite the generators against the flat layout or delete them and their `package.json` scripts.

## Medium

**M1. SW update banner effectively never fires for routine deploys, and old chunks accumulate unboundedly** — `public/service-worker.js:4` + `src/hooks/useServiceWorkerUpdate.ts:96-112`
The SW byte content only changes when someone manually edits `CACHE_NAME`, so `updatefound`/the banner trigger only on those rare manual bumps — routine app deploys never surface "A new version is available". Between bumps, every deploy's hashed assets pile up in the single `rpg-character-sheet-v3` cache with no size cap or pruning (activate only deletes *differently named* caches). The hook also never calls `registration.update()` on an interval or visibility change, so long-lived tabs/installed PWAs only check on navigation (24h HTTP cap). Fix: derive a per-build cache version (build-time injection), prune stale `/assets/` entries against a precache manifest on activate, and add periodic `reg.update()`.

**M2. Navigation handler caches non-OK responses and `cache.put` races SW termination** — `public/service-worker.js:58-63, 83`
Navigations are cached without a `response.ok` check, so a transient 404/500/maintenance page gets stored and later replayed as the offline fallback for that URL; each distinct URL also stores its own full copy of `index.html`. Both `cache.put` calls run as floating promises not tied to `event.waitUntil`, so the SW can be terminated before the write completes (lost cache entries, benign but flaky offline behavior). `self.clients.claim()` (line 27) is similarly not awaited inside `waitUntil`. Fix: gate caching on `response.ok`, and wrap puts/claim in `event.waitUntil`.

**M3. `deploy-preview` runs (and fails) for fork PRs; `pull_request` trigger is unfiltered** — `.github/workflows/ci.yml:6, 74-78`
`if: github.event_name == 'pull_request'` has no same-repo guard, but fork PRs don't receive `NETLIFY_AUTH_TOKEN`/`NETLIFY_SITE_ID`, so external contributions get a guaranteed red check after passing verify. Fix: add `&& github.event.pull_request.head.repo.full_name == github.repository` (or gate on secret presence). Also consider `concurrency` with `cancel-in-progress` and `timeout-minutes` on the verify job (none today), since the full verify (two builds + e2e on two browsers at `workers: 1`) is long.

**M4. Tests, e2e specs, and tool configs are never type-checked** — `tsconfig.json:25`, `tsconfig.node.json:10`
`tsc` (run in `build`) excludes `src/__tests__/**/*`; `tsconfig.node.json` includes only `vite.config.ts`. Nothing type-checks `e2e/**`, `playwright.config.ts`, `vitest.config.ts`, or the 918 unit tests — vitest and Playwright strip types via esbuild without checking, and ESLint runs without type-aware rules. Type errors in tests/specs (wrong matcher args, stale fixture shapes) ship silently until they fail at runtime or not at all. Fix: add a `tsconfig.test.json` (and include e2e/configs) checked by a `tsc --noEmit` step inside `verify`.

**M5. Coverage thresholds are computed over a narrow slice of `src/`** — `vitest.config.ts:23-29, 42-47`
`coverage.include` covers only `components/utils/systems/hooks/registry`; `src/contexts/` (AuthContext — the Supabase integration), `src/lib/`, `src/rules/`, `src/scene/`, `src/constants/`, and `App.tsx` are excluded from instrumentation entirely, so the 70/65/60/70 thresholds assert nothing about them. The gate looks stronger than it is. Fix: broaden `include` (or explicitly document the exclusions) so threshold drift in those areas is visible.

**M6. `srd:coverage` executes remote third-party JavaScript via `new Function`** — `src/scripts/srd-coverage.ts:120-149`
`extractJsArray` fetches `frnprt/mm3e-character-creator`'s `data.js` from raw.githubusercontent.com and evaluates a sliced array literal with `new Function(...)()`. An array literal can contain arbitrary expressions (IIFEs, getters), so whoever controls that repo can execute code on any dev machine running `npm run srd:coverage`. It is not in the `verify`/CI path, which limits exposure, but it is still a supply-chain hazard in a script the docs tell maintainers to re-run. Fix: parse names with a regex/AST reader (e.g. extract `name: "..."` pairs textually) instead of evaluating, or pin a commit hash and verify a checksum. Also note `main()` swallows per-target failures as `SKIP` and still rewrites the committed `docs/generated/srd-coverage.md`, so a network-degraded run can quietly gut the report (lines 414-416).

**M7. `check:generated-docs` fails on Windows and leaves the workspace dirty on generator failure** — `scripts/check-generated-docs.mjs:45-50, 61-71`
`execFileSync('npm.cmd', ...)` without `shell: true` throws `EINVAL` on Node ≥ 20.12.2 (the April 2024 CVE-2024-27980 hardening), so the repo-pinned 20.19.0 cannot run this check on Windows at all (confidence: medium on team impact; CI is Linux). Separately, if `roadmap:metrics` throws, `execFileSync` raises before the restore loop, leaving `docs/generated/*` regenerated-but-not-restored in the working tree. Fix: invoke `process.execPath` + the npm-cli.js path (the repo already has that machinery in `scripts/runtime/ensure-node-runtime.mjs`), and wrap the run in `try/finally` so the snapshot restore always executes.

**M8. `manualChunks`: the `icons` chunk is unreachable and `react` matching over-captures** — `vite.config.ts:36-43`
`id.includes('react')` is tested before `id.includes('lucide-react')`, and `/node_modules/lucide-react/...` contains `react`, so lucide always lands in `react-vendor` and the `icons` chunk never exists; any other dep with "react" in its path is captured too. `check-bundle-size.mjs` still finds `react-vendor-*` so no gate notices the dead branch — only the 200 KiB vendor budget would eventually trip. Fix: order the most-specific check first (`lucide-react` before `react`), or match on `/node_modules/react/` and `/node_modules/react-dom/` path segments.

**M9. PWA e2e tests pass without the PWA actually working** — `e2e/pwa-install.spec.ts:10-25`, `e2e/system-smoke.spec.ts:35-40, 107, 172`
The install test dispatches a hand-built synthetic `beforeinstallprompt`, so it exercises only the banner UI — it would pass with a broken manifest, failed SW registration, or non-installable origin, and no spec anywhere exercises SW registration, offline reload, or the update banner despite "offline-capable" being the product's headline. In system-smoke, `clickTab` clicks via `element.click()` inside `evaluate`, bypassing Playwright actionability (a tab covered by an overlay still "works"), and two bare `waitForTimeout(1000)` sleeps paper over load races that the subsequent 10 s `expect` already handles; CI `retries: 2` (`playwright.config.ts:10`) further masks residual flakiness. Fix: add one real SW/offline spec (`context.setOffline(true)` after first load), use normal `.click()` for tabs, and delete the sleeps.

## Low

- **L1. Unused `jsdom` devDependency invisible to the dead-code gate** — `package.json:75`. Vitest uses `happy-dom`; `jsdom` appears nowhere else (verified by grep), yet `npx knip` passes because jsdom is an optional peer of vitest. Also `knip.json:16-24` turns off `exports`/`types`/`duplicates`, so `check:dead-code` only gates unused files and dependencies — weaker than the name suggests. Remove jsdom; consider re-enabling `exports` incrementally.
- **L2. `npm test` starts watch mode** — `package.json:25`. `vitest` without `run` hangs any consumer that calls plain `npm test` (CI uses `verify`, but the doc-drift checker whitelists `npm test` as a builtin, so docs can legitimately recommend it). Use `vitest run` and a separate `test:watch`.
- **L3. `vite preview` without `--strictPort`** — `playwright.config.ts:20`. If 4173 is taken, preview silently picks 4174 and the webServer health check times out with a misleading error. Add `--strictPort`.
- **L4. `verify` builds twice** — `package.json:42` + `playwright.config.ts:20`. `build` runs, then `test:e2e`'s webServer runs `npm run build` again; the deployed artifact is the second build. Wasted minutes per CI run; consider "skip build if dist fresh" or reordering.
- **L5. `dist/stats.html` and `.gz`/`.br` files are deployed publicly** — `vite.config.ts:20-25`. The visualizer report (module paths/sizes) ships in the artifact Netlify publishes; Netlify also ignores precompressed files (it compresses itself), so the compression plugins only add artifact weight. Write stats outside `dist/` and consider dropping `vite-plugin-compression` (unmaintained, v0.5.x) entirely.
- **L6. `check-playwright-browsers` deep-imports playwright internals** — `scripts/check-playwright-browsers.mjs:6`. `../node_modules/playwright-core/lib/server/registry/index.js` is private API and relies on npm hoisting (breaks under pnpm/PnP or playwright refactors). Prefer spawning `npx playwright install --dry-run` or catching the launch error.
- **L7. iOS/maskable icon gaps** — `index.html:5-9`, `public/manifest.webmanifest:10-23`. SVG-only icons with no `<link rel="apple-touch-icon">` mean iOS home-screen installs fall back to a screenshot tile; `purpose: "any maskable"` on the same icon means maskable contexts crop the full-bleed art. Add PNG 192/512 + apple-touch-icon, and a dedicated maskable variant. Manifest also lacks `id`.
- **L8. `netlify.toml` `[functions]` points at a nonexistent directory** — `netlify.toml:17-19` (`netlify/functions` does not exist; knip's `netlify/**` entries also match nothing, as knip itself hints). Harmless today, but drift; remove or create the directory.
- **L9. Main-module detection breaks on Windows** — `src/scripts/generators/generate-spell.ts:256`, `show-progress.ts:77`. `import.meta.url === 'file://' + process.argv[1]` never matches Windows drive paths or URL-encoded characters, so the CLIs silently do nothing there. Use the `fileURLToPath(import.meta.url) === path.resolve(process.argv[1])` pattern already used in `scripts/*.mjs`.
- **L10. `show-progress` renders constant fake bars** — `src/scripts/show-progress.ts:20, 26`. `'█'.repeat(20)` regardless of count; the bars convey nothing. Scale by count or drop them. Relatedly, `enhance-classes.ts:1-9` claims it "Adds" metadata but is a pure reporter that never writes or exits non-zero — rename to `audit` semantics so `npm run enhance` is not misleading.
- **L11. Doc-drift workflow regex is order-fragile** — `src/utils/docDrift.ts:142`. `workflowVerifyCommand` is the *first* `run: npm run ...` in ci.yml; inserting any `npm run` step before "Run full verification suite" would make the baseline comparison fire a false drift (loud failure, so safe, but confusing). Anchor to the named step.
- **L12. CI polish cluster** — `ci.yml`. Actions pinned by tag not SHA (`nwtgck/actions-netlify@v2`, `codecov/codecov-action@v5` — tag-move supply-chain exposure with `NETLIFY_AUTH_TOKEN` in env); codecov has no token (silently degrades on rate limits/private repos); no `permissions:` block (default-permissive `GITHUB_TOKEN`); no concurrency/timeout (see M3). `scripts/check-doc-drift.mjs:1` also carries a `#!/usr/bin/env node` shebang but imports a `.ts` file, so it only runs under tsx as wired in package.json.

## Strengths

- **The verification tooling is real, not theater.** `check-doc-drift`, `check-repo-hygiene`, and `knip` all pass and all do substantive work: doc-drift cross-joins docs against package.json scripts, the system registry, generated metrics, and ci.yml pins; `check-generated-docs` uses a snapshot/regenerate/normalize/restore design that correctly ignores timestamps; bundle budgets measure actual gzip bytes with per-chunk-class limits and env overrides.
- **The Node runtime pinning system (`scripts/runtime/*`) is production-grade**: SHASUMS256 verification with cleanup on mismatch, redirect caps, atomic temp-dir downloads/renames, cross-platform extraction, `.nvmrc`/`.node-version`/engines consistency enforcement, and CI reading the same pin file — plus `runtime-doctor` for diagnosis.
- **The SW update-consent flow is thoughtfully designed where it is implemented**: no blind `skipWaiting()` on install, user-gated `SKIP_WAITING`, and the `controllerchange` reload correctly gated to user-initiated updates (avoiding the classic first-install reload bug), with the reasoning documented inline — the gaps are in caching strategy (H1/H2/M1), not in the lifecycle choreography.

---

# Chapter L — Test Suite Review — src/__tests__

## Overall assessment

This is a genuinely trustworthy suite, well above typical quality for its size: rules-math tests pin hand-computed RAW values (not re-derived from production helpers), all dice paths are either seed-injected or `Math.random`-mocked, storage tests run against real `fake-indexeddb` including migration and fallback paths, and component tests favor `userEvent` + accessible role queries. Mock boundaries are sensible — hook tests mock `syncEngine` but exercise the real `useEntitySync` state machine, and `syncEngine` tests mock only the Supabase client. The weaknesses are concentrated in one place: failure-path coverage of the sync/persistence pipeline (fetch/push failures, storage quota) is thin and asymmetric, and a handful of rules tests contain seed-conditional assertions, including one that is provably dead code. Nothing I found undermines the math coverage that is the product's core value; the residual risk is in "Supabase is down / storage is full" scenarios.

## High

### H1. Dead assertion: cross-system damage parity check can never execute
`src/__tests__/rules/attackResolution.test.ts:204-215`
```ts
const result = resolveAttack({ attackEffects, damageEffects, targetValue: 50, // force a hit to inspect damage
  ...
expect(result.attackBonus).toBe(5);
if (result.isHit && !result.isCriticalHit) {
  expect(result.damageBonus).toBe(4);
}
```
With `attackBonus` 5 and `targetValue` 50, the max non-crit total is 25, so per the implementation (`src/rules/resolver/attackResolution.ts:99-102`, `isHit = isCriticalHit || ... attackTotal >= targetValue`) `isHit` is true only on a natural 20, which always sets `isCriticalHit`. The guard `isHit && !isCriticalHit` is unsatisfiable for every seed, so the `damageBonus` half of the "+1 magic weapon raises attack and damage identically across systems" test never runs — the comment "force a hit" shows the author believed otherwise. Fix: set `targetValue` low (e.g., 5) or attack bonus high (50) as other tests in this file do, and assert the damage path unconditionally.

## Medium

### M1. Seed-conditional assertions silently skip when the guard is false
`src/__tests__/rules/attackResolution.test.ts:109-113` and `:167-169`
```ts
if (!result.isCriticalHit) {
  expect(result.isHit).toBe(false);
  expect(result.damage).toBe(0);
}
```
These assertions only run if seeds `'miss'`/`'dmg'` happen to not produce a natural 20 under the current RNG implementation. If `createSeededRng` ever changes, the assertions can stop executing with no failure signal. The crit/fumble tests in the same file (lines 115-150) do this correctly with a `found` flag and `expect(found).toBe(true)`; apply the same pattern here (or assert `result.isCriticalHit === false` explicitly so a seed shift fails loudly).

### M2. Sync hooks never test fetch-failure or push-failure — the offline-queue data-safety net is unexercised
`src/__tests__/hooks/useSync.test.tsx`, `src/__tests__/hooks/useCampaignSync.test.tsx`
Grep confirms the only rejection mocks in both suites are `mockedDeleteRemoteDocument.mockRejectedValueOnce` (useSync.test.tsx:215) and `mockedDeleteRemoteCampaign.mockRejectedValueOnce` (useCampaignSync.test.tsx:290). Untested in `useEntitySync` (`src/hooks/useEntitySync.ts`): the initial-sync catch (`fetchRemote` rejects → `syncState 'error'`, lines 139-140) and the debounced-push failure path (`adapter.push` rejects → `queueSnapshot(snapshot)` + `'error'`, lines 79-82). The push-failure queue is the mechanism that prevents losing edits when Supabase is unreachable mid-session — exactly the product's stated risk. Add two tests per hook: `fetchRemoteDocuments.mockRejectedValueOnce` on mount, and `pushDocuments.mockRejectedValueOnce` after a rerender, asserting `queueSyncSnapshot` is called with the latest snapshot and state is `'error'`.

### M3. No quota/`setItem`-failure coverage for the sync queues (and the code can't survive it)
Verified by grep: `quota|QuotaExceeded` matches nothing under `src`. `documentStorage` save failure is tested (`src/__tests__/documentStorage.test.ts:112-131`), but `queueSyncSnapshot` (`src/utils/syncEngine.ts:199-205`) is a bare `localStorage.setItem` with no try/catch, called from the offline branch of `useEntitySync` (line 69) outside any error handling. A quota failure while offline would throw out of the sync effect. There is no test mocking `localStorage.setItem` to throw against the queue functions or the hook's offline path; add one (it will likely expose a production bug, which is the point).

### M4. Document-side syncEngine error propagation untested (asymmetric with campaigns)
`src/__tests__/utils/syncEngine.test.ts:56-76` builds a Supabase mock supporting `fetchError`/`upsertError`/`deleteError`, but none of the 6 tests use them; the campaign twin has exactly one (`src/__tests__/utils/syncEngineCampaigns.test.ts:130-134`, fetch only). The `if (error) throw new Error(error.message)` branches in `fetchRemoteDocuments`/`pushDocuments`/`deleteRemoteDocument` (syncEngine.ts:129, 158, 168) — the inputs to the hook-level error handling above — are never executed. Add `rejects.toThrow` tests for fetch/upsert/delete on the documents side, mirroring the campaign test.

### M5. Fixed 350 ms sleeps create a false-pass vector around the 300 ms debounce
`src/__tests__/hooks/useDocuments.test.tsx:148-151`, `src/__tests__/hooks/useCampaigns.test.tsx:116-119`, `src/__tests__/hooks/useScenes.test.tsx:86-89`
```ts
await new Promise((resolve) => setTimeout(resolve, 350));
expect(localStorage.getItem('rpg-documents-v2')).toBeNull();
```
These "clear does not re-save pending debounced state" tests assert a negative after a hardcoded window. If the debounce delay (currently 300 ms in `useDebouncedPersistence`) is ever raised above 350 ms, the stale save would fire after the assertion and the tests would keep passing while the bug ships. Either import/export the delay constant and sleep `delay + margin`, or use `vi.useFakeTimers()` + `advanceTimersByTime` (the suite currently uses no fake timers anywhere). Same pattern (lower risk, flake-shaped instead) in `src/__tests__/utils/documentStorageIDB.test.ts:42,67,193,196` with bare 50 ms sleeps instead of awaiting the write.

### M6. Initiative tie-break is untested and locale-sensitive
`src/scene/encounterBuilder.ts:359` sorts initiative with `b.value - a.value || a.tokenId.localeCompare(b.tokenId)`. Grep across `src/__tests__` finds no test constructing two combatants with equal initiative values (the only tie test is target-scoring, `src/__tests__/rules/tacticalExecutor.test.ts:131`). The existing determinism test (`src/__tests__/sceneEncounterBuilder.test.ts:102-157`) re-runs the same seed in the same process, so it cannot detect that `localeCompare` (no explicit locale) may order ids differently across user environments — a problem for a "deterministic, replayable" event log synced between devices. Add a fixed-value tie test asserting exact order, and consider codepoint comparison in production.

## Low

### L1. `isRoundConclusive` all-dead edge untested
`src/__tests__/rules/roundDriver.test.ts:188-197` covers "one faction alive" and "both alive" only. The implementation (`src/rules/tactical/roundDriver.ts:151-161`) returns `livingFactions.size <= 1`; mutating `<= 1` to `=== 1` survives the current tests, and that mutant means combat never ends after a mutual KO (e.g., AoE drops the last members of both sides). One extra line: `expect(isRoundConclusive(order, { hero: 0, foe: 0 })).toBe(true)`.

### L2. Production retry defaults are dead code under test
`src/utils/retry.ts:31-45` switches to `TEST_DEFAULTS` (`maxAttempts: 1`, zero delays) when `MODE === 'test'`, and `src/__tests__/utils/retry.test.ts:153-158` pins only the test defaults. The shipped `PROD_DEFAULTS` (`maxAttempts: 4`, backoff values) are asserted nowhere — a typo there ships silently, and no syncEngine test exercises retry-then-succeed integration. Export and pin `PROD_DEFAULTS` values, or `vi.stubEnv` a non-test MODE in one test.

### L3. `vi.restoreAllMocks()` inside test bodies leaks spies on failure
`src/__tests__/pf2eEngineMath.test.ts:185-189` and `:212-221` call `vi.restoreAllMocks()` as the last statement of the test body after spying `Math.random`. The global `afterEach` (`src/__tests__/setup.ts:8-11`) only does `vi.clearAllMocks()`, which clears call history but does not restore spies — so one failing assertion leaves `Math.random` pinned at 0.5 for the rest of the file, producing cascading misleading failures. Move the restore into `afterEach` (as the neighboring describe blocks in the same file already do), or change setup.ts to `vi.restoreAllMocks()`.

### L4. `asyncUtilTimeout` equals the test timeout
`src/__tests__/setup.ts:6` sets `configure({ asyncUtilTimeout: 10000 })` while `vitest.config.ts:16` sets `testTimeout: 10000`. A hanging `waitFor` therefore dies as an opaque vitest test-timeout instead of a `waitFor` timeout with its last-error/DOM diagnostics. Set `asyncUtilTimeout` comfortably below `testTimeout` (e.g., 5000).

## Strengths

- **Math tests assert literal, hand-computed RAW values with rule citations, across edge cases that matter**: multiclass slot table including warlock-pact exclusion and third-casters (`dnd5e2014EngineMath.test.ts:339-382`), 2014-vs-2024 exhaustion divergence tested on both engines, min-1-HP-per-die with Con 3, PF2e dying/wounded/recovery track, and per-system bonus-stacking semantics declared as "the ONLY difference" in `rules/equipParity.test.ts`. Zero tautological tests found — expected values are never computed with the helper under test.
- **Determinism discipline is real**: no `Math.random`/`Date.now` reliance in any test (verified by grep), seeded RNG injected throughout the combat resolver/round-driver/encounter-builder tests with byte-identical replay assertions, and crit-path tests that search seeds and then `expect(found).toBe(true)` so they cannot skip silently.
- **Storage tests test the real thing**: `fake-indexeddb` with per-test database deletion, dual-write verification, localStorage-to-IDB auto-migration, IDB-unavailable fallback, the stale-async-IDB-load-vs-local-edit race (`useDocuments.test.tsx:246-272`), pagehide/unmount flush of debounced saves, and a 3-consecutive-failure toast test with proper module-state reset (`resetDocumentStorageDiagnosticsForTests`).

---
