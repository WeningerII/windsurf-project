import { describe, expect, it } from 'vitest';
import { dnd5eMonstersById } from '../../data/dnd/5e-2014/monsters';
import { resolveSceneCombatStats, type CombatStatsSources } from '../../scene/combatStats';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { SceneToken, SceneTokenKind } from '../../types/core/scene';

const heroDoc: CharacterDocument<SystemDataModel> = {
  id: 'pc-1',
  name: 'Hero',
  systemId: 'dnd-5e-2014',
  system: {
    level: 5,
    baseAttributes: { str: 18, dex: 10, con: 14, int: 10, wis: 10, cha: 10 },
    armorClass: 18,
    hitPoints: { current: 44, max: 44, temp: 0 },
    equipment: [],
  } as unknown as SystemDataModel,
  createdAt: new Date('2026-05-31T00:00:00.000Z'),
  updatedAt: new Date('2026-05-31T00:00:00.000Z'),
};

const sources: CombatStatsSources = {
  monstersById: new Map([['goblin', dnd5eMonstersById.goblin]]),
  documentsById: new Map([['pc-1', heroDoc]]),
  daggerheartWeaponsById: new Map(),
  daggerheartAdversariesById: new Map(),
};

function token(kind: SceneTokenKind, refId?: string): SceneToken {
  return { id: 't', name: 't', kind, position: { x: 0, y: 0 }, size: 1, refId };
}

describe('resolveSceneCombatStats', () => {
  it('resolves a monster token from a statblock and a character token from a sheet', () => {
    expect(resolveSceneCombatStats(token('monster', 'goblin'), sources)).toMatchObject({
      armorClass: 15, // goblin AC
    });
    expect(resolveSceneCombatStats(token('character', 'pc-1'), sources)).toMatchObject({
      armorClass: 18, // hero AC
    });
  });

  it('makes an NPC mechanically real via a statblock OR a sheet', () => {
    // NPC backed by a creature statblock (a goblin-archer-style NPC).
    const fromStatblock = resolveSceneCombatStats(token('npc', 'goblin'), sources);
    expect(fromStatblock).toMatchObject({ armorClass: 15 });

    // NPC backed by a full character sheet (a named lord), with the same refId
    // absent from the monster pool so the statblock path falls through.
    const fromSheet = resolveSceneCombatStats(token('npc', 'pc-1'), sources);
    expect(fromSheet).toMatchObject({ armorClass: 18 });
    expect(fromSheet?.attackEffects.length).toBeGreaterThan(0);
  });

  it('cannot resolve an NPC with no ref, an unknown ref, or an object token', () => {
    expect(resolveSceneCombatStats(token('npc'), sources)).toBeUndefined();
    expect(resolveSceneCombatStats(token('npc', 'nobody'), sources)).toBeUndefined();
    // Objects never fight even with a resolvable ref.
    expect(resolveSceneCombatStats(token('object', 'goblin'), sources)).toBeUndefined();
  });
});
