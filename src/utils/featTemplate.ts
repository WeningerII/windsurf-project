import { dnd5e2024Weapons } from '../data/dnd/5e-2024/equipment/weapons';
import {
  ArtisanToolProficiency,
  MusicalInstrumentProficiency,
  OtherToolProficiency,
} from '../constants/proficiencies';
import { FeatDefinition } from '../types/character-options/feats';
import { Feat, FeatAutomationState, ProficiencyLevel } from '../types/core/character';
import { CharacterDocument } from '../types/core/document';
import { Dnd5e2024DataModel } from '../systems/dnd5e-2024/data-model';
import { Dnd5eDataModel } from '../systems/dnd5e/data-model';

type Dnd5eLikeDataModel = Dnd5eDataModel | Dnd5e2024DataModel;

type DerivedClassProficiencies = {
  armor: string[];
  weapons: string[];
  tools: string[];
  savingThrows: string[];
};

type DerivedFeatAutomation = {
  abilityScores: Record<string, number>;
  armor: string[];
  weapons: string[];
  tools: string[];
  languages: string[];
  savingThrows: string[];
  skills: Record<string, ProficiencyLevel>;
};

type ChoiceCategory = 'ability' | 'skill' | 'tool' | 'weapon' | 'language' | 'skill-or-tool';

export interface Dnd5eFeatChoiceOption {
  id: string;
  label: string;
  category: Exclude<ChoiceCategory, 'skill-or-tool'>;
}

export interface Dnd5eFeatChoiceRequirement {
  id: string;
  label: string;
  count: number;
  options: Dnd5eFeatChoiceOption[];
  maxPerOption: number;
  category: ChoiceCategory;
  maxScore?: number;
}

export type Dnd5eFeatSelections = Record<string, string[]>;

const FEAT_SOURCE_PREFIX = 'feat:';
const ABILITY_REQUIREMENT_ID = 'ability-scores';

const ABILITY_NAME_TO_ID: Record<string, string> = {
  strength: 'str',
  dexterity: 'dex',
  constitution: 'con',
  intelligence: 'int',
  wisdom: 'wis',
  charisma: 'cha',
  str: 'str',
  dex: 'dex',
  con: 'con',
  int: 'int',
  wis: 'wis',
  cha: 'cha',
};

const ABILITY_OPTIONS: Dnd5eFeatChoiceOption[] = [
  { id: 'str', label: 'Strength', category: 'ability' },
  { id: 'dex', label: 'Dexterity', category: 'ability' },
  { id: 'con', label: 'Constitution', category: 'ability' },
  { id: 'int', label: 'Intelligence', category: 'ability' },
  { id: 'wis', label: 'Wisdom', category: 'ability' },
  { id: 'cha', label: 'Charisma', category: 'ability' },
];

const SKILL_OPTIONS: Array<Dnd5eFeatChoiceOption & { ability: string }> = [
  { id: 'acrobatics', label: 'Acrobatics', category: 'skill', ability: 'dex' },
  { id: 'animal-handling', label: 'Animal Handling', category: 'skill', ability: 'wis' },
  { id: 'arcana', label: 'Arcana', category: 'skill', ability: 'int' },
  { id: 'athletics', label: 'Athletics', category: 'skill', ability: 'str' },
  { id: 'deception', label: 'Deception', category: 'skill', ability: 'cha' },
  { id: 'history', label: 'History', category: 'skill', ability: 'int' },
  { id: 'insight', label: 'Insight', category: 'skill', ability: 'wis' },
  { id: 'intimidation', label: 'Intimidation', category: 'skill', ability: 'cha' },
  { id: 'investigation', label: 'Investigation', category: 'skill', ability: 'int' },
  { id: 'medicine', label: 'Medicine', category: 'skill', ability: 'wis' },
  { id: 'nature', label: 'Nature', category: 'skill', ability: 'int' },
  { id: 'perception', label: 'Perception', category: 'skill', ability: 'wis' },
  { id: 'performance', label: 'Performance', category: 'skill', ability: 'cha' },
  { id: 'persuasion', label: 'Persuasion', category: 'skill', ability: 'cha' },
  { id: 'religion', label: 'Religion', category: 'skill', ability: 'int' },
  { id: 'sleight-of-hand', label: 'Sleight of Hand', category: 'skill', ability: 'dex' },
  { id: 'stealth', label: 'Stealth', category: 'skill', ability: 'dex' },
  { id: 'survival', label: 'Survival', category: 'skill', ability: 'wis' },
];

const COMMON_LANGUAGE_OPTIONS: Dnd5eFeatChoiceOption[] = [
  'Common',
  'Dwarvish',
  'Elvish',
  'Giant',
  'Gnomish',
  'Goblin',
  'Halfling',
  'Orc',
  'Draconic',
  'Infernal',
  'Celestial',
  'Abyssal',
  'Primordial',
  'Sylvan',
  'Undercommon',
  'Deep Speech',
].map((label) => ({
  id: label,
  label,
  category: 'language',
}));

const TOOL_LABELS: Record<string, string> = {
  'alchemists-supplies': "Alchemist's Supplies",
  'brewers-supplies': "Brewer's Supplies",
  'calligraphers-supplies': "Calligrapher's Supplies",
  'carpenters-tools': "Carpenter's Tools",
  'cartographers-tools': "Cartographer's Tools",
  'cobblers-tools': "Cobbler's Tools",
  'cooks-utensils': "Cook's Utensils",
  'glassblowers-tools': "Glassblower's Tools",
  'jewelers-tools': "Jeweler's Tools",
  'leatherworkers-tools': "Leatherworker's Tools",
  'masons-tools': "Mason's Tools",
  'painters-supplies': "Painter's Supplies",
  'potters-tools': "Potter's Tools",
  'smiths-tools': "Smith's Tools",
  'tinkers-tools': "Tinker's Tools",
  'weavers-tools': "Weaver's Tools",
  'woodcarvers-tools': "Woodcarver's Tools",
  bagpipes: 'Bagpipes',
  drum: 'Drum',
  dulcimer: 'Dulcimer',
  flute: 'Flute',
  lute: 'Lute',
  lyre: 'Lyre',
  horn: 'Horn',
  'pan-flute': 'Pan Flute',
  shawm: 'Shawm',
  viol: 'Viol',
  'disguise-kit': 'Disguise Kit',
  'forgery-kit': 'Forgery Kit',
  'herbalism-kit': 'Herbalism Kit',
  'navigators-tools': "Navigator's Tools",
  'poisoners-kit': "Poisoner's Kit",
  'thieves-tools': "Thieves' Tools",
  'vehicles-land': 'Vehicles (Land)',
  'vehicles-water': 'Vehicles (Water)',
};

const TOOL_OPTIONS: Dnd5eFeatChoiceOption[] = [
  ...Object.values(ArtisanToolProficiency),
  ...Object.values(MusicalInstrumentProficiency).filter((value) => value !== 'musical-instrument'),
  ...Object.values(OtherToolProficiency).filter(
    (value) => value !== 'artisans-tools' && value !== 'gaming-set'
  ),
]
  .filter((value, index, values) => values.indexOf(value) === index)
  .map((id) => ({
    id,
    label: TOOL_LABELS[id] || humanizeId(id),
    category: 'tool' as const,
  }));

const WEAPON_OPTIONS: Dnd5eFeatChoiceOption[] = dnd5e2024Weapons
  .map((weapon) => ({
    id: weapon.id,
    label: weapon.name,
    category: 'weapon' as const,
  }))
  .filter(
    (weapon, index, weapons) => weapons.findIndex((entry) => entry.id === weapon.id) === index
  );

function cloneDocument<T extends Dnd5eLikeDataModel>(
  document: CharacterDocument<T>
): CharacterDocument<T> {
  return structuredClone(document);
}

function humanizeId(value: string): string {
  return value
    .split('-')
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ');
}

function normalizeAbilityId(value: string): string | null {
  return ABILITY_NAME_TO_ID[value.toLowerCase()] || null;
}

function normalizeArmorGrant(value: string): string {
  const normalized = value.trim().toLowerCase();
  if (normalized === 'light armor') return 'light';
  if (normalized === 'medium armor') return 'medium';
  if (normalized === 'heavy armor') return 'heavy';
  if (normalized === 'shield') return 'shields';
  return normalized;
}

function normalizeToolGrant(value: string): string {
  const normalized = value.trim().toLowerCase();
  if (normalized === "cook's utensils") return 'cooks-utensils';
  return normalized.replace(/'/g, '').replace(/\s+/g, '-');
}

function dedupe(values: string[]): string[] {
  return [...new Set(values)];
}

function mergeDerivedList(
  current: string[],
  previousDerived: string[],
  nextDerived: string[]
): string[] {
  return dedupe([...current.filter((value) => !previousDerived.includes(value)), ...nextDerived]);
}

function emptyDerivedAutomation(): DerivedFeatAutomation {
  return {
    abilityScores: {},
    armor: [],
    weapons: [],
    tools: [],
    languages: [],
    savingThrows: [],
    skills: {},
  };
}

function emptyClassDerivedProficiencies(): DerivedClassProficiencies {
  return {
    armor: [],
    weapons: [],
    tools: [],
    savingThrows: [],
  };
}

function aggregateFeatAutomation(feats: Feat[]): DerivedFeatAutomation {
  return feats.reduce<DerivedFeatAutomation>((derived, feat) => {
    const automation = feat.automation;
    if (!automation) {
      return derived;
    }

    Object.entries(automation.abilityScores || {}).forEach(([ability, bonus]) => {
      derived.abilityScores[ability] = (derived.abilityScores[ability] || 0) + bonus;
    });

    derived.armor.push(...(automation.armor || []));
    derived.weapons.push(...(automation.weapons || []));
    derived.tools.push(...(automation.tools || []));
    derived.languages.push(...(automation.languages || []));
    derived.savingThrows.push(...(automation.savingThrows || []));

    Object.entries(automation.skills || {}).forEach(([skillId, level]) => {
      if (!derived.skills[skillId]) {
        derived.skills[skillId] = level;
      }
    });

    return derived;
  }, emptyDerivedAutomation());
}

function featSourceId(featId: string): string {
  return `${FEAT_SOURCE_PREFIX}${featId}`;
}

function removeFeatSkillSources(sys: Dnd5eLikeDataModel): void {
  Object.entries(sys.skillProficiencies || {}).forEach(([skillId, proficiency]) => {
    const remainingSources = (proficiency.source || []).filter(
      (source) => !source.startsWith(FEAT_SOURCE_PREFIX)
    );
    if (remainingSources.length === (proficiency.source || []).length) {
      return;
    }

    if (remainingSources.length === 0) {
      delete sys.skillProficiencies[skillId];
      return;
    }

    sys.skillProficiencies[skillId] = {
      ...proficiency,
      source: remainingSources,
    };
  });
}

function applyFeatSkillSources(
  sys: Dnd5eLikeDataModel,
  feats: Feat[]
): void {
  feats.forEach((feat) => {
    const source = featSourceId(feat.id);
    Object.keys(feat.automation?.skills || {}).forEach((skillId) => {
      const existing = sys.skillProficiencies[skillId];
      if (!existing) {
        sys.skillProficiencies[skillId] = {
          level: 'proficient',
          source: [source],
        };
        return;
      }

      sys.skillProficiencies[skillId] = {
        ...existing,
        level: existing.level === 'none' ? 'proficient' : existing.level,
        source: [...new Set([...(existing.source || []), source])],
      };
    });
  });
}

function syncFeatState<T extends Dnd5eLikeDataModel>(
  document: CharacterDocument<T>
): CharacterDocument<T> {
  const sys = document.system;
  const previousDerived = sys.templateState?.featDerivedAutomation || emptyDerivedAutomation();
  const classDerivedProficiencies = sys.templateState?.classDerivedProficiencies || emptyClassDerivedProficiencies();
  const nextDerived = aggregateFeatAutomation(sys.feats || []);

  Object.entries(previousDerived.abilityScores || {}).forEach(([ability, bonus]) => {
    if (typeof sys.baseAttributes[ability] === 'number') {
      sys.baseAttributes[ability] -= bonus;
    }
  });

  Object.entries(nextDerived.abilityScores).forEach(([ability, bonus]) => {
    sys.baseAttributes[ability] = (sys.baseAttributes[ability] || 10) + bonus;
  });

  sys.armorProficiencies = mergeDerivedList(
    sys.armorProficiencies || [],
    previousDerived.armor || [],
    dedupe(nextDerived.armor)
  );
  sys.weaponProficiencies = mergeDerivedList(
    sys.weaponProficiencies || [],
    previousDerived.weapons || [],
    dedupe(nextDerived.weapons)
  );
  sys.toolProficiencies = mergeDerivedList(
    sys.toolProficiencies || [],
    previousDerived.tools || [],
    dedupe(nextDerived.tools)
  );
  sys.languageProficiencies = mergeDerivedList(
    sys.languageProficiencies || [],
    previousDerived.languages || [],
    dedupe(nextDerived.languages)
  );
  sys.savingThrowProficiencies = mergeDerivedList(
    sys.savingThrowProficiencies || [],
    previousDerived.savingThrows || [],
    dedupe(nextDerived.savingThrows)
  );

  removeFeatSkillSources(sys);
  applyFeatSkillSources(sys, sys.feats || []);

  sys.templateState = {
    classDerivedProficiencies: {
      armor: [...classDerivedProficiencies.armor],
      weapons: [...classDerivedProficiencies.weapons],
      tools: [...classDerivedProficiencies.tools],
      savingThrows: [...classDerivedProficiencies.savingThrows],
    },
    featDerivedAutomation: {
      abilityScores: nextDerived.abilityScores,
      armor: dedupe(nextDerived.armor),
      weapons: dedupe(nextDerived.weapons),
      tools: dedupe(nextDerived.tools),
      languages: dedupe(nextDerived.languages),
      savingThrows: dedupe(nextDerived.savingThrows),
    },
  };

  return document;
}

function inferAbilityChoiceRequirement(feat: FeatDefinition): Dnd5eFeatChoiceRequirement | null {
  if (!feat.abilityScoreIncrease) {
    return null;
  }

  const abilityBenefit = feat.benefits.find((benefit) =>
    benefit.toLowerCase().startsWith('ability score increase:')
  );
  const abilityOptions =
    abilityBenefit && /any ability score|one ability score/i.test(abilityBenefit)
      ? ABILITY_OPTIONS
      : ABILITY_OPTIONS.filter((option) =>
          abilityBenefit?.toLowerCase().includes(option.label.toLowerCase())
        );

  const fallbackOptions =
    abilityOptions.length > 0
      ? abilityOptions
      : Object.keys(feat.abilityScoreIncrease.attributes || {})
          .map((ability) => normalizeAbilityId(ability))
          .filter((ability): ability is string => ability != null)
          .map((abilityId) => ABILITY_OPTIONS.find((option) => option.id === abilityId))
          .filter((option): option is Dnd5eFeatChoiceOption => Boolean(option));

  const maxScoreMatch = abilityBenefit?.match(/maximum of (\d+)/i);

  return {
    id: ABILITY_REQUIREMENT_ID,
    label: 'Ability Score Increase',
    count:
      feat.abilityScoreIncrease.type === 'choice'
        ? feat.abilityScoreIncrease.totalIncrease || 1
        : Object.values(feat.abilityScoreIncrease.attributes || {}).reduce(
            (total, bonus) => total + bonus,
            0
          ),
    options: fallbackOptions.length > 0 ? fallbackOptions : ABILITY_OPTIONS,
    maxPerOption: feat.abilityScoreIncrease.maxPerAttribute || 1,
    category: 'ability',
    maxScore: maxScoreMatch ? Number.parseInt(maxScoreMatch[1], 10) : 20,
  };
}

function choiceRequirementFromGrant(
  kind: 'skills' | 'tools' | 'weapons' | 'languages',
  value: string
): Dnd5eFeatChoiceRequirement | null {
  const normalized = value.trim().toLowerCase();

  if (kind === 'skills' && normalized === 'one intelligence skill of your choice') {
    return {
      id: 'skills',
      label: 'Choose an Intelligence Skill',
      count: 1,
      options: SKILL_OPTIONS.filter((option) => option.ability === 'int'),
      maxPerOption: 1,
      category: 'skill',
    };
  }

  if (kind === 'skills' && normalized === 'three skills of your choice') {
    return {
      id: 'skills',
      label: 'Choose Three Skills',
      count: 3,
      options: SKILL_OPTIONS,
      maxPerOption: 1,
      category: 'skill',
    };
  }

  if (kind === 'tools' && normalized === 'three artisan tools of your choice') {
    return {
      id: 'tools',
      label: "Choose Three Artisan's Tools",
      count: 3,
      options: TOOL_OPTIONS.filter((option) =>
        Object.values(ArtisanToolProficiency).includes(option.id as never)
      ),
      maxPerOption: 1,
      category: 'tool',
    };
  }

  if (kind === 'tools' && normalized === 'three musical instruments of your choice') {
    return {
      id: 'tools',
      label: 'Choose Three Musical Instruments',
      count: 3,
      options: TOOL_OPTIONS.filter((option) =>
        Object.values(MusicalInstrumentProficiency).includes(option.id as never)
      ),
      maxPerOption: 1,
      category: 'tool',
    };
  }

  if (kind === 'weapons' && normalized === 'four weapons of your choice') {
    return {
      id: 'weapons',
      label: 'Choose Four Weapons',
      count: 4,
      options: WEAPON_OPTIONS,
      maxPerOption: 1,
      category: 'weapon',
    };
  }

  if (kind === 'languages' && normalized === 'three languages of your choice') {
    return {
      id: 'languages',
      label: 'Choose Three Languages',
      count: 3,
      options: COMMON_LANGUAGE_OPTIONS,
      maxPerOption: 1,
      category: 'language',
    };
  }

  return null;
}

function specialChoiceRequirements(feat: FeatDefinition): Dnd5eFeatChoiceRequirement[] {
  if (feat.id === 'skilled') {
    return [
      {
        id: 'skill-or-tool',
        label: 'Choose Three Skills or Tools',
        count: 3,
        options: [...SKILL_OPTIONS, ...TOOL_OPTIONS],
        maxPerOption: 1,
        category: 'skill-or-tool',
      },
    ];
  }

  if (feat.id === 'observant') {
    return [
      {
        id: 'skills',
        label: 'Choose an Observant Skill',
        count: 1,
        options: SKILL_OPTIONS.filter((option) =>
          ['insight', 'investigation', 'perception'].includes(option.id)
        ),
        maxPerOption: 1,
        category: 'skill',
      },
    ];
  }

  return [];
}

export function getDnd5eFeatAutomationRequirements(
  feat: FeatDefinition
): Dnd5eFeatChoiceRequirement[] {
  const requirements: Dnd5eFeatChoiceRequirement[] = [];

  const abilityRequirement = inferAbilityChoiceRequirement(feat);
  if (abilityRequirement) {
    requirements.push(abilityRequirement);
  }

  requirements.push(...specialChoiceRequirements(feat));
  const hasMixedSkillToolRequirement = requirements.some(
    (requirement) => requirement.category === 'skill-or-tool'
  );

  const grantEntries = [
    ...(feat.proficienciesGranted?.skills || []).map((value) => ['skills', value] as const),
    ...(feat.proficienciesGranted?.tools || []).map((value) => ['tools', value] as const),
    ...(feat.proficienciesGranted?.weapons || []).map((value) => ['weapons', value] as const),
    ...(feat.proficienciesGranted?.languages || []).map((value) => ['languages', value] as const),
  ];

  grantEntries.forEach(([kind, value]) => {
    if (hasMixedSkillToolRequirement && (kind === 'skills' || kind === 'tools')) {
      return;
    }

    const requirement = choiceRequirementFromGrant(kind, value);
    if (
      requirement &&
      !requirements.some((existing) => existing.id === requirement.id && existing.category === requirement.category)
    ) {
      requirements.push(requirement);
    }
  });

  return requirements;
}

function defaultSelectionsForRequirement(
  requirement: Dnd5eFeatChoiceRequirement,
  baseAttributes: Record<string, number>
): string[] {
  const selected: string[] = [];

  for (const option of requirement.options) {
    const uses = selected.filter((value) => value === option.id).length;
    if (uses >= requirement.maxPerOption) {
      continue;
    }

    if (requirement.category === 'ability' && requirement.maxScore != null) {
      const current = (baseAttributes[option.id] || 10) + uses;
      if (current >= requirement.maxScore) {
        continue;
      }
    }

    selected.push(option.id);
    if (selected.length >= requirement.count) {
      break;
    }
  }

  return selected;
}

export function createDefaultDnd5eFeatSelections(
  feat: FeatDefinition,
  baseAttributes: Record<string, number>
): Dnd5eFeatSelections {
  return Object.fromEntries(
    getDnd5eFeatAutomationRequirements(feat).map((requirement) => [
      requirement.id,
      defaultSelectionsForRequirement(requirement, baseAttributes),
    ])
  );
}

function countSelections(values: string[]): Record<string, number> {
  return values.reduce<Record<string, number>>((counts, value) => {
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
}

function resolveSelections(
  requirement: Dnd5eFeatChoiceRequirement,
  selections: Dnd5eFeatSelections,
  baseAttributes: Record<string, number>
): string[] {
  const provided = selections[requirement.id] || [];
  const resolved = provided.length > 0 ? provided : defaultSelectionsForRequirement(requirement, baseAttributes);

  if (resolved.length !== requirement.count) {
    throw new Error(`${requirement.label} requires ${requirement.count} selection(s)`);
  }

  const allowedIds = new Set(requirement.options.map((option) => option.id));
  const counts = countSelections(resolved);

  Object.entries(counts).forEach(([value, count]) => {
    if (!allowedIds.has(value)) {
      throw new Error(`Invalid selection "${value}" for ${requirement.label}`);
    }

    if (count > requirement.maxPerOption) {
      throw new Error(`${requirement.label} cannot choose "${value}" more than ${requirement.maxPerOption} time(s)`);
    }

    if (requirement.category === 'ability' && requirement.maxScore != null) {
      const current = baseAttributes[value] || 10;
      if (current + count > requirement.maxScore) {
        throw new Error(`${humanizeId(value)} cannot exceed ${requirement.maxScore} from ${requirement.label}`);
      }
    }
  });

  return resolved;
}

function concreteFeatAutomation(feat: FeatDefinition): FeatAutomationState {
  return {
    armor: (feat.proficienciesGranted?.armor || [])
      .filter((value) => !value.toLowerCase().includes('choice'))
      .map(normalizeArmorGrant),
    weapons: (feat.proficienciesGranted?.weapons || []).filter(
      (value) => !value.toLowerCase().includes('choice')
    ),
    tools: (feat.proficienciesGranted?.tools || [])
      .filter((value) => !value.toLowerCase().includes('choice'))
      .map(normalizeToolGrant),
    languages: (feat.proficienciesGranted?.languages || []).filter(
      (value) => !value.toLowerCase().includes('choice')
    ),
  };
}

function abilityAutomationFromSelections(
  feat: FeatDefinition,
  selections: Dnd5eFeatSelections,
  baseAttributes: Record<string, number>
): Record<string, number> {
  const requirement = inferAbilityChoiceRequirement(feat);
  if (!requirement) {
    return {};
  }

  const resolved = resolveSelections(requirement, selections, baseAttributes);
  return countSelections(resolved);
}

function currentSelectionsForRequirement(
  requirement: Dnd5eFeatChoiceRequirement,
  feat: Feat
): string[] {
  const automation = feat.automation || {};

  if (requirement.category === 'ability') {
    const selections: string[] = [];
    requirement.options.forEach((option) => {
      const count = automation.abilityScores?.[option.id] || 0;
      for (let index = 0; index < count; index += 1) {
        selections.push(option.id);
      }
    });
    return selections.slice(0, requirement.count);
  }

  if (requirement.category === 'skill') {
    return requirement.options
      .filter((option) => Boolean(automation.skills?.[option.id]))
      .map((option) => option.id)
      .slice(0, requirement.count);
  }

  if (requirement.category === 'tool') {
    return requirement.options
      .filter((option) => automation.tools?.includes(option.id))
      .map((option) => option.id)
      .slice(0, requirement.count);
  }

  if (requirement.category === 'weapon') {
    return requirement.options
      .filter((option) => automation.weapons?.includes(option.id))
      .map((option) => option.id)
      .slice(0, requirement.count);
  }

  if (requirement.category === 'language') {
    return requirement.options
      .filter((option) => automation.languages?.includes(option.id))
      .map((option) => option.id)
      .slice(0, requirement.count);
  }

  return requirement.options
    .filter((option) =>
      option.category === 'skill'
        ? Boolean(automation.skills?.[option.id])
        : automation.tools?.includes(option.id)
    )
    .map((option) => option.id)
    .slice(0, requirement.count);
}

export function getCurrentDnd5eFeatSelections(
  featDefinition: FeatDefinition,
  feat: Feat
): Dnd5eFeatSelections {
  return Object.fromEntries(
    getDnd5eFeatAutomationRequirements(featDefinition).map((requirement) => [
      requirement.id,
      currentSelectionsForRequirement(requirement, feat),
    ])
  );
}

function skillAutomationFromSelections(
  feat: FeatDefinition,
  selections: Dnd5eFeatSelections,
  baseAttributes: Record<string, number>
): Record<string, ProficiencyLevel> {
  if (feat.id === 'boon-of-skill') {
    return Object.fromEntries(SKILL_OPTIONS.map((option) => [option.id, 'proficient']));
  }

  const skillAutomation: Record<string, ProficiencyLevel> = {};

  getDnd5eFeatAutomationRequirements(feat)
    .filter((requirement) => requirement.category === 'skill' || requirement.category === 'skill-or-tool')
    .forEach((requirement) => {
      const resolved = resolveSelections(requirement, selections, baseAttributes);
      resolved.forEach((value) => {
        const skillOption = SKILL_OPTIONS.find((option) => option.id === value);
        if (skillOption) {
          skillAutomation[skillOption.id] = 'proficient';
        }
      });
    });

  return skillAutomation;
}

function toolAutomationFromSelections(
  feat: FeatDefinition,
  selections: Dnd5eFeatSelections,
  baseAttributes: Record<string, number>
): string[] {
  const tools = [...(concreteFeatAutomation(feat).tools || [])];

  getDnd5eFeatAutomationRequirements(feat)
    .filter((requirement) => requirement.category === 'tool' || requirement.category === 'skill-or-tool')
    .forEach((requirement) => {
      const resolved = resolveSelections(requirement, selections, baseAttributes);
      resolved.forEach((value) => {
        if (TOOL_OPTIONS.some((option) => option.id === value)) {
          tools.push(value);
        }
      });
    });

  return dedupe(tools);
}

function weaponAutomationFromSelections(
  feat: FeatDefinition,
  selections: Dnd5eFeatSelections,
  baseAttributes: Record<string, number>
): string[] {
  const weapons = [...(concreteFeatAutomation(feat).weapons || [])];

  getDnd5eFeatAutomationRequirements(feat)
    .filter((requirement) => requirement.category === 'weapon')
    .forEach((requirement) => {
      weapons.push(...resolveSelections(requirement, selections, baseAttributes));
    });

  return dedupe(weapons);
}

function languageAutomationFromSelections(
  feat: FeatDefinition,
  selections: Dnd5eFeatSelections,
  baseAttributes: Record<string, number>
): string[] {
  const languages = [...(concreteFeatAutomation(feat).languages || [])];

  getDnd5eFeatAutomationRequirements(feat)
    .filter((requirement) => requirement.category === 'language')
    .forEach((requirement) => {
      languages.push(...resolveSelections(requirement, selections, baseAttributes));
    });

  return dedupe(languages);
}

function savingThrowAutomationFromSelections(
  feat: FeatDefinition,
  selections: Dnd5eFeatSelections,
  baseAttributes: Record<string, number>
): string[] {
  if (feat.id !== 'resilient') {
    return [];
  }

  return Object.keys(abilityAutomationFromSelections(feat, selections, baseAttributes));
}

function buildAutomatedFeat(
  feat: FeatDefinition,
  baseAttributes: Record<string, number>,
  selections: Dnd5eFeatSelections = {}
): Feat {
  const baseAutomation = concreteFeatAutomation(feat);
  const abilityScores = abilityAutomationFromSelections(feat, selections, baseAttributes);
  const skills = skillAutomationFromSelections(feat, selections, baseAttributes);
  const tools = toolAutomationFromSelections(feat, selections, baseAttributes);
  const weapons = weaponAutomationFromSelections(feat, selections, baseAttributes);
  const languages = languageAutomationFromSelections(feat, selections, baseAttributes);
  const savingThrows = savingThrowAutomationFromSelections(feat, selections, baseAttributes);

  return {
    id: feat.id,
    name: feat.name,
    description: feat.description,
    source: feat.source,
    modifiers: feat.modifiers,
    automation: {
      abilityScores,
      armor: dedupe(baseAutomation.armor || []),
      weapons,
      tools,
      languages,
      skills,
      savingThrows,
    },
  };
}

export function applyDnd5eFeatTemplate<T extends Dnd5eLikeDataModel>(
  document: CharacterDocument<T>,
  feat: FeatDefinition,
  selections: Dnd5eFeatSelections = {}
): CharacterDocument<T> {
  const nextDocument = cloneDocument(document);
  const sys = nextDocument.system;

  if (sys.feats.some((entry) => entry.id === feat.id)) {
    throw new Error(`${feat.name} is already selected`);
  }

  const configuredFeat = buildAutomatedFeat(feat, sys.baseAttributes, selections);
  sys.feats = [...sys.feats, configuredFeat];
  return syncFeatState(nextDocument);
}

export function removeDnd5eFeatTemplate<T extends Dnd5eLikeDataModel>(
  document: CharacterDocument<T>,
  featId: string
): CharacterDocument<T> {
  const nextDocument = cloneDocument(document);
  const sys = nextDocument.system;

  if (!sys.feats.some((feat) => feat.id === featId)) {
    return nextDocument;
  }

  sys.feats = sys.feats.filter((feat) => feat.id !== featId);
  return syncFeatState(nextDocument);
}
