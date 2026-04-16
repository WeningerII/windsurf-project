import { Feature, ProficiencyLevel } from '../types/core/character';
import { CharacterDocument } from '../types/core/document';
import { Species } from '../types/character-options/species';
import { Dnd5e2024DataModel } from '../systems/dnd5e-2024/data-model';
import { Dnd5eDataModel } from '../systems/dnd5e/data-model';
import { formatDnd5eToolLabel } from './dnd5eToolChoices';

type Dnd5eLikeDataModel = Dnd5eDataModel | Dnd5e2024DataModel;

export interface Dnd5eSpeciesChoiceSlot {
  label: string;
  options: string[];
  bonus?: number;
}

export interface Dnd5eSpeciesTemplateSelections {
  abilitySelections?: string[];
  languageSelections?: string[];
  skillSelections?: string[];
  toolSelections?: string[];
}

const PROFICIENCY_PRIORITY: Record<ProficiencyLevel, number> = {
  none: 0,
  half: 1,
  proficient: 2,
  expertise: 3,
  double: 3,
};

const COMMON_LANGUAGE_OPTIONS = [
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
];

const SKILL_OPTIONS = [
  'acrobatics',
  'animal-handling',
  'arcana',
  'athletics',
  'deception',
  'history',
  'insight',
  'intimidation',
  'investigation',
  'medicine',
  'nature',
  'perception',
  'performance',
  'persuasion',
  'religion',
  'sleight-of-hand',
  'stealth',
  'survival',
];

function cloneDocument<T extends Dnd5eLikeDataModel>(
  document: CharacterDocument<T>
): CharacterDocument<T> {
  return structuredClone(document);
}

function dedupe(values: string[]): string[] {
  return [...new Set(values)];
}

function removeValues(current: string[] | undefined, removed: string[]): string[] {
  return (current || []).filter((value) => !removed.includes(value));
}

function mergeSkillProficiency(
  sys: Dnd5eLikeDataModel,
  skillId: string,
  speciesName: string
): void {
  const existing = sys.skillProficiencies[skillId];

  if (!existing) {
    sys.skillProficiencies[skillId] = {
      level: 'proficient',
      source: [speciesName],
    };
    return;
  }

  const nextLevel =
    PROFICIENCY_PRIORITY[existing.level] >= PROFICIENCY_PRIORITY.proficient
      ? existing.level
      : 'proficient';

  sys.skillProficiencies[skillId] = {
    ...existing,
    level: nextLevel,
    source: [...new Set([...(existing.source || []), speciesName])],
  };
}

function removeSkillProficiencySource(
  sys: Dnd5eLikeDataModel,
  skillId: string,
  sourceName: string
): void {
  const existing = sys.skillProficiencies[skillId];
  if (!existing) {
    return;
  }

  const remainingSources = (existing.source || []).filter((source) => source !== sourceName);
  if (remainingSources.length === 0) {
    delete sys.skillProficiencies[skillId];
    return;
  }

  sys.skillProficiencies[skillId] = {
    ...existing,
    source: remainingSources,
  };
}

function resolveChoiceSelections(
  slots: Dnd5eSpeciesChoiceSlot[],
  rawSelections: string[] | undefined,
  unavailable: string[],
  useFallback: boolean
): string[] {
  if (slots.length === 0) {
    return [];
  }

  const blocked = new Set(unavailable);
  const selections: string[] = [];

  slots.forEach((slot, index) => {
    const candidate = rawSelections?.[index] ?? '';
    if (candidate && slot.options.includes(candidate) && !blocked.has(candidate)) {
      selections[index] = candidate;
      blocked.add(candidate);
      return;
    }

    if (!useFallback) {
      selections[index] = '';
      return;
    }

    const fallback = slot.options.find((option) => !blocked.has(option));
    selections[index] = fallback || '';
    if (fallback) {
      blocked.add(fallback);
    }
  });

  return selections;
}

function buildAbilityChoiceSlots(speciesData: Species): Dnd5eSpeciesChoiceSlot[] {
  return speciesData.abilityScoreIncrease.flatMap((increase) => {
    if (increase.type !== 'choice' || !increase.choice) {
      return [];
    }

    const values =
      increase.values && increase.values.length > 0
        ? increase.values
        : Array.from({ length: increase.choice.count }, () => 1);

    return Array.from({ length: increase.choice.count }, (_, index) => {
      const bonus = values[index] ?? values.at(-1) ?? 1;
      const slotLabel =
        increase.choice!.count > 1
          ? `${increase.choice!.label} ${index + 1} (+${bonus})`
          : `${increase.choice!.label} (+${bonus})`;

      return {
        label: slotLabel,
        options: dedupe(increase.choice!.options),
        bonus,
      };
    });
  });
}

function fixedAbilityBonuses(speciesData: Species): Record<string, number> {
  return speciesData.abilityScoreIncrease.reduce<Record<string, number>>((bonuses, increase) => {
    if (increase.type !== 'fixed' || !increase.attributes) {
      return bonuses;
    }

    Object.entries(increase.attributes).forEach(([ability, bonus]) => {
      if (typeof bonus === 'number') {
        bonuses[ability] = (bonuses[ability] || 0) + bonus;
      }
    });

    return bonuses;
  }, {});
}

function choiceAbilityBonuses(speciesData: Species, selections: string[]): Record<string, number> {
  const bonuses: Record<string, number> = {};

  buildAbilityChoiceSlots(speciesData).forEach((slot, index) => {
    const ability = selections[index];
    if (!ability) {
      return;
    }

    bonuses[ability] = (bonuses[ability] || 0) + (slot.bonus ?? 1);
  });

  return bonuses;
}

function totalAbilityBonuses(speciesData: Species, selections: string[]): Record<string, number> {
  const bonuses = fixedAbilityBonuses(speciesData);
  Object.entries(choiceAbilityBonuses(speciesData, selections)).forEach(([ability, bonus]) => {
    bonuses[ability] = (bonuses[ability] || 0) + bonus;
  });
  return bonuses;
}

function normalizeLanguageOptions(speciesData: Species): string[] {
  const choice = speciesData.languages.choice;
  if (!choice) {
    return [];
  }

  return dedupe(
    choice.options.flatMap((option) =>
      option.toLowerCase() === 'any' ? COMMON_LANGUAGE_OPTIONS : [option]
    )
  );
}

export function getDnd5eSpeciesAbilityChoiceSlots(speciesData?: Species): Dnd5eSpeciesChoiceSlot[] {
  return speciesData ? buildAbilityChoiceSlots(speciesData) : [];
}

export function getDnd5eSpeciesLanguageChoiceSlots(
  speciesData?: Species
): Dnd5eSpeciesChoiceSlot[] {
  if (!speciesData?.languages.choice) {
    return [];
  }

  const options = normalizeLanguageOptions(speciesData);
  return Array.from({ length: speciesData.languages.choice.count }, (_, index) => ({
    label:
      speciesData.languages.choice!.count > 1
        ? `${speciesData.languages.choice!.label} ${index + 1}`
        : speciesData.languages.choice!.label,
    options,
  }));
}

function fixedSkillGrants(speciesData: Species): string[] {
  return speciesData.traits.flatMap((trait) => {
    if (trait.id === 'keen-senses') {
      return ['perception'];
    }

    if (trait.id === 'menacing') {
      return ['intimidation'];
    }

    return [];
  });
}

export function getDnd5eSpeciesSkillChoiceSlots(speciesData?: Species): Dnd5eSpeciesChoiceSlot[] {
  if (!speciesData) {
    return [];
  }

  return speciesData.traits.flatMap((trait) => {
    if (speciesData.id === 'half-elf' && ['skill-versatility', 'versatile'].includes(trait.id)) {
      return Array.from({ length: 2 }, (_, index) => ({
        label: index === 0 ? trait.name : `${trait.name} ${index + 1}`,
        options: SKILL_OPTIONS,
      }));
    }

    if (
      speciesData.id === 'human' &&
      speciesData.system === 'dnd-5e-2024' &&
      trait.id === 'skillful'
    ) {
      return [
        {
          label: trait.name,
          options: SKILL_OPTIONS,
        },
      ];
    }

    return [];
  });
}

function fixedWeaponProficiencies(speciesData: Species): string[] {
  return speciesData.traits.flatMap((trait) => {
    if (speciesData.id === 'dwarf' && trait.id === 'dwarven-combat-training') {
      return ['battleaxe', 'handaxe', 'light-hammer', 'warhammer'];
    }

    return [];
  });
}

export function getDnd5eSpeciesToolChoiceSlots(speciesData?: Species): Dnd5eSpeciesChoiceSlot[] {
  if (!speciesData) {
    return [];
  }

  return speciesData.traits.flatMap((trait) => {
    if (speciesData.id === 'dwarf' && trait.id === 'tool-proficiency') {
      return [
        {
          label: trait.name,
          options: ['smiths-tools', 'brewers-supplies', 'masons-tools'],
        },
      ];
    }

    return [];
  });
}

export function formatDnd5eSpeciesToolLabel(toolId: string): string {
  return formatDnd5eToolLabel(toolId);
}

function speciesDerivedLanguages(speciesData: Species, selections: string[]): string[] {
  return dedupe([...(speciesData.languages.automatic || []), ...selections.filter(Boolean)]);
}

function speciesDerivedTools(_speciesData: Species, selections: string[]): string[] {
  return dedupe(selections.filter(Boolean));
}

function speciesDerivedWeapons(speciesData: Species): string[] {
  return dedupe(fixedWeaponProficiencies(speciesData));
}

function buildSpeciesFeatures(speciesData: Species): Feature[] {
  return speciesData.traits.map((trait) => ({
    id: trait.id,
    name: trait.name,
    source: trait.source || speciesData.name,
    description: trait.description,
  }));
}

function shouldAutofillSpeciesChoices(
  previousSpecies: Species | undefined,
  currentSpeciesId: string | undefined,
  shouldPreserveSelections: boolean
): boolean {
  return !shouldPreserveSelections && !previousSpecies && !currentSpeciesId;
}

export function applyDnd5eSpeciesTemplate<T extends Dnd5eLikeDataModel>(
  document: CharacterDocument<T>,
  speciesData?: Species,
  previousSpecies?: Species,
  selections?: Dnd5eSpeciesTemplateSelections
): CharacterDocument<T> {
  const newDoc = cloneDocument(document);
  const sys = newDoc.system;
  const currentSpeciesId = sys.speciesId;
  const currentAbilitySelections = sys.speciesAbilitySelections || [];
  const currentLanguageSelections = sys.speciesLanguageSelections || [];
  const currentSkillSelections = sys.speciesSkillSelections || [];
  const currentToolSelections = sys.speciesToolSelections || [];

  if (previousSpecies) {
    const previousBonuses = totalAbilityBonuses(previousSpecies, currentAbilitySelections);
    Object.entries(previousBonuses).forEach(([ability, bonus]) => {
      if (typeof sys.baseAttributes[ability] === 'number') {
        sys.baseAttributes[ability] -= bonus;
      }
    });

    sys.languageProficiencies = removeValues(
      sys.languageProficiencies,
      speciesDerivedLanguages(previousSpecies, currentLanguageSelections)
    );
    sys.toolProficiencies = removeValues(
      sys.toolProficiencies,
      speciesDerivedTools(previousSpecies, currentToolSelections)
    );
    sys.weaponProficiencies = removeValues(
      sys.weaponProficiencies,
      speciesDerivedWeapons(previousSpecies)
    );

    Object.keys(sys.skillProficiencies || {}).forEach((skillId) => {
      removeSkillProficiencySource(sys, skillId, previousSpecies.name);
    });

    sys.features = (sys.features || []).filter(
      (feature) => feature.source !== previousSpecies.name
    );
  }

  sys.speciesId = speciesData?.id;
  sys.speciesAbilitySelections = [];
  sys.speciesLanguageSelections = [];
  sys.speciesSkillSelections = [];
  sys.speciesToolSelections = [];

  if (!speciesData) {
    sys.speed = 30;
    return newDoc;
  }

  const shouldPreserveSelections =
    speciesData.id === previousSpecies?.id || speciesData.id === currentSpeciesId;
  const shouldAutofillChoices = shouldAutofillSpeciesChoices(
    previousSpecies,
    currentSpeciesId,
    shouldPreserveSelections
  );

  const abilitySelections = resolveChoiceSelections(
    buildAbilityChoiceSlots(speciesData),
    selections?.abilitySelections ??
      (shouldPreserveSelections ? currentAbilitySelections : undefined),
    [],
    shouldAutofillChoices
  );
  const nextAbilityBonuses = totalAbilityBonuses(speciesData, abilitySelections);

  sys.speciesId = speciesData.id;
  sys.speed = speciesData.speed;
  Object.entries(nextAbilityBonuses).forEach(([ability, bonus]) => {
    sys.baseAttributes[ability] = (sys.baseAttributes[ability] || 10) + bonus;
  });

  const retainedLanguages = sys.languageProficiencies || [];
  const languageSelections = resolveChoiceSelections(
    getDnd5eSpeciesLanguageChoiceSlots(speciesData),
    selections?.languageSelections ??
      (shouldPreserveSelections ? currentLanguageSelections : undefined),
    retainedLanguages,
    shouldAutofillChoices
  );
  sys.languageProficiencies = dedupe([
    ...retainedLanguages,
    ...speciesDerivedLanguages(speciesData, languageSelections),
  ]);

  const retainedSkills = Object.entries(sys.skillProficiencies || {})
    .filter(([, proficiency]) => {
      const sources = proficiency.source || [];
      return sources.length === 0 || sources.some((source) => source !== speciesData.name);
    })
    .map(([skillId]) => skillId);
  const skillSelections = resolveChoiceSelections(
    getDnd5eSpeciesSkillChoiceSlots(speciesData),
    selections?.skillSelections ?? (shouldPreserveSelections ? currentSkillSelections : undefined),
    retainedSkills,
    shouldAutofillChoices
  );
  dedupe([...fixedSkillGrants(speciesData), ...skillSelections.filter(Boolean)]).forEach(
    (skillId) => {
      mergeSkillProficiency(sys, skillId, speciesData.name);
    }
  );

  const retainedTools = sys.toolProficiencies || [];
  const toolSelections = resolveChoiceSelections(
    getDnd5eSpeciesToolChoiceSlots(speciesData),
    selections?.toolSelections ?? (shouldPreserveSelections ? currentToolSelections : undefined),
    retainedTools,
    shouldAutofillChoices
  );
  sys.toolProficiencies = dedupe([
    ...retainedTools,
    ...speciesDerivedTools(speciesData, toolSelections),
  ]);
  sys.weaponProficiencies = dedupe([
    ...(sys.weaponProficiencies || []),
    ...speciesDerivedWeapons(speciesData),
  ]);

  const existingFeatureIds = new Set(sys.features?.map((feature) => feature.id) || []);
  const nextSpeciesFeatures = buildSpeciesFeatures(speciesData).filter(
    (feature) => !existingFeatureIds.has(feature.id)
  );
  sys.features = [...(sys.features || []), ...nextSpeciesFeatures];

  sys.speciesAbilitySelections = abilitySelections;
  sys.speciesLanguageSelections = languageSelections;
  sys.speciesSkillSelections = skillSelections;
  sys.speciesToolSelections = toolSelections;

  return newDoc;
}
