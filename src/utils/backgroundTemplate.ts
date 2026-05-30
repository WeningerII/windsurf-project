import { cloneDocument, dedupe } from './templateShared';
import { Background } from '../types/character-options/backgrounds';
import { CharacterDocument } from '../types/core/document';
import { Dnd5e2024DataModel } from '../systems/dnd5e-2024/data-model';
import { Dnd5eDataModel } from '../systems/dnd5e/data-model';
import { expandDnd5eToolChoiceValue, formatDnd5eToolLabel } from './dnd5eToolChoices';

type Dnd5eLikeDataModel = Dnd5eDataModel | Dnd5e2024DataModel;

type BackgroundChoiceValue = { count: number; options: string[]; label: string };
type BackgroundChoiceSlot = { label: string; options: string[] };

export interface Dnd5eBackgroundTemplateSelections {
  languageSelections?: string[];
  toolSelections?: string[];
}

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

function isChoiceValue(value: unknown): value is BackgroundChoiceValue {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function mergeSkillSource(sys: Dnd5eLikeDataModel, skillId: string, source: string): void {
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
    level:
      existing.level === 'expertise' || existing.level === 'double' ? existing.level : 'proficient',
    source: [...new Set([...(existing.source || []), source])],
  };
}

function removeSkillSource(sys: Dnd5eLikeDataModel, skillId: string, source: string): void {
  const existing = sys.skillProficiencies[skillId];
  if (!existing) {
    return;
  }

  const remainingSources = (existing.source || []).filter((entry) => entry !== source);
  if (remainingSources.length === 0) {
    delete sys.skillProficiencies[skillId];
    return;
  }

  sys.skillProficiencies[skillId] = {
    ...existing,
    source: remainingSources,
  };
}

function fixedValues(value?: string[] | BackgroundChoiceValue): string[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (isChoiceValue(value)) {
    return [];
  }

  return [];
}

function toolChoiceOptionsForValue(value: string): string[] | null {
  return expandDnd5eToolChoiceValue(value);
}

function toolChoiceLabelForValue(value: string): string {
  return formatDnd5eToolLabel(value);
}

function removeDerivedList(current: string[] | undefined, derived: string[]): string[] {
  return (current || []).filter((value) => !derived.includes(value));
}

function fixedToolValues(toolProficiencies?: Background['toolProficiencies']): string[] {
  if (!toolProficiencies) {
    return [];
  }

  if (Array.isArray(toolProficiencies)) {
    return toolProficiencies.filter((value) => toolChoiceOptionsForValue(value) == null);
  }

  return [];
}

function normalizeBackgroundLanguageOptions(
  languageProficiencies?: Background['languageProficiencies']
): string[] {
  if (
    !languageProficiencies ||
    Array.isArray(languageProficiencies) ||
    !isChoiceValue(languageProficiencies)
  ) {
    return [];
  }

  return dedupe(
    languageProficiencies.options.flatMap((option) =>
      option.toLowerCase() === 'any' ? COMMON_LANGUAGE_OPTIONS : [option]
    )
  );
}

export function getBackgroundLanguageOptions(
  languageProficiencies?: Background['languageProficiencies']
): string[] {
  return normalizeBackgroundLanguageOptions(languageProficiencies);
}

function toolChoiceSlots(
  toolProficiencies?: Background['toolProficiencies']
): BackgroundChoiceSlot[] {
  if (!toolProficiencies) {
    return [];
  }

  if (Array.isArray(toolProficiencies)) {
    return toolProficiencies.flatMap((value) => {
      const options = toolChoiceOptionsForValue(value);
      return options ? [{ label: toolChoiceLabelForValue(value), options }] : [];
    });
  }

  if (!isChoiceValue(toolProficiencies)) {
    return [];
  }

  const options = dedupe(
    toolProficiencies.options.flatMap((option) => toolChoiceOptionsForValue(option) || [option])
  );
  if (options.length === 0) {
    return [];
  }

  return Array.from({ length: toolProficiencies.count }, (_, index) => ({
    label:
      toolProficiencies.count > 1
        ? `${toolProficiencies.label} ${index + 1}`
        : toolProficiencies.label,
    options,
  }));
}

export function getBackgroundFixedToolProficiencies(
  toolProficiencies?: Background['toolProficiencies']
): string[] {
  return fixedToolValues(toolProficiencies);
}

export function getBackgroundToolChoiceSlots(
  toolProficiencies?: Background['toolProficiencies']
): BackgroundChoiceSlot[] {
  return toolChoiceSlots(toolProficiencies);
}

export function formatBackgroundToolLabel(toolId: string): string {
  return toolChoiceLabelForValue(toolId);
}

function sanitizeBackgroundLanguageSelections(
  languageProficiencies: Background['languageProficiencies'] | undefined,
  rawSelections: string[] | undefined,
  unavailableLanguages: string[]
): string[] {
  if (
    !languageProficiencies ||
    Array.isArray(languageProficiencies) ||
    !isChoiceValue(languageProficiencies)
  ) {
    return [];
  }

  const normalizedOptions = normalizeBackgroundLanguageOptions(languageProficiencies);
  const unavailable = new Set(unavailableLanguages);
  const selections: string[] = [];
  const used = new Set<string>();

  for (let index = 0; index < languageProficiencies.count; index += 1) {
    const candidate = rawSelections?.[index] ?? '';
    if (
      candidate &&
      normalizedOptions.includes(candidate) &&
      !unavailable.has(candidate) &&
      !used.has(candidate)
    ) {
      selections[index] = candidate;
      used.add(candidate);
      continue;
    }

    selections[index] = '';
  }

  return selections;
}

function sanitizeBackgroundToolSelections(
  toolProficiencies: Background['toolProficiencies'] | undefined,
  rawSelections: string[] | undefined,
  unavailableTools: string[]
): string[] {
  const slots = toolChoiceSlots(toolProficiencies);
  if (slots.length === 0) {
    return [];
  }

  const unavailable = new Set(unavailableTools);
  const selections: string[] = [];
  const used = new Set<string>();

  slots.forEach((slot, index) => {
    const candidate = rawSelections?.[index] ?? '';
    if (
      candidate &&
      slot.options.includes(candidate) &&
      !unavailable.has(candidate) &&
      !used.has(candidate)
    ) {
      selections[index] = candidate;
      used.add(candidate);
      return;
    }

    selections[index] = '';
  });

  return selections;
}

function backgroundDerivedState(sys: Dnd5eLikeDataModel) {
  return sys.templateState?.backgroundDerived || { tools: [], languages: [] };
}

function updateBackgroundTemplateState(
  sys: Dnd5eLikeDataModel,
  nextDerived: { tools: string[]; languages: string[] }
): void {
  const classDerivedProficiencies = sys.templateState?.classDerivedProficiencies || {
    armor: [],
    weapons: [],
    tools: [],
    savingThrows: [],
  };
  const featDerivedAutomation = sys.templateState?.featDerivedAutomation || {
    abilityScores: {},
    armor: [],
    weapons: [],
    tools: [],
    languages: [],
    savingThrows: [],
  };

  sys.templateState = {
    classDerivedProficiencies: {
      armor: [...classDerivedProficiencies.armor],
      weapons: [...classDerivedProficiencies.weapons],
      tools: [...classDerivedProficiencies.tools],
      savingThrows: [...classDerivedProficiencies.savingThrows],
    },
    backgroundDerived: {
      tools: [...nextDerived.tools],
      languages: [...nextDerived.languages],
    },
    featDerivedAutomation: {
      abilityScores: { ...featDerivedAutomation.abilityScores },
      armor: [...featDerivedAutomation.armor],
      weapons: [...featDerivedAutomation.weapons],
      tools: [...featDerivedAutomation.tools],
      languages: [...featDerivedAutomation.languages],
      savingThrows: [...featDerivedAutomation.savingThrows],
    },
  };
}

function appendInventoryFromBackground(sys: Dnd5eLikeDataModel, background: Background): void {
  const inventoryIds = new Set(sys.inventory.map((item) => item.itemId));
  const newEntries = background.equipment
    .filter((itemId) => !inventoryIds.has(itemId))
    .map((itemId) => ({ itemId, quantity: 1 }));

  sys.inventory = [...sys.inventory, ...newEntries];
}

export function applyDnd5eBackgroundTemplate<T extends Dnd5eLikeDataModel>(
  document: CharacterDocument<T>,
  background?: Background,
  previousBackground?: Background,
  selections?: Dnd5eBackgroundTemplateSelections
): CharacterDocument<T> {
  const nextDocument = cloneDocument(document);
  const sys = nextDocument.system;
  const currentBackgroundId = sys.backgroundId;
  const currentLanguageSelections = sys.backgroundLanguageSelections || [];
  const currentToolSelections = sys.backgroundToolSelections || [];
  const previousDerived = backgroundDerivedState(sys);
  const previousDerivedTools =
    previousDerived.tools.length > 0
      ? previousDerived.tools
      : dedupe([
          ...fixedToolValues(previousBackground?.toolProficiencies),
          ...sanitizeBackgroundToolSelections(
            previousBackground?.toolProficiencies,
            currentToolSelections,
            []
          ).filter(Boolean),
        ]);
  const previousDerivedLanguages =
    previousDerived.languages.length > 0
      ? previousDerived.languages
      : dedupe([
          ...fixedValues(previousBackground?.languageProficiencies),
          ...sanitizeBackgroundLanguageSelections(
            previousBackground?.languageProficiencies,
            currentLanguageSelections,
            []
          ).filter(Boolean),
        ]);

  if (previousBackground) {
    fixedValues(previousBackground.skillProficiencies).forEach((skillId) => {
      removeSkillSource(sys, skillId, previousBackground.name);
    });

    sys.features = (sys.features || []).filter(
      (feature) =>
        feature.id !== previousBackground.feature.id &&
        feature.source !== previousBackground.feature.source
    );
  }

  const retainedTools = removeDerivedList(sys.toolProficiencies, previousDerivedTools);
  const retainedLanguages = removeDerivedList(sys.languageProficiencies, previousDerivedLanguages);

  sys.backgroundId = background?.id;
  sys.backgroundLanguageSelections = [];
  sys.backgroundToolSelections = [];
  sys.toolProficiencies = retainedTools;
  sys.languageProficiencies = retainedLanguages;

  if (!background) {
    updateBackgroundTemplateState(sys, { tools: [], languages: [] });
    return nextDocument;
  }

  fixedValues(background.skillProficiencies).forEach((skillId) => {
    mergeSkillSource(sys, skillId, background.name);
  });

  const shouldPreserveSelections =
    background.id === previousBackground?.id || background.id === currentBackgroundId;
  const nextToolSelections = sanitizeBackgroundToolSelections(
    background.toolProficiencies,
    selections?.toolSelections ?? (shouldPreserveSelections ? currentToolSelections : undefined),
    retainedTools
  );
  const nextDerivedTools = dedupe([
    ...fixedToolValues(background.toolProficiencies),
    ...nextToolSelections.filter(Boolean),
  ]).filter((tool) => !retainedTools.includes(tool));
  const nextLanguageSelections = sanitizeBackgroundLanguageSelections(
    background.languageProficiencies,
    selections?.languageSelections ??
      (shouldPreserveSelections ? currentLanguageSelections : undefined),
    retainedLanguages
  );
  const nextDerivedLanguages = dedupe([
    ...fixedValues(background.languageProficiencies),
    ...nextLanguageSelections.filter(Boolean),
  ]).filter((language) => !retainedLanguages.includes(language));

  sys.backgroundLanguageSelections = nextLanguageSelections;
  sys.backgroundToolSelections = nextToolSelections;
  sys.toolProficiencies = dedupe([...retainedTools, ...nextDerivedTools]);
  sys.languageProficiencies = dedupe([...retainedLanguages, ...nextDerivedLanguages]);

  const featureExists = (sys.features || []).some(
    (feature) =>
      feature.id === background.feature.id && feature.source === background.feature.source
  );
  if (!featureExists) {
    sys.features = [...(sys.features || []), structuredClone(background.feature)];
  }

  if (!previousBackground && sys.currency.gold === 0) {
    sys.currency.gold = background.gold;
  }

  if (!previousBackground) {
    appendInventoryFromBackground(sys, background);
  }

  updateBackgroundTemplateState(sys, {
    tools: nextDerivedTools,
    languages: nextDerivedLanguages,
  });

  return nextDocument;
}
