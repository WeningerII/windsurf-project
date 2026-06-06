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
import type { CreationDraft, CreationIntent, ResolvedSelections, SystemCreator } from '../types';

/**
 * D&D 5e creator, shared by the 2014 and 2024 editions (their data models and
 * the template appliers are interchangeable). With no `resolved`, it picks
 * class/species/background by keyword, lays the standard array (15 on the
 * class's primary ability), and auto-fills a caster's spells. With `resolved`
 * (the LLM author's pre-sanitized picks), each of those is taken from the model
 * when it resolves against the catalog and falls back per field otherwise — so
 * a "Batman" lands as a stealthy Rogue with the abilities/spells the model chose.
 */

type Dnd5eLike = Dnd5eDataModel | Dnd5e2024DataModel;

const MAX_LEVEL = 20;
const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];
const ABILITY_IDS = ['str', 'dex', 'con', 'int', 'wis', 'cha'] as const;
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
    async build(intent: CreationIntent, resolved?: ResolvedSelections): Promise<CreationDraft<T>> {
      const [classes, species, backgrounds, spells] = await Promise.all([
        loadClassesForSystem(systemId),
        loadSpeciesForSystem(systemId),
        loadBackgroundsForSystem(systemId),
        loadSpellsForSystem(systemId),
      ]);

      const cls =
        byName(classes, asString(resolved?.class)) ??
        pickByKeywordsOrDefault(
          intent.tokens,
          classes,
          (entry) => [entry.name, entry.id],
          classes[0]
        );
      const speciesChoice =
        byName(species, asString(resolved?.species)) ??
        pickByKeywordsOrDefault(
          intent.tokens,
          species,
          (entry) => [entry.name, entry.id],
          species[0]
        );
      const background = backgrounds.length
        ? (byName(backgrounds, asString(resolved?.background)) ??
          pickByKeywordsOrDefault(
            intent.tokens,
            backgrounds,
            (entry) => [entry.name, entry.id],
            backgrounds[0]
          ))
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

      // Standard array first so the species template's bonuses stack on top.
      document.system.baseAttributes = resolveAbilities(resolved) ?? assignStandardArray(cls);

      document = applyDnd5eClassTemplate(document, cls, level);
      document = applyDnd5eSpeciesTemplate(document, speciesChoice);
      if (background) {
        document = applyDnd5eBackgroundTemplate(document, background);
      }
      if (!applyResolvedSpells(document.system, cls, spells, resolved)) {
        selectStartingSpells(document.system, cls, spells);
      }

      const name = intent.name ?? `${speciesChoice.name} ${cls.name}`;
      return { name, system: document.system };
    },
  };
}

// --- LLM-resolution helpers (return undefined/false → deterministic path) ---

/**
 * Use the model's authored pre-racial ability spread (any integer per ability;
 * missing abilities default to 10). The validator caps each final score to
 * 1..30 and the repair loop fixes anything out of range — no fixed-array
 * straitjacket. Returns undefined only when nothing was authored (→ standard array).
 */
function resolveAbilities(resolved?: ResolvedSelections): Record<string, number> | undefined {
  const raw = resolved?.abilities;
  if (!raw || typeof raw !== 'object') return undefined;
  const source = raw as Record<string, unknown>;

  const scores: Record<string, number> = {};
  let authored = false;
  for (const ability of ABILITY_IDS) {
    const value = source[ability];
    if (typeof value === 'number' && Number.isInteger(value)) {
      scores[ability] = value;
      authored = true;
    } else {
      scores[ability] = 10;
    }
  }
  return authored ? scores : undefined;
}

/** Fill the spell list from the model's chosen spell names; false → caller auto-fills. */
function applyResolvedSpells(
  system: Dnd5eLike,
  classData: CharacterClass,
  spells: Spell[],
  resolved?: ResolvedSelections
): boolean {
  const spellcasting = system.spellcasting;
  const progression = classData.spellcasting;
  const names = asStringArray(resolved?.spells);
  if (!spellcasting || !progression || !names) return false;

  const classSpells = spells.filter((spell) => spell.classes?.includes(classData.id));
  const topLevel = maxSpellLevel(system);

  const cantrips: string[] = [];
  const leveled: string[] = [];
  const used = new Set<string>();
  for (const name of names) {
    const spell = classSpells.find((entry) => matchesName(entry.name, name));
    if (!spell || used.has(spell.id) || spell.level > topLevel) continue;
    used.add(spell.id);
    (spell.level === 0 ? cantrips : leveled).push(spell.id);
  }
  if (cantrips.length === 0 && leveled.length === 0) return false;

  spellcasting.spellsKnown = [...cantrips, ...leveled];
  spellcasting.spellsPrepared = progression.preparedCasterFormula ? leveled : [];
  return true;
}

// --- Deterministic helpers (the fallback path) ---

function selectStartingSpells(system: Dnd5eLike, classData: CharacterClass, spells: Spell[]): void {
  const spellcasting = system.spellcasting;
  const progression = classData.spellcasting;
  if (!spellcasting || !progression) return;

  const levelIndex = Math.max(0, system.level - 1);
  const topLevel = maxSpellLevel(system);

  const classSpells = spells.filter((spell) => spell.classes?.includes(classData.id));
  const byNameSort = (a: Spell, b: Spell) => a.name.localeCompare(b.name);
  const cantrips = classSpells.filter((spell) => spell.level === 0).sort(byNameSort);
  const leveled = classSpells
    .filter((spell) => spell.level >= 1 && spell.level <= topLevel)
    .sort((a, b) => a.level - b.level || byNameSort(a, b));

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

function assignStandardArray(cls: CharacterClass): Record<string, number> {
  const primary = (cls.primaryAbility?.[0] ?? 'str').toLowerCase();
  const order = [primary, ...ABILITY_PRIORITY.filter((ability) => ability !== primary)];
  return order.reduce<Record<string, number>>((result, ability, index) => {
    result[ability] = STANDARD_ARRAY[index] ?? 10;
    return result;
  }, {});
}

// --- Small utilities ---

function maxSpellLevel(system: Dnd5eLike): number {
  const slots = system.spellcasting?.spellSlots;
  let top = 0;
  if (slots) {
    for (let slot = 1; slot <= 9; slot += 1) {
      if (slots[slot as keyof typeof slots].max > 0) top = slot;
    }
  }
  return Math.max(1, top);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.floor(value)));
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}

function asStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const strings = value.filter((entry): entry is string => typeof entry === 'string');
  return strings.length > 0 ? strings : undefined;
}

function matchesName(candidate: string, value: string): boolean {
  return candidate.toLowerCase() === value.toLowerCase();
}

function byName<T extends { name: string }>(list: T[], value: string | undefined): T | undefined {
  if (value === undefined) return undefined;
  return list.find((entry) => matchesName(entry.name, value));
}

export const dnd5e2014Creator: SystemCreator<Dnd5eDataModel> = createDnd5eCreator(
  'dnd-5e-2014',
  createDefaultDnd5eData
);

export const dnd5e2024Creator: SystemCreator<Dnd5e2024DataModel> = createDnd5eCreator(
  'dnd-5e-2024',
  createDefaultDnd5e2024Data
);
