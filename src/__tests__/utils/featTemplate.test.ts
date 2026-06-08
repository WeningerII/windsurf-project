import { describe, expect, it } from 'vitest';
import { abilityScoreImprovement } from '../../data/dnd/5e-2024/feats/general';
import { alert, skilled } from '../../data/dnd/5e-2024/feats/origin';
import {
  createDefaultDnd5e2024Data,
  Dnd5e2024DataModel,
} from '../../systems/dnd5e-2024/data-model';
import { CharacterDocument } from '../../types/core/document';
import {
  applyDnd5eFeatTemplate,
  getCurrentDnd5eFeatSelections,
  removeDnd5eFeatTemplate,
} from '../../utils/featTemplate';

function makeDoc(
  overrides: Partial<Dnd5e2024DataModel> = {}
): CharacterDocument<Dnd5e2024DataModel> {
  return {
    id: 'feat-template-doc',
    name: 'Feat Hero',
    systemId: 'dnd-5e-2024',
    system: { ...createDefaultDnd5e2024Data(), ...overrides },
    createdAt: new Date('2026-03-07T00:00:00.000Z'),
    updatedAt: new Date('2026-03-07T00:00:00.000Z'),
  };
}

describe('featTemplate', () => {
  it('rejects ability score improvement selections that exceed the feat cap', () => {
    const doc = makeDoc({
      baseAttributes: { str: 19, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    });

    expect(() =>
      applyDnd5eFeatTemplate(doc, abilityScoreImprovement, {
        'ability-scores': ['str', 'str'],
      })
    ).toThrow('Str cannot exceed 20');
  });

  it('supports mixed skill and tool selections for skilled', () => {
    const updated = applyDnd5eFeatTemplate(makeDoc(), skilled, {
      'skill-or-tool': ['acrobatics', 'bagpipes', 'thieves-tools'],
    });

    expect(updated.system.skillProficiencies.acrobatics).toEqual({
      level: 'proficient',
      source: ['feat:skilled'],
    });
    expect(updated.system.toolProficiencies).toEqual(
      expect.arrayContaining(['bagpipes', 'thieves-tools'])
    );
    expect(getCurrentDnd5eFeatSelections(skilled, updated.system.feats[0])).toEqual({
      'skill-or-tool': ['acrobatics', 'bagpipes', 'thieves-tools'],
    });
  });

  it('removes feat-derived skill sources without clobbering non-feat proficiencies', () => {
    const doc = makeDoc({
      skillProficiencies: {
        acrobatics: { level: 'proficient', source: ['background:entertainer'] },
      },
    });
    const withFeat = applyDnd5eFeatTemplate(doc, skilled, {
      'skill-or-tool': ['acrobatics', 'stealth', 'survival'],
    });
    const removed = removeDnd5eFeatTemplate(withFeat, skilled.id);

    expect(withFeat.system.skillProficiencies.acrobatics.source).toEqual(
      expect.arrayContaining(['background:entertainer', 'feat:skilled'])
    );
    expect(removed.system.skillProficiencies.acrobatics).toEqual({
      level: 'proficient',
      source: ['background:entertainer'],
    });
  });

  it('throws when the same feat is selected twice and leaves unrelated removals untouched', () => {
    const withFeat = applyDnd5eFeatTemplate(makeDoc(), alert);

    expect(() => applyDnd5eFeatTemplate(withFeat, alert)).toThrow('Alert is already selected');

    const removedMissingFeat = removeDnd5eFeatTemplate(withFeat, 'missing-feat');
    expect(removedMissingFeat).not.toBe(withFeat);
    expect(removedMissingFeat.system.feats).toEqual(withFeat.system.feats);
    expect(removedMissingFeat.system.baseAttributes).toEqual(withFeat.system.baseAttributes);
  });
});
