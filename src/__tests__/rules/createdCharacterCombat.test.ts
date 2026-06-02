import { describe, it, expect } from 'vitest';

import { systemRegistry } from '../../registry';
import { registerAllSystems } from '../../systems';
import {
  buildCharacterCombatant,
  buildDaggerheartCombatant,
  buildMam3eCombatant,
  buildMonsterCombatant,
  runCombatRound,
  type RoundCombatant,
} from '../../rules';
import { dnd5eMonstersById } from '../../data/dnd/5e-2014/monsters';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { GameSystemId } from '../../types/game-systems';

registerAllSystems();

/**
 * "Create and run characters" — the end-to-end proof that a FRESH default
 * character built from each system's own createDefaultData() (not a hand-tuned
 * stub) becomes a usable combatant. This guards against drift between the sheet
 * a system actually produces and the field paths the combat adapters read: a
 * mismatch would surface here as unsupported, NaN, or a thrown error rather than
 * silently passing on a convenient hand-built sheet.
 */

function defaultDoc(systemId: GameSystemId): CharacterDocument<SystemDataModel> {
  const def = systemRegistry.get(systemId);
  if (!def) throw new Error(`system ${systemId} is not registered`);
  return {
    id: `${systemId}-pc`,
    name: 'Fresh Hero',
    systemId,
    system: def.createDefaultData() as SystemDataModel,
    createdAt: new Date('2026-06-01T00:00:00.000Z'),
    updatedAt: new Date('2026-06-01T00:00:00.000Z'),
  };
}

const D20_SYSTEMS: GameSystemId[] = ['dnd-5e-2014', 'dnd-5e-2024', 'dnd-3.5e', 'pf1e', 'pf2e'];

describe('a freshly created character becomes a combatant (d20 family)', () => {
  for (const systemId of D20_SYSTEMS) {
    it(`${systemId}: default sheet → usable combatant`, () => {
      const result = buildCharacterCombatant(defaultDoc(systemId), { position: { x: 0, y: 0 } });
      expect(result.supported).toBe(true);
      if (!result.supported) return;
      const c = result.combatant;
      expect(c.attackEffects.length).toBeGreaterThan(0);
      expect(typeof c.attackEffects[0].value).toBe('number');
      expect(Number.isFinite(c.attackEffects[0].value as number)).toBe(true);
      expect(Number.isFinite(c.armorClass)).toBe(true);
      expect(c.armorClass).toBeGreaterThanOrEqual(10);
      expect(c.token.hp).toBeDefined();
      expect(Number.isFinite(c.token.hp!.max)).toBe(true);
      expect(c.token.kind).toBe('character');
    });
  }
});

describe('a freshly created character becomes a combatant (no-HP systems)', () => {
  it('mam3e: default sheet → condition-track combatant (no HP)', () => {
    const c = buildMam3eCombatant(defaultDoc('mam3e'), { position: { x: 0, y: 0 } });
    expect(c.token.hp).toBeUndefined();
    expect(c.token.conditions).toBeDefined();
    expect(Number.isFinite(c.parry)).toBe(true);
    expect(Number.isFinite(c.toughness)).toBe(true);
    expect(typeof c.attackEffects[0].value).toBe('number');
    expect(Number.isFinite(c.attackEffects[0].value as number)).toBe(true);
  });

  it('daggerheart: default sheet → Evasion + thresholds + HP slots', () => {
    const c = buildDaggerheartCombatant(defaultDoc('daggerheart'), { position: { x: 0, y: 0 } });
    expect(Number.isFinite(c.evasion)).toBe(true);
    expect(Number.isFinite(c.thresholds.major)).toBe(true);
    expect(Number.isFinite(c.thresholds.severe)).toBe(true);
    expect(c.token.hp).toBeDefined();
    expect(c.attackEffects.length).toBeGreaterThan(0);
  });
});

describe('create → run: a fresh 5e character fights a real goblin', () => {
  it('runs a full round without faking, recording turns and final HP', () => {
    const pc = buildCharacterCombatant(defaultDoc('dnd-5e-2014'), {
      position: { x: 0, y: 0 },
      faction: 'party',
      weaponDie: 8,
    });
    expect(pc.supported).toBe(true);
    if (!pc.supported) return;

    const goblin = buildMonsterCombatant(dnd5eMonstersById.goblin, {
      tokenId: 'goblin-1',
      position: { x: 1, y: 0 },
    });

    const order: RoundCombatant[] = [
      {
        tokenId: pc.combatant.token.id,
        faction: 'party',
        position: { x: 0, y: 0 },
        armorClass: pc.combatant.armorClass,
        hp: {
          current: pc.combatant.token.hp?.max ?? 10,
          max: pc.combatant.token.hp?.max ?? 10,
        },
        attackEffects: pc.combatant.attackEffects,
        damageEffects: pc.combatant.damageEffects,
        reach: 1,
      },
      {
        tokenId: goblin.token.id,
        faction: 'monsters',
        position: { x: 1, y: 0 },
        armorClass: goblin.armorClass,
        hp: { current: goblin.token.hp!.current, max: goblin.token.hp!.max },
        attackEffects: goblin.attackEffects,
        damageEffects: goblin.damageEffects,
        reach: 1,
      },
    ];

    const result = runCombatRound({
      order,
      seed: 'create-and-run',
      round: 1,
      systemId: 'dnd-5e-2014',
    });
    expect(result.turns).toHaveLength(2);
    // Each combatant scored the other across factions (the N-participant loop ran).
    expect(result.turns[0].turn.scored.some((s) => s.tokenId === 'goblin-1')).toBe(true);
    expect(result.finalHp[pc.combatant.token.id]).toBeDefined();
    expect(result.finalHp['goblin-1']).toBeDefined();
  });
});
