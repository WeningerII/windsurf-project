import type {
  Pf2eBackgroundChoice,
  Pf2eBackgroundDefinition,
} from '../../data/pathfinder/2e/backgrounds';
import type { Archetype } from '../../types/character-options/archetypes';
import type { Species } from '../../types/character-options/species';
import type { Pf2eDataModel } from './data-model';

export interface Pf2eChoiceSlot {
  slotIndex: number;
  label: string;
  value: string;
  options: string[];
}

interface GetPf2eSheetChoiceStateProps {
  data: Pf2eDataModel;
  archetypes: Archetype[];
  selectedArchetypeIds: string[];
  selectedAncestry?: Species;
  selectedBackground?: Pf2eBackgroundDefinition;
}

export function getPf2eSheetChoiceState({
  data,
  archetypes,
  selectedArchetypeIds,
  selectedAncestry,
  selectedBackground,
}: GetPf2eSheetChoiceStateProps) {
  const heritageOptions = selectedAncestry?.subraces ?? [];
  const selectedArchetypes = archetypes.filter((entry) => selectedArchetypeIds.includes(entry.id));
  const orderedArchetypes = [...archetypes].sort((left, right) => {
    const leftMatches = left.parentClassId === data.classId ? 1 : 0;
    const rightMatches = right.parentClassId === data.classId ? 1 : 0;

    if (leftMatches !== rightMatches) {
      return rightMatches - leftMatches;
    }

    return left.name.localeCompare(right.name);
  });
  const loreIds = Object.keys(data.loreProficiencies ?? {});
  // Class DC needs the class's key ability. When none is set we report null so
  // the sheet renders an explicit "—" instead of silently substituting the
  // highest ability score (which masked missing data with an inflated DC).
  const classDcAbility =
    data.keyAbility && data.baseAttributes[data.keyAbility] != null ? data.keyAbility : null;
  const classDcScore: number | null =
    classDcAbility != null ? data.baseAttributes[classDcAbility] : null;

  const ancestryChoiceSlots: Pf2eChoiceSlot[] = [];
  if (selectedAncestry) {
    const selectedValues = data.ancestryAbilityBoostSelections ?? [];
    let offset = 0;

    selectedAncestry.abilityScoreIncrease.forEach((increase) => {
      if (increase.type !== 'choice' || !increase.choice) {
        return;
      }

      const groupSelections = selectedValues.slice(offset, offset + increase.choice.count);
      for (let index = 0; index < increase.choice.count; index += 1) {
        const currentValue = groupSelections[index] || '';
        const blockedValues = new Set(
          groupSelections.filter((value, selectionIndex) => value && selectionIndex !== index)
        );

        ancestryChoiceSlots.push({
          slotIndex: offset + index,
          label:
            increase.choice.count > 1
              ? `${increase.choice.label} ${index + 1}`
              : increase.choice.label,
          value: currentValue,
          options: increase.choice.options.filter(
            (option) => option === currentValue || !blockedValues.has(option)
          ),
        });
      }

      offset += increase.choice.count;
    });
  }

  const backgroundAbilitySelections = data.backgroundAbilityBoostSelections ?? [];
  const backgroundRestrictedBoost = backgroundAbilitySelections[0] || '';
  const backgroundFreeBoost = backgroundAbilitySelections[1] || '';
  const backgroundSkillChoice =
    selectedBackground && typeof selectedBackground.skillTraining !== 'string'
      ? selectedBackground.skillTraining
      : undefined;
  const backgroundLoreChoice =
    selectedBackground && typeof selectedBackground.loreTraining !== 'string'
      ? selectedBackground.loreTraining
      : undefined;
  const backgroundFreeBoostOptions = ['str', 'dex', 'con', 'int', 'wis', 'cha'].filter(
    (ability) => ability === backgroundFreeBoost || ability !== backgroundRestrictedBoost
  );

  return {
    ancestryChoiceSlots,
    backgroundFreeBoost,
    backgroundFreeBoostOptions,
    backgroundLoreChoice: backgroundLoreChoice as Pf2eBackgroundChoice | undefined,
    backgroundRestrictedBoost,
    backgroundSkillChoice: backgroundSkillChoice as Pf2eBackgroundChoice | undefined,
    classDcScore,
    heritageOptions,
    loreIds,
    orderedArchetypes,
    selectedArchetypes,
  };
}
