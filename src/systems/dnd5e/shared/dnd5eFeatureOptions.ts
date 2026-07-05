import type {
  Dnd5eFeatureOptionDefinition,
  Dnd5eFeatureOptionGroup,
  Dnd5eFeatureOptionSelection,
} from '../../../types/character-options/feature-options';
import type { Feature } from '../../../types/core/character';

type ClassLevelLike = {
  classId: string;
  level: number;
  subclassId?: string;
};

type FeatureOptionState = {
  featureOptionSelections?: Dnd5eFeatureOptionSelection[];
  features: Feature[];
};

type SourceWithBook = {
  book: string;
};

export const DND5E_FEATURE_OPTION_GROUP_LABELS: Record<Dnd5eFeatureOptionGroup, string> = {
  invocations: 'Eldritch Invocations',
  'fighting-styles': 'Fighting Styles',
  metamagic: 'Metamagic',
  maneuvers: 'Maneuvers',
  'ki-abilities': 'Ki Abilities',
  'channel-divinity': 'Channel Divinity',
  'wild-shapes': 'Wild Shapes',
  smites: 'Divine Smites',
};

const DND5E_FEATURE_OPTION_SOURCE_LABELS: Record<Dnd5eFeatureOptionGroup, string> = {
  invocations: 'Selected Invocation',
  'fighting-styles': 'Selected Fighting Style',
  metamagic: 'Selected Metamagic',
  maneuvers: 'Selected Maneuver',
  'ki-abilities': 'Selected Ki Ability',
  'channel-divinity': 'Selected Channel Divinity',
  'wild-shapes': 'Selected Wild Shape',
  smites: 'Selected Divine Smite',
};

const GROUP_PRIORITY: Record<Dnd5eFeatureOptionGroup, number> = {
  invocations: 0,
  'fighting-styles': 1,
  metamagic: 2,
  maneuvers: 3,
  'ki-abilities': 4,
  'channel-divinity': 5,
  'wild-shapes': 6,
  smites: 7,
};

const DOMAIN_SUBCLASS_IDS: Partial<Record<string, string>> = {
  life: 'life-domain',
};

function normalizeSource(source: string | SourceWithBook): string {
  return typeof source === 'string' ? source : source.book;
}

function appendBulletList(description: string, entries: string[] | undefined): string {
  if (!entries || entries.length === 0) {
    return description;
  }

  return `${description}\n\n${entries.join('\n')}`;
}

function unique(values: Array<string | undefined>): string[] {
  return [...new Set(values.filter((value): value is string => Boolean(value && value.trim())))];
}

function selectionKey(selection: Pick<Dnd5eFeatureOptionSelection, 'group' | 'id'>): string {
  return `${selection.group}:${selection.id}`;
}

function featureIdForOption(option: Pick<Dnd5eFeatureOptionSelection, 'group' | 'id'>): string {
  return `feature-option:${selectionKey(option)}`;
}

export function isDnd5eFeatureOptionFeatureId(featureId: string): boolean {
  return featureId.startsWith('feature-option:');
}

export function getDnd5eFeatureOptionGroupLabel(group: Dnd5eFeatureOptionGroup): string {
  return DND5E_FEATURE_OPTION_GROUP_LABELS[group];
}

function toFeature(option: Dnd5eFeatureOptionDefinition): Feature {
  return {
    id: featureIdForOption(option),
    name: option.name,
    source: DND5E_FEATURE_OPTION_SOURCE_LABELS[option.group],
    description: option.description,
  };
}

function sameSelection(
  left: Pick<Dnd5eFeatureOptionSelection, 'group' | 'id'>,
  right: Pick<Dnd5eFeatureOptionSelection, 'group' | 'id'>
): boolean {
  return left.group === right.group && left.id === right.id;
}

function sortOptions(
  left: Dnd5eFeatureOptionDefinition,
  right: Dnd5eFeatureOptionDefinition
): number {
  const groupDelta = GROUP_PRIORITY[left.group] - GROUP_PRIORITY[right.group];
  if (groupDelta !== 0) {
    return groupDelta;
  }

  if (left.minLevel !== right.minLevel) {
    return (left.minLevel ?? 0) - (right.minLevel ?? 0);
  }

  return left.name.localeCompare(right.name);
}

export async function loadDnd5e2014FeatureOptions(): Promise<Dnd5eFeatureOptionDefinition[]> {
  const [
    invocationsModule,
    smitesModule,
    fightingStylesModule,
    kiAbilitiesModule,
    metamagicModule,
    maneuversModule,
    channelDivinityModule,
    wildShapesModule,
  ] = await Promise.all([
    import('../../../data/dnd/5e-2014/special-abilities/eldritch-invocations'),
    import('../../../data/dnd/5e-2014/special-abilities/divine-smites'),
    import('../../../data/dnd/5e-2014/special-abilities/fighting-styles'),
    import('../../../data/dnd/5e-2014/special-abilities/ki-abilities'),
    import('../../../data/dnd/5e-2014/special-abilities/sorcerer-metamagic'),
    import('../../../data/dnd/5e-2014/special-abilities/maneuvers'),
    import('../../../data/dnd/5e-2014/class-features/cleric/channel-divinity'),
    import('../../../data/dnd/5e-2014/class-features/druid/wild-shapes'),
  ]);

  const options: Dnd5eFeatureOptionDefinition[] = [
    ...invocationsModule.eldritchInvocations.map((entry) => ({
      id: entry.id,
      group: 'invocations' as const,
      name: entry.name,
      system: 'dnd-5e-2014' as const,
      source: normalizeSource(entry.source),
      description: appendBulletList(entry.description, entry.effects),
      classIds: ['warlock'],
      minLevel: entry.minLevel > 0 ? entry.minLevel : undefined,
      prerequisites: unique([entry.prerequisites]),
    })),
    ...smitesModule.divineSmites.map((entry) => ({
      id: entry.id,
      group: 'smites' as const,
      name: entry.name,
      system: 'dnd-5e-2014' as const,
      source: normalizeSource(entry.source),
      description: appendBulletList(entry.description, [
        `Base damage: ${entry.baseDamage}`,
        ...entry.effects,
      ]),
      classIds: ['paladin'],
      prerequisites: unique(
        entry.spellSlotLevel > 1 ? [`Requires a level ${entry.spellSlotLevel}+ spell slot`] : []
      ),
    })),
    ...fightingStylesModule.fightingStyles.map((entry) => ({
      id: entry.id,
      group: 'fighting-styles' as const,
      name: entry.name,
      system: 'dnd-5e-2014' as const,
      source: normalizeSource(entry.source),
      description: appendBulletList(entry.description, entry.benefits),
      classIds: entry.class,
    })),
    ...kiAbilitiesModule.kiAbilities.map((entry) => ({
      id: entry.id,
      group: 'ki-abilities' as const,
      name: entry.name,
      system: 'dnd-5e-2014' as const,
      source: normalizeSource(entry.source),
      description: appendBulletList(entry.description, entry.effects),
      classIds: ['monk'],
      minLevel: entry.minLevel > 0 ? entry.minLevel : undefined,
      prerequisites: unique(entry.kiCost > 0 ? [`Costs ${entry.kiCost} ki`] : []),
    })),
    ...metamagicModule.sorcererMetamagic.map((entry) => ({
      id: entry.id,
      group: 'metamagic' as const,
      name: entry.name,
      system: 'dnd-5e-2014' as const,
      source: normalizeSource(entry.source),
      description: appendBulletList(entry.description, entry.effects),
      classIds: ['sorcerer'],
      prerequisites: unique(
        entry.sorceryPointCost > 0 ? [`Costs ${entry.sorceryPointCost} sorcery point(s)`] : []
      ),
    })),
    ...maneuversModule.maneuvers.map((entry) => ({
      id: entry.id,
      group: 'maneuvers' as const,
      name: entry.name,
      system: 'dnd-5e-2014' as const,
      source: 'SRD 5.1',
      description: entry.description,
      classIds: ['fighter'],
      prerequisites: unique(
        entry.source.toLowerCase().includes('battle master') ? ['Battle Master archetype'] : []
      ),
    })),
    ...channelDivinityModule.channelDivinityOptions.map((entry) => ({
      id: entry.id,
      group: 'channel-divinity' as const,
      name: entry.name,
      system: 'dnd-5e-2014' as const,
      source: normalizeSource(entry.source),
      description: entry.description,
      classIds: ['cleric'],
      subclassIds: unique(
        entry.domain ? [DOMAIN_SUBCLASS_IDS[entry.domain] as string | undefined] : []
      ),
      minLevel: entry.minLevel,
      prerequisites: unique(entry.domain ? [`${entry.domain} domain`] : []),
    })),
    ...wildShapesModule.wildShapeForms.map((entry) => ({
      id: entry.id,
      group: 'wild-shapes' as const,
      name: entry.name,
      system: 'dnd-5e-2014' as const,
      source: normalizeSource(entry.source),
      description: appendBulletList(
        `${entry.name} wild shape form.`,
        unique([
          `CR ${entry.challengeRating}`,
          entry.swimSpeed ? 'Swim speed available' : undefined,
          entry.flySpeed ? 'Fly speed available' : undefined,
          ...entry.actions.map((action) => `Action: ${action}`),
          ...(entry.specialAbilities || []).map((ability) => `Trait: ${ability}`),
        ])
      ),
      classIds: ['druid'],
      minLevel: entry.minDruidLevel,
    })),
  ];

  return options.sort(sortOptions);
}

export function getEligibleDnd5eFeatureOptions(
  options: Dnd5eFeatureOptionDefinition[],
  classLevels: ClassLevelLike[]
): Dnd5eFeatureOptionDefinition[] {
  return options.filter((option) =>
    classLevels.some((classLevel) => {
      if (!option.classIds.includes(classLevel.classId)) {
        return false;
      }

      if (option.minLevel && classLevel.level < option.minLevel) {
        return false;
      }

      if (option.subclassIds && option.subclassIds.length > 0) {
        return Boolean(classLevel.subclassId && option.subclassIds.includes(classLevel.subclassId));
      }

      return true;
    })
  );
}

export function synchronizeDnd5eFeatureOptionSelections<T extends FeatureOptionState>(
  system: T,
  options: Dnd5eFeatureOptionDefinition[]
): T {
  const optionMap = new Map(options.map((option) => [selectionKey(option), option]));
  const currentSelections = system.featureOptionSelections || [];
  const nextSelections = currentSelections.filter((selection) =>
    optionMap.has(selectionKey(selection))
  );
  const preservedFeatures = system.features.filter(
    (feature) => !isDnd5eFeatureOptionFeatureId(feature.id)
  );
  const syncedFeatures = nextSelections.flatMap((selection) => {
    const option = optionMap.get(selectionKey(selection));
    return option ? [toFeature(option)] : [];
  });

  return {
    ...system,
    featureOptionSelections: nextSelections,
    features: [...preservedFeatures, ...syncedFeatures],
  };
}

export function applyDnd5eFeatureOptionSelection<T extends FeatureOptionState>(
  system: T,
  option: Dnd5eFeatureOptionDefinition
): T {
  const currentSelections = system.featureOptionSelections || [];
  if (currentSelections.some((selection) => sameSelection(selection, option))) {
    return system;
  }

  return {
    ...system,
    featureOptionSelections: [...currentSelections, { id: option.id, group: option.group }],
    features: [
      ...system.features.filter((feature) => feature.id !== featureIdForOption(option)),
      toFeature(option),
    ],
  };
}

export function removeDnd5eFeatureOptionSelection<T extends FeatureOptionState>(
  system: T,
  selection: Dnd5eFeatureOptionSelection
): T {
  return {
    ...system,
    featureOptionSelections: (system.featureOptionSelections || []).filter(
      (entry) => !sameSelection(entry, selection)
    ),
    features: system.features.filter((feature) => feature.id !== featureIdForOption(selection)),
  };
}
