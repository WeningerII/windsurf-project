import { Background } from '../types/character-options/backgrounds';
import { CharacterDocument } from '../types/core/document';
import { Dnd5e2024DataModel } from '../systems/dnd5e-2024/data-model';
import { Dnd5eDataModel } from '../systems/dnd5e/data-model';

type Dnd5eLikeDataModel = Dnd5eDataModel | Dnd5e2024DataModel;

function cloneDocument<T extends Dnd5eLikeDataModel>(
  document: CharacterDocument<T>
): CharacterDocument<T> {
  return structuredClone(document);
}

function isChoiceValue(
  value: unknown
): value is { count: number; options: string[]; label: string } {
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

function fixedValues(
  value?: string[] | { count: number; options: string[]; label: string }
): string[] {
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

function appendInventoryFromBackground(sys: Dnd5eLikeDataModel, background: Background): void {
  const inventoryIds = new Set(sys.inventory.map((item) => item.itemId));
  const newEntries = background.equipment
    .filter((itemId) => !inventoryIds.has(itemId))
    .map((itemId) => ({ itemId, quantity: 1 }));

  sys.inventory = [...sys.inventory, ...newEntries];
}

export function applyDnd5eBackgroundTemplate<T extends Dnd5eLikeDataModel>(
  document: CharacterDocument<T>,
  background: Background,
  previousBackground?: Background
): CharacterDocument<T> {
  const nextDocument = cloneDocument(document);
  const sys = nextDocument.system;
  const isBackgroundChange =
    sys.backgroundId != null && previousBackground && sys.backgroundId !== background.id;

  if (isBackgroundChange && previousBackground) {
    fixedValues(previousBackground.skillProficiencies).forEach((skillId) => {
      removeSkillSource(sys, skillId, previousBackground.name);
    });

    sys.features = (sys.features || []).filter(
      (feature) =>
        feature.id !== previousBackground.feature.id &&
        feature.source !== previousBackground.feature.source
    );
  }

  sys.backgroundId = background.id;

  fixedValues(background.skillProficiencies).forEach((skillId) => {
    mergeSkillSource(sys, skillId, background.name);
  });

  const tools = fixedValues(background.toolProficiencies);
  if (tools.length > 0) {
    sys.toolProficiencies = [...new Set([...(sys.toolProficiencies || []), ...tools])];
  }

  const languages = fixedValues(background.languageProficiencies);
  if (languages.length > 0) {
    sys.languageProficiencies = [...new Set([...(sys.languageProficiencies || []), ...languages])];
  }

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

  return nextDocument;
}
