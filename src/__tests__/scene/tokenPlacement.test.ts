import { describe, expect, it } from 'vitest';
import { buildPlacedToken } from '../../scene/tokenPlacement';
import type { Monster } from '../../types/creatures/monsters';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';

const position = { x: 2, y: 3 };
const id = () => 'tok-1';

function monster(overrides: Partial<Monster> = {}): Monster {
  return {
    id: 'goblin',
    name: 'Goblin',
    system: 'dnd-5e-2024',
    source: 'SRD 5.2',
    size: 'small',
    type: 'humanoid',
    alignment: 'neutral evil',
    challengeRating: 0.25,
    experiencePoints: 50,
    armorClass: 15,
    hitPoints: { count: 2, die: 'd6', modifier: 0, notation: '2d6' },
    speed: { walk: 30 },
    abilities: { str: 8, dex: 14, con: 10, int: 10, wis: 8, cha: 8 },
    senses: [],
    languages: [],
    actions: [],
    ...overrides,
  } as Monster;
}

const now = new Date('2026-06-20T00:00:00.000Z');
function doc(): CharacterDocument<SystemDataModel> {
  return {
    id: 'doc-1',
    name: 'Astra',
    systemId: 'dnd-5e-2024',
    system: {} as SystemDataModel,
    createdAt: now,
    updatedAt: now,
  };
}

describe('buildPlacedToken', () => {
  it('returns null when there is no usable name', () => {
    expect(
      buildPlacedToken({
        position,
        nameInput: '   ',
        tokenKind: 'npc',
        tokenAllegiance: 'hostile',
        idFactory: id,
      })
    ).toBeNull();
  });

  it('builds a manual character token: player-controlled, no hp/ref, size 1', () => {
    const token = buildPlacedToken({
      position,
      nameInput: 'Guard',
      tokenKind: 'character',
      tokenAllegiance: 'hostile',
      idFactory: id,
    });
    expect(token).toEqual({
      id: 'tok-1',
      name: 'Guard',
      kind: 'character',
      position,
      size: 1,
      playerControlled: true,
    });
  });

  it('builds a manual NPC token: carries allegiance, not player-controlled', () => {
    const token = buildPlacedToken({
      position,
      nameInput: 'Thug',
      tokenKind: 'npc',
      tokenAllegiance: 'party',
      idFactory: id,
    });
    expect(token).toMatchObject({ kind: 'npc', allegiance: 'party' });
    expect(token).not.toHaveProperty('playerControlled');
    expect(token).not.toHaveProperty('hp');
  });

  it('builds a statblock-backed NPC: average HP, ref, name fallback', () => {
    const token = buildPlacedToken({
      position,
      statblock: monster(),
      nameInput: '',
      tokenKind: 'npc',
      tokenAllegiance: 'hostile',
      idFactory: id,
    });
    // 2 * avg(d6=3.5) + 0 = 7
    expect(token).toMatchObject({
      name: 'Goblin',
      kind: 'npc',
      refId: 'goblin',
      size: 1,
      hp: { current: 7, max: 7, temp: 0 },
      allegiance: 'hostile',
    });
  });

  it('maps creature size to grid footprint (large -> 2)', () => {
    const token = buildPlacedToken({
      position,
      statblock: monster({ id: 'ogre', name: 'Ogre', size: 'large' }),
      nameInput: '',
      tokenKind: 'npc',
      tokenAllegiance: 'hostile',
      idFactory: id,
    });
    expect(token?.size).toBe(2);
  });

  it('places a linked sheet as a character with its ref id', () => {
    const token = buildPlacedToken({
      position,
      linkedDoc: doc(),
      nameInput: '',
      tokenKind: 'character',
      tokenAllegiance: 'hostile',
      idFactory: id,
    });
    expect(token).toMatchObject({
      name: 'Astra',
      kind: 'character',
      refId: 'doc-1',
      playerControlled: true,
    });
    expect(token).not.toHaveProperty('allegiance');
  });

  it('places a linked sheet as an NPC (sheet-backed) with allegiance', () => {
    const token = buildPlacedToken({
      position,
      linkedDoc: doc(),
      nameInput: 'Astra (turned)',
      tokenKind: 'npc',
      tokenAllegiance: 'hostile',
      idFactory: id,
    });
    expect(token).toMatchObject({ kind: 'npc', refId: 'doc-1', allegiance: 'hostile' });
    expect(token).not.toHaveProperty('playerControlled');
  });
});
