# RFC 006: Scene Runtime — Documents, Event Sourcing, And Seeded Replay

**Status:** Accepted — runtime shipped; this RFC documents the architecture and
contracts (the Scene Runtime track's Phase 0, written retroactively) and names
the next increments.
**Author:** engineering planning
**Created:** June 17, 2026

## Summary

The deterministic scene runtime described by the MASTER_PLAN "Scene Runtime,
AI-DM Control Plane, And Generated Encounters" track is **shipped**: scene
documents, an append-only event log with a pure fold, seeded RNG, a typed
action→event boundary, per-system combat resolvers, a tactical executor, an
encounter builder, and browser-local persistence with import/export all exist
and are test-covered. What never landed was the track's **Phase 0 Runtime
Architecture RFC**. This document fills that gap: it pins the contracts the
runtime already honors so the remaining phases (encounter-spec validation,
map-aware spawn zones, AI drafting, backend sync) build on a written spec rather
than reverse-engineering the code.

It is deliberately descriptive of current reality plus the immediately-next
increments — not a redesign. The runtime is deterministic-first and provider-free
by construction; nothing here introduces an AI dependency.

## Scene documents and storage

A scene is a persisted `SceneDocument` (`src/types/core/scene.ts`,
`src/scene/runtime.ts`):

- `id`, `name`, `systemId`, optional `campaignId`
- `initialState: SceneState` — the scene at sequence 0 (grid, tokens, markers,
  initiative, round, `seed`)
- `events: SceneEvent[]` — the append-only log
- `createdAt`, `updatedAt`, `version: 1`

The **current** scene is never stored; it is the pure fold of
`initialState + events` (see below). Persistence lives in
`src/utils/sceneStorage.ts` under the browser-local key **`rpg-scenes-v1`**
(`SCENES_STORAGE_KEY`), wrapped as `{ version, scenes, lastModified }`.
`exportScenes`/`importScenes` round-trip the documents as JSON; `useScenes`
(`src/hooks/useScenes.ts`) owns the React lifecycle and merges cross-tab
`storage` events by `updatedAt`. There is **no Supabase requirement** — backend
sync (RFC 001) is additive and optional.

**Relation to campaigns and characters.** A scene optionally belongs to a
campaign via `campaignId`. Tokens reference a source document by `refId`
(a character or monster id); the token carries its own combat-relevant snapshot
(position, hp, conditions) so the scene is self-contained for folding and the
referenced sheet can change without rewriting history.

## Event sourcing and the fold

`foldSceneEvents(scene)` (`src/scene/runtime.ts`) is a **pure** function: it
clones `initialState`, sorts events by `sequence`, validates each
(`validateSceneEvent`), and applies the valid ones (`applySceneEvent`). It never
mutates its input and returns `{ state, issues }`. Two validation layers are kept
distinct on purpose:

- **Intent validation** gates *new* actions at the boundary (e.g. "cannot advance
  turn with no initiative") — forward-looking.
- **Event validation** is historical: an old event with an odd payload still
  folds cleanly rather than crashing a replay.

This split is the migration contract: **event types and payloads are
append-only and additive.** New event kinds may be added; existing kinds must
keep folding. Malformed persisted documents are dropped by `parseSceneDocument`
(`src/utils/boundaryValidation.ts`), never thrown into the UI.

## Seeded replay

All randomness flows through `createSeededRng` (`src/scene/seededRng.ts`,
XorShift128). Seeds are derived deterministically from the scene seed plus a
discriminator (event count, round, turn index, per-click nonce), so the runtime
core contains **no `Math.random`**. The guarantee: *the same initial scene + the
same event log yields byte-identical folded state*, and an autonomous round with
the same seed makes the same decisions. This is what makes audit, replay, and
"re-run from turn N" possible, and it is the property every future phase
(including AI drafting) must preserve.

## Typed action/event boundary

The only way scene state changes is: a `SceneActionIntent` →
`resolveSceneAction(scene, intent, options)` (validate against the folded state,
build a typed `SceneEvent` or return structured `issues`) → `appendSceneEvent`.
The UI never mutates scene state directly.

**Event ownership.** Three producers, one path:

1. **Player UI** (`SceneManager`) builds intents from clicks.
2. **The autonomous round** (`runSceneRound` → tactical executor) emits intents
   that are applied through the same `resolveSceneAction`/`appendSceneEvent` path.
3. **Future AI tools** (Phase 8+) must also emit intents through this boundary —
   never write events or state directly.

## Resolution and combat-over

Combat resolves deterministically per system (`src/rules/resolver/resolve.ts`,
`src/rules/combat/sceneCombat.ts`): d20 degrees (5e/3.5e/PF1e/PF2e), M&M 3e
d20-vs-Dodge/Parry + Toughness condition track, and Daggerheart 2d12 duality.
Both the manual single-attack path and the autonomous round enforce the same
rules (liveness, reach by Chebyshev distance). `runCombatRound` walks initiative
re-deriving the living participant set each turn.

This RFC's accompanying increment wires **combat-over detection** into the UI:
`isRoundConclusive` (one living faction) is combined with "≥2 factions were
present" so a finished battle (one side wiped) disables Run Round and shows a
"Combat over" badge, while a single-faction scene still lets Run Round walk the
initiative/round cycle. This closes the prior gap where Run Round stayed enabled
forever with no "combat over" surface.

## Next increments (named, not yet built)

- **Structured encounter-spec validation** — a deterministic validator that
  checks a proposed encounter spec (monster ids, counts, difficulty) against
  loader ids, the open-content policy, and the system budget, returning
  machine-readable errors. This is the gate a future AI drafting loop (Phase 8)
  consumes before it ever touches the event-backed scene path.
- **Map-aware spawn zones** — placement that respects terrain/hazard markers.
- **Manual correction/rebalance ergonomics** — editing a drafted encounter.
- **Backend sync** (RFC 001) — the event log is sync-friendly (compare last
  sequence); conflict policy is out of scope here.
