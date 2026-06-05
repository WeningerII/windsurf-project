import {
  loadClassesForSystem,
  loadSpeciesForSystem,
  loadPf2eBackgroundsForSystem,
} from '../../utils/dataLoader';
import {
  applyPf2eClassTemplate,
  applyPf2eAncestryTemplate,
  applyPf2eBackgroundTemplate,
} from '../../utils/pf2eTemplate';
import { createDefaultPf2eData, type Pf2eDataModel } from '../../systems/pf2e/data-model';
import type { CharacterDocument } from '../../types/core/document';
import { pickByKeywordsOrDefault } from '../intent';
import type { CreationDraft, CreationIntent, SystemCreator } from '../types';

/**
 * Pathfinder 2e creator. PF2e construction is selection-driven through the same
 * pure template appliers the sheet uses: pick class / ancestry / heritage /
 * background from the loader-backed catalogs, apply them in order (class sets
 * the key-ability boost, ancestry/heritage and background set their boosts),
 * then lay the four free level-1 ability boosts on top. The engine derives
 * AC/HP/spellcasting; the result is a complete, in-catalog, legal build.
 */

const MAX_LEVEL = 20;
/** Level-1 grants four free ability boosts to four different abilities (CRB p.20). */
const FREE_BOOSTS = 4;
/** Abilities never exceed 18 at level 1, so a +2 only lands on a score ≤ 16. */
const LEVEL_ONE_ABILITY_CAP = 18;
const PF2E_ABILITY_IDS = ['str', 'dex', 'con', 'int', 'wis', 'cha'] as const;

export const pf2eCreator: SystemCreator<Pf2eDataModel> = {
  systemId: 'pf2e',
  async build(intent: CreationIntent): Promise<CreationDraft<Pf2eDataModel>> {
    const [classes, ancestries, backgrounds] = await Promise.all([
      loadClassesForSystem('pf2e'),
      loadSpeciesForSystem('pf2e'),
      loadPf2eBackgroundsForSystem('pf2e'),
    ]);

    const cls = pickByKeywordsOrDefault(
      intent.tokens,
      classes,
      (entry) => [entry.name, entry.id],
      classes[0]
    );
    const ancestry = pickByKeywordsOrDefault(
      intent.tokens,
      ancestries,
      (entry) => [entry.name, entry.id],
      ancestries[0]
    );
    const heritage = ancestry.subraces?.[0];
    const background = pickByKeywordsOrDefault(
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
    applyFreeBoosts(document.system.baseAttributes, document.system.keyAbility);

    const name = intent.name ?? `${ancestry.name} ${cls.name}`;
    return { name, system: document.system };
  },
};

/**
 * Apply the four free level-1 ability boosts to four different abilities, leading
 * with the class key ability and then a survivability-first spread. A boost only
 * lands where it keeps the score within the level-1 cap of 18.
 */
function applyFreeBoosts(scores: Record<string, number>, keyAbility: string | undefined): void {
  const priority = [keyAbility, 'con', 'dex', 'wis', 'cha', 'str', 'int'].filter(
    (ability): ability is string =>
      typeof ability === 'string' && (PF2E_ABILITY_IDS as readonly string[]).includes(ability)
  );
  const order = Array.from(new Set(priority));

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
