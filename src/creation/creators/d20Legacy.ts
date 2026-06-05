import { loadClassesForSystem, loadSpeciesForSystem } from '../../utils/dataLoader';
import {
  applyD20LegacyClassTemplate,
  applyD20LegacyRaceTemplate,
} from '../../utils/d20LegacyTemplate';
import { createDefaultPf1eData, type Pf1eDataModel } from '../../systems/pf1e/data-model';
import { createDefaultDnd35eData, type Dnd35eDataModel } from '../../systems/dnd35e/data-model';
import type { CharacterClass } from '../../types/character-options/classes';
import type { Species } from '../../types/character-options/species';
import type { CharacterDocument } from '../../types/core/document';
import type { GameSystemId } from '../../types/game-systems';
import { pickByKeywordsOrDefault } from '../intent';
import type { CreationDraft, CreationIntent, SystemCreator } from '../types';

type D20LegacyLike = Pf1eDataModel | Dnd35eDataModel;

// The d20 template appliers expose per-edition overloads, but their
// implementations are generic over the union (they branch on document.systemId).
// Recover that generic form so one shared builder can drive both editions.
const applyClass = applyD20LegacyClassTemplate as <U extends D20LegacyLike>(
  document: CharacterDocument<U>,
  classData: CharacterClass,
  level?: number
) => CharacterDocument<U>;
const applyRace = applyD20LegacyRaceTemplate as <U extends D20LegacyLike>(
  document: CharacterDocument<U>,
  species: Species,
  previousSpecies?: Species
) => CharacterDocument<U>;

/**
 * Shared creator for the d20 "legacy" systems (D&D 3.5e and Pathfinder 1e),
 * which use the same template appliers. Pick class and race from the
 * loader-backed catalogs, lay the standard array (15/14/13/12/10/8) with the 15
 * on the class's primary ability, and apply the class and race templates (the
 * class template seeds the single class level; the race template adds racial
 * ability adjustments and traits) and assign class-skill ranks within the cap.
 * The engine derives BAB, saves, AC, and HP.
 */

const MAX_LEVEL = 20;
const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];
const ABILITY_PRIORITY = ['con', 'dex', 'wis', 'str', 'int', 'cha'];
/** Per-skill rank cap: PF1e = level, 3.5e = level + 3 (class-skill maximum). */
const SKILL_CAP_OVER_LEVEL: Record<string, number> = { pf1e: 0, 'dnd-3.5e': 3 };

function createD20LegacyCreator<T extends D20LegacyLike>(
  systemId: GameSystemId,
  createDefault: () => T
): SystemCreator<T> {
  return {
    systemId,
    async build(intent: CreationIntent): Promise<CreationDraft<T>> {
      const [classes, species] = await Promise.all([
        loadClassesForSystem(systemId),
        loadSpeciesForSystem(systemId),
      ]);

      const cls = pickByKeywordsOrDefault(
        intent.tokens,
        classes,
        (entry) => [entry.name, entry.id],
        classes[0]
      );
      const race = pickByKeywordsOrDefault(
        intent.tokens,
        species,
        (entry) => [entry.name, entry.id],
        species[0]
      );

      const level = Math.min(MAX_LEVEL, intent.level);

      let document: CharacterDocument<T> = {
        id: 'draft',
        name: 'draft',
        systemId,
        system: createDefault(),
        createdAt: new Date(0),
        updatedAt: new Date(0),
      };

      // Standard array first; the race template stacks racial adjustments on top.
      document.system.baseAttributes = assignStandardArray(cls);

      document = applyClass(document, cls, level);
      document = applyRace(document, race);
      document.system.level = level;
      document.system.skillRanks = assignSkillRanks(document.system, systemId, level);

      const name = intent.name ?? `${race.name} ${cls.name}`;
      return { name, system: document.system };
    },
  };
}

/**
 * Spend skill ranks on the class's own class skills, capped per skill. The class
 * grants `skillPointsPerLevel` ranks/level; maxing one class skill costs the
 * per-skill cap, so filling that many class skills to the cap spends the budget
 * while keeping every skill at or under the legal maximum the validator enforces.
 */
function assignSkillRanks(
  system: D20LegacyLike,
  systemId: GameSystemId,
  level: number
): Record<string, number> {
  const maxRanks = level + (SKILL_CAP_OVER_LEVEL[systemId] ?? 0);
  const pointsPerLevel = system.classLevels[0]?.skillPointsPerLevel ?? 2;
  const classSkills = system.classSkills ?? [];
  const skillsToFill = Math.min(Math.max(1, pointsPerLevel), classSkills.length);

  const ranks: Record<string, number> = {};
  for (let index = 0; index < skillsToFill; index += 1) {
    ranks[classSkills[index]] = maxRanks;
  }
  return ranks;
}

function assignStandardArray(cls: CharacterClass): Record<string, number> {
  const primary = (cls.primaryAbility?.[0] ?? 'str').toLowerCase();
  const order = [primary, ...ABILITY_PRIORITY.filter((ability) => ability !== primary)];
  return order.reduce<Record<string, number>>((result, ability, index) => {
    result[ability] = STANDARD_ARRAY[index] ?? 10;
    return result;
  }, {});
}

export const pf1eCreator: SystemCreator<Pf1eDataModel> = createD20LegacyCreator(
  'pf1e',
  createDefaultPf1eData
);

export const dnd35eCreator: SystemCreator<Dnd35eDataModel> = createD20LegacyCreator(
  'dnd-3.5e',
  createDefaultDnd35eData
);
