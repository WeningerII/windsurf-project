export type DocDriftSurfaceKind =
  | 'live'
  | 'generated'
  | 'historical'
  | 'workflow'
  | 'runtime-copy'
  | 'data-readme'
  | 'rfc'
  | 'plan';

export type DocDriftRuleType =
  | 'count_rule'
  | 'support_matrix_rule'
  | 'verification_rule'
  | 'command_rule'
  | 'path_ref_rule'
  | 'historical_banner_rule'
  | 'runtime_copy_rule'
  | 'capability_phrase_rule';

export interface DocDriftSurface {
  path: string;
  kind: DocDriftSurfaceKind;
  owner: string;
  rules: DocDriftRuleType[];
}

export const DOC_DRIFT_MANIFEST: DocDriftSurface[] = [
  {
    path: 'README.md',
    kind: 'live',
    owner: 'product-overview',
    rules: [
      'count_rule',
      'verification_rule',
      'command_rule',
      'path_ref_rule',
      'capability_phrase_rule',
    ],
  },
  {
    path: 'CONTRIBUTING.md',
    kind: 'live',
    owner: 'engineering-workflow',
    rules: ['verification_rule', 'command_rule', 'path_ref_rule'],
  },
  {
    // The docs index: authority order, reading order, and the gate-defined order
    // of operations for changing a doc. Deliberately owns no counts and names no
    // commit, so count_rule / verification_rule do not apply; it does cite real
    // directories and scripts, so path_ref_rule and command_rule do.
    path: 'docs/README.md',
    kind: 'live',
    owner: 'docs-index',
    rules: ['command_rule', 'path_ref_rule'],
  },
  {
    // The forward-looking work queue: what to do next and what it unblocks.
    // MASTER_PLAN owns status and decisions, GAPS owns evidence, this owns
    // ordering. Cites real paths so path_ref_rule applies; owns no counts and
    // names no commit, so the count and verification rules do not.
    path: 'docs/WORK_PLAN.md',
    kind: 'plan',
    owner: 'work-queue',
    rules: ['path_ref_rule'],
  },
  {
    path: 'docs/MASTER_PLAN.md',
    kind: 'live',
    owner: 'roadmap',
    rules: [
      'count_rule',
      'support_matrix_rule',
      'verification_rule',
      'command_rule',
      'path_ref_rule',
      'capability_phrase_rule',
    ],
  },
  {
    path: 'docs/STATUS.md',
    kind: 'live',
    owner: 'status-summary',
    rules: [
      'count_rule',
      'support_matrix_rule',
      'verification_rule',
      'path_ref_rule',
      'capability_phrase_rule',
    ],
  },
  {
    path: 'docs/VISION.md',
    kind: 'live',
    owner: 'vision',
    rules: ['path_ref_rule'],
  },
  {
    // Retired 2026-07-26. All seven phases complete, and it survived only by
    // being hand-mirrored into MASTER_PLAN.md — a mirror that demonstrably
    // dropped four shipped items. Kept for its forensic record (§0-§1 root
    // cause, Appendix A dead-code inventory); the live toolchain remainder now
    // lives in the plan's "Technical Remediation Closeout".
    path: 'docs/history/REMEDIATION_PLAN.md',
    kind: 'historical',
    owner: 'historical-remediation-plan',
    rules: ['historical_banner_rule'],
  },
  {
    path: 'docs/GAPS.md',
    kind: 'plan',
    owner: 'completion-gaps',
    rules: [],
  },
  {
    // Item-by-item record of the M&M 3e equipment provenance repair (which
    // hand-written entry was reconciled to which Hero SRD row, which were kept
    // as original content). Names shipped encoder / gate / data paths, so
    // path_ref_rule applies and keeps the record honest about what exists.
    path: 'docs/mam3e-equipment-provenance.md',
    kind: 'live',
    owner: 'mam3e-equipment-provenance',
    rules: ['path_ref_rule'],
  },
  {
    path: 'docs/design/vtt-ui-ux-research.md',
    kind: 'plan',
    owner: 'ui-shell-redesign',
    rules: ['path_ref_rule'],
  },
  {
    // The adversarial-tournament plan of record; references many proposed
    // (not-yet-existing) files by design, so no path_ref_rule.
    path: 'docs/design/ui-shell-redesign-final-plan.md',
    kind: 'plan',
    owner: 'ui-shell-redesign',
    rules: [],
  },
  {
    // Build-ready per-phase specs (re-grounded anchors + kickoff); references
    // proposed files by design, so no path_ref_rule.
    path: 'docs/design/ui-redesign-phase-build-specs.md',
    kind: 'plan',
    owner: 'ui-shell-redesign',
    rules: [],
  },
  {
    // Phase-7 budgets of record: the measured numbers behind the bundle and
    // keepalive gates, plus the honest hard-gated / soft-logged ledger. Cites
    // only files that exist, so path_ref_rule applies.
    path: 'docs/design/ui-shell-phase7-budgets.md',
    kind: 'live',
    owner: 'ui-shell-redesign',
    rules: ['path_ref_rule'],
  },
  {
    path: 'docs/srd-sources.md',
    kind: 'plan',
    owner: 'srd-sources',
    rules: [],
  },
  {
    path: 'docs/generated/srd-coverage.md',
    kind: 'generated',
    owner: 'srd-coverage',
    rules: [],
  },
  {
    // Machine-readable sidecar of the coverage report, written by the same
    // networked run. It exists so the offline metrics generator can republish
    // Denominator A without re-measuring it.
    path: 'docs/generated/srd-coverage.json',
    kind: 'generated',
    owner: 'srd-coverage',
    rules: [],
  },
  {
    // Warning label on the retired Denominator A mechanism. Names real repo
    // paths (the surviving hand-authored files and the report that replaced
    // it), so path_ref_rule applies.
    path: 'docs/srd-manifest/README.md',
    kind: 'live',
    owner: 'srd-coverage',
    rules: ['path_ref_rule'],
  },
  {
    path: 'docs/generated/roadmap-metrics.md',
    kind: 'generated',
    owner: 'generated-reporting',
    rules: ['path_ref_rule'],
  },
  {
    path: 'docs/generated/roadmap-metrics.json',
    kind: 'generated',
    owner: 'generated-reporting',
    rules: [],
  },
  {
    path: 'docs/generated/master-gap-ledger.md',
    kind: 'generated',
    owner: 'master-gap-ledger',
    rules: ['path_ref_rule'],
  },
  {
    path: 'docs/generated/master-gap-ledger.json',
    kind: 'generated',
    owner: 'master-gap-ledger',
    rules: [],
  },
  {
    path: 'docs/generated/verification-baseline.json',
    kind: 'generated',
    owner: 'verification-baseline',
    rules: [],
  },
  {
    // RFC index: one line per decision, plus the statement that an RFC owns the
    // DECISION and the plan owns rollout status. Names real RFC paths, so
    // path_ref_rule applies; owns no counts and no commit, so the count and
    // verification rules do not.
    path: 'docs/rfc/README.md',
    kind: 'rfc',
    owner: 'rfc-index',
    rules: ['path_ref_rule'],
  },
  {
    path: 'docs/rfc/001-backend-sync.md',
    kind: 'rfc',
    owner: 'backend-sync-rfc',
    rules: ['path_ref_rule'],
  },
  {
    path: 'docs/rfc/002-ai-control-plane.md',
    kind: 'rfc',
    owner: 'ai-control-plane-rfc',
    rules: ['path_ref_rule'],
  },
  {
    path: 'docs/rfc/003-rules-ir-and-effects.md',
    kind: 'rfc',
    owner: 'rules-ir-effects-rfc',
    rules: ['path_ref_rule'],
  },
  {
    path: 'docs/rfc/004-monster-product-surface.md',
    kind: 'rfc',
    owner: 'monster-product-surface-rfc',
    rules: ['path_ref_rule'],
  },
  {
    path: 'docs/rfc/005-resource-pools.md',
    kind: 'rfc',
    owner: 'resource-pools-rfc',
    rules: ['path_ref_rule'],
  },
  {
    path: 'docs/rfc/006-scene-runtime.md',
    kind: 'rfc',
    owner: 'scene-runtime-rfc',
    rules: ['path_ref_rule'],
  },
  {
    // Forward-looking design: cites shipped seams alongside PROPOSED paths
    // (src/scene/aiDm/, the src/systems/** glob) that do not exist yet, so
    // path_ref_rule must NOT apply (mirrors the plan docs above).
    path: 'docs/rfc/007-ai-dm-runtime.md',
    kind: 'rfc',
    owner: 'ai-dm-runtime-rfc',
    rules: [],
  },
  {
    // Ops runbook (turnkey-when-provisioned); prose spec, not code-paired, so
    // 'plan' (rules-free prose) like srd-sources.md — 'live' requires rule coverage.
    path: 'docs/runbooks/sentry-alerts.md',
    kind: 'plan',
    owner: 'ops-runbooks',
    rules: [],
  },
  {
    // Ops runbook (turnkey-when-provisioned); prose spec, not code-paired, so
    // 'plan' (rules-free prose) like srd-sources.md — 'live' requires rule coverage.
    path: 'docs/runbooks/supabase-backup-restore.md',
    kind: 'plan',
    owner: 'ops-runbooks',
    rules: [],
  },
  {
    // Support/on-call procedure for the BROWSER-LOCAL store (the data of record
    // on a default, sync-less install). Prose runbook like its two siblings.
    path: 'docs/runbooks/local-data-recovery.md',
    kind: 'plan',
    owner: 'ops-runbooks',
    rules: [],
  },
  {
    // Archive folder guide for the docs moved below (Remediation Phase 6, 2026-07-21).
    path: 'docs/history/README.md',
    kind: 'plan',
    owner: 'historical-planning',
    rules: ['path_ref_rule'],
  },
  {
    path: 'docs/history/PRODUCTION_PLAN.md',
    kind: 'historical',
    owner: 'historical-planning',
    rules: ['historical_banner_rule', 'path_ref_rule'],
  },
  {
    path: 'docs/history/EVIDENCE_LINKED_PARITY_AUDIT.md',
    kind: 'historical',
    owner: 'historical-audit',
    rules: ['historical_banner_rule', 'path_ref_rule'],
  },
  {
    path: 'docs/history/EVIDENCE_LINKED_PARITY_REMEDIATION_PLAN.md',
    kind: 'historical',
    owner: 'historical-remediation',
    rules: ['historical_banner_rule', 'path_ref_rule'],
  },
  {
    path: 'docs/history/2026-06-09-full-repo-code-review.md',
    kind: 'historical',
    owner: 'historical-code-review',
    rules: ['historical_banner_rule', 'path_ref_rule'],
  },
  {
    // Superseded by ui-shell-redesign-final-plan.md two days after it was
    // written (that document names this one in its own Supersedes line). Kept
    // for the file-grounded mapping and the product-decision reasoning the
    // final plan states as settled. References proposed files by design, so no
    // path_ref_rule.
    path: 'docs/history/ui-shell-redesign-plan.md',
    kind: 'historical',
    owner: 'ui-shell-redesign',
    rules: ['historical_banner_rule'],
  },
  {
    // Sourcing recommendation whose follow-on shipped: the encoder + manifest it
    // named as PROPOSED now exist, so it is a decision record, not open work.
    // Still no path_ref_rule — it also names rejected corpora that were never
    // vendored.
    path: 'docs/history/pf1e-equipment-sourcing.md',
    kind: 'historical',
    owner: 'pf1e-equipment-sourcing',
    rules: ['historical_banner_rule'],
  },
  {
    path: 'docs/history/DAGGERHEART_DATA_ORGANIZATION_PLAN.md',
    kind: 'historical',
    owner: 'historical-daggerheart-plan',
    rules: ['historical_banner_rule', 'path_ref_rule'],
  },
  {
    path: 'src/data/mutants-and-masterminds/3e/conditions/README.md',
    kind: 'data-readme',
    owner: 'mm3e-conditions-data',
    rules: ['path_ref_rule'],
  },
  {
    path: 'src/data/mutants-and-masterminds/3e/powers/README.md',
    kind: 'data-readme',
    owner: 'mm3e-powers-data',
    rules: ['path_ref_rule'],
  },
  {
    path: '.github/workflows/ci.yml',
    kind: 'workflow',
    owner: 'ci-workflow',
    rules: ['command_rule'],
  },
  {
    // Builds and deploys the app to GitHub Pages. No doc-coupled content to
    // track (the command/verification rules are scoped to ci.yml), so it is
    // registered for coverage with no per-file rules.
    path: '.github/workflows/pages.yml',
    kind: 'workflow',
    owner: 'pages-deploy-workflow',
    rules: [],
  },
  {
    path: 'scripts/runtime/runtime-policy.mjs',
    kind: 'runtime-copy',
    owner: 'runtime-policy-guidance',
    rules: ['runtime_copy_rule'],
  },
  {
    path: 'scripts/check-node-version.mjs',
    kind: 'runtime-copy',
    owner: 'runtime-mismatch-entrypoint',
    rules: ['runtime_copy_rule'],
  },
  {
    path: 'src/utils/documentationCopy.ts',
    kind: 'runtime-copy',
    owner: 'runtime-copy-canonical-source',
    rules: ['runtime_copy_rule'],
  },
  {
    path: 'src/systems/dnd35e/definition.ts',
    kind: 'runtime-copy',
    owner: 'dnd35e-support-note',
    rules: ['runtime_copy_rule'],
  },
  {
    path: 'src/systems/pf1e/definition.ts',
    kind: 'runtime-copy',
    owner: 'pf1e-support-note',
    rules: ['runtime_copy_rule'],
  },
  {
    path: 'src/systems/daggerheart/definition.ts',
    kind: 'runtime-copy',
    owner: 'daggerheart-support-note',
    rules: ['runtime_copy_rule'],
  },
  {
    path: 'src/components/GameSystemSelector.tsx',
    kind: 'runtime-copy',
    owner: 'selector-support-surface',
    rules: ['runtime_copy_rule'],
  },
  {
    path: 'src/components/SystemStatusDashboard.tsx',
    kind: 'runtime-copy',
    owner: 'dashboard-support-surface',
    rules: ['runtime_copy_rule'],
  },
  {
    path: 'src/systems/d20-legacy/components/D20SpellsTab.tsx',
    kind: 'runtime-copy',
    owner: 'legacy-spell-manual-boundaries',
    rules: ['runtime_copy_rule'],
  },
  {
    path: 'src/systems/dnd5e/shared/components/Dnd5eSpellsTab.tsx',
    kind: 'runtime-copy',
    owner: 'shared-5e-spell-boundaries',
    rules: ['runtime_copy_rule'],
  },
  {
    path: 'src/systems/dnd5e/shared/components/Dnd5eSelectedFeatsSection.tsx',
    kind: 'runtime-copy',
    owner: 'shared-5e-feat-boundaries',
    rules: ['runtime_copy_rule'],
  },
  {
    path: 'src/systems/dnd5e/shared/components/Dnd5eFeatBrowserTab.tsx',
    kind: 'runtime-copy',
    owner: 'shared-5e-feat-browser-boundaries',
    rules: ['runtime_copy_rule'],
  },
  {
    path: 'src/systems/dnd5e/shared/components/Dnd5eFeatureOptionsSection.tsx',
    kind: 'runtime-copy',
    owner: 'shared-5e-feature-option-boundaries',
    rules: ['runtime_copy_rule'],
  },
  {
    path: 'src/systems/pf2e/components/Pf2eSpellsTab.tsx',
    kind: 'runtime-copy',
    owner: 'pf2e-spell-boundaries',
    rules: ['runtime_copy_rule'],
  },
  {
    path: 'src/systems/mam3e/components/MamArchetypesTab.tsx',
    kind: 'runtime-copy',
    owner: 'mam3e-archetype-boundaries',
    rules: ['runtime_copy_rule'],
  },
];
