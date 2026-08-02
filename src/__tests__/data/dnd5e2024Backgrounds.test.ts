import { describe, it, expect } from 'vitest';
import { dnd5e2024Backgrounds } from '../../data/dnd/5e-2024/backgrounds';
import { getFeat } from '../../data/dnd/5e-2024/feats';
import { getEquipment } from '../../data/dnd/5e-2024/equipment';
import { expandDnd5eToolChoiceValue } from '../../systems/dnd5e/shared/dnd5eToolChoices';
import type { AbilityScore } from '../../types/core/common';

// SRD 5.2.1 "Character Origins" pins each background to three ability scores and
// one Origin feat; 5e-bits/5e-database `src/2024/en/5e-SRD-Backgrounds.json`
// corroborates both. Sage's feat comes from the markdown only — the JSON records
// it as bare "Magic Initiate" with no spell-list note.
const EXPECTED: Record<string, { abilities: AbilityScore[]; featId: string; goldA: number }> = {
  'acolyte-2024': { abilities: ['int', 'wis', 'cha'], featId: 'magic-initiate-cleric', goldA: 8 },
  'criminal-2024': { abilities: ['dex', 'con', 'int'], featId: 'alert', goldA: 16 },
  'sage-2024': { abilities: ['con', 'int', 'wis'], featId: 'magic-initiate-wizard', goldA: 8 },
  'soldier-2024': { abilities: ['str', 'dex', 'con'], featId: 'savage-attacker', goldA: 14 },
};

// Soldier's package A reads "Gaming Set (same as above)" — the set taken as the
// tool proficiency, so it carries the choice token instead of an item id. It is
// the only id in the 2024 backgrounds that is not expected to resolve against
// the equipment catalog, and the test below proves the token still expands.
const CHOICE_TOKENS = new Set(['one-gaming-set']);

describe('D&D 5e (2024) backgrounds carry the 2024 model', () => {
  it('ships exactly the four SRD 5.2 backgrounds', () => {
    expect(dnd5e2024Backgrounds.map((b) => b.id).sort()).toEqual(Object.keys(EXPECTED).sort());
  });

  it.each(dnd5e2024Backgrounds.map((b) => [b.id, b] as const))(
    '%s pins three ability scores and a resolvable Origin feat',
    (id, background) => {
      const expected = EXPECTED[id];
      expect(background.abilityScores).toEqual(expected.abilities);
      expect(background.originFeat?.id).toBe(expected.featId);
      expect(
        getFeat(background.originFeat!.id),
        `origin feat ${background.originFeat?.id} is not in the 2024 feat catalog`
      ).toBeDefined();
    }
  );

  it.each(dnd5e2024Backgrounds.map((b) => [b.id, b] as const))(
    '%s offers the lettered A/B equipment choice, with B money-only at 50 GP',
    (id, background) => {
      const options = background.equipmentOptions;
      expect(options?.map((o) => o.label)).toEqual(['A', 'B']);
      expect(options![0].gold).toBe(EXPECTED[id].goldA);
      expect(options![0].items.length).toBeGreaterThan(0);
      expect(options![1]).toEqual({ label: 'B', items: [], gold: 50 });
    }
  );

  it.each(dnd5e2024Backgrounds.map((b) => [b.id, b] as const))(
    '%s mirrors package A into the applied `equipment`/`gold`',
    (_id, background) => {
      const packageA = background.equipmentOptions![0];
      expect(background.equipment).toEqual(packageA.items.map((item) => item.itemId));
      expect(background.gold).toBe(packageA.gold);
    }
  );

  it.each(dnd5e2024Backgrounds.map((b) => [b.id, b] as const))(
    '%s references only equipment ids the 2024 catalog can resolve',
    (_id, background) => {
      const ids = new Set([
        ...background.equipment,
        ...background.equipmentOptions!.flatMap((o) => o.items.map((i) => i.itemId)),
      ]);
      for (const itemId of ids) {
        if (CHOICE_TOKENS.has(itemId)) {
          expect(
            expandDnd5eToolChoiceValue(itemId),
            `${itemId} is exempt from catalog resolution but no longer expands as a choice token`
          ).toBeTruthy();
          continue;
        }
        expect(getEquipment(itemId), `equipment id "${itemId}" resolves to nothing`).toBeDefined();
      }
    }
  );

  it.each(dnd5e2024Backgrounds.map((b) => [b.id, b] as const))(
    '%s carries none of the 2014 model SRD 5.2 dropped',
    (_id, background) => {
      expect(background.feature).toBeUndefined();
      expect(background.suggestedCharacteristics).toBeUndefined();
      expect(background.description).toBeUndefined();
      // SRD 5.2 backgrounds grant no languages.
      expect(background.languageProficiencies).toBeUndefined();
    }
  );
});
