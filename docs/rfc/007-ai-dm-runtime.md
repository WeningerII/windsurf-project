# RFC 007: Autonomous AI-DM Runtime — Proposals Over The Scene Runtime

**Status:** Draft — proposed, not yet implemented. This RFC describes a target
design layered on shipped infrastructure (RFC 002 gateway, RFC 005 resource
pools, RFC 006 scene runtime); nothing here has landed. It supersedes nothing
and introduces no new provider dependency beyond the existing gateway.
**Author:** engineering planning
**Created:** July 20, 2026

## Summary

RFC 006 shipped a deterministic, provider-free scene runtime: scene documents,
an append-only event log with a pure fold, seeded replay, a typed
action→event boundary, per-system combat resolvers, a tactical executor, and an
encounter builder. RFC 002 shipped a provider-agnostic AI control plane whose
governing rule is **the model proposes, deterministic validators decide**. RFC
006 explicitly reserved a seat for "future AI tools (Phase 8+)" that "must also
emit intents through this boundary — never write events or state directly," and
the MASTER_PLAN "Scene Runtime, AI-DM Control Plane, And Generated Encounters"
track names an AI-DM as its endpoint.

This RFC specifies that endpoint: an **autonomous AI-DM runtime** that can
narrate scenes, propose NPC and monster turns, pace encounters, and adjudicate
outcomes — expressed **entirely as proposals** over the existing scene runtime
and resource pools. The AI-DM never mutates game state. Every action it wants
becomes a `SceneActionIntent` that passes through `resolveSceneAction`
(`src/scene/runtime.ts`) and the deterministic rules core before it can append a
single event. The runtime is default-off behind `VITE_AI_ENABLED`, rate-limited
through the RFC 002 gateway, and works across all seven game systems as equals.

It is deliberately an **orchestration** layer, not a second rules engine. Where
RFC 002's shipped surfaces are one-shot (prompt → draft → review → apply), the
AI-DM is the **loop** form of the same contract: it runs turn after turn, but
each turn is still a bounded proposal a validator can veto.

## Motivation

The pieces already exist; what is missing is the loop that binds them:

- The **only** way scene state changes is `SceneActionIntent` →
  `resolveSceneAction(scene, intent, options)` → `appendSceneEvent`
  (`src/scene/runtime.ts`). Three producers already share this one path: the
  player UI (`SceneManager`), the autonomous round (`runSceneRound` in
  `src/rules/combat/sceneCombat.ts` → the tactical executor in
  `src/rules/tactical/`), and — per RFC 006's own words — future AI tools.
- The **autonomous round already exists and is provider-free**. `runCombatRound`
  (`src/rules/tactical/roundDriver.ts`) walks initiative and emits intents
  through the same resolver; `runSceneRound` drives a full round. An NPC turn is
  *already* machine-decidable deterministically. The AI-DM does not replace this;
  it **proposes** the intent inputs that the deterministic executor then scores
  and resolves.
- **Encounter adjudication has a gate**: `validateEncounterSpec`
  (`src/scene/encounterSpec.ts`) returns coded `EncounterSpecIssue`s and budget
  headroom, and RFC 006 names it "the entry contract" for AI drafting.
- **Narration has a home**: RFC 002's shipped `scene-narration` task turns a
  deterministic recap into prose grounded in those facts only, attached as
  read-only presentation, never state.
- **Resource changes have a verb layer**: RFC 005's `ResourcePool` primitive
  (`src/utils/resourcePool.ts`) gives `spend`/`restore`/`reset` a single clamped
  home across all five rest-bearing systems, and reserves a `consume` verb.

What is absent is a **runtime that sequences these into a play loop** — decide
when to narrate, whose turn to propose, when to advance pacing, when to call a
scene resolved — while preserving RFC 006's core guarantee (`same initial scene
+ same event log ⇒ byte-identical folded state`) and RFC 002's core guarantee
(no direct model writes). This RFC defines that runtime without weakening either.

## Scope

In scope:

- An **AI-DM control loop** that, given a folded scene and DM context, produces
  a bounded sequence of *proposals* — narration, turn intents, pacing beats,
  and adjudication calls — each validated before it applies.
- **Narration proposals** over deterministic event/result artifacts (reusing
  and extending the `scene-narration` task).
- **NPC / monster turn proposals**: the AI-DM proposes tactical *intent* (target
  preference, action choice, positioning goal) that feeds the existing tactical
  executor, which deterministically scores and resolves it.
- **Scene pacing proposals**: when to advance a turn/round, when to introduce a
  described complication, when a lull warrants a beat — always as intents the
  runtime can reject.
- **Encounter adjudication**: proposing spec edits and outcome framing, gated by
  `validateEncounterSpec` and the per-system budget dispatch.
- New AI gateway task contracts (`src/ai/contracts.ts`) for the above, each with
  a parse-don't-cast validator and a deterministic candidate/verb pool.
- A **DM policy object** describing autonomy limits (max proposals per turn,
  which proposal classes are enabled, human-confirm thresholds).

Out of scope:

- Direct model writes to scene state, character documents, campaign, or sync
  storage (forbidden by RFC 002; re-affirmed here).
- A second rules engine, second resolver, or model-side arithmetic. Legality,
  damage, degrees of success, budgets, and resource clamps stay in the
  deterministic core.
- Any per-move mechanical hot path running through the model (RFC 002 out-of-scope
  item; the tactical executor stays deterministic).
- Unbounded / background autonomy: no unattended multi-scene campaign advancement,
  no self-triggering loop without a human-initiated round.
- Provider/model lock-in: the AI-DM consumes the existing provider-agnostic
  gateway seam (`AiProviderAdapter`), not a new SDK.
- Homebrew/closed-content generation into shipped catalogs.
- 5e-specific behavior. See "Peer-system dispatch."

## Design principles

### The model proposes, deterministic validators decide (inherited, non-negotiable)

This is RFC 002's governing rule, applied to the play loop. The AI-DM's entire
output is a set of **proposals**. Nothing the model returns is trusted:

- A proposed turn is a `SceneActionIntent`, re-parsed by the contract's
  parse-don't-cast validator and then handed to `resolveSceneAction`, which
  validates it against the *folded* state (liveness, reach by Chebyshev distance,
  initiative, resource availability) exactly as it validates a player click.
- A proposed resource spend routes through the RFC 005 verbs (`spend`/`consume`),
  which clamp to bounds — the model cannot overspend a pool.
- A proposed encounter edit is re-run through `validateEncounterSpec`; an
  over-budget or unknown-monster proposal is rejected with a coded issue.
- A proposed narration is grounded only in the deterministic recap it was given;
  it is attached as read-only presentation and can never assert a mechanical
  fact the event log does not already contain.

**Validator veto is total.** If validation fails, the proposal is dropped (or
sent once through the bounded repair loop of RFC 002), and the runtime falls back
to the deterministic autonomous round or to a human prompt. The model is never a
tie-breaker on rules.

### Determinism and replay are preserved

The AI-DM sits *outside* the fold. Model calls are non-deterministic, so their
output may only ever enter the scene as **already-resolved, seeded events** —
identical to how `token.damaged` and `check.rolled` already store resolved
values so the fold never re-rolls (RFC 006). Any randomness inside an accepted
proposal is drawn from `createSeededRng` (`src/scene/seededRng.ts`) keyed off the
event id, not from the model. The guarantee holds: *the same event log folds to
byte-identical state*, with or without the AI-DM having produced it. A replay of
an AI-DM scene never needs to call the model again.

### Local-first remains the baseline

With no provider key, the scene runtime is fully playable: manual turns,
`runSceneRound`, checks, oracle, dice, encounter building. The AI-DM is a
**disabled affordance** in that case, never a broken workflow (RFC 002). The
deterministic autonomous round is the graceful degradation of *every* AI-DM
turn: if a proposal is vetoed, times out, or the gateway is over budget, the
runtime runs the deterministic executor for that actor instead.

### Peer-system dispatch — no system is privileged

The AI-DM must serve `dnd5e`, `dnd5e-2024`, `dnd35e`, `pf1e`, `pf2e`, `mam3e`,
and `daggerheart` as equals. It achieves this by **never touching system rules
directly** — it dispatches through the same system-agnostic seams the rest of the
runtime uses:

- Turn resolution goes through the tactical executor and per-system combat
  resolvers (`src/rules/resolver/resolve.ts`, `src/rules/combat/sceneCombat.ts`),
  which already cover d20 degrees (5e / 3.5e / PF1e / PF2e), M&M 3e d20-vs-Dodge/
  Parry + Toughness track, and Daggerheart 2d12 duality.
- Resource proposals go through the `SystemEngine`
  (`src/registry/types.ts`: `prepareData` / `rollCheck` / `applyDamage`) and the
  RFC 005 `ResourcePool` verbs — the only stateful seams shared by all systems.
- Encounter proposals go through the single-source-of-truth budget dispatch
  (`encounterPartyBudget` / `monsterEncounterCost` / `supportsEncounterBudget`,
  `src/scene/encounterDraft.ts`) and `validateEncounterSpec`.

The AI-DM prompt is parameterized by `systemId` and receives only
loader-derived, system-correct candidate pools (valid action ids, monster ids,
maneuver options for *that* system). A proposal naming a 5e-only construct in a
Daggerheart scene simply is not in the candidate pool and is rejected
deterministically. **The runtime carries no `if (systemId === '...')` play
logic** — system knowledge lives behind the engine/validator seams, and the loop
is written once.

## Architecture

### The DM loop (orchestrator)

A pure orchestrator `runDmTurn(scene, dmContext, policy)` (proposed home:
`src/scene/aiDm/` or `src/rules/tactical/` adjacent to the executor) produces an
ordered list of **candidate proposals** for the current point in the scene. It
does not call the gateway itself and it does not append events; it is injected
with a `proposeFn` (the gateway call) and returns proposals plus the intents it
would dispatch, so it is unit-testable with fixtures exactly like RFC 002's core.

Each loop step:

1. Fold the scene (`foldSceneEvents`) to get authoritative current state.
2. Decide the proposal class for this beat (narrate / propose-turn / pace /
   adjudicate) from deterministic scene signals — `isRoundConclusive`
   (`roundDriver.ts`), whose initiative turn it is, whether a lull exists.
3. Build the **candidate/verb pool** for that class from loaders and folded state.
4. Call the gateway task with system id, folded summary, and the pool.
5. Parse-don't-cast the response; map it to typed intents / narration.
6. Validate each intent through `resolveSceneAction`; drop or repair on failure.
7. Apply survivors via `appendSceneEvent`; attach narration read-only.

The loop is **human-initiated and bounded**: it runs on an explicit "AI-DM: run
this turn/round" action, produces at most `policy.maxProposalsPerTurn`, and stops
at scene boundaries. There is no self-scheduling background job (RFC 002
out-of-scope: no background jobs).

### New gateway task contracts

Following RFC 002's one-entry-at-a-time allowlist growth (`AI_GATEWAY_TASKS` in
`src/ai/contracts.ts`), the AI-DM adds task classes incrementally, each with its
own request/response contract, `parseTaskData` case, prompt builder, and fixture:

- `dm-turn-intent` — folded scene + actor + system-correct action pool →
  structured tactical intent (chosen action id, target ref, positioning goal).
  Validated to a `SceneActionIntent`, then resolved by the tactical executor.
- `dm-narration` — extends the shipped `scene-narration` task to the running
  loop; recap → prose, facts-only, read-only.
- `dm-pacing` — folded scene + recent event summary → a bounded pacing beat
  (advance turn, introduce a *described* complication as an intent, or hold).
- `dm-adjudicate` — proposed encounter/outcome framing, gated by
  `validateEncounterSpec` and the budget dispatch.

Every task reuses the existing gateway plumbing unchanged: the server function
holding the key (`netlify/functions/ai-gateway.mts`), the provider factory and
`AiProviderAdapter` seam (`src/ai/providerFactory.ts`), the mock adapter for
keyless CI (`src/ai/mockAdapter.ts`), fixture replay, timeout, structured logs
(`src/ai/gatewayLog.ts`), and the fixed-window rate limiter
(`src/utils/rateLimit.ts`).

### Proposal → intent → event boundary

The AI-DM is producer #3 in RFC 006's "three producers, one path" model, and it
gains **no** privileges over producers #1 and #2:

```
gateway proposal → parseTaskData → typed SceneActionIntent
                 → resolveSceneAction(folded scene, intent, options)   // veto point
                 → appendSceneEvent                                    // only on pass
```

Narration and other read-only presentation attach to the event/result artifacts
they describe, never to `SceneState`. Resource effects of an accepted intent flow
through `applyDamage` / the RFC 005 pool verbs, never a raw counter write.

### DM policy and guardrails

A `DmPolicy` object makes autonomy explicit and inspectable:

- `enabledClasses` — which proposal classes are live (narration only, +turns, +pacing…).
- `maxProposalsPerTurn`, `maxTurnsPerInvocation` — hard bounds on a single run.
- `confirmThreshold` — proposal classes that require human confirm before apply
  (e.g. pacing complications default to confirm; combat turns can auto-apply
  because the deterministic resolver already gates them).
- `repairBudget` — reuses RFC 002's bounded single-repair loop; no unbounded retry.

Rate limiting is enforced by the existing gateway limiter (`AI_RATE_LIMIT` /
`AI_RATE_LIMIT_WINDOW_MS`); exhaustion degrades a turn to the deterministic
executor (HTTP 429 → fallback), so the loop can never spin the provider.

## Safety and guardrails (summary)

- **Validator veto is total** — no proposal reaches the event log without passing
  `resolveSceneAction` / `validateEncounterSpec` / the pool clamps.
- **No direct writes** — the AI-DM touches state only via `appendSceneEvent`,
  same as a player click.
- **No unbounded autonomy** — human-initiated, per-invocation caps, scene-boundary
  stops, gateway rate limit, no background jobs, no cross-scene advancement.
- **Determinism preserved** — model output enters only as seeded, resolved
  events; replay never re-calls the model.
- **Default-off** — `VITE_AI_ENABLED` gates the whole surface; keyless CI runs it
  through the mock adapter and fixtures.
- **Facts-only narration** — grounded in the deterministic recap; cannot assert
  mechanics the log does not contain.

## Phased rollout

Following RFC 002's "narrow first, one task at a time" discipline:

- **Phase 0 — this RFC.** Pin the contracts and the proposal→intent→event
  boundary before code.
- **Phase 1 — narration loop.** `dm-narration` in the running scene, read-only,
  no state authority. Lowest risk; reuses the shipped narration task.
- **Phase 2 — turn-intent proposals.** `dm-turn-intent` feeding the existing
  tactical executor; the deterministic resolver remains the decider. Prove
  parity: an AI-DM turn and a deterministic autonomous turn both resolve through
  the same path and both fold identically.
- **Phase 3 — pacing.** `dm-pacing` with `confirmThreshold` defaulting to human
  confirm for complications.
- **Phase 4 — adjudication.** `dm-adjudicate` gated by `validateEncounterSpec`.
- **Phase 5 — cross-system hardening.** Fixture coverage for all seven systems
  proving no system-specific branch leaked into the loop; the deterministic
  fallback covers every vetoed/over-budget turn.

Each phase is default-off, fixture-covered in CI without a key, and must leave
the keyless product fully playable.

## Acceptance criteria

The AI-DM runtime is acceptable only when:

- The scene runtime is fully playable with no provider key; the AI-DM is a
  disabled affordance, not a broken workflow.
- No proposal mutates scene, character, campaign, or sync state directly; every
  applied change went through `resolveSceneAction` + `appendSceneEvent`.
- Every proposal is parsed (parse-don't-cast) and deterministically validated
  before apply; invalid intents, over-budget specs, and overspends are rejected
  with coded issues.
- Replay is preserved: an AI-DM scene folds to byte-identical state without
  re-calling the model.
- The loop is bounded (per-invocation caps, human-initiated, rate-limited) with
  a deterministic fallback for every vetoed or unavailable turn.
- The same loop code serves all seven systems with no per-system play branch;
  fixtures prove it for each.
- CI exercises the full path via fixtures and the mock adapter, no live calls.

## Open questions

- **Turn-intent granularity.** Should `dm-turn-intent` propose a full intent
  (action + target + position) that the executor merely resolves, or only a
  *preference* (target-scoring hint) fed into the existing `targetScoring.ts`,
  keeping even the choice deterministic? The latter is safer and more replayable;
  the former is more expressive. Phase 2 should prototype both against the parity
  test.
- **Pacing authority.** How much narrative pacing can be autonomous before it
  needs human confirm by default? Proposed: complications that spend a resource
  or spawn a token always confirm; pure prose beats can auto-apply.
- **Multi-actor batching vs. rate limit.** A full monster side is many turns; do
  we batch one gateway call per round (cheaper, coarser) or one per actor
  (finer, more calls against `AI_RATE_LIMIT`)? Interacts with the cost-bucket
  work RFC 002 still lists as unbuilt.
- **Where the loop lives.** `src/scene/aiDm/` (scene-owned) vs. adjacent to the
  tactical executor in `src/rules/tactical/` (resolution-owned). Layer-boundary
  lint forbids shared layers value-importing `src/systems/**`, which the loop
  must respect either way by dispatching through the engine/validator seams.
- **Adjudication scope.** Should `dm-adjudicate` ever propose *new* monsters
  mid-scene (re-running the budget gate), or only frame outcomes of the existing
  roster? Spawning touches the encounter budget and map spawn zones and may
  warrant its own confirm.
