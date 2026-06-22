# RFC 003: Rules Intermediate Representation And Effect Resolution

**Status:** Accepted — foundational connective layer, critical path complete
(2026-06-22). The IR + deterministic resolver, the contribution-ledger view,
cross-system equip resolution (all seven systems), conditions-as-IR (5e/PF2e/
d20-legacy), functional terrain, and the grounded AI seam are all live. The 5e
contribution ledger re-backs onto the resolver; the M&M and Daggerheart ledgers
are deliberately left bespoke (their core math is not a pure fold and they
already single-source via per-system helpers — see `docs/MASTER_PLAN.md`).
**Author:** engineering planning
**Created:** May 31, 2026
**Last revised:** May 31, 2026 — re-centered on system-agnostic-from-day-one
sequencing and all-systems RAW parity (supersedes the earlier "5e pilot, then
extract" draft).

## Summary

This RFC defines a **system-independent intermediate representation (IR)** for
game mechanics — effects, modifiers, conditions, action intents, and terrain
features — that every per-system engine compiles its rules-as-written (RAW)
into, plus a **deterministic resolver** that folds those structures into state.

It is the connective tissue between two things the repo already has but does not
yet join: faithful per-system *data/engines* and an event-sourced *scene
runtime*. It is the layer `docs/VISION.md` names as "the connective tissue this
project most needs and least has today."

The earlier draft of this RFC proposed piloting the IR inside D&D 5e first and
extracting it only after three consumers appeared. **That sequencing is
withdrawn.** Per the locked-in product direction, all seven systems are 1:1
equal, and the IR must be system-agnostic from its first commit. The first
proof point is deliberately cross-system: *equip an item and have its effects on
attack, AC, magical bonuses, and feats resolve through one shared resolver,
identically in all seven systems.* That single proof point satisfies the
anti-overengineering "three named consumers" rule many times over (seven
compilers feeding one resolver), so extraction is justified up front rather than
deferred.

## The locked-in product direction this serves

1. **All seven systems are equal.** D&D 5e (2014), D&D 5e (2024), D&D 3.5e,
   Pathfinder 1e, Pathfinder 2e, Mutants & Masterminds 3e, and Daggerheart must
   support character creation and play with equal ease and full RAW fidelity. No
   system is privileged, and none is the "pilot."
2. **Every mechanical rule-as-written is a deterministic instance.** Equipment
   effects on attack/AC, magical bonuses, feats, spells, class features, and
   conditions all resolve in code. The only things that stay non-mechanical are
   rules written as pure GM judgment; those are labeled, never faked.
3. **AI is sandboxed and self-grounding.** It may only select from
   engine-provided legal options and must pass deterministic validation before
   anything becomes state. It grounds on RAW before responding and never authors
   or overrides mechanics. Homebrew only on explicit request, and even then it is
   emitted as IR that passes per-system validation and is flagged as homebrew.
4. **Local-first.** Everything here is pure deterministic TypeScript that works
   signed-out and with no provider keys.

## Motivation

The deterministic core is strong, but mechanics are encoded *idiomatically per
system*. Concrete symptoms of the missing layer (all confirmed in the current
tree):

1. **No attack/damage resolution exists in any system.** No engine computes a
   weapon attack roll or damage. Equipment items carry only AC-relevant fields;
   there is no `attackBonus`, `damageBonus`, or `enhancementBonus` field
   anywhere, and nothing reads one.
2. **`Feat.modifiers` / `Feature.modifiers` are typed but never read.** The
   modifier types exist in `src/types/core/character.ts`; no engine consumes
   them. Feat automation is a hand-maintained allowlist instead.
3. **Conditions are applied imperatively inside `rollCheck`, per system.** 5e
   knows "poisoned → disadvantage" and PF2e knows its status-penalty math, but
   each is bespoke code in a roll path, not data — so conditions cannot compose,
   cannot be explained, and differ wildly in coverage.
4. **Terrain is cosmetic.** `SceneMarker` carries `{ kind, label, position }`
   and renders as a tile; nothing represents "this tile halves fire damage" or
   "costs 2 movement."
5. **The contribution ledger re-computes instead of being the source.** The
   per-system `contributionLedger.ts` builders re-derive the same numbers the
   engine already computed, just to annotate them. Two code paths for one truth,
   free to diverge.

The deeper problem (`docs/VISION.md`): the long-horizon thesis depends on a
*cross-system grammar of mechanics*, and that grammar must be **designed**. This
RFC's key observation is that the contribution-ledger row and a resolver's
effect are **the same primitive viewed from two angles** — explaining a value
versus producing one — and defining it once, system-agnostically, is the
high-leverage move.

## Goals

- A small, typed IR for mechanical effects that is system-independent at the
  boundary but loses no system-specific fidelity (notably d20/PF named-bonus
  stacking and PF2e's three-bucket stacking).
- A deterministic resolver: `(effects, context) → resolved values + ledger`,
  pure arithmetic with no `Math.random`; when dice are involved it draws only
  from the existing seeded RNG, byte-identical under replay.
- One primitive shared with the contribution ledger, so "why is this value what
  it is" and "apply this value" stop being two systems.
- Functional terrain: terrain features carry effects drawn from the same IR.
- A cross-system proof from day one, not a single-system pilot.

## Non-Goals

- **Not a content-pack rewrite.** Loaders, source filtering, generated metrics,
  source manifests, and the system registry remain canonical (master-plan
  constraint: `No content-pack rewrite`). The IR is computed *from* loaded data;
  it does not replace the data tree. Equipment shapes gain optional bonus fields
  additively; nothing is migrated to a Foundry-style pack.
- **Not a universal engine that supersedes per-system engines.** Engines keep
  their authority and their idioms. The IR is the *interchange format* between
  them and the resolver/ledger/scene runtime. Each engine owns a small
  `effectCompiler` that emits IR; the resolver is shared.
- **Not an AI surface.** No model decides effects or legality. This is pure
  deterministic TypeScript (`No LLM hot-path mechanics`). The AI grounding
  contract sits *above* this layer and consumes it.
- **Not a new persisted schema.** The IR is a runtime/derived shape. Persisted
  documents and scene events are unchanged. Equipment bonus fields are optional
  additions to existing in-document shapes, not a new store.

## The shared primitive

A single descriptor that can both **explain** a value (ledger view) and
**produce** one (resolver). It is a strict superset of the existing
`ContributionLedgerEntry`, so the ledger becomes a view of it rather than a
parallel computation.

```ts
interface EffectInstance {
  id: string;
  systemId: GameSystemId;        // provenance TAG; the IR is system-tagged, not system-shaped
  target: string;                // open string: 'ac' | 'attack' | 'damage.fire' | 'save.fortitude' | 'cost.power.0.perRank' | 'evasion' | 'movement-cost' ...
  operation: EffectOperation;
  value: EffectValue;            // number | string | number[] | null
  stackPolicy: StackPolicy;      // how this combines with siblings on the same target
  source: EffectSource;          // { kind, id?, label, path? } — superset of ContributionSourceKind
  label: string;
  condition?: EffectCondition;   // when it applies; defaults to always
  category?: ContributionCategory; // reuse the existing ledger grouping enum
  manualBoundary?: { kind: 'manual' | 'partial' | 'reference-only' | 'unsupported'; note: string };
  details?: Record<string, unknown>;
}
```

### Operations

```ts
type EffectOperation =
  | 'add' | 'subtract' | 'multiply' | 'set' | 'min' | 'max'
  | 'advantage' | 'disadvantage'   // d20 5e: roll twice (resolved to a rollMode)
  | 'set-die' | 'add-die'          // damage dice, M&M ranks, Daggerheart dice
  | 'note';                        // manual-boundary marker; contributes 0
```

### Stacking policy — the one piece the old draft lacked

Stacking is where systems genuinely differ, and the old `operation`-only sketch
could not encode 3.5e/PF/PF2e correctly. `stackPolicy` captures it without making
the IR system-shaped:

```ts
type StackPolicy =
  | 'sum'                          // all instances add (5e magic items + class, Daggerheart, M&M cost)
  | { bonusType: BonusType }       // d20/PF named bonus: only the LARGEST of this type counts
  | 'pf2e-item' | 'pf2e-status' | 'pf2e-circumstance'; // PF2e: highest per bucket, buckets sum
```

`BonusType` already exists in `src/types/core/common.ts` and already includes
`size`, `dodge`, `enhancement`, `circumstance`, `insight`, etc. — it is exactly
the d20/PF stacking vocabulary, reused as-is. **No new bonus types are needed.**

### Relationship to `ContributionLedgerEntry`

The existing `ContributionLedgerEntry` (`src/types/core/contributionLedger.ts`)
is `EffectInstance` minus `stackPolicy`/`condition` and with a narrower
`operation` enum. The IR keeps the ledger types intact and provides a
`toContributionLedger(applied: EffectInstance[]): ContributionLedgerResult` view.
Phase 0 adds the IR as new, additive types and does **not** modify the existing
ledger builders; re-backing those builders onto the resolver is a later phase,
once the resolver is proven, so the change stays gated and reversible.

## Worked encodings — proof of system-agnosticism

The same `EffectInstance` shape encodes every system; only `systemId`, `target`,
and `stackPolicy` change.

- **5e +1 magic weapon:** two effects, `target: 'attack'` and
  `target: 'damage.slashing'`, `operation: 'add'`, `value: 1`,
  `stackPolicy: 'sum'` (5e magic bonuses always add).
- **PF2e item/status/circumstance:** three effects on `target: 'attack'`, each
  `add 1`, with `stackPolicy: 'pf2e-item' | 'pf2e-status' | 'pf2e-circumstance'`
  → resolver takes the highest within each bucket then sums (+3).
- **3.5e enhancement bonus:** `target: 'attack'`, `add 2`,
  `stackPolicy: { bonusType: 'enhancement' }` → does not stack with other
  enhancement bonuses.
- **PF1e size + enhancement on AC:** `add 1` with
  `stackPolicy: { bonusType: 'size' }` and `add 1` with
  `stackPolicy: { bonusType: 'enhancement' }` → different types, both apply (+2).
- **M&M power cost / power → defense:** `target: 'cost.power.0.perRank'`,
  `add 1`, `stackPolicy: 'sum'`, `category: 'cost'`; Protection →
  `target: 'defense.toughness'`, `add N`. Same IR expresses point-buy math.
- **Daggerheart armor score / threshold:** `target: 'armorScore'` /
  `target: 'severeThreshold'`, `add N`, `stackPolicy: 'sum'`,
  `condition: { kind: 'while-armored' }`.

The only per-system variation is `stackPolicy` and the `target` namespace.
Everything else is identical structure. That is "tagged, not shaped."

## The resolver

```
resolveEffects(effects: EffectInstance[], context: ResolveContext): ResolveResult
```

- **Pure arithmetic fold.** Group applicable effects by `target`; within each
  target, apply `stackPolicy` (sum adds; `{ bonusType }` takes the max per type;
  PF2e takes the max per bucket then sums); apply `set`/`multiply`/`min`/`max`
  in a defined order; fold `advantage`/`disadvantage` into a `rollMode`.
- **Determinism.** The fold uses no randomness. Dice operations (`add-die`,
  attack d20) draw exclusively from the existing seeded RNG
  (`src/scene/seededRng.ts`), never `Math.random`. Same effects + same seed ⇒
  byte-identical result. This honors the scene runtime's replay invariant.
- **Ledger is free.** The set of effects that actually applied *is* the ledger;
  `toContributionLedger` projects it. "Compute AC" and "explain AC" become one
  call, two projections.

### How "equip item → attack / AC / bonus" flows

```
1. User equips a +1 weapon and +1 armor.
2. The system's effectCompiler.collectEffects(document) emits EffectInstance[]
   (armor base AC, dex, shield, item attack/damage/AC bonuses, feat modifiers,
   active conditions) — reusing each system's existing AC logic, now expressed
   as IR.
3. resolveEffects(effects, ctx) folds per target:
     ac     → base (set) + dex (sum) + enhancement (typed) = total
     attack → proficiency + ability + item bonus
     damage → weapon die (set-die) + ability + item bonus
4. The engine writes resolved scalars into its derived fields.
5. The sheet breakdown reads the same applied-effects list — no second compute.
```

Because the compiler produces IR and the resolver folds it **identically
regardless of `systemId`**, the same flow runs in all seven systems; only each
system's compiler and `stackPolicy` choices differ.

## Participant-aware resolution (N participants per interaction)

Every interaction loop has **N participants**, and an action by one participant
has downstream effects on more than a single receiver. This is a first-class
design constraint, not an edge case, and it recurs across loops:

- **Combat targeting.** An action resolves against *one or more* targets.
  Area-of-effect (a fireball, a breath weapon) hits every token in a region;
  multiattack/cleave hits several chosen targets; and the same action may change
  which targets it affects between uses. Resolution must produce a *per-target
  outcome*, and where the rules roll shared damage once (5e/PF2e area spells roll
  damage a single time and each target saves independently), the structure must
  reflect that — shared rolls plus per-participant saves and per-participant
  damage.
- **Initiative / the turn loop.** The loop is over *all* combatants; each must be
  acknowledged in order, and effects (e.g. an aura, difficult terrain, a
  condition that ends "at the start of your next turn") are evaluated per
  participant as the loop advances.
- **Social / conversation loops (future, AI-DM).** A scene can contain multiple
  NPCs; depending on variables (proximity, relationship, awareness) a beat may
  involve +1 participants, and an utterance can have downstream effects on every
  NPC who heard it, not just the addressee.

The unifying shape: an interaction names a **participant set** (one or more
actors, one or more targets, and potentially observers), and resolution returns
**per-participant outcomes** plus any shared rolls/effects. The deterministic
resolver stays per-effect; the participant layer sits above it, deriving an
independent seeded sub-stream per participant (keyed by base seed + actor +
target) so each participant's resolution is independent and replay-stable
regardless of target order. Combat resolution implements this now; the same
participant-set shape is intended to generalize to the social/conversation loop
when the AI-DM layer lands, rather than being reinvented per loop.

## Functional terrain

Terrain features carry `effects: EffectInstance[]` from the same IR, drawn from a
small open-content terrain catalog (e.g. *deep water* →
`{ target: 'damage.fire', operation: 'multiply', value: 0.5 }` plus a drowning
hazard). Rendering is unchanged; resolution now has something to read. Whether
terrain effects live on `SceneMarker` or a dedicated terrain layer is settled in
favor of a dedicated, additive, optional field on scene state, so marker
rendering is untouched and no persisted event schema changes.

## AI grounding contract (above this layer)

The IR makes the AI seam clean and system-agnostic:

- **Candidate pools come from loaders + the resolver's legal options, never the
  model.** The model receives only enumerated legal ids/actions.
- **Mandatory deterministic validation before state.** AI output is draft input;
  it becomes state only after the per-system `SystemValidator` (characters) or
  the scene action validator (play) accepts it.
- **Self-grounding.** The AI is handed the deterministic facts — candidate pool,
  the applied-effects ledger, active conditions/terrain — and selects; it never
  authors mechanics.
- **Server-side gateway, no browser secrets; no-keys fallback.** The provider
  call lives behind a server function. With no key, every surface degrades to the
  deterministic/manual tool. The resolver is the mechanics hot path; the LLM runs
  strictly before (drafting) or after (narration).

## Phased adoption (dependency-ordered, system-agnostic from day one)

Ordering, not scheduling. Each step lands behind repo-native tests before the
next depends on it.

0. **IR + resolver, additive and isolated.** Define `EffectInstance` and the
   stacking/operation types; implement the pure resolver fold and the
   `toContributionLedger` view; prove every worked encoding above folds to
   hand-checked totals. New files only; zero edits to existing engines.
1. **The cross-system proof point.** Give each of the seven systems an
   `effectCompiler.collectEffects(document)` and add optional bonus fields to the
   equipment shapes (additive). Route each engine's AC (and new attack/damage)
   through `resolveEffects`. Acceptance: equipping an item resolves AC/attack/
   damage deterministically via the shared resolver, **identically in all seven
   systems**, with the ledger naming the item — and existing engine outputs for
   non-magic gear are unchanged.
2. **Conditions as IR.** Replace the per-system imperative `rollCheck` condition
   math with `ConditionDescriptor` data folded by the resolver, across all
   systems that have condition rules. Preserve current outputs; conditions now
   compose and explain.
3. **Ledger unification.** Re-implement the existing `contributionLedger.ts`
   builders as `toContributionLedger(resolveEffects(collectEffects(doc)))`,
   deleting the duplicate derivation. Existing ledger tests must pass unchanged.
4. **Functional terrain + seeded scene resolution.** Add terrain effects and a
   `resolveActionMechanics(state, action, rng)` that folds actor + terrain +
   condition effects through the resolver under the scene seed.
5. **AI grounding seam.** Candidate pools over loaders + resolver legal actions;
   validators for all seven systems; server-side draft gateway with fixtures and
   a no-keys fallback.

## Acceptance criteria

- The IR is computed from loaded data; no loader, source-filter, or generated
  metric behavior changes.
- The resolver is deterministic and replays byte-identically under a fixed seed.
- The cross-system proof point passes for **all seven** systems before mechanic
  coverage deepens.
- No persisted document or scene-event schema changes without a follow-up RFC;
  equipment bonus fields are optional additive in-document fields.
- Conditions, terrain, and any rule that genuinely remains GM judgment are
  labeled manual, not faked.
- Everything works with no provider keys and while signed out.

## Resolved questions (were open in the prior draft)

- **`target` modeling:** open string with per-system validation, to keep the IR
  system-independent. A known-target registry can come later if needed.
- **Pilot vs. cross-system:** cross-system from day one. The seven compilers are
  the consumers that justify the shared resolver immediately.
- **Ledger/resolver unification timing:** the IR ships first (Phase 0); the
  existing ledger builders are re-backed onto it in Phase 3, once proven.
- **PF2e degree of success:** modeled as a richer outcome on the action
  resolution path (Phase 4), not forced into the scalar `operation` enum.
