import {
  loadClassesForSystem,
  loadSpeciesForSystem,
  loadPf2eBackgroundsForSystem,
  loadSpellsForSystem,
} from '../../utils/dataLoader';
import {
  applyPf2eClassTemplate,
  applyPf2eAncestryTemplate,
  applyPf2eBackgroundTemplate,
} from '../../utils/pf2eTemplate';
import { createDefaultPf2eData, type Pf2eDataModel } from '../../systems/pf2e/data-model';
import type { CharacterDocument } from '../../types/core/document';
import type { Spell } from '../../types/magic/spells';
import { pickByKeywordsOrDefault } from '../intent';
import type { CreationDraft, CreationIntent, ResolvedSelections, SystemCreator } from '../types';

/**
 * Pathfinder 2e creator. With no `resolved`, it picks class/ancestry/heritage/
 * background by keyword, applies the pure templates (which set the class
 * key-ability and ancestry/background boosts), and lays the four free level-1
 * boosts on a survivability-first spread. With `resolved` (the LLM author's
 * picks), it takes the authored class/ancestry/heritage/background when they
 * resolve against the catalog and uses the authored free-boost abilities,
 * falling back per field — so the model designs the build and the engine derives
 * a complete, in-catalog, legal sheet.
 */

const MAX_LEVEL = 20;
/** Level-1 grants four free ability boosts to four different abilities (CRB p.20). */
const FREE_BOOSTS = 4;
/** Abilities never exceed 18 at level 1, so a +2 only lands on a score ≤ 16. */
const LEVEL_ONE_ABILITY_CAP = 18;
const PF2E_ABILITY_IDS = ['str', 'dex', 'con', 'int', 'wis', 'cha'] as const;

export const pf2eCreator: SystemCreator<Pf2eDataModel> = {
  systemId: 'pf2e',
  async build(
    intent: CreationIntent,
    resolved?: ResolvedSelections
  ): Promise<CreationDraft<Pf2eDataModel>> {
    const [classes, ancestries, backgrounds, spells] = await Promise.all([
      loadClassesForSystem('pf2e'),
      loadSpeciesForSystem('pf2e'),
      loadPf2eBackgroundsForSystem('pf2e'),
      loadSpellsForSystem('pf2e'),
    ]);

    const cls =
      byName(classes, asString(resolved?.class)) ??
      pickByKeywordsOrDefault(
        intent.tokens,
        classes,
        (entry) => [entry.name, entry.id],
        classes[0]
      );
    const ancestry =
      byName(ancestries, asString(resolved?.ancestry)) ??
      pickByKeywordsOrDefault(
        intent.tokens,
        ancestries,
        (entry) => [entry.name, entry.id],
        ancestries[0]
      );
    const heritage =
      byName(ancestry.subraces ?? [], asString(resolved?.heritage)) ?? ancestry.subraces?.[0];
    const background =
      byName(backgrounds, asString(resolved?.background)) ??
      pickByKeywordsOrDefault(
        intent.tokens,
        backgrounds,
        (entry) => [entry.name, entry.id],
        backgrounds[0]
      );

    const level = Math.min(MAX_LEVEL, intent.level);

    let document: CharacterDocument<Pf2eDataModel> = {
      id: 'draft',
      name: 'draft',
      systemId: 'pf2e',
      system: createDefaultPf2eData(),
      createdAt: new Date(0),
      updatedAt: new Date(0),
    };

    document = applyPf2eClassTemplate(document, cls, level);
    document = applyPf2eAncestryTemplate(document, ancestry, heritage);
    document = applyPf2eBackgroundTemplate(document, background);
    applyFreeBoosts(
      document.system.baseAttributes,
      document.system.keyAbility,
      asStringArray(resolved?.freeBoosts)
    );
    applyResolvedSpells(document.system, spells, asStringArray(resolved?.spells));

    const name = intent.name ?? `${ancestry.name} ${cls.name}`;
    return { name, system: document.system };
  },
};

/**
 * Apply the four free level-1 boosts to four different abilities. The LLM's
 * chosen abilities (when valid) lead, then the class key ability and a
 * survivability-first spread back-fill so four always land; each boost only
 * lands where it keeps the score within the level-1 cap of 18.
 */
function applyFreeBoosts(
  scores: Record<string, number>,
  keyAbility: string | undefined,
  preferred: string[] | undefined
): void {
  const requested = (preferred ?? []).map((ability) => ability.toLowerCase());
  const candidates = [...requested, keyAbility, 'con', 'dex', 'wis', 'cha', 'str', 'int'].filter(
    (ability): ability is string =>
      typeof ability === 'string' && (PF2E_ABILITY_IDS as readonly string[]).includes(ability)
  );
  const order = Array.from(new Set(candidates));

  let applied = 0;
  for (const ability of order) {
    if (applied >= FREE_BOOSTS) break;
    const current = scores[ability] ?? 10;
    if (current <= LEVEL_ONE_ABILITY_CAP - 2) {
      scores[ability] = current + 2;
      applied += 1;
    }
  }
}

/**
 * Fill a caster's known spells from the model's chosen spell names, resolved to
 * ids within the character's spell tradition. The class template already set up
 * `spellcasting` (tradition + slots) for casters; non-casters have none, so this
 * is a no-op for them. The validator checks the slot math; spells known is the
 * model's call.
 */
function applyResolvedSpells(
  system: Pf2eDataModel,
  spells: Spell[],
  names: string[] | undefined
): void {
  const spellcasting = system.spellcasting;
  if (!spellcasting || !names) return;
  const tradition = spellcasting.tradition;
  const traditionSpells = spells.filter((spell) => spell.traditions?.includes(tradition));

  const known: string[] = [];
  const seen = new Set<string>();
  for (const name of names) {
    const spell = traditionSpells.find((entry) => entry.name.toLowerCase() === name.toLowerCase());
    if (spell && !seen.has(spell.id)) {
      seen.add(spell.id);
      known.push(spell.id);
    }
  }
  if (known.length > 0) {
    spellcasting.spellsKnown = known;
  }
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}

function asStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const strings = value.filter((entry): entry is string => typeof entry === 'string');
  return strings.length > 0 ? strings : undefined;
}

function byName<T extends { name: string }>(list: T[], value: string | undefined): T | undefined {
  if (value === undefined) return undefined;
  return list.find((entry) => entry.name.toLowerCase() === value.toLowerCase());
}
