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
    path: 'docs/REMEDIATION_PLAN.md',
    kind: 'plan',
    owner: 'active-remediation-plan',
    rules: [],
  },
  {
    path: 'docs/GAPS.md',
    kind: 'plan',
    owner: 'completion-gaps',
    rules: [],
  },
  {
    path: 'docs/design/vtt-ui-ux-research.md',
    kind: 'plan',
    owner: 'ui-shell-redesign',
    rules: ['path_ref_rule'],
  },
  {
    // Forward-looking plan: deliberately references proposed src/dock/** and
    // src/shell/** files that do not exist yet, so path_ref_rule must NOT apply
    // (mirrors REMEDIATION_PLAN.md / GAPS.md, which also carry no rules).
    path: 'docs/design/ui-shell-redesign-plan.md',
    kind: 'plan',
    owner: 'ui-shell-redesign',
    rules: [],
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
    path: 'docs/PRODUCTION_PLAN.md',
    kind: 'historical',
    owner: 'historical-planning',
    rules: ['historical_banner_rule', 'path_ref_rule'],
  },
  {
    path: 'docs/EVIDENCE_LINKED_PARITY_AUDIT.md',
    kind: 'historical',
    owner: 'historical-audit',
    rules: ['historical_banner_rule', 'path_ref_rule'],
  },
  {
    path: 'docs/EVIDENCE_LINKED_PARITY_REMEDIATION_PLAN.md',
    kind: 'historical',
    owner: 'historical-remediation',
    rules: ['historical_banner_rule', 'path_ref_rule'],
  },
  {
    path: 'docs/reviews/2026-06-09-full-repo-code-review.md',
    kind: 'historical',
    owner: 'historical-code-review',
    rules: ['historical_banner_rule', 'path_ref_rule'],
  },
  {
    path: 'docs/DAGGERHEART_DATA_ORGANIZATION_PLAN.md',
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
