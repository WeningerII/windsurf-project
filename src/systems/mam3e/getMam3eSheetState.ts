import type { CharacterClass } from '../../types/character-options/classes';
import type { PowerModifier } from '../../data/mutants-and-masterminds/3e/modifiers/extras';
import type { Mam3eDataModel } from './data-model';
import { createEmptyMam3eConditionTrack } from './mam3eSheetShared';

interface GetMam3eSheetStateProps {
  data: Mam3eDataModel;
  archetypes: CharacterClass[];
  modifierCatalog: PowerModifier[];
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
  const pinnedArchetypeIds = data.selectedArchetypeIds ?? [];
  const pinnedArchetypes = archetypes.filter((archetype) =>
    pinnedArchetypeIds.includes(archetype.id)
  );
  const insertedComplicationIds = data.complications
    .map((complication) => complication.id)
    .filter((id): id is string => typeof id === 'string' && id.trim().length > 0);
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
