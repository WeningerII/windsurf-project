# RFC 003: Rules Intermediate Representation And Effect Resolution

**Status:** Draft (Proposed) — not accepted, no implementation has begun.
**Author:** engineering planning
**Created:** May 31, 2026

## Summary

This RFC proposes a system-independent intermediate representation (IR) for game
mechanics — effects, modifiers, conditions, action intents, and terrain
features — that the existing per-system engines emit into, and a deterministic
resolver that folds those structures into state.

It is the connective tissue between two things the repo already has but does not
yet join: faithful per-system *data/engines* and an event-sourced *scene
runtime*. It is also the prerequisite for three capabilities the master plan
wants but cannot reach cleanly today: applying conditions mechanically, making
terrain functional, and (much later) synthesizing balanced homebrew.

This RFC proposes a **contract and a pilot**, not a framework. It explicitly
respects the master plan's anti-overengineering constraint: no shared
abstraction is extracted until at least three concrete consumers share the
shape.

## Motivation

The deterministic core is strong but the mechanics are encoded *idiomatically
per system*. Two concrete symptoms show the missing layer:

1. **Conditions are tracked, never applied.** The scene runtime and sheets
   record that a token is `prone`, `poisoned`, or `frightened`, but nothing
   computes the mechanical consequence (`prone → disadvantage on attacks`,
   `frightened N → −N on checks within line of sight`). Each engine knows its
   own condition effects internally, but there is no shared shape for "an effect
   that modifies a roll/derived value under a stated condition."
2. **Terrain is cosmetic.** Scene markers carry `{ kind, label, position }` and
   render as colored tiles. There is no representation of "this tile halves fire
   damage" or "this tile costs 2 movement," so terrain cannot participate in
   resolution.

The deeper problem (see `docs/VISION.md`): the project's long-horizon thesis
depends on a *cross-system grammar* of mechanics, and that grammar must be
designed. The contribution-ledger work already planned (master plan Phase 2)
points the same direction — it forces every derived value to name its source,
operation, and magnitude. This RFC proposes that the ledger's "contribution"
shape and a resolver's "effect" shape are **the same primitive** viewed from two
angles (explaining a value vs. producing one), and that defining it once is the
high-leverage move.

## Goals

- A small, typed IR for mechanical effects that is system-independent at the
  boundary but loses no system-specific fidelity.
- A deterministic resolver: `(state, effects, seededRng) → newState`, with no
  `Math.random` in the core, byte-identical under replay.
- Functional terrain: terrain features carry effects drawn from the same IR.
- A single primitive shared with the contribution ledger, so "why is this value
  what it is" and "apply this value" are not two parallel systems.
- A pilot that proves the shape on real consumers before any extraction.

## Non-Goals

- **Not a content-pack rewrite.** Loaders, source filtering, generated metrics,
  and the system registry remain canonical (master plan constraint:
  `No content-pack rewrite`). The IR is computed *from* loaded data; it does not
  replace the data tree.
- **Not a universal rules engine that supersedes per-system engines.** Engines
  keep their authority; the IR is the *interchange format* between them and the
  resolver/ledger/scene runtime.
- **Not an AI surface.** No model decides effects or legality. This is pure
  deterministic TypeScript (master plan: `No LLM hot-path mechanics`).
- **Not a new persisted schema (initially).** The IR is a runtime/derived shape.
  Persisted documents and scene events are unchanged unless a later phase proves
  the need behind its own RFC.
- **Not a premature abstraction.** Until three consumers share it, the pilot
  stays system-local.

## Relationship To The Master Plan

This RFC does not open a new track; it *specifies the connective layer* under
two existing ones:

- **Rule Truth / Provenance (Phase 2, Contribution Ledger).** The ledger's
  contribution row and this RFC's effect descriptor are unified into one
  primitive. Phase 2's three named consumers (5e AC/proficiency, Daggerheart
  passive bonuses, M&M power-modifier math) become the *same three consumers*
  that justify the IR under the anti-overengineering rule.
- **Scene Runtime / Generated Encounters (Phase 6, Resolution & Narration
  Split, and Phase 4 terrain/hazard state).** The resolver is the deterministic
  half of the mechanics/narration split; functional terrain gives the encounter
  builder and map phases something mechanical to target.

If accepted, the master plan is updated (per its maintenance rule) to reference
this RFC from those phases rather than to add a parallel track.

## Design Sketch

> Illustrative shapes, not final signatures. The point is the *contract*, not
> the field names.

### The shared primitive

A single descriptor that can both **explain** a value (ledger) and **produce**
one (resolver):

```
EffectDescriptor {
  id: string;
  systemId: GameSystemId;     // provenance; the IR is system-tagged, not system-shaped
  target: string;             // e.g. "ac", "attack-roll", "fire-damage", "movement-cost"
  operation: 'add' | 'multiply' | 'set' | 'advantage' | 'disadvantage' | 'clamp';
  value: number | null;       // null for advantage/disadvantage-style operations
  source: { kind: 'condition' | 'feature' | 'terrain' | 'equipment' | 'spell'; ref: string };
  condition?: EffectCondition; // when the effect applies (e.g. "attacker is prone")
  manualBoundary?: string;     // honest note when interpretation remains manual
}
```

The same row, surfaced read-only in a tooltip, is a ledger entry; consumed by
the resolver, it changes state. One shape, two readers.

### The resolver contract

```
resolve(state, intents, rng) -> { state, events, ledger }
```

- Pure and deterministic: same `state` + same `intents` + same seeded `rng`
  stream yields byte-identical output (master plan Phase 2 replay invariant).
- Emits the scene runtime's existing typed events; it does not write storage.
- Produces ledger rows as a by-product, so explanation is free.

### Functional terrain

`SceneMarker` (or a sibling type) gains an optional `effects: EffectDescriptor[]`
sourced from a small open-content terrain catalog (e.g. *deep water* →
`{ target: 'fire-damage', operation: 'multiply', value: 0.5 }` plus a drowning
hazard effect). Rendering stays as-is; resolution now has something to read.

### Determinism and local-first

- No `Math.random` in the resolver; it uses the existing seeded RNG helper.
- Nothing here requires a backend or provider key; this is core product code.

## Phased Adoption (dependency-ordered, no timelines)

Ordering, not scheduling.

1. **Define the shared primitive** as a type, with no behavior change. Prove the
   ledger and a resolver can both read it.
2. **Pilot resolution, system-local, in D&D 5e:** apply a small set of
   conditions (prone, poisoned, a frightened-style modifier) through the
   resolver inside the 5e scene path. No extraction yet.
3. **Pilot functional terrain** with two or three open-content terrain types
   feeding effects into the same resolver.
4. **Confirm the three consumers** share the shape (5e condition/derived
   application, Daggerheart passive bonuses, M&M power-modifier math). Only then
   extract the shared `EffectDescriptor`/resolver into a system-independent
   module.
5. **Wire the ledger** to the extracted primitive so provenance and resolution
   stop being two code paths.

Each step lands behind repo-native tests before the next depends on it, and
each step is independently useful: even step 2 alone makes 5e combat
mechanically real for the first time.

## Open Questions

- Is `target` best modeled as an open string with a registry of known targets,
  or a closed per-system union? (Leaning open-string + validation, to keep the
  IR system-independent.)
- Do terrain effects belong on `SceneMarker` or a dedicated `terrain` layer in
  the scene document?
- How much of PF2e's degree-of-success model fits the `operation` enum versus
  needing a richer outcome type?
- Should the ledger/resolver unification land before or after the validation
  registry (master plan Phase 1A)? (Leaning after 1A, so legality and
  application share vocabulary.)

## Acceptance Criteria

This RFC is acceptable to implement only when the design satisfies:

- The IR is computed from loaded data; no loader, source-filter, or generated
  metric behavior changes.
- The resolver is deterministic and replays byte-identically under a fixed seed.
- The pilot is system-local and adds no repo-wide abstraction until three named
  consumers share the shape.
- No persisted document or scene-event schema changes without a follow-up RFC.
- Conditions and terrain that remain manual are labeled manual, not faked.
- Everything works with no provider keys and while signed out.
