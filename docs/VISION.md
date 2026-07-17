# Vision

**Last updated:** July 17, 2026

This document records the *why* of the project — the long-horizon thesis that
the product is built to test. It is deliberately separate from the roadmap.

- `docs/VISION.md` (this file) — the thesis and the bet. Changes rarely.
- `docs/MASTER_PLAN.md` — the roadmap: phases, sequencing, constraints. The
  sole planning authority. Changes often.
- `README.md` — what ships **today**, stated honestly.

If this document and the master plan ever disagree about *scope*, the master
plan wins; this file exists to explain the direction the plan is walking
toward, not to commit dates or deliverables.

## The thesis

Tabletop role-playing games are among the richest interactive systems humans
have designed, and almost none of that richness is accessible without a large
investment of human labor: someone has to learn hundreds of pages of rules,
someone has to prepare encounters, someone has to adjudicate every edge case at
the table. The friction is enormous and it sits in front of *every* moment of
play — session zero, character creation, prep, and the session itself.

The bet this project makes is that the friction is removable **without giving
up correctness**, and that the way to remove it is:

1. **Encode the rules as written (RAW), faithfully and completely, for multiple
   systems.** Not a summary, not a single edition — the real math, the real
   tables, the real interactions, sourced from open-license content.
2. **Make those rules *executable*** — engines that compute derived state,
   validators that decide what is legal, resolvers that fold game actions into
   new state deterministically.
3. **Layer AI on top as a drafting and orchestration surface, never as the
   authority.** The deterministic core decides what is *true* and what is
   *legal*. AI proposes; the rules dispose.

The deterministic core is the moat. AI without it hallucinates rules. The core
without AI is a faithful but high-friction tool. Together — gold-standard
algorithms doing the mechanical work, AI doing the linguistic and creative
work, each where it is strongest — the friction collapses while the math stays
correct.

## The north star experience

Across every surface, the same shape:

> Describe what you want in natural language → receive a structured draft
> constrained to shipped, rules-legal content → review the deterministic
> validation and provenance → accept it through the same paths a manual user
> would use.

Concretely, the experiences this is aimed at:

- **Character creation for newcomers.** The largest barrier to session zero is
  asking a new player to read every subclass, feat, and multiclass interaction
  before they can make a single choice. Instead: pick a system, describe the
  character you imagine in a sentence, and get a complete, legal sheet — because
  point-buy, prerequisites, and progression are already encoded and the AI only
  ever *selects from* what the rules allow.
- **Encounters and scenes from a prompt.** Describe a fight or a location and
  get a validated encounter: real statblocks, an initialized map, tokens placed,
  initiative seeded — assembled from loader-backed content, not invented.
- **A populated world.** NPCs — shopkeepers, lords, a court, goblin archers —
  spun up from the same rules that build player characters, so they are
  mechanically real, not set dressing.
- **Maps that mean something.** A battle map is not a picture; its terrain is
  *functional*. Water can drown the unprepared and halves fire; difficult
  terrain costs movement; cover changes the math. The map and the rules are the
  same object.
- **Play that runs.** An AI game master that can carry a campaign over a long
  horizon — proposing, narrating, adjudicating — while every mechanical
  resolution still passes through deterministic validators and replayable
  events.

When provider keys are absent or a model call fails, all of it must still work
as a deterministic, manual tool. AI is leverage, never a dependency.

## The hard part, stated honestly

There is a tempting version of this thesis that is **wrong**, and it is worth
writing down so we do not drift into it:

> "If we hard-code enough systems, the patterns that make a game will simply
> *emerge*, and we will be able to synthesize new content — a balanced new
> species, spell, or subclass — by reading off those patterns."

The accumulation does not produce the abstraction on its own. This repository
is the proof: it already encodes **seven** systems faithfully, and the shared
grammar has *not* fallen out of the pile. Each engine encodes its own system
idiomatically. The only place commonality has been factored into a reusable
shape is where someone **deliberately designed it** — the small shared d20
helper layer, and now the RFC 003 rules IR: a shared resolver and condition
catalogs that reach all seven systems, with a compile layer the five
additive-shaped engines route through.

The lesson: **a cross-system rules grammar has to be built, not discovered.**
Faithful per-system data is the *corpus* — necessary, expensive, and now
largely paid for. But turning a corpus into a grammar is a modeling act: an
explicit intermediate representation of what an *effect*, a *condition*, an
*action*, a *modifier*, and a *terrain feature* are, independent of any one
system, that every engine maps onto. That representation was deliberately
designed — not discovered — in `docs/rfc/003-rules-ir-and-effects.md`
(Accepted; the IR, resolver, and per-system compile layer have begun
shipping), proving the point: the shared grammar appeared exactly where it
was explicitly built, and nowhere else.

Synthesis of new content — the original dream — is therefore correctly the
*last* thing, not the first. It is not a feature to bolt on; it is the
**emergent payoff** of having built the grammar. Build the intermediate
representation, the validators, and the provenance ledger, and synthesizing a
balanced, rules-legal, clearly-labeled-as-homebrew species becomes tractable.
Skip them, and no amount of additional hard-coded data will make it real.

## The bet, in one line

Encode the rules faithfully; make them executable; design the grammar that
unifies them; let AI draft against that grammar but never overrule it. Do those
in that order and the friction disappears without the correctness going with it.

## Principles

These are summarized here and enforced in detail by the **Non-Negotiable
Constraints** in `docs/MASTER_PLAN.md`:

- **Deterministic-first.** Mechanics resolve in code. AI runs before or after
  the mechanical loop, never inside it.
- **AI drafts, users approve, validators decide legality.** Model output is
  draft input that becomes durable state only through the same typed
  actions/validators/templates a manual edit uses.
- **Local-first.** The product works fully signed-out and with no provider
  keys. Cloud sync and AI are additive, never required.
- **Open-content only.** Shipped data stays inside the source allowlist.
- **No fake automation.** Where rules support is partial, the UI and docs say
  so plainly rather than imply automation that is not there.

## What this is not

- Not a replacement for a human game master who wants the chair — a tool that
  *can* run the game, for the table that wants that.
- Not a closed-content product. No product-identity rules ship.
- Not a bet on any specific model or provider. Those are implementation details
  chosen inside phases, not commitments made here.

## Where it stands today

Honest snapshot — see `README.md` and `docs/generated/roadmap-metrics.md` for
the authoritative current state:

- **Built and solid:** the deterministic core. Seven systems behind a unified
  document/engine/registry abstraction; engines that compute (not just store)
  HP, proficiency, per-system defenses (AC, Evasion, Dodge/Parry/Toughness),
  saves, damage thresholds, and per-system resource math (spell slots,
  power-point costs); substantial loader-backed RAW; local-first persistence
  with optional sync; an event-sourced scene runtime with a manual
  grid/initiative/encounter slice.
- **Built and begun:** the system-agnostic rules IR and effect resolver
  (RFC 003, Accepted) — IR, pure resolver, contribution-ledger view, and shared
  compile layer shipped and routed through the five additive-shaped engines,
  with the bespoke Daggerheart and M&M derivations an accepted architectural
  boundary; functional terrain (cover, high ground, difficult-terrain movement
  cost) resolving in scene combat across all seven systems; rule validation and
  provenance primitives; and the default-off AI control plane (RFC 002) — a
  server-side gateway with four task surfaces, where deterministic validators
  decide what applies.
- **Not yet built:** guided creation, the LLM strategist and narration critic,
  observability/cost controls, and IR condition/ledger unification beyond the
  5e engines.

The foundation — the part that is hard to fake and expensive to earn — exists.
Finishing the grammar's adoption and deepening the AI layer are the road ahead.
