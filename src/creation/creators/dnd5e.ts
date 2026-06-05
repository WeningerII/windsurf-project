import {
  loadClassesForSystem,
  loadSpeciesForSystem,
  loadBackgroundsForSystem,
} from '../../utils/dataLoader';
import { applyDnd5eClassTemplate } from '../../utils/classTemplate';
import { applyDnd5eSpeciesTemplate } from '../../utils/speciesTemplate';
import { applyDnd5eBackgroundTemplate } from '../../utils/backgroundTemplate';
import { createDefaultDnd5eData, type Dnd5eDataModel } from '../../systems/dnd5e/data-model';
import {
  createDefaultDnd5e2024Data,
  type Dnd5e2024DataModel,
} from '../../systems/dnd5e-2024/data-model';
import type { CharacterClass } from '../../types/character-options/classes';
import type { CharacterDocument } from '../../types/core/document';
import type { GameSystemId } from '../../types/game-systems';
import { pickByKeywordsOrDefault } from '../intent';
import type { CreationDraft, CreationIntent, SystemCreator } from '../types';

/**
 * D&D 5e creator, shared by the 2014 and 2024 editions (their data models and
 * the template appliers are interchangeable). It picks class / species /
 * background from the loader-backed catalogs, lays the standard array
 * (15/14/13/12/10/8) with the 15 on the class's primary ability, and applies
 * the same templates the sheet uses (which add racial/background grants). The
 * engine derives level, proficiency, HP, and spell slots.
 */

type Dnd5eLike = Dnd5eDataModel | Dnd5e2024DataModel;

const MAX_LEVEL = 20;
const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];
// Fallback priority for the non-primary abilities (survivability first).
const ABILITY_PRIORITY = ['con', 'dex', 'wis', 'str', 'int', 'cha'];

function createDnd5eCreator<T extends Dnd5eLike>(
  systemId: GameSystemId,
  createDefault: () => T
): SystemCreator<T> {
  return {
    systemId,
    async build(intent: CreationIntent): Promise<CreationDraft<T>> {
      const [classes, species, backgrounds] = await Promise.all([
        loadClassesForSystem(systemId),
        loadSpeciesForSystem(systemId),
        loadBackgroundsForSystem(systemId),
      ]);

      const cls = pickByKeywordsOrDefault(
        intent.tokens,
        classes,
        (entry) => [entry.name, entry.id],
        classes[0]
      );
      const speciesChoice = pickByKeywordsOrDefault(
        intent.tokens,
        species,
        (entry) => [entry.name, entry.id],
        species[0]
      );
      const background = backgrounds.length
        ? pickByKeywordsOrDefault(
            intent.tokens,
            backgrounds,
            (entry) => [entry.name, entry.id],
            backgrounds[0]
          )
        : undefined;

      const level = Math.min(MAX_LEVEL, intent.level);

      let document: CharacterDocument<T> = {
        id: 'draft',
        name: 'draft',
        systemId,
        system: createDefault(),
        createdAt: new Date(0),
        updatedAt: new Date(0),
      };

      // Standard array first so the species template's ability bonuses stack on
      // top, matching point-buy-then-racial order.
      document.system.baseAttributes = assignStandardArray(cls);

      document = applyDnd5eClassTemplate(document, cls, level);
      document = applyDnd5eSpeciesTemplate(document, speciesChoice);
      if (background) {
        document = applyDnd5eBackgroundTemplate(document, background);
      }

      const name = intent.name ?? `${speciesChoice.name} ${cls.name}`;
      return { name, system: document.system };
    },
  };
}

function assignStandardArray(cls: CharacterClass): Record<string, number> {
  const primary = (cls.primaryAbility?.[0] ?? 'str').toLowerCase();
  const order = [primary, ...ABILITY_PRIORITY.filter((ability) => ability !== primary)];
  return order.reduce<Record<string, number>>((result, ability, index) => {
    result[ability] = STANDARD_ARRAY[index] ?? 10;
    return result;
  }, {});
}

export const dnd5e2014Creator: SystemCreator<Dnd5eDataModel> = createDnd5eCreator(
  'dnd-5e-2014',
  createDefaultDnd5eData
);

export const dnd5e2024Creator: SystemCreator<Dnd5e2024DataModel> = createDnd5eCreator(
  'dnd-5e-2024',
  createDefaultDnd5e2024Data
);
