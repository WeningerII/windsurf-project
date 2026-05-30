import type { Dnd5eFeatureOptionGroup } from '../../../types/character-options/feature-options';
import type { SpellSlots } from '../../../types/core/character';
import type { CharacterDocument } from '../../../types/core/document';
import type { Dnd5eDataModel } from '../data-model';
import { getDnd5eDefenseStyleArmorClassBonus, hasDnd5eEquippedArmor } from './activityState';

type Dnd5eActivityKind = 'action' | 'passive';
type Dnd5eActivitySeverity = 'warning' | 'error';
type Dnd5eActivitySourceKind = 'feature-option' | 'feat' | 'feature';
type Dnd5eActivityCostKind = 'spell-slot' | 'feature-use';
type Dnd5eActivityOutputKind = 'document-update' | 'derived-modifier' | 'mechanical-note';

export interface Dnd5eActivityIssue {
  code: string;
  severity: Dnd5eActivitySeverity;
  message: string;
  path?: string;
  recoverable?: boolean;
  details?: Record<string, unknown>;
}

export interface Dnd5eActivityManualBoundary {
  kind: 'manual' | 'partial' | 'unsupported';
  note: string;
}

export interface Dnd5eActivitySource {
  kind: Dnd5eActivitySourceKind;
  id: string;
  label: string;
  group?: Dnd5eFeatureOptionGroup;
}

export interface Dnd5eActivityCost {
  kind: Dnd5eActivityCostKind;
  label: string;
  amount: number;
  path: string;
  available: boolean;
  details?: Record<string, unknown>;
}

export interface Dnd5eActivityOutput {
  kind: Dnd5eActivityOutputKind;
  target: string;
  label: string;
  operation?: 'add' | 'set';
  value: number | string | boolean | Record<string, unknown>;
}

export interface Dnd5eActivityEligibility {
  eligible: boolean;
  reasons: string[];
}

export interface Dnd5eActivityDefinition {
  id: string;
  label: string;
  kind: Dnd5eActivityKind;
  source: Dnd5eActivitySource;
  eligibility: Dnd5eActivityEligibility;
  costs: Dnd5eActivityCost[];
  outputs: Dnd5eActivityOutput[];
  inputs: [];
  manualBoundary?: Dnd5eActivityManualBoundary;
}

export interface Dnd5eActivityExecutionResult {
  document: CharacterDocument<Dnd5eDataModel>;
  activity?: Dnd5eActivityDefinition;
  issues: Dnd5eActivityIssue[];
}

const DEFENSE_STYLE_ACTIVITY_ID = 'dnd5e-2014.feature-option.fighting-styles.defense.ac';
const DIVINE_SMITE_ACTIVITY_PREFIX = 'dnd5e-2014.feature-option.smites.';

export function buildDnd5eActivityDefinitions(
  document: CharacterDocument<Dnd5eDataModel>
): Dnd5eActivityDefinition[] {
  if (document.systemId !== 'dnd-5e-2014') {
    return [];
  }

  return [
    ...buildDefenseStyleActivity(document.system),
    ...buildDivineSmiteActivities(document.system),
  ];
}

export function executeDnd5eActivity(
  document: CharacterDocument<Dnd5eDataModel>,
  activityId: string
): Dnd5eActivityExecutionResult {
  const activity = buildDnd5eActivityDefinitions(document).find((entry) => entry.id === activityId);

  if (!activity) {
    return {
      document,
      issues: [
        {
          code: 'dnd5e-activity-not-found',
          severity: 'error',
          message: `No D&D 5e activity definition found for '${activityId}'.`,
          recoverable: true,
        },
      ],
    };
  }

  if (activity.kind !== 'action') {
    return {
      document,
      activity,
      issues: [
        {
          code: 'dnd5e-activity-not-executable',
          severity: 'error',
          message: `${activity.label} is a passive activity and cannot be executed.`,
          recoverable: false,
        },
      ],
    };
  }

  if (!activity.eligibility.eligible) {
    return {
      document,
      activity,
      issues: activity.eligibility.reasons.map((reason) => ({
        code: 'dnd5e-activity-ineligible',
        severity: 'error',
        message: reason,
        recoverable: true,
      })),
    };
  }

  const spellSlotCost = activity.costs.find((cost) => cost.kind === 'spell-slot');
  if (!spellSlotCost) {
    return {
      document,
      activity,
      issues: [
        {
          code: 'dnd5e-activity-missing-cost',
          severity: 'error',
          message: `${activity.label} does not define an executable cost.`,
          recoverable: false,
        },
      ],
    };
  }

  const slotLevel = spellSlotCost.details?.slotLevel;
  if (typeof slotLevel !== 'number') {
    return {
      document,
      activity,
      issues: [
        {
          code: 'dnd5e-activity-invalid-cost',
          severity: 'error',
          message: `${activity.label} has an invalid spell-slot cost.`,
          recoverable: false,
        },
      ],
    };
  }

  const nextDocument = structuredClone(document);
  const spellcasting = nextDocument.system.spellcasting;
  const slot = spellcasting?.spellSlots[slotLevel as keyof SpellSlots];
  if (!spellcasting || !slot || slot.used >= slot.max) {
    return {
      document,
      activity,
      issues: [
        {
          code: 'dnd5e-activity-cost-unavailable',
          severity: 'error',
          path: `system.spellcasting.spellSlots.${slotLevel}`,
          message: `No available level ${slotLevel} spell slot remains for ${activity.label}.`,
          recoverable: true,
        },
      ],
    };
  }

  nextDocument.system.spellcasting = {
    ...spellcasting,
    spellSlots: {
      ...spellcasting.spellSlots,
      [slotLevel]: {
        ...slot,
        used: slot.used + 1,
      },
    },
  };

  return { document: nextDocument, activity, issues: [] };
}

function buildDefenseStyleActivity(system: Dnd5eDataModel): Dnd5eActivityDefinition[] {
  const hasSelection = hasFeatureOption(system, 'fighting-styles', 'defense');
  if (!hasSelection) {
    return [];
  }

  const hasArmor = hasDnd5eEquippedArmor(system.equipment);
  const bonus = getDnd5eDefenseStyleArmorClassBonus(system);

  return [
    {
      id: DEFENSE_STYLE_ACTIVITY_ID,
      label: 'Defense Fighting Style',
      kind: 'passive',
      source: {
        kind: 'feature-option',
        group: 'fighting-styles',
        id: 'defense',
        label: 'Defense Fighting Style',
      },
      eligibility: {
        eligible: hasArmor,
        reasons: hasArmor ? [] : ['Defense Fighting Style requires equipped armor.'],
      },
      costs: [],
      outputs: [
        {
          kind: 'derived-modifier',
          target: 'armorClass',
          label: 'Armor Class bonus while armored',
          operation: 'add',
          value: bonus,
        },
      ],
      inputs: [],
    },
  ];
}

function buildDivineSmiteActivities(system: Dnd5eDataModel): Dnd5eActivityDefinition[] {
  return (system.featureOptionSelections ?? [])
    .filter((selection) => selection.group === 'smites')
    .map((selection) => {
      const slotLevel = divineSmiteSlotLevel(selection.id);
      if (slotLevel == null) {
        return buildUnsupportedDivineSmiteActivity(selection.id);
      }

      return buildDivineSmiteActivity(system, selection.id, slotLevel);
    });
}

function buildDivineSmiteActivity(
  system: Dnd5eDataModel,
  optionId: string,
  slotLevel: number
): Dnd5eActivityDefinition {
  const slot = system.spellcasting?.spellSlots[slotLevel as keyof SpellSlots];
  const hasSlot = Boolean(slot && slot.max > slot.used);
  const hasSpellcasting = Boolean(system.spellcasting);
  const reasons = [
    ...(hasSpellcasting ? [] : ['Divine Smite requires spellcasting data on the character.']),
    ...(hasSlot ? [] : [`No available level ${slotLevel} spell slot remains.`]),
  ];

  return {
    id: `${DIVINE_SMITE_ACTIVITY_PREFIX}${optionId}`,
    label: `Divine Smite (${slotLevel}${ordinalSuffix(slotLevel)} Level Slot)`,
    kind: 'action',
    source: {
      kind: 'feature-option',
      group: 'smites',
      id: optionId,
      label: 'Divine Smite',
    },
    eligibility: {
      eligible: reasons.length === 0,
      reasons,
    },
    costs: [
      {
        kind: 'spell-slot',
        label: `Use one level ${slotLevel} spell slot`,
        amount: 1,
        path: `system.spellcasting.spellSlots.${slotLevel}.used`,
        available: hasSlot,
        details: {
          slotLevel,
          max: slot?.max ?? 0,
          used: slot?.used ?? 0,
        },
      },
    ],
    outputs: [
      {
        kind: 'document-update',
        target: `spellcasting.spellSlots.${slotLevel}.used`,
        label: 'Mark spell slot used',
        operation: 'add',
        value: 1,
      },
      {
        kind: 'mechanical-note',
        target: 'damage.radiant',
        label: 'Radiant damage dice',
        operation: 'set',
        value: `${slotLevel}d8`,
      },
    ],
    inputs: [],
    manualBoundary: {
      kind: 'partial',
      note: 'Execution marks the spell slot used. Hit confirmation, target-type bonus damage, and damage rolling remain manual.',
    },
  };
}

function buildUnsupportedDivineSmiteActivity(optionId: string): Dnd5eActivityDefinition {
  return {
    id: `${DIVINE_SMITE_ACTIVITY_PREFIX}${optionId}`,
    label: 'Divine Smite Reference',
    kind: 'passive',
    source: {
      kind: 'feature-option',
      group: 'smites',
      id: optionId,
      label: 'Divine Smite',
    },
    eligibility: {
      eligible: false,
      reasons: ['This Divine Smite option is a reference note rather than an executable slot use.'],
    },
    costs: [],
    outputs: [],
    inputs: [],
    manualBoundary: {
      kind: 'manual',
      note: 'Target-type bonus damage is tracked as a manual reference.',
    },
  };
}

function hasFeatureOption(
  system: Dnd5eDataModel,
  group: Dnd5eFeatureOptionGroup,
  id: string
): boolean {
  return (system.featureOptionSelections ?? []).some(
    (selection) => selection.group === group && selection.id === id
  );
}

function divineSmiteSlotLevel(optionId: string): number | null {
  const match = optionId.match(/^divine-smite-(\d)(?:st|nd|rd|th)$/);
  if (!match) {
    return null;
  }

  return Number.parseInt(match[1], 10);
}

function ordinalSuffix(value: number): string {
  if (value === 1) return 'st';
  if (value === 2) return 'nd';
  if (value === 3) return 'rd';
  return 'th';
}
