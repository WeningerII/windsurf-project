import type { Mam3eArchetype } from '../../types/mam/archetypes';
import type { PowerModifier } from '../../data/mutants-and-masterminds/3e/modifiers/extras';
import type { Mam3eDataModel } from './data-model';
import { createEmptyMam3eConditionTrack } from './mam3eSheetShared';

interface GetMam3eSheetStateProps {
  data: Mam3eDataModel;
  archetypes: Mam3eArchetype[];
  modifierCatalog: PowerModifier[];
}

function uniqueNonEmptyStrings(values: Array<string | undefined>): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  values.forEach((value) => {
    const normalized = value?.trim();
    if (!normalized || seen.has(normalized)) {
      return;
    }

    seen.add(normalized);
    result.push(normalized);
  });

  return result;
}

export function getMam3eSheetState({ data, archetypes, modifierCatalog }: GetMam3eSheetStateProps) {
  const conditionTrack = data.conditionTrack ?? createEmptyMam3eConditionTrack();
  const ppSpent =
    data.powerPoints.spent.abilities +
    data.powerPoints.spent.defenses +
    data.powerPoints.spent.powers +
    data.powerPoints.spent.advantages +
    data.powerPoints.spent.skills;
  const ppOver = ppSpent > data.powerPoints.total;
  const pinnedArchetypeIds = uniqueNonEmptyStrings(data.selectedArchetypeIds ?? []);
  const pinnedArchetypes = archetypes.filter((archetype) =>
    pinnedArchetypeIds.includes(archetype.id)
  );
  const insertedComplicationIds = uniqueNonEmptyStrings(
    data.complications.map((complication) => complication.id)
  );
  const extraModifiers = modifierCatalog
    .filter((modifier) => modifier.type === 'extra')
    .sort((left, right) => left.name.localeCompare(right.name));
  const flawModifiers = modifierCatalog
    .filter((modifier) => modifier.type === 'flaw')
    .sort((left, right) => left.name.localeCompare(right.name));
  const modifierById = new Map(modifierCatalog.map((modifier) => [modifier.id, modifier]));

  return {
    conditionTrack,
    ppSpent,
    ppOver,
    pinnedArchetypeIds,
    pinnedArchetypes,
    insertedComplicationIds,
    extraModifiers,
    flawModifiers,
    modifierById,
  };
}
