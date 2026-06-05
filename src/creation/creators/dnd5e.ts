import {
  loadClassesForSystem,
  loadSpeciesForSystem,
  loadBackgroundsForSystem,
  loadSpellsForSystem,
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
import type { Spell } from '../../types/magic/spells';
import { abilityMod } from '../../utils/math';
import { pickByKeywordsOrDefault } from '../intent';
import type { CreationDraft, CreationIntent, SystemCreator } from '../types';

/**
 * D&D 5e creator, shared by the 2014 and 2024 editions (their data models and
 * the template appliers are interchangeable). It picks class / species /
 * background from the loader-backed catalogs, lays the standard array
 * (15/14/13/12/10/8) with the 15 on the class's primary ability, applies the
 * same templates the sheet uses (which add racial/background grants and set up
 * spell slots), and — for casters — fills a starting spell list from the class's
 * own spells. The engine derives level, proficiency, and HP.
 */

type Dnd5eLike = Dnd5eDataModel | Dnd5e2024DataModel;

const MAX_LEVEL = 20;
const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];
// Fallback priority for the non-primary abilities (survivability first).
const ABILITY_PRIORITY = ['con', 'dex', 'wis', 'str', 'int', 'cha'];
const DEFAULT_CANTRIPS_KNOWN = 3;
const DEFAULT_SPELLS_KNOWN = 4;

function createDnd5eCreator<T extends Dnd5eLike>(
  systemId: GameSystemId,
  createDefault: () => T
): SystemCreator<T> {
  return {
    systemId,
    async build(intent: CreationIntent): Promise<CreationDraft<T>> {
      const [classes, species, backgrounds, spells] = await Promise.all([
        loadClassesForSystem(systemId),
        loadSpeciesForSystem(systemId),
        loadBackgroundsForSystem(systemId),
        loadSpellsForSystem(systemId),
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
      selectStartingSpells(document.system, cls, spells);

      const name = intent.name ?? `${speciesChoice.name} ${cls.name}`;
      return { name, system: document.system };
    },
  };
}

/**
 * Fill a caster's starting spell list from the class's own spells. The class
 * template has already set up `spellcasting` with slots; this picks cantrips and
 * leveled spells (lowest level first, deterministic by name) up to the class's
 * known/prepared counts. Prepared casters also get those leveled spells marked
 * prepared. Non-casters (no spellcasting) are left untouched.
 */
function selectStartingSpells(system: Dnd5eLike, classData: CharacterClass, spells: Spell[]): void {
  const spellcasting = system.spellcasting;
  const progression = classData.spellcasting;
  if (!spellcasting || !progression) return;

  const levelIndex = Math.max(0, system.level - 1);
  let maxSpellLevel = 0;
  for (let slot = 1; slot <= 9; slot += 1) {
    if (spellcasting.spellSlots[slot as keyof typeof spellcasting.spellSlots].max > 0) {
      maxSpellLevel = slot;
    }
  }
  const topLevel = Math.max(1, maxSpellLevel);

  const classSpells = spells.filter((spell) => spell.classes?.includes(classData.id));
  const byName = (a: Spell, b: Spell) => a.name.localeCompare(b.name);
  const cantrips = classSpells.filter((spell) => spell.level === 0).sort(byName);
  const leveled = classSpells
    .filter((spell) => spell.level >= 1 && spell.level <= topLevel)
    .sort((a, b) => a.level - b.level || byName(a, b));

  const cantripCount = clamp(
    progression.cantripsKnown?.[levelIndex] ?? DEFAULT_CANTRIPS_KNOWN,
    0,
    cantrips.length
  );
  const isPrepared = Boolean(progression.preparedCasterFormula);
  const preparedCount =
    system.level + abilityMod(system.baseAttributes[progression.ability.toLowerCase()] ?? 10);
  const knownCount = clamp(
    isPrepared ? preparedCount : (progression.spellsKnown?.[levelIndex] ?? DEFAULT_SPELLS_KNOWN),
    1,
    leveled.length
  );

  const chosenCantrips = cantrips.slice(0, cantripCount).map((spell) => spell.id);
  const chosenLeveled = leveled.slice(0, knownCount).map((spell) => spell.id);

  spellcasting.spellsKnown = [...chosenCantrips, ...chosenLeveled];
  spellcasting.spellsPrepared = isPrepared ? chosenLeveled : [];
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.floor(value)));
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
