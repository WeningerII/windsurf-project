# RFC 005: System-Agnostic Resource Pools And Stateful Action Verbs

**Status:** Accepted — primitive + first consumers implemented; broader adoption
incremental.
**Author:** engineering planning
**Created:** June 17, 2026

## Summary

This RFC defines a **system-agnostic model for depletable resource pools** — the
shared shape behind D&D spell slots, limited-use features, PF2e focus/hero
points, 5e hit dice, ki/sorcery points, Daggerheart stress/armor/hope, and the
not-yet-built item-charges/"consume" verb — plus the small `clampCount`
primitive every system was duplicating.

It is the **stateful** counterpart to RFC 003. RFC 003 made *static* derivation
agnostic: given character state, one resolver folds per-system effects into
derived values (AC, attack, …) identically for all seven systems. But the
*stateful action verbs* — spend, restore, reset/rest, consume — had **no**
shared layer. Each system re-implemented the same "decrement a counter, clamp to
bounds, refill on rest" logic in its own React mutation handler, with the same
inline `Math.max(0, Math.min(bound, x))`.

## Motivation

A survey of how all seven systems handle equip/use/consume/spend (see the
discussion that produced this RFC) found:

- The `SystemEngine` interface (`src/registry/types.ts`) has exactly three
  methods — `prepareData`, `rollCheck`, and `applyDamage`. So **`applyDamage`
  is the only stateful verb that is already system-agnostic.**
- `SystemDataModel` is a pure black box (`{ [key: string]: unknown }`), so the
  document imposes no shared structure on resources.
- A search for any shared `ResourcePool` / `spendResource` / `consumeResource` /
  character reducer returned nothing.
- The same bounded-counter clamp was reimplemented ~8 times, and several systems
  were missing verbs entirely (no item "consume" anywhere; no rest automation in
  5e/M&M/Daggerheart).

The duplication is **incidental** (same shape, different labels), which is
exactly the case an abstraction should collapse.

## Design

A pool is modeled canonically as a capacity and the amount consumed, always
clamped. Implemented in `src/utils/resourcePool.ts`:

```ts
interface ResourcePool { max: number; spent: number }

clampCount(value, max, min = 0)            // the shared bounded-clamp primitive
createPool(max, spent?)                    // clamps spent into 0..max
spend(pool, n = 1)  restore(pool, n = 1)  reset(pool)   // verbs, all clamped
setMax(pool, max)                          // change cap, keep spent (re-clamped)
remainingOf · isExhausted · isFull
poolFromRemaining(current, max) · remainingShape(pool)  // {current,max} adapter
```

It deliberately maps **both** data-model shapes found in the survey:

- **"used / total"** pools (spell slots `{ total, used }`): `total → max`,
  `used → spent`.
- **"current / max"** pools (feature uses, focus, stress/armor): via the
  `poolFromRemaining` / `remainingShape` adapter.

Raw `+/-` stepper edits that apply a signed delta straight to a counter use
`clampCount`; the semantic verbs (`spend`, `reset` for rest, …) are layered on
top of it.

## What was migrated

- `clampCount` replaced every depletable-resource clamp: 5e spell slots, pact
  magic, limited-use features, and hit dice (handlers + level-up); d20-legacy
  spell slots and Dragon Disciple slots; PF2e focus points; Daggerheart stress,
  armor slots, and hope.
- d20-legacy spell-slot `spend`/`recover`/`reset` delegate to the semantic verbs.

The clamp now lives in exactly one place, behavior-identical (the existing
spell-slot, vancian-prep, and engine-math tests pin it).

## Boundaries (what intentionally stays per-system)

Per the repo's anti-overengineering rule ("do not create repo-wide abstractions
unless at least 3 concrete consumers share the same interaction shape"), the
abstraction targets only the genuinely-shared shape:

- **Equip** stays a thin per-system mutation. Slot semantics differ (5e slots
  vs. equipped-flag vs. Daggerheart weapon/armor loadout-with-burden vs. M&M
  having no equipment); the *consequences* already resolve through RFC 003's
  `compileEquipmentEffects`. See the d20 equip flow in
  `src/systems/d20-legacy/useD20LegacyMutationHandlers.ts`.
- **M&M power points** are a computed budget, not a depletable spend-pool.
- **Daggerheart loadout/vault** capacity rules are not a numeric pool.
- **Status tracks** (5e death saves `[0,3]`, exhaustion `[0,6]`) are bounded but
  are not resources you spend and restore; they keep their inline clamp.

## Relationship to RFC 003

RFC 003 (`docs/rfc/003-rules-ir-and-effects.md`) is the agnostic **static**
layer (compile RAW → IR → resolve to derived values). This RFC is the agnostic
**stateful** layer (operate on bounded resource counters). Together they cover
"what a character's state derives to" and "how a verb changes that state." The
`docs/MASTER_PLAN.md` direction — state changes flowing through "typed
actions/events … the same reducer/resolver path as player actions" — is the
eventual home for these verbs; this primitive is the first step toward it.

## Future work

- A typed `consume` verb for item charges/ammunition (missing everywhere today),
  expressed against `ResourcePool`.
- Rest as a first-class `reset` across the systems that lack rest automation.
  **Done (2026-07-17):** Daggerheart gained its long-rest downtime moves
  (`src/systems/daggerheart/daggerheartRest.ts`) — Tend to All Wounds / Clear
  All Stress / Repair All Armor built on `reset`, Prepare on `clampCount` —
  offered as individual moves (Daggerheart rest is move-based), with the
  short-rest `1d4 + tier` variants a follow-up. The two remaining hand-rolled
  rest handlers were then consolidated: 5e (`dnd5eRest.ts`) and PF2e
  (`pf2eSheetShared.ts`) now route their slot/focus/HP refills through the pool
  verbs via a `slotPool` adapter, matching the d20-legacy pattern —
  behavior-identical (the pinned rest tests are unchanged). So **all five
  rest-bearing systems now share the RFC 005 primitive.**
- Optional: a generic per-pool registry so a UI stepper and an AI-DM action
  drive the same code path.
