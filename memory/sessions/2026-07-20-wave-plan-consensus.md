# Wave-execution plan — adversarial consensus V5 (2026-07-20)

Answers: "how many workflows until the code-doable master plan is complete?"
**22 build workflows, 3 waves of sequential sub-waves, max ~4 concurrent.**

Provenance: 5 adversarial review rounds (4 critic dimensions: file-collisions,
sequencing, execution/failure model, completeness; Explore agents verifying
against the repo, not docs). Blocking-finding trajectory 5 → 3 → 3 → 2 → 0;
final round both remaining critics ACCEPT. Runs: wf_daa7d5c8-16d (rounds 1–3),
wf_8f8660e1-ef8 (round 4), wf_5e56eebb-b75 (round 5). Scope inventory from
wf_e8b3847c-a20 (7-phase remaining-work scan).

## Execution model (binding rules)

- Each item = its OWN Workflow invocation: separate background task, failure
  domain, completion notification, resume handle. Never one bundled script.
- Concurrency cap PROVISIONAL 4 (nproc=4, swap 0B, two OOM/recycle incidents
  on 2026-07-20). Sub-wave 1a launches 2-wide and canary-probes a 3rd then 4th;
  once validated, later sub-waves may run 4-wide. Launch items within a
  sub-wave in expected-duration-ascending order; long tails isolated (1c, 3b).
- One shared working tree on `claude/next-priorities-98pzof`; each item's file
  domain is EXCLUSIVE during its sub-wave; every item declares an exhaustive
  new-file glob list up front.
- Agents NEVER edit orchestrator-owned shared files: mutation-anchors.ts,
  compute-register index.ts, docs/generated/**, package.json,
  playwright.config.ts, App.tsx, main.tsx, memory/** — unless the item
  explicitly owns the file and no sub-wave sibling touches it. Proposed
  mutation anchors are returned as structured data; orchestrator applies them.
- COMMIT decoupled from GATE: the moment a workflow completes, orchestrator
  path-scoped `git add <domain> && git commit` — per-completion commits are the
  durability checkpoint (container-recycle landmine: committed work is the only
  durable state).
- TREE RECONCILIATION before every barrier gate (barrier tools read the working
  tree; tsc is whole-program, check-compute-register refuses a dirty tree):
  make tree == committed union. Stray untracked files: reference-check the
  committed union first (extension-agnostic module-specifier grep incl.
  directory/index + tsconfig-alias forms); referenced → ADOPT into the owning
  commit or FAIL LOUDLY, never clean; unreferenced → QUARANTINE to scratch with
  repo-relative path recorded (reversible), never `git clean -fd` directly.
  Porcelain-empty (ignored excluded) is the machine-checked gate precondition.
- Gating sub-wave/wave-atomic, OOM-safe: never monolithic `npm run verify`;
  separate sequential stages — typecheck; unit tests as CI-verbatim
  `npm run test:coverage -- --run --maxWorkers=1` (wave barriers + final);
  targeted `vitest run <files> --maxWorkers=1` allowed at sub-wave barriers;
  build; e2e — never overlapping a still-running workflow. Mutate ordering:
  apply anchors → COMMIT → then `check:compute-register --mutate` (serialized).
- Agents run NO vitest/build. Closing verify agent runs `tsc --noEmit` filtered
  to own-domain diagnostics; sibling-import cascades marked INCONCLUSIVE and
  re-checked at the barrier, not false-blocking.
- graphify READ-ONLY for agents (query/explain/path; never `graphify update` —
  it rewrites tracked graphify-out/**). Orchestrator: graphify update → commit
  → porcelain check → gate, once per wave barrier.
- Derivation layer src/rules/derivation/** is READ-ONLY for agents; every
  declared quantity is one numeric spec per scalar. Non-numeric quantities
  (legality booleans, type-set classifications) are bespoke ComputeRegisterEntry
  rows with behavioral testRefs — never a DerivedQuantitySpec. Items 1–5 may
  author their system's resist/vuln/immune classification rows in their owned
  register file where not already covered.
- AC/defense rule: NO wave-1 item declares/migrates/surfaces a resolver-routed
  L2 AC/defense quantity or anchors into src/utils/armorClass.ts (item 12
  retires it in wave 2; f9f113d re-pin precedent). Deferred slice = item 21.
- Failure handling: per-sub-wave TaskStop deadline; on deadline: stop laggard,
  discard its uncommitted edits (reconciliation), gate+push committed subset,
  relaunch laggard next sub-wave (resume best-effort — handles die on recycle).
  After any recycle: rebuild scratchpad/pw-bridge before any e2e stage; never
  `playwright install`.

## Wave 1 — 11 workflows (sub-waves 1a / 1b / 1c)

| # | SW | Item | Exclusive domain (summary) |
|---|----|------|-----------------------------|
| 1 | 1a | P3 pf2e derived quantities (NO AC/defense; MAP/bulk/heighten etc.) | systems/pf2e/{engine,sheet,data-model,derivedQuantities(new),components/Pf2eOverview}, register pf2e.ts, new test |
| 2 | 1a | P3 mam3e derived quantities (defenses not resolver-routed → no AC exclusion) | systems/mam3e/{engine,sheet,data-model,derivedQuantities(new)}+overview, register mam3e.ts, new test |
| 3 | 1a | P3 daggerheart derived quantities (same — no AC exclusion) | systems/daggerheart/{engine,sheet,data-model,derivedQuantities(new)}+overview, register daggerheart.ts, new test |
| 4 | 1a | P3 5e-family residual (cantrip-scaling, concentration-DC, push-drag-lift, jump) | systems/dnd5e/shared/{derivedQuantities,engine,Dnd5eSheetBase,Dnd5eOverviewSection}, dnd5e-2024/**, registers 2014+2024, existing generic test |
| 5 | 1b | P3 d20-family (3.5e+PF1e serial inside; NO AC total/touch/flatFooted). MUST wire d20-legacy derived section as GENERIC presentDerivedQuantities map-render | systems/dnd35e/**, pf1e/**, d20-legacy/**, registers dnd35e+pf1e, new test |
| 6 | 1b | P4 mam3e creator increments 2+ (skills/defenses/advantages/powers; M&M cap-legality chartered HERE) | systems/mam3e/creator/** only + own tests |
| 7 | 1b | P6 RFC006 scene/encounter (3.5e EL/XP budgets, multi-system rounding) | src/scene/**, src/components/scene/** |
| 9 | 1b | P5 telemetry scaffold (opt-in, no-PII) | src/telemetry/**(new), utils/performanceMonitoring.ts, main.tsx (owned) |
| 8 | 1c | P5 AI-gateway hardening (adapter factory + mock + rate-limit + structured logs, serial inside) | netlify/functions/**, src/ai/**, utils/syncEngine.ts, utils/rateLimit.ts(new), .env.example, RFC 002 |
| 10 | 1c | P1 content coverage (5 units serial inside; M&M equipment = wiring only, data already ships; network regen at integration) | scripts/srd-coverage.ts, src/data/**, docs/srd-sources.md, pf1e-bestiary-manifest.json |
| 11 | 1c | P6 RFC004 bestiary route (nav is closed union: new LibrarySegment case in useAppNav.ts + assertNever + navReducer; AppHeader data-driven, no edit) | new page, hooks/useAppNav.ts (owned), App.tsx (owned), monster loader wiring |

## Wave 2 — 7 workflows (2a / 2b)

| # | SW | Item | Key constraints |
|---|----|------|-----------------|
| 12 | 2a | P2 spine-α: fold base AC/defense into resolver, retire armorClass.ts | Domain = armorClass.ts + rules/compile/** + dnd5e/shared/{engine,contributionLedger} + dnd35e/pf1e/pf2e engines + the 4 AC-importing test files (armorClass.test, dnd5e2014EngineMath.test, d20LegacyEngineMath.test, dnd35eArmorCatalog.test). NINE-importer closure (5 source + 4 test) migrated atomically. pf2e slice stays OFF pf2e/data-model.ts (item 14 owns it; escalation: move 14 to wave 3 if impossible). Preserve every describe+it title verbatim, tests stay in current files (register resolves by ancestorTitles). MANDATORY deliverable: re-pins for all 8 pre-existing armorClass.ts anchors, applied+committed at 2a barrier before any --mutate. |
| 13 | 2a | P2 spine-β: conditions-as-IR for mam3e + daggerheart | rules/conditions/{mam3e,daggerheart}Conditions.ts(new) + those engines' roll paths. Declares own distinct test files. |
| 14 | 2a | P4 pf2e multiclass dedication aggregation | pf2e/{pf2eTemplate,data-model,derivedMath}. Own test files (pf2eEngineMath.test.ts carries item 12's 'L2 PF2e AC' testRef — engine-wired, no armorClass import, so no item-12 edit needed there). |
| 15 | 2a | P6 RFC005 consume verb + broader leveling (serial inside) | utils/resourcePool.ts, types/equipment/items.ts, per-system handlers/controllers/headers. Own distinct test files; must NOT touch level-driven describes inside item 12's exclusive files. |
| 16 | 2b | P5 CI-tooling: a11y (axe/pa11y) + secrets-exposure guard (serial inside) | package.json, e2e/a11y.spec.ts(new), scripts/check-secret-exposure.mjs(new), playwright.config.ts, CI |
| 17 | 2b | P7 feature-flag layer | src/config/featureFlags.ts(new), App.tsx, src/ai/gatewayClient.ts, tests |
| 21 | 2b | P3 L2 AC register migration (IN-PLACE edit of existing verified entries; never append) | pf2e/{derivedQuantities,engine,Pf2eOverview}, dnd35e/pf1e derivedQuantities, registers {pf2e,dnd35e,pf1e,dnd5e-2014,dnd5e-2024}.ts (exclusive in 2b); dnd35e/pf1e AC surfaces via display-bearing specs through item 5's generic d20 section — touches NONE of d20LegacySheetShared/useD20LegacySheetController/d20 ledger |

RFC-003 scope note: items 12+13 are the FULL P2 extent of this plan; ledger
spell-DC/attack path consolidation is explicitly deferred beyond it.

## Wave 3 — 4 workflows (3a / 3b)

| # | SW | Item | Constraint |
|---|----|------|-----------|
| 18 | 3a | P4 dnd5e-shared: ledger spell-DC/attack rows + feature-option resolver surfacing (serial inside) | dnd5e/shared/contributionLedger.ts (post-item-12 import path) + dnd5eFeatureOptions.ts (+ maybe rules/compile/modifierEffects.ts). Wave 3 = hard file conflict with item 12. |
| 19 | 3a | P4 d20-legacy ledger (BAB/saves/skill-synergy) | new d20-legacy/contributionLedger.ts + d20LegacySheetShared + useD20LegacySheetController. Wave 3 SOLELY because item 15 edits the controller in 2a. |
| 20 | 3a | P7 prod-smoke (lean tagged suite) | playwright.config.ts + e2e/ + package.json (item 16 owns them in 2b). |
| 22 | 3b | P3/L9 build-legality validators, non-M&M (5 systems, serial → long tail alone) | New validator modules + tests; bespoke boolean ComputeRegisterEntry rows; exclusive wave-3 owner of the 5 register files. M&M legality lives in item 6. |

Final integration (orchestrator): staged gate (never monolithic verify),
docs/generated regen, memory /save, PR merge per standing directive.

## Sub-wave 2a execution grounding (scouted 2026-07-20, 4 Explore agents)

STRATEGY (refined from scouts): **item 12 ALONE first (2a-i)**, then **13/14/15
concurrent (2a-ii)** against item 12's settled base. Reason: item 12 owns shared
files (rules/index.ts barrel shared w/ 13; resolver/compile; pf2e engine; the AC
register files) — isolate it, gate it (incl. --mutate anchor re-pin), then the
mutually-disjoint 13/14/15 parallelize cleanly.

- **Item 12 (AC/defense resolver fold, retire armorClass.ts)** — HIGHEST RISK.
  armorClass.ts exports: dnd5eArmorDexContribution, compute5eAC, D20_SIZE_MOD
  (⚠ also used for ATTACK rolls dnd35e/pf1e engine ~L221/233), computeD20LegacyAC
  (→{total,touch,flatFooted}), computePf2eAC. 9 importers = 5 src (dnd5e/shared/
  {engine L9,contributionLedger L11}, dnd35e/engine L10, pf1e/engine L9, pf2e/
  engine L8) + 4 test (armorClass.test, dnd5e2014EngineMath.test L14, d20Legacy
  EngineMath.test L37, dnd35eArmorCatalog.test L12). Fold seam = rules/compile/
  equipEffects.ts (already emits target:'ac' add) + resolveEffects set-then-add;
  base AC becomes a 'set' on 'ac' so resolveCharacterEffects('ac')=full AC. 3.5e/
  pf1e touch/flatFooted tuple → 3 targets OR relocated helper (scalar can't hold
  tuple; implementer judgment, correctness first). PF2e fold = pf2e/engine.ts ONLY
  (NOT data-model — item 14 safe). 8 anchors (all file:armorClass.ts today):
  dnd5e2014.L2.ac.unarmored, dnd35e.L2.ac, pf1e.L2.ac (shares find w/ dnd35e),
  dnd5e2014.L2.ac.light('return dexMod;'⚠), .medium('?? 2'→'?? 3'), .heavy
  ('return 0;'⚠), dnd5e2024.L2.ac-formula-set (shares find w/ unarmored), pf2e.L2.ac.
  Re-pins RETURNED AS STRUCTURED DATA (orchestrator applies to mutation-anchors.ts,
  then check:compute-register --mutate). Preserve ALL describe/it titles verbatim
  (testRef = filename::title); pf2eEngineMath.test UNCHANGED (engine-wired). Item
  12 MAY edit docs/compute-register/{dnd5e-2014,2024,dnd35e,pf1e,pf2e}.ts during
  its solo sub-wave (no concurrent sibling then). Behavior MUST be byte-identical.
- **Item 13 (conditions-IR mam3e+daggerheart)** — NEW rules/conditions/{mam3e,
  daggerheart}Conditions.ts + 2 tests (__tests__/rules/*ConditionsIr.test.ts) +
  mam3e/engine.ts rollCheck (~L306-315 Toughness bruise) + daggerheart/engine.ts
  rollCheck (~L94-127, note-only hook) + rules/index.ts barrel + maybe
  sceneConditions.ts (relocate daggerheart stubs). Mirror dnd5eConditions.ts +
  engine wiring. PRESERVE applyMam3eToughnessFailure export (item 15 imports it).
- **Item 14 (pf2e multiclass dedication)** — pf2e/{data-model, pf2eTemplate
  (extend applyPf2eArchetypeTemplate via mergeProficiencySource), derivedMath,
  derivedQuantities} + own test (pf2eDedication.test). KEEP archetype-template fn
  SIGNATURES stable (else collides w/ item 15 handlers). Register rows for pf2e
  RETURNED AS DATA (orchestrator appends to pf2e.ts AFTER item 12) — item 14 does
  NOT edit docs/compute-register/pf2e.ts. NO engine.ts (item 12 owns it).
- **Item 15 (RFC005 consume verb + leveling)** — utils/resourcePool.ts (new
  consume verb after reset ~L76, returns depletion state) + types/equipment/
  items.ts (consumable quantity/charges) + per-system HANDLER/CONTROLLER/RESOURCES/
  TEMPLATE-HANDLER/HEADER (NOT engines): dnd5e useDnd5eSheetActionHandlers/
  Controller/Resources/TemplateHandlers/Dnd5eHeaderSection; d20 useD20Legacy*;
  pf2e usePf2e{MutationHandlers,SheetController,SheetResources,TemplateHandlers}+
  Pf2eHeader + pf2eSheetShared.ts (focus leveling); mam3e handlers/controller/
  resources (leveling only, no consume); daggerheart handlers (consumeInventory
  Item L244-264 = ref pattern)/controller/resources/templatehandlers/header. OWN
  new test files ONLY — NEVER add to item 12's engine-math test describes.

## Sub-wave 1c execution grounding (scouted 2026-07-20, 3 Explore agents)

Launch order (2-wide, OOM-safe — concurrent tsc in verify is memory-heavy): item 8
+ item 11 first; item 10 when a slot frees. All three confirmed file-disjoint.

- **Item 8 (AI-gateway hardening)** — task `ws75xyl0k` RUNNING. Domain: netlify/functions/**,
  src/ai/**, NEW src/utils/rateLimit.ts, NEW src/ai/gatewayLog.ts, NEW src/ai/mockAdapter.ts,
  NEW netlify/functions/providerFactory.mts, .env.example (append), docs/rfc/002 (status prose),
  tests in __tests__/ai + __tests__/utils. Seam exists: AiProviderAdapter + GatewayContext in
  gatewayCore.ts (~L22-39); factory plugs at ai-gateway.mts ~L15-17 (DI, SDK-free); rate-limit
  reuses over-budget→429 (gatewayHttp.ts ~L55), new optional ctx.rateLimiter before adapter call;
  logger = new optional ctx.log. SDK (@ai-sdk/google) stays confined to geminiAdapter.mts. Must NOT
  touch syncEngine.ts/App.tsx/useAppNav/src/data.
- **Item 11 (RFC004 bestiary route)** — task `w0sw8lp5n` RUNNING. OWNS src/hooks/useAppNav.ts +
  src/App.tsx; NEW src/components/LibraryBestiaryView.tsx + a __tests__/components test. Nav edit =
  3 spots in useAppNav.ts (LibrarySegment union ~L26 add 'bestiary'; librarySegmentLabel case ~L88-89
  before assertNever; LIBRARY_SEGMENTS array ~L95-100). navReducer + AppHeader NEED NO edit
  (data-driven). App.tsx = import + one `isLibrary && segment==='bestiary' && <LibraryBestiaryView/>`
  block (~L710, mirror 'content'). Consume loadMonstersForSystem (src/utils/dataLoader.ts ~L881,
  Promise<Monster[]>) + MonsterBrowser READ-ONLY; empty state for not-shipped systems; do NOT edit
  dataLoader.ts or create data. Agnostic system selector, catalog-only (RFC004 non-goals).
- **Item 10 (content coverage)** — task PENDING (launch when slot frees). Domain (PURE-LOCAL only):
  src/scripts/srd-coverage.ts (note src/scripts NOT scripts/), docs/GAPS.md, docs/srd-sources.md,
  docs/master-gap-ledger.source.ts, NEW unit test for the collapse helpers. Code-doable = (a) collapse
  3.5e category-heading denominator in fetchSrd35MonsterNames (~L480-489); (b) collapse PF1e
  dragon/elemental container records in denominator path (~L395-405, 14 of 15 "missing"); (c) add M&M
  equipment CoverageTarget (data already ships + runtime wired — only the measurement target missing);
  (d) extend norm/loaderNormVariants (~L39-53) for confirmed provenance naming-variant false-positives.
  Make collapse logic PURE + unit-tested with fixture heading/name lists (NO network). DEFERRED (do
  NOT do): running `npm run srd:coverage` (network), encoding missing individuals (PF1e Skeletal
  Champion; 3.5e Lich/Ghost/Salamander/Hydra) via scripts/encode-*.mjs, provenance deletions from
  src/data, executing the M&M equipment target (frnprt fetch). Agent must NOT edit docs/generated/**
  or run `npm run gap:ledger` — ORCHESTRATOR regenerates generated docs at the wave-1 barrier.
  Deferred shared-data regen is the only (integration-time) coupling with item 11's loader.

Wave-1 barrier (after all 1c commit+push): tree reconcile → `graphify update` → regen docs/generated
(`npm run gap:ledger` + generated-docs) → typecheck app+test → full `test:coverage -- --run
--maxWorkers=1` → build. Then `check:compute-register` (Tier A) stays green (no 1c anchors).

## Cannot be completed by ANY workflow (bounds "complete")

- Human sign-off: dnd5e-2024 exhaustion −2/level; screen-reader pass; final go/no-go.
- Secrets/infra: provider/Supabase/Sentry/Netlify secrets; Sentry alert rules;
  durable rate-limit store; analytics sink; live backup/restore; staged-rollout
  execution; rollback rehearsal.
- Source-blocked: PF1e CRB equipment list (pin a clean OGC source or formalize exclusion).
- Needs own RFC: AI-DM autonomous runtime.
- Deferred beyond plan (code-doable later): ledger spell-DC/attack resolver consolidation.
