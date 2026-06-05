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
 * and let the engine derive AC/HP/spellcasting. Free ability boosts are not yet
 * modeled, but the result is a legal, in-catalog build the validator accepts.
 */

const MAX_LEVEL = 20;

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

    const name = intent.name ?? `${ancestry.name} ${cls.name}`;
    return { name, system: document.system };
  },
};
