import { describe, expect, it } from 'vitest';
import type { CharacterDocument } from '../../types/core/document';
import {
  createDefaultDaggerheartData,
  type DaggerheartDataModel,
} from '../../systems/daggerheart/data-model';
import {
  applyDaggerheartAncestryTemplate,
  applyDaggerheartClassTemplate,
  applyDaggerheartCommunityTemplate,
} from '../../utils/daggerheartTemplate';
import { getDaggerheartClass } from '../../data/daggerheart/1.0/classes';
import { getDaggerheartAncestry } from '../../data/daggerheart/1.0/ancestries';
import { getDaggerheartCommunity } from '../../data/daggerheart/1.0/communities';

function makeDoc(
  overrides: Partial<DaggerheartDataModel> = {}
): CharacterDocument<DaggerheartDataModel> {
  return {
    id: 'daggerheart-template-doc',
    name: 'Template Hero',
    systemId: 'daggerheart',
    system: { ...createDefaultDaggerheartData(), ...overrides },
    createdAt: new Date('2026-03-09T00:00:00.000Z'),
    updatedAt: new Date('2026-03-09T00:00:00.000Z'),
  };
}

describe('daggerheartTemplate', () => {
  const bard = getDaggerheartClass('daggerheart-bard')!;
  const guardian = getDaggerheartClass('daggerheart-guardian')!;
  const human = getDaggerheartAncestry('human')!;
  const giant = getDaggerheartAncestry('giant')!;
  const simiah = getDaggerheartAncestry('simiah')!;
  const highborne = getDaggerheartCommunity('highborne')!;
  const wanderborne = getDaggerheartCommunity('wanderborne')!;

  it('applies class starting values and class keepsakes on initial selection', () => {
    const updated = applyDaggerheartClassTemplate(makeDoc(), bard);

    expect(updated.system.class).toBe('Bard');
    expect(updated.system.evasion).toBe(10);
    expect(updated.system.hitPoints).toEqual({ current: 5, max: 5 });
    expect(updated.system.inventory.map((item) => item.name)).toEqual([
      'A romance novel',
      'A letter never opened',
    ]);
  });

  it('replaces derived class values and keepsakes when the class changes before manual edits', () => {
    const bardDoc = applyDaggerheartClassTemplate(makeDoc(), bard);
    const guardianDoc = applyDaggerheartClassTemplate(bardDoc, guardian, {
      previousClass: bard,
    });

    expect(guardianDoc.system.class).toBe('Guardian');
    expect(guardianDoc.system.evasion).toBe(9);
    expect(guardianDoc.system.hitPoints).toEqual({ current: 7, max: 7 });
    expect(guardianDoc.system.inventory.map((item) => item.name)).toEqual([
      'A totem from your mentor',
      'A secret key',
    ]);
  });

  it('layers ancestry bonuses onto class-backed starting values and swaps them cleanly', () => {
    const bardDoc = applyDaggerheartClassTemplate(makeDoc(), bard);
    const humanDoc = applyDaggerheartAncestryTemplate(bardDoc, human, {
      classData: bard,
    });
    const giantDoc = applyDaggerheartAncestryTemplate(humanDoc, giant, {
      previousAncestry: human,
      classData: bard,
    });
    const simiahDoc = applyDaggerheartAncestryTemplate(giantDoc, simiah, {
      previousAncestry: giant,
      classData: bard,
    });

    expect(humanDoc.system.stress.max).toBe(7);
    expect(giantDoc.system.hitPoints).toEqual({ current: 6, max: 6 });
    expect(giantDoc.system.stress.max).toBe(6);
    expect(simiahDoc.system.evasion).toBe(11);
    expect(simiahDoc.system.hitPoints).toEqual({ current: 5, max: 5 });
  });

  it('adds and removes the wanderborne nomadic pack inventory item', () => {
    const wanderer = applyDaggerheartCommunityTemplate(makeDoc(), wanderborne);
    const noble = applyDaggerheartCommunityTemplate(wanderer, highborne);

    expect(wanderer.system.community).toBe('Wanderborne');
    expect(wanderer.system.inventory.map((item) => item.name)).toContain('Nomadic Pack');
    expect(noble.system.community).toBe('Highborne');
    expect(noble.system.inventory.map((item) => item.name)).not.toContain('Nomadic Pack');
  });

  it('preserves manual evasion and hit point edits when changing classes later', () => {
    const bardDoc = applyDaggerheartClassTemplate(makeDoc(), bard);
    const customized = makeDoc({
      ...bardDoc.system,
      class: bard.name,
      evasion: 13,
      hitPoints: { current: 3, max: 8 },
      inventory: bardDoc.system.inventory,
    });

    const updated = applyDaggerheartClassTemplate(customized, guardian, {
      previousClass: bard,
    });

    expect(updated.system.evasion).toBe(13);
    expect(updated.system.hitPoints).toEqual({ current: 3, max: 8 });
    expect(updated.system.inventory.map((item) => item.name)).toEqual([
      'A totem from your mentor',
      'A secret key',
    ]);
  });
});
