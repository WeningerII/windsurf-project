/**
 * MASTER GAP LEDGER — the authoritative, machine-readable work-list that drives
 * every phase toward the two-denominator, production-hardened, doc-true product.
 *
 * This is the CURATED source; `npm run gap:ledger` renders it to
 * `docs/generated/master-gap-ledger.{json,md}` (committed, guarded by
 * check:generated-docs). Each item is grounded in a live artifact — the
 * generated coverage/metrics reports, the compute register, or a landed commit —
 * cited in `evidence`. Update items here, then regenerate.
 *
 * Status is deliberately conservative: an item is only `done` when an artifact
 * the producer cannot edit (a gate, a generated number, a committed diff) backs
 * it. "Verified" never means hand-stamped (see check:compute-register).
 */

/** Phase 0 instruments → 1–5 the production bar → 6 expansions → 7 release. */
export type LedgerPhase = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type LedgerTrack =
  | 'A-content' // Denominator A: SRD/open-content catalog coverage
  | 'B-compute' // Denominator B: engine-math wiring
  | 'spine' // RFC 003 rules-IR / effect resolver
  | 'parity' // cross-system capability parity / UX
  | 'hardening' // production infra gaps
  | 'instrument' // Phase-0 measurement/verification instruments
  | 'expansion' // roadmap expansions (RFCs 004-006, AI-DM)
  | 'release';

export type LedgerStatus =
  | 'done' // backed by a gate / generated number / committed diff
  | 'in-progress' // partially landed; rollout tracked
  | 'pending' // scoped, not started
  | 'missing' // the rules define it; not built
  | 'blocked'; // external blocker (source unavailable, human ack)

export type LedgerTag =
  | 'launch-blocker'
  | 'legal-blocking'
  | 'engineering'
  | 'source-blocked'
  | 'denominator-fix'
  | 'rollout'
  | 'human-signoff';

export interface GapLedgerItem {
  id: string;
  phase: LedgerPhase;
  track: LedgerTrack;
  title: string;
  detail: string;
  status: LedgerStatus;
  tags: LedgerTag[];
  /** Optional system id when the item is scoped to one system. */
  system?: string;
  /** A live artifact, generated number, or commit grounding the status. */
  evidence?: string;
}

export const MASTER_GAP_LEDGER: readonly GapLedgerItem[] = [
  // ── Phase 0 — instruments ────────────────────────────────────────────────
  {
    id: 'p0.legal-pack',
    phase: 0,
    track: 'instrument',
    title: 'Open-content Legal Compliance Pack (LEGAL-1)',
    detail:
      'Root LICENSE; generated NOTICE with verbatim OGL 1.0a / CC-BY-4.0 / DPCGL; in-app Legal route; check:legal-notices (presence + reachability) in verify; e2e asserts the rendered DOM.',
    status: 'done',
    tags: ['launch-blocker', 'legal-blocking'],
    evidence: 'commit feat(legal) 4141c7d; scripts/check-legal-notices.mjs',
  },
  {
    id: 'p0.compute-register-gate',
    phase: 0,
    track: 'instrument',
    title: 'check:compute-register verification-integrity gate',
    detail:
      'Every status:verified compute-register entry must resolve to a real, passing, register-independent test (Tier A), proven from the vitest result tree; mutation-proof seeded on 11 anchors. Demotes what it cannot prove.',
    status: 'done',
    tags: ['launch-blocker', 'engineering'],
    evidence: 'commit feat(compute-register) 23e5325; scripts/check-compute-register.mjs',
  },
  {
    id: 'p0.outcome-harness',
    phase: 0,
    track: 'instrument',
    title: 'Per-system user-outcome baseline harness (ORCH-14 / PROD-10)',
    detail:
      'All 7 systems measured equally: a fresh user reaches a legal non-trivial character; X (steps + time) and Y (legal) committed as a per-system floor; an unset floor is a red gate.',
    status: 'done',
    tags: ['launch-blocker', 'engineering'],
    evidence: 'commit test(e2e) 3585f9e; e2e/outcome/baseline.json',
  },
  {
    id: 'p0.doc-reconciliation',
    phase: 0,
    track: 'instrument',
    title: 'Reconcile STATUS/GAPS with live ground truth',
    detail:
      'Removed the false "Denominator B verified at 100%" claim and obsolete spell-coverage percentages; pointed both docs at the authoritative generated reports.',
    status: 'done',
    tags: ['engineering'],
    evidence: 'commit docs(reconcile) 77e2eb6',
  },
  {
    id: 'p0.master-gap-ledger',
    phase: 0,
    track: 'instrument',
    title: 'Master Gap Ledger (this artifact)',
    detail:
      'The machine-readable per-phase work-list that drives Phases 1-7, generated from a curated source and guarded by check:generated-docs.',
    status: 'done',
    tags: ['engineering'],
    evidence: 'docs/generated/master-gap-ledger.json',
  },
  {
    id: 'p0.dice-substrate',
    phase: 0,
    track: 'instrument',
    title: 'Unify dice rolls onto one seedable RNG substrate',
    detail:
      'All in-sheet rollChecks route through src/rules/dice.ts on the shared Rng (createSeededRng / createLiveRng) — the same substrate the resolver L3 damage path uses. No inline Math.random remains. Foundation for L3.',
    status: 'done',
    tags: ['engineering'],
    evidence: 'commit refactor(dice) ed170f7',
  },

  // ── Phase 1 — Denominator A (content) ────────────────────────────────────
  {
    id: 'p1.mam-equipment',
    phase: 1,
    track: 'A-content',
    title: 'Mutants & Masterminds equipment — data, runtime, and coverage target',
    detail:
      'Coverage closed AND the provenance defect behind it fixed. The 45/113 measurement was not a content gap, it was a citation defect: all 150 shipped entries were HAND-WRITTEN and every one claimed source "Hero\'s Handbook", but only 45 of those names exist in the Hero SRD — and even those printed costs the SRD does not (Club 2 vs 1, Bow 6 vs 3, Rocket Launcher 27 vs 19). Plate Armor and Chain Mail each shipped twice under different ids. scripts/encode-mam-equipment.mjs now generates all 113/113 SRD entries (byte-reproducible, cited "M&M 3e Hero SRD") and the six hand-written modules are deleted. Nothing was removed from the product: 25 entries were the SRD\'s own item renamed (reconciled, SRD stats win) and the 79 genuinely original ones are kept in equipment/original-not-srd.ts under a new, honest source label admitted through a new originalContentSources policy channel rather than the open-content whitelist. Offline gate check:mam-equipment is wired into verify. Networked srd:coverage re-run: 113/113 (100%). The published compliance metrics were also fixed so they do not launder the 79: isOpenContentCompliant is the SHIPPING gate (open content OR declared original content) and was the wrong predicate for MEASURING open-content compliance, so roadmap-metrics Content Integrity gained an explicit Original (non-SRD) column with the 79 excluded from both sides of the ratio (M&M reads 469 | 79 | 390 | 390 | 100%), and docs/srd-manifest/ gained a ManifestEntryStatus of "original" that keeps them enumerated but out of the open-content denominator (M&M equipment catalog parity 113/113, not 192/192). RESIDUAL: the gate compares name/cost/type only — prose fidelity is unaudited; the generated tier carries no structured stat fields (protection/damage/toughness live in the SRD details prose, and deriving them would not be transcription); original-not-srd.ts stays hand-written and unauditable; and the other hand-written M&M data sets (21 non-SRD powers, 1 non-SRD advantage per srd:coverage) have the same defect, untreated.',
    status: 'done',
    tags: ['engineering'],
    system: 'mam3e',
    evidence:
      'scripts/encode-mam-equipment.mjs; scripts/check-mam-equipment-provenance.mjs (in npm run verify); scripts/data/mam3e-equipment-manifest.json; docs/mam3e-equipment-provenance.md (item-by-item classification); docs/GAPS.md §17; docs/generated/srd-coverage.md (M&M equipment 113/113)',
  },
  {
    id: 'p1.mam-provenance-LEGAL-2',
    phase: 1,
    track: 'A-content',
    title: 'M&M open-content provenance remediation (LEGAL-2)',
    detail:
      'Resolved as Open Game Content. Green Ronin designates the M&M 3e Hero\'s Handbook as OGC under OGL v1.0a bar its sole Product Identity — the terms "Hero Points"/"Power Points" — and the shipped data was authored from and verified against the d20herosrd Hero SRD (data READMEs; docs/srd-sources.md). openContentPolicy.ts re-pointed (the book label and the explicit Hero SRD designation are both accepted), the attribution flipped to open with the completed 4-line §15 chain (OGL → SRD → DC Adventures 2010 → Hero\'s Handbook 2011) and the PI carve-out disclosed honestly rather than hedged.',
    status: 'done',
    tags: ['launch-blocker', 'legal-blocking'],
    system: 'mam3e',
    evidence:
      'src/legal/attributions.ts (M&M provenanceStatus: open); src/utils/openContentPolicy.ts; NOTICE §15 chain; check:legal-notices OGC markers',
  },
  {
    id: 'p1.monster-denominator-fix',
    phase: 1,
    track: 'A-content',
    title: '3.5e / PF1e monster denominator shape-mismatch',
    detail:
      'The shape-mismatch is fixed in code: the denominator previously counted SRD 3.5 category headings / PF1e dragon-elemental parent records as if they were individual stat blocks. Pure, unit-tested helpers (src/scripts/srdCoverageShape.ts collapse35eMonsterHeadings + collapsePf1eContainerRecords) now drop those containers and fold 3.5e age/size variants to their archetype, so both denominators count individual stat blocks (the 14 PF1e parents collapse; Skeletal Champion stays a genuine miss). Counting LOGIC fixed and tested offline; the refreshed published percentages come from the next networked srd:coverage run, and encoding the genuine missing individuals (Lich, Ghost, Salamander, Hydra line, Skeletal Champion) is a separate follow-on.',
    status: 'in-progress',
    tags: ['denominator-fix', 'engineering'],
    evidence:
      'src/scripts/srdCoverageShape.ts; src/scripts/srd-coverage.ts (PF1e + 3.5e monster paths); src/__tests__/scripts/srdCoverageShape.test.ts',
  },
  {
    id: 'p1.provenance-over-inclusion-audit',
    phase: 1,
    track: 'A-content',
    title: 'Provenance over-inclusion audit',
    detail:
      "AUDITED, GATED and ADVERSARIALLY RE-VERIFIED; the remaining remedies are owner decisions. All 1,045 suspects across the 41 wired (system x category) denominators are classified item-by-item with evidence in scripts/data/srd-overinclusion-classification.json under a closed 10-class vocabulary (docs/GAPS.md §18). 753 are NOT provenance problems — the entry is in the cited source and the MEASUREMENT is wrong (591 of those are PF1e equipment/magic-items double-counting each other; the rest are incomplete source slices and granularity mismatches). 117 are catalog hygiene: 69 duplicate-alias rows plus 48 pre-built instances of generic source rows, deliberately NOT remedied by extending normalization, which would clear the report while leaving users two identical crossbows. 173 records (158 distinct entries) are genuine provenance findings — 95 with no counterpart in any cited open-content source and 78 of open content cited to the wrong edition — but only 31 carry a FALSE CITATION today, because 64 of the 95 are M&M originals that §17 already relabelled honestly to Original Content (not SRD); they stay in the licensing class because the trade-dress question on names like Power Ring and Web Shooters is the owner's call. The M&M hand-off this audit predicted in its own text completed 2026-07-26: all 103 deferred records failed the gate exactly as forecast (79 SOURCE-TAG DRIFT + 24 STALE) and were re-recorded or removed. Adversarial re-verification proved all five gate failure modes fire against a control run, and corrected seven records from genuine-non-open-content to wrong-edition-attribution after finding their counterparts in this audit's OWN pinned manifest (Ring of Clumsiness, Cloak of Etherealness, Horn, Sledgehammer, Pixie) — a systematic defect where entries were checked only against their own system's sources. That correction REDUCES claimed exposure. The verifying agents were themselves wrong 25% of the time (5 of 20 claimed M&M counterparts were fabricated), so every applied refutation was re-verified locally against the pinned manifest; refutations resting on external sources were not applied and are recorded in §18.7. Following the §11 OC-1 precedent NOTHING was deleted or relabelled — filterOpenContentBySource drops any entry leaving the allowlist, so re-tagging silently removes shipped content. npm run check:provenance-over-inclusion is now in verify. REMAINING: the three measurement defects are diagnosed but not repaired (fixing a denominator moves published coverage). Structural limit, stated: a NAME diff cannot see content divergence under a legitimate name — GAPS §15(c) backgrounds are the proof — so 173 is a lower bound, not a measure.",
    status: 'in-progress',
    tags: ['engineering'],
    evidence:
      'docs/GAPS.md §18; scripts/check-provenance-over-inclusion.mjs; scripts/data/srd-overinclusion-classification.json; scripts/data/srd-overinclusion-manifest.json; src/scripts/srd-coverage.ts (TARGETS exported so the gate pins the same cited sources); docs/generated/srd-coverage.md (over-inclusion table)',
  },
  {
    id: 'p1.single-entry-gaps',
    phase: 1,
    track: 'A-content',
    title: 'Single-entry content gaps',
    detail:
      "5e-2014 Net; 5e-2024 Will-o'-Wisp (upstream source table defective — verify, do not guess); PF1e Teleport (Greater) [naming]; 3.5e Shadow Evocation (Greater) [naming]; verify the naming variants against the SRD before adding.",
    status: 'missing',
    tags: ['engineering'],
    evidence: 'docs/generated/srd-coverage.md (Missing entries)',
  },
  {
    id: 'p1.pf1e-equipment',
    phase: 1,
    track: 'A-content',
    title: 'PF1e Core equipment + magic items — data, manifest, coverage',
    detail:
      'Sourced, encoded, and coverage PUBLISHED at 100%. scripts/encode-pf1e-equipment.mjs reads devonjones/PSRD-Data core_rulebook/item/** (Paizo PRD, OGL 1.0a / OGC — the repo already pinned for the bestiary) and generates src/data/pathfinder/1e/equipment/srd-{weapons,armor,gear,magic-items}.ts (243 mundane equipment + 347 magic items), merged so hand-authored entries win on id. scripts/data/pf1e-equipment-manifest.json pins the denominator; src/scripts/srd-coverage.ts has pf1e equipment + magic-items CoverageTargets. The networked npm run srd:coverage published PF1e equipment 243/243 (100%) and magic-items 347/347 (100%) in docs/generated/srd-coverage.md.',
    status: 'done',
    tags: ['engineering'],
    system: 'pf1e',
    evidence:
      'scripts/encode-pf1e-equipment.mjs; scripts/data/pf1e-equipment-manifest.json; src/data/pathfinder/1e/equipment/srd-*.ts; docs/generated/srd-coverage.md (PF1e equipment/magic-items 100%)',
  },
  {
    id: 'p1.wire-remaining-denominators',
    phase: 1,
    track: 'A-content',
    title: 'Wire remaining coverage denominators',
    detail:
      'PF2e/PF1e non-spell categories, M&M skills/conditions/equipment, Daggerheart classes/ancestries/communities/weapons/armor, and all-system monsters are documented in srd-sources.md and pending wiring into srd:coverage.',
    status: 'pending',
    tags: ['engineering'],
    evidence: 'docs/generated/srd-coverage.md (Pending)',
  },

  // ── Phase 2 — architecture spine (RFC 003) ───────────────────────────────
  {
    id: 'p2.rfc003-consolidation',
    phase: 2,
    track: 'spine',
    title: 'Consolidate the rules-IR / effect resolver (RFC 003)',
    detail:
      'The effect-composition already exists distributed across contributionLedger.ts, armorClass.ts, and the conditions layer. Consolidate into one resolver behind a behavior-equivalence (golden-master) gate; NOT a greenfield rebuild.',
    status: 'in-progress',
    tags: ['engineering'],
    evidence: 'src/rules/resolver/*; src/rules/ir/*; src/systems/*/contributionLedger.ts',
  },

  // ── Phase 3 — Denominator B (engine-math wiring) ─────────────────────────
  {
    id: 'p3.mutation-anchor-rollout',
    phase: 3,
    track: 'B-compute',
    title: 'Mutation-anchor rollout (verified → mutation-proven)',
    detail:
      'Complete: check:compute-register --mutate proves all 190 of the 190 verified entries across every system (each carries a real formula mutation anchor whose perturbation flips a linked, register-independent test from pass to fail). "verified" has graduated from test-linked-and-passing (Tier A) to mutation-proven (Tier B) for the entire register. New verified entries must land with their anchor to keep the numerator at 100%.',
    status: 'done',
    tags: ['rollout', 'engineering'],
    evidence:
      'docs/compute-register/mutation-anchors.ts (190 anchors); docs/generated/compute-register-gate.json (Tier A+B, 0 demotions); check:compute-register:mutate',
  },
  {
    id: 'p3.L3-damage-assembly',
    phase: 3,
    track: 'B-compute',
    title: 'L3 — full damage assembly with riders',
    detail:
      'Denominator-B engine wiring complete: Sneak Attack / Rage / Divine Smite / GWM / Sharpshooter / Extra Attack, 3.5e/PF1e iteratives + crit confirmation, Daggerheart crit damage + Spellcast dice, M&M Damage/Affliction DCs, 5e Versatile weapon dice, and two-weapon off-hand attacks all assemble through the seeded dice substrate + resolver/combatant and are mutation-proven. buildCharacterCombatant consumes equipped weapon dice (EquippedItem.weaponDamage) and builds the off-hand profile (resolved by the tactical executor); a placeholder die remains the fallback. SEPARATE follow-on (Denominator-A content, not B-compute): populating EquippedItem.weaponDamage from a weapon catalog at equip time so these fire for real saved characters.',
    status: 'done',
    tags: ['engineering'],
    evidence:
      'docs/compute-register/* (L3 entries mutation-proven); src/rules/resolver/attackResolution.ts (crit confirmation); src/rules/combatants/characterCombatant.ts (weapon dice + Versatile + off-hand); src/rules/tactical/tacticalExecutor.ts (off-hand resolution); src/__tests__/rules/{attackResolution,characterCombatant}.test.ts',
  },
  {
    id: 'p3.derived-and-economy',
    phase: 3,
    track: 'B-compute',
    title:
      'L1/L2/L5-L10 — derived stats, spell economy, progression, defenses, legality, encounter',
    detail:
      'Spell DC/attack/passive/cantrip/Unarmored Defense/MAP/bulk/heighten; prepared/known/upcasting; speed-with-penalty; ASI/feat cadence; resist/vuln/immune; point-buy + prereq + multiclass-stacking validators; 3.5e encounter budget + wealth — surfaced in prepareData/sheets via the resolver.',
    status: 'done',
    tags: ['engineering'],
    // Corrected 2026-07-25: the previous evidence read "per-layer in-scope <
    // verified", which is no longer true. roadmap-metrics computeCompletion now
    // reads 234/234 = 100% for ALL SEVEN systems with every layer L1–L10 at
    // in-scope == verified (Tier A test-linked AND mutation-proven, 0
    // demotions). Scope note, so this does not overclaim: 100% is of the
    // register's DECLARED in-scope set — `register-full-enumeration` is what
    // keeps that set honest, and it records `not-computed`/`excluded` entries
    // rather than silently narrowing scope.
    evidence:
      'docs/generated/roadmap-metrics.json computeCompletion (234/234 in-scope, L1–L10, all 7)',
  },

  // ── Phase 4 — cross-system parity & UX ───────────────────────────────────
  {
    id: 'p4.parity-matrix',
    phase: 4,
    track: 'parity',
    title: 'Close the 7×N capability parity matrix',
    detail:
      '5e-2024 ledger spell-DC/attack rows; d20-legacy (PF1e/3.5e) ledger breadth (BAB/saves/skill-synergy); M&M conditions UI + a guided creation orchestrator (the one system lacking a creator); PF2e multiclass aggregation; feature-option effect surfacing via the resolver.',
    status: 'pending',
    tags: ['engineering'],
    // Evidence corrected 2026-07-25: the "(absent for mam3e)" clause was stale —
    // ALL SEVEN systems now expose `loadCreationPlan`, mam3e included (it embeds
    // Mam3eCreator as a component step). Contribution ledgers are likewise 7/7.
    // The item stays PENDING because the rest of the 7×N matrix in `detail`
    // (M&M conditions UI, PF2e multiclass aggregation, feature-option effect
    // surfacing) is not proven closed — only the creation-plan and ledger
    // columns are.
    evidence: 'src/systems/*/contributionLedger.ts (7/7); src/creation/ (7/7 loadCreationPlan)',
  },

  // ── Phase 5 — production hardening ────────────────────────────────────────
  {
    id: 'p5.ai-provider-agnostic',
    phase: 5,
    track: 'hardening',
    title: 'AI gateway provider-agnosticism (D-AI)',
    detail:
      'Refactor netlify/functions/ai-gateway.mts + adapters so the provider (currently geminiAdapter) is env-selected; document the adapter interface; add a mock adapter. AI surfaces stay default-off (VITE_AI_ENABLED).',
    status: 'pending',
    tags: ['engineering'],
    evidence: 'netlify/functions/ai-gateway.mts; geminiAdapter.mts',
  },
  {
    id: 'p5.infra-gaps',
    phase: 5,
    track: 'hardening',
    title: 'Rate-limiting, analytics, a11y, observability, secrets-audit, backup/DR',
    detail:
      'Rate-limiting (pluggable store + session budget + latency budgets), opt-in no-PII telemetry, the axe a11y gate, and the VITE_*-secret guard are all built. Observability closed 2026-07-25: the sync and AI-gateway failure paths now report through errorLogger, so sentry-alerts.md rules (b)/(c) are live rather than dormant. Backup/DR closed for the browser-local store (the data of record): a recovery runbook plus an all-seven-systems lossless export/import round-trip gate. Remaining and RECORDED as decisions in GAPS.md §14 — no analytics network sink (deliberate, not a stub), Sentry release/environment wiring deferred behind the eager-bundle budget, server-side 5xx alerting is ops provisioning, and §12 a11y contrast.',
    status: 'in-progress',
    tags: ['engineering'],
    evidence:
      'docs/GAPS.md §14; docs/runbooks/local-data-recovery.md; src/__tests__/backupRestoreRoundTrip.test.ts; src/__tests__/observability/failureReporting.test.tsx; netlify/functions/rateLimitStore.mts; scripts/check-secret-exposure.mjs',
  },

  // ── Phase 6 — roadmap expansions (gated after the production bar) ─────────
  {
    id: 'p6.expansions',
    phase: 6,
    track: 'expansion',
    title:
      'RFC 005 resources/rest/leveling, RFC 004 bestiary surface, RFC 006 scene runtime, AI-DM',
    detail:
      'Short/long rest replenish + XP/milestone leveling (highest-leverage); cross-system bestiary browser; deeper event-sourced scene runtime + multi-system encounter generation; AI-DM autonomous runtime behind the AI control plane + its own RFC.',
    status: 'pending',
    tags: ['engineering'],
    evidence: 'docs/rfc/004-006; docs/rfc/002-ai-control-plane.md',
  },

  // ── Phase 7 — release ─────────────────────────────────────────────────────
  {
    id: 'p7.release',
    phase: 7,
    track: 'release',
    title: 'Release engineering & launch',
    detail:
      'Final full-gauntlet + whole-corpus adversarial sweep; single deploy target (Netlify; remove stale vercel.json); provision real secrets; staged rollout via feature flags; prod-build Playwright smoke (Chromium+Firefox); rollback rehearsal.',
    status: 'pending',
    tags: ['engineering'],
    evidence: '.github/workflows/ci.yml; netlify.toml',
  },

  // ── Carry-forward review item ─────────────────────────────────────────────
  {
    id: 'review.dnd5e-2024-exhaustion',
    phase: 3,
    track: 'B-compute',
    title: '5e-2024 exhaustion −2/level change — human sign-off (ratified)',
    detail:
      'The only shipped rule-behavior change (src/systems/dnd5e-2024/engine.ts exhaustion −2 per level) required explicit human sign-off. RATIFIED 2026-07-20: confirmed against SRD 5.2 RAW (each level of exhaustion imposes −2 to d20 tests); Dnd5e2024Engine.getExhaustionD20Penalty is settled and test-pinned.',
    status: 'done',
    tags: ['human-signoff'],
    system: 'dnd-5e-2024',
    evidence: 'src/systems/dnd5e-2024/engine.ts; ratified by maintainer 2026-07-20 (SRD 5.2 RAW)',
  },
];
