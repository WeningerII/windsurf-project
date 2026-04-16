import type { GameSystemId } from '../src/types/game-systems';
import {
  D20_LEGACY_MANUAL_NOTES,
  DND5E_FEATURE_OPTION_COPY,
  DND5E_FEAT_COPY,
  DND5E_SPELLS_COPY,
  MAM3E_ARCHETYPE_COPY,
  PF2E_SPELLS_COPY,
} from '../src/utils/documentationCopy';

export interface VerificationBaseline {
  lastVerifiedDate: string;
  nodeVersion: string;
  verifyCommand: string;
  vitestFiles?: number;
  vitestTests?: number;
  playwrightTests?: number;
  coverage?: {
    lines?: number;
    statements?: number;
    functions?: number;
    branches?: number;
  };
}

export interface DocDriftTruth {
  registeredSystemCount: number;
  nvmVersion: string;
  nodeVersionFileVersion: string | null;
  pinnedNodeVersion: string;
  supportedNodeRangeLabel: string;
  workflowNodeVersion: string | null;
  workflowNodeVersionFile: string | null;
  workflowUsesNetlify: boolean;
  workflowVerifyCommand: string | null;
  verificationBaseline: VerificationBaseline;
  spellCounts: Record<GameSystemId, number>;
  systemSupportLevels: Record<GameSystemId, 'full' | 'partial' | 'scaffold'>;
  systemLabels: Record<GameSystemId, string>;
}

type ExpectedTextRule = {
  path: string;
  description: string;
  expectedText: (truth: DocDriftTruth) => string;
};

type SupportMatrixRule = {
  path: string;
  description: string;
  expectedRows: (truth: DocDriftTruth) => string[];
};

type CapabilityPhraseRule = {
  path: string;
  description: string;
  expected: string;
};

type RuntimeCopyRule =
  | {
      path: string;
      kind: 'definition-note';
      systemId: GameSystemId;
      sourceToken: string;
    }
  | {
      path: string;
      kind: 'source-token';
      requiredTokens: string[];
    };

export const COUNT_RULES: ExpectedTextRule[] = [
  {
    path: 'README.md',
    description: 'registered system count overview',
    expectedText: (truth) => `across ${truth.registeredSystemCount} registered game systems`,
  },
  {
    path: 'docs/STATUS.md',
    description: 'registered system count summary',
    expectedText: (truth) =>
      `${truth.registeredSystemCount} registered systems are live in the registry.`,
  },
  {
    path: 'docs/MASTER_PLAN.md',
    description: 'registered system count current truth',
    expectedText: (truth) =>
      `The repo currently ships ${truth.registeredSystemCount} registered systems.`,
  },
  {
    path: 'docs/STATUS.md',
    description: 'canonical 3.5e spell count',
    expectedText: (truth) =>
      `canonical ${truth.spellCounts['dnd-3.5e']}-spell loader-backed catalog`,
  },
  {
    path: 'docs/MASTER_PLAN.md',
    description: 'canonical 3.5e spell count',
    expectedText: (truth) =>
      `canonical ${truth.spellCounts['dnd-3.5e']}-spell loader-backed catalog`,
  },
  {
    path: 'docs/PRODUCTION_PLAN.md',
    description: 'historical current-truth 3.5e spell count',
    expectedText: (truth) => `${truth.spellCounts['dnd-3.5e']} for D&D 3.5e`,
  },
  {
    path: 'docs/PRODUCTION_PLAN.md',
    description: 'historical current-truth PF2e spell count',
    expectedText: (truth) => `${truth.spellCounts.pf2e} for PF2e`,
  },
  {
    path: 'docs/EVIDENCE_LINKED_PARITY_AUDIT.md',
    description: 'historical current-truth 3.5e spell count',
    expectedText: (truth) => `${truth.spellCounts['dnd-3.5e']} loader-backed D&D 3.5e spells`,
  },
  {
    path: 'docs/EVIDENCE_LINKED_PARITY_AUDIT.md',
    description: 'historical current-truth PF2e spell count',
    expectedText: (truth) => `${truth.spellCounts.pf2e} loader-backed PF2e spells`,
  },
];

export const SUPPORT_MATRIX_RULES: SupportMatrixRule[] = [
  {
    path: 'docs/STATUS.md',
    description: 'system support rows',
    expectedRows: (truth) =>
      (Object.keys(truth.systemSupportLevels) as GameSystemId[]).map(
        (systemId) =>
          `| ${truth.systemLabels[systemId]} | ${capitalizeSupportLevel(truth.systemSupportLevels[systemId])} |`
      ),
  },
  {
    path: 'docs/MASTER_PLAN.md',
    description: 'system support rows',
    expectedRows: (truth) =>
      (Object.keys(truth.systemSupportLevels) as GameSystemId[]).map(
        (systemId) =>
          `| ${truth.systemLabels[systemId]} | ${capitalizeSupportLevel(truth.systemSupportLevels[systemId])} |`
      ),
  },
];

export const VERIFICATION_RULES: ExpectedTextRule[] = [
  {
    path: 'README.md',
    description: 'README verification baseline',
    expectedText: (truth) =>
      `✅ **Verification**: \`${truth.verificationBaseline.verifyCommand}\` passed on ${truth.verificationBaseline.lastVerifiedDate} under Node \`${truth.verificationBaseline.nodeVersion}\``,
  },
  {
    path: 'docs/STATUS.md',
    description: 'STATUS verification baseline',
    expectedText: (truth) =>
      `**Last repo-wide verification:** ${truth.verificationBaseline.lastVerifiedDate} via \`${truth.verificationBaseline.verifyCommand}\` under Node \`${truth.verificationBaseline.nodeVersion}\``,
  },
  {
    path: 'docs/MASTER_PLAN.md',
    description: 'MASTER_PLAN verification baseline',
    expectedText: (truth) =>
      `The documented repo-wide verification baseline is green as of ${truth.verificationBaseline.lastVerifiedDate} via \`${truth.verificationBaseline.verifyCommand}\` under Node \`${truth.verificationBaseline.nodeVersion}\`.`,
  },
  {
    path: 'CONTRIBUTING.md',
    description: 'CONTRIBUTING verification baseline',
    expectedText: (truth) =>
      `Latest recorded full pass: ${truth.verificationBaseline.lastVerifiedDate} under Node \`v${truth.verificationBaseline.nodeVersion}\`.`,
  },
];

export const COMMAND_RUNTIME_RULES: ExpectedTextRule[] = [
  {
    path: 'README.md',
    description: 'README supported node range',
    expectedText: (truth) => `- **Node.js**: ${truth.supportedNodeRangeLabel}`,
  },
  {
    path: 'README.md',
    description: 'README runtime pin',
    expectedText: (truth) =>
      `- **Runtime Pin**: \`.nvmrc\` and \`.node-version\` both pin \`${truth.pinnedNodeVersion}\``,
  },
  {
    path: 'README.md',
    description: 'README manager path',
    expectedText: () =>
      '- **Manager Path**: Use your preferred version manager to match the repo pin, then run normal `npm install` / `npm run verify` flows',
  },
  {
    path: 'README.md',
    description: 'README bootstrap path',
    expectedText: () =>
      '- **Bootstrap Path**: On host Node 18+, run `npm run bootstrap:node`, then `npm run pinned -- run <task>` if no version manager is available',
  },
  {
    path: 'CONTRIBUTING.md',
    description: 'CONTRIBUTING supported node range',
    expectedText: (truth) =>
      `- Node.js ${truth.supportedNodeRangeLabel}. The test stack depends on this runtime.`,
  },
  {
    path: 'CONTRIBUTING.md',
    description: 'CONTRIBUTING runtime pin',
    expectedText: (truth) =>
      `- \`.nvmrc\` and \`.node-version\` both pin \`${truth.pinnedNodeVersion}\`.`,
  },
  {
    path: 'CONTRIBUTING.md',
    description: 'CONTRIBUTING manager path',
    expectedText: () =>
      '- Manager path: use your preferred version manager to match the repo pin, then run normal `npm install` / `npm run verify` flows.',
  },
  {
    path: 'CONTRIBUTING.md',
    description: 'CONTRIBUTING bootstrap path',
    expectedText: () =>
      '- Bootstrap path: on host Node 18+, run `npm run bootstrap:node`, then `npm run pinned -- run <task>` if no version manager is available.',
  },
];

export const CAPABILITY_PHRASE_RULES: CapabilityPhraseRule[] = [
  {
    path: 'README.md',
    description: 'open-content-only overview',
    expected: 'only open-license SRD content',
  },
  {
    path: 'README.md',
    description: 'shared 5e always-prepared phrase',
    expected: 'structured always-prepared support',
  },
  {
    path: 'README.md',
    description: 'legacy Vancian workflow phrase',
    expected: 'Vancian tracked/prepared spell workflows',
  },
  {
    path: 'README.md',
    description: 'PF2e rank-10 browsing phrase',
    expected: 'PF2e rank-10 browser support',
  },
  {
    path: 'README.md',
    description: 'M&M reference-only archetypes phrase',
    expected: 'Archetypes remain reference-only and do not auto-build characters.',
  },
  {
    path: 'docs/STATUS.md',
    description: 'PF2e rank-10 browsing status phrase',
    expected: 'dynamic rank-10 spell browsing',
  },
  {
    path: 'docs/STATUS.md',
    description: 'Daggerheart manual/reference boundary phrase',
    expected: 'deterministic passive automation with explicit manual/reference boundaries',
  },
  {
    path: 'docs/MASTER_PLAN.md',
    description: 'PF2e rank-10 browsing master-plan phrase',
    expected: 'dynamic rank-10 spell browsing',
  },
  {
    path: 'docs/MASTER_PLAN.md',
    description: 'M&M reference-only boundary phrase',
    expected:
      'reference-only. They can be pinned and reviewed in-sheet, but they do not auto-build powers, skills, or point totals.',
  },
];

export const HISTORICAL_BANNER_RULES = [
  {
    path: 'docs/PRODUCTION_PLAN.md',
    description: 'historical execution record banner',
  },
  {
    path: 'docs/EVIDENCE_LINKED_PARITY_AUDIT.md',
    description: 'historical audit banner',
  },
  {
    path: 'docs/EVIDENCE_LINKED_PARITY_REMEDIATION_PLAN.md',
    description: 'historical remediation banner',
  },
  {
    path: 'docs/DAGGERHEART_DATA_ORGANIZATION_PLAN.md',
    description: 'historical Daggerheart banner',
  },
] as const;

export const RUNTIME_COPY_RULES: RuntimeCopyRule[] = [
  {
    path: 'scripts/runtime/runtime-policy.mjs',
    kind: 'source-token',
    requiredTokens: [
      'Manager path: use your preferred version manager to match',
      'Bootstrap path: on host Node 18+, run `npm run bootstrap:node`, then `npm run pinned -- run <task>`.',
      'Pin files: .nvmrc=',
    ],
  },
  {
    path: 'scripts/check-node-version.mjs',
    kind: 'source-token',
    requiredTokens: ['assertHostRuntimeSupported'],
  },
  {
    path: 'src/systems/dnd35e/definition.ts',
    kind: 'definition-note',
    systemId: 'dnd-3.5e',
    sourceToken: "SYSTEM_SUPPORT_NOTES['dnd-3.5e']",
  },
  {
    path: 'src/systems/pf1e/definition.ts',
    kind: 'definition-note',
    systemId: 'pf1e',
    sourceToken: 'SYSTEM_SUPPORT_NOTES.pf1e',
  },
  {
    path: 'src/systems/daggerheart/definition.ts',
    kind: 'definition-note',
    systemId: 'daggerheart',
    sourceToken: 'SYSTEM_SUPPORT_NOTES.daggerheart',
  },
  {
    path: 'src/components/GameSystemSelector.tsx',
    kind: 'source-token',
    requiredTokens: ['summary?.supportNotes', 'supportBadgeLabels', 'supportBadgeStyles'],
  },
  {
    path: 'src/components/SystemStatusDashboard.tsx',
    kind: 'source-token',
    requiredTokens: ['summary?.supportNotes', 'supportBadgeLabels', 'supportBadgeStyles'],
  },
  {
    path: 'src/systems/d20-legacy/components/D20SpellsTab.tsx',
    kind: 'source-token',
    requiredTokens: ['D20_LEGACY_MANUAL_NOTES'],
  },
  {
    path: 'src/systems/dnd5e/shared/components/Dnd5eSpellsTab.tsx',
    kind: 'source-token',
    requiredTokens: [
      'DND5E_SPELLS_COPY.knownSpellCasting',
      'DND5E_SPELLS_COPY.alwaysPreparedSupport',
    ],
  },
  {
    path: 'src/systems/dnd5e/shared/components/Dnd5eSelectedFeatsSection.tsx',
    kind: 'source-token',
    requiredTokens: ['DND5E_FEAT_COPY.selectedSupport'],
  },
  {
    path: 'src/systems/dnd5e/shared/components/Dnd5eFeatBrowserTab.tsx',
    kind: 'source-token',
    requiredTokens: ['DND5E_FEAT_COPY.browserSupport'],
  },
  {
    path: 'src/systems/dnd5e/shared/components/Dnd5eFeatureOptionsSection.tsx',
    kind: 'source-token',
    requiredTokens: [
      'DND5E_FEATURE_OPTION_COPY.provenanceSupport',
      'DND5E_FEATURE_OPTION_COPY.emptyState',
    ],
  },
  {
    path: 'src/systems/pf2e/components/Pf2eSpellsTab.tsx',
    kind: 'source-token',
    requiredTokens: [
      'PF2E_SPELLS_COPY.alwaysPreparedSupport',
      'PF2E_SPELLS_COPY.preparedSlotsSupport',
    ],
  },
  {
    path: 'src/systems/mam3e/components/MamArchetypesTab.tsx',
    kind: 'source-token',
    requiredTokens: ['MAM3E_ARCHETYPE_COPY.referenceOnly'],
  },
  {
    path: 'src/utils/documentationCopy.ts',
    kind: 'source-token',
    requiredTokens: [
      'SYSTEM_SUPPORT_NOTES = {',
      D20_LEGACY_MANUAL_NOTES[0],
      DND5E_SPELLS_COPY.alwaysPreparedSupport,
      DND5E_FEAT_COPY.browserSupport,
      DND5E_FEATURE_OPTION_COPY.provenanceSupport,
      PF2E_SPELLS_COPY.preparedSlotsSupport,
      MAM3E_ARCHETYPE_COPY.referenceOnly,
    ],
  },
];

export function capitalizeSupportLevel(level: 'full' | 'partial' | 'scaffold'): string {
  return level.charAt(0).toUpperCase() + level.slice(1);
}
