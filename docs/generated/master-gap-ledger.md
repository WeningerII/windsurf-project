# Master Gap Ledger

_Generated 2026-06-26. Authoritative machine-readable work list for all future phases. Source of truth: docs/generated/master-gap-ledger.json._

---

## Phase 0 — Hardening Gates

_Build these first. All other phases depend on them._

| id | type | system | status | description |
|---|---|---|---|---|
| hard-compute-register-gate | hardening | cross-system | in-progress | Add check:compute-register CI gate. ~180 register entries currently marked 'verified' have no machine enforcement — status is known-unverified until this gate is live. |
| hard-playwright-per-system | hardening | cross-system | in-progress | Build one Playwright user-outcome harness per supported system (7 total). Covers critical user journeys: character creation, spell lookup, monster stat block, equipment browse. |
| hard-ai-gateway-provider-agnostic | hardening | cross-system | open | AI gateway locked to Gemini via geminiAdapter.mts. Design provider-agnostic adapter interface and registry before any AI feature expansion. |

---

## Phase 1 — Legal Blockers

_Must resolve before any public release or content expansion._

| id | type | system | status | description |
|---|---|---|---|---|
| legal-mam3e-open-content-policy | legal | mam3e | open | openContentPolicy.ts whitelists 'Hero's Handbook' (commercial title) as M&M 3e allowedSource. Re-point to d20herosrd OGC designation. Systemic change — affects all mam3e loader tags. |
| legal-license-notice-files | legal | cross-system | open | No LICENSE or NOTICE file in repo root. Required by OGL (Section 15) and CC-BY for all SRD content. Add both files with per-system attributions. |
| legal-in-app-legal-route | legal | cross-system | open | No /legal route in SPA. OGL Section 15 requires OGL text reproduction in-app. Add route surfacing all open-content attributions, OGL text, and project license. |

---

## Phase 2 — Denominator-A Gaps

_SRD content missing from loaders. Small/simple gaps first, then denominator-fix items._

| id | type | system | status | description |
|---|---|---|---|---|
| dena-dnd5e2014-equipment-net | denominator-a | dnd-5e-2014 | open | 1 missing: Net. Encode with SRD 5.1 source tag (weapon, thrown, special). |
| dena-dnd5e2024-monsters-wisp | denominator-a | dnd-5e-2024 | open | 1 missing: Will-o'-Wisp. Encode with SRD 5.2 source tag. |
| dena-pf2e-equipment-three-items | denominator-a | pf2e | open | 3 missing: Bag of Holding, Boots of Speed, Ring of Sustenance. Encode all from Pf2eToolsOrg items-crb.json with CRB source tag. |
| dena-pf1e-spells-teleport-greater | denominator-a | pf1e | open | 1 missing: 'Teleport, Greater'. Verify vs. over-inclusion entry 'Greater Teleport' — likely a name-format mismatch. Normalize key or encode if genuinely absent. |
| dena-dnd35e-spells-shadow-evocation-greater | denominator-a | dnd-3.5e | open | 1 missing: 'Shadow Evocation, Greater'. Verify vs. over-inclusion entry 'Greater Shadow Evocation' — likely a name-format mismatch. Normalize key or encode if genuinely absent. |
| dena-daggerheart-weapons-two-items | denominator-a | daggerheart | open | 2 missing: 'Sword of Light and Flame', 'Widgast Pendant'. Loader has 'Sword of Light & Flame' and 'Widogast Pendant' — typo/ampersand variants. Verify against pinned manifest and normalize loader keys; do not double-encode. |
| dena-daggerheart-armor-bellamie | denominator-a | daggerheart | open | 1 missing: 'Bellamie Fine Armor'. Loader has 'Bellamoi Fine Armor' — spelling typo. Verify canonical spelling in pinned manifest and correct loader key. |
| dena-mam3e-equipment-68-items | denominator-a | mam3e | open | 68 missing (SRD total 113, loader has 45). Covers weapons, grenades, explosives, armor, shields, vehicles, tools, gadgets, and HQ features. BLOCKED by legal-mam3e-open-content-policy. Source: frnprt/mm3e-character-creator EQUIPMENT. |
| dena-pf1e-monsters-denominator-fix | denominator-a | pf1e | open | 15 listed missing (346 SRD vs 331 covered). Step 1: collapse dragon age and elemental size variants in denominator script. Step 2: encode Skeletal Champion if it remains genuinely absent after fix. |
| dena-dnd35e-monsters-denominator-fix | denominator-a | dnd-3.5e | open | 72 listed missing (364 SRD vs 292 covered). Mostly dragon age bands, elemental sizes, lycanthrope variants, template-derived, and player-race stat blocks. Step 1: fix denominator script (scripts/encode-35e-monsters.mjs, scripts/lib/srd35Monsters.mjs) to collapse variants. Step 2: encode genuinely novel individuals with distinct stat blocks in olimot/srd-v3.5-md. |

---

## Phase 3 — Denominator-B Gaps

_Compute-register coverage: layers not yet gate-verified across systems._

| id | type | system | status | description |
|---|---|---|---|---|
| denb-register-known-unverified | denominator-b | cross-system | open | ~180 register entries marked 'verified' with no CI gate. Downgrade to known-unverified; re-triage after Phase 0 gate is live. |
| denb-l3-damage-assembly | denominator-b | cross-system | open | L3 full damage assembly + riders missing from registers. Add entries and gate tests: base dice, bonus dice (sneak attack, divine smite), damage type, rider conditions, recharge. |
| denb-l5-spell-economy | denominator-b | cross-system | open | L5 spell economy (prepared/known/upcasting) missing from registers. Add entries and gate tests: prepared/known count per level, slot table, upcast scaling, cantrip scaling. |
| denb-l6-speed-penalty | denominator-b | cross-system | open | L6 speed with penalty missing from registers. Add entries and gate tests: base speed, heavy armor penalty, encumbrance reductions, condition-based speed interactions. |
| denb-l7-asi-feat-cadence | denominator-b | cross-system | open | L7 ASI/feat cadence missing from registers for some systems. Add entries and gate tests: ASI levels per class, fighter/rogue bonus, multiclass restrictions, feat prerequisites. |
| denb-l8-resist-vuln-immune | denominator-b | cross-system | open | L8 resist/vuln/immune missing for non-Daggerheart systems (Daggerheart already 6/6). Add entries and gate tests covering resistance halving, vulnerability doubling, immunity bypass, condition immunities, interaction order. |
| denb-l9-point-buy-prereqs-multiclass | denominator-b | cross-system | open | L9 point-buy/prereqs/multiclass validators missing from registers. Add entries and gate tests: standard array vs point-buy, multiclass score minimums, first-level-only proficiency grants, cross-system prereq validators. |
| denb-l10-dnd35e-encounter-budget | denominator-b | dnd-3.5e | open | L10 encounter budget missing from dnd-3.5e registers. Add entries and gate tests: CR-to-EL conversion, party-size XP adjustments, treasure by CR, mixed-CR EL calculation. |
| denb-rfc003-effect-resolver-consolidate | denominator-b | cross-system | open | RFC 003 effect resolver is distributed across contributionLedger.ts, armorClass.ts, conditions — not unbuilt. Phase 2 consolidates into unified interface. Re-verify effect-order-dependent register entries after consolidation. |

---

## Summary counts

| Phase | Total items | Open | In-progress | Done |
|---|---|---|---|---|
| Phase 0 — Hardening | 3 | 1 | 2 | 0 |
| Phase 1 — Legal | 3 | 3 | 0 | 0 |
| Phase 2 — Denominator-A | 10 | 10 | 0 | 0 |
| Phase 3 — Denominator-B | 9 | 9 | 0 | 0 |
| **Total** | **25** | **23** | **2** | **0** |

### Estimated content items to encode (Denominator-A)

| Gap id | Items |
|---|---|
| dena-dnd5e2014-equipment-net | 1 |
| dena-dnd5e2024-monsters-wisp | 1 |
| dena-pf2e-equipment-three-items | 3 |
| dena-pf1e-spells-teleport-greater | 1 (verify first) |
| dena-dnd35e-spells-shadow-evocation-greater | 1 (verify first) |
| dena-daggerheart-weapons-two-items | 2 (verify/rename, not new encodes) |
| dena-daggerheart-armor-bellamie | 1 (verify/rename, not new encode) |
| dena-mam3e-equipment-68-items | 68 (BLOCKED — legal) |
| dena-pf1e-monsters-denominator-fix | up to 15 (denominator fix first) |
| dena-dnd35e-monsters-denominator-fix | up to 72 (denominator fix first, likely much fewer genuine encodes) |
