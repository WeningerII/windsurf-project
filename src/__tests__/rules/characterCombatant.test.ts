import { describe, it, expect } from 'vitest';

import { dnd5eMonstersById } from '../../data/dnd/5e-2014/monsters';
import {
  appendSceneEvent,
  createSceneDocument,
  foldSceneEvents,
  resolveSceneAction,
} from '../../scene/runtime';
import {
  buildCharacterCombatant,
  buildMonsterCombatant,
  runCombatRound,
  type RoundCombatant,
} from '../../rules';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { GameSystemId } from '../../types/game-systems';
import type { SceneDocument } from '../../types/core/scene';

/**
 * BREADTH (RFC 003): player characters become combatants across the d20 family,
 * so a real PC can fight real monsters. M&M/Daggerheart return unsupported
 * (different damage models) rather than being faked.
 */

function charDoc(
  systemId: GameSystemId,
  system: Record<string, unknown>,
  id = 'pc-1',
  name = 'Hero'
): CharacterDocument<SystemDataModel> {
  return {
    id,
    name,
    systemId,
    system: system as SystemDataModel,
    createdAt: new Date('2026-05-31T00:00:00.000Z'),
    updatedAt: new Date('2026-05-31T00:00:00.000Z'),
  };
}

describe('buildCharacterCombatant — d20 family parity', () => {
  it('5e 2014: attack = proficiency + STR; AC and HP read from the sheet', () => {
    const doc = charDoc('dnd-5e-2014', {
      level: 5,
      baseAttributes: { str: 18, dex: 10, con: 14, int: 10, wis: 10, cha: 10 },
      armorClass: 18,
      hitPoints: { current: 44, max: 44, temp: 0 },
      equipment: [],
      feats: [],
      features: [],
    });
    const result = buildCharacterCombatant(doc, { position: { x: 0, y: 0 } });
    expect(result.supported).toBe(true);
    if (!result.supported) return;
    // proficiency at level 5 = +3, STR 18 = +4 -> +7 attack.
    expect(result.combatant.attackEffects[0].value).toBe(7);
    expect(result.combatant.armorClass).toBe(18);
    expect(result.combatant.token.hp).toEqual({ current: 44, max: 44, temp: 0 });
    expect(result.combatant.token.kind).toBe('character');
  });

  it('3.5e: attack = BAB + STR; AC read from { total }', () => {
    const doc = charDoc('dnd-3.5e', {
      level: 6,
      baseAttributes: { str: 16, dex: 12, con: 12, int: 10, wis: 10, cha: 10 },
      baseAttackBonus: 6,
      armorClass: { total: 19, touch: 12, flatFooted: 17 },
      hitPoints: { current: 52, max: 52, temp: 0 },
      equipment: [],
      feats: [],
      features: [],
    });
    const result = buildCharacterCombatant(doc, { position: { x: 0, y: 0 } });
    expect(result.supported).toBe(true);
    if (!result.supported) return;
    // BAB 6 + STR 16 (+3) = +9.
    expect(result.combatant.attackEffects[0].value).toBe(9);
    expect(result.combatant.armorClass).toBe(19);
  });

  it('PF2e: attack = martial proficiency total + STR; AC flat', () => {
    const doc = charDoc('pf2e', {
      level: 4,
      baseAttributes: { str: 18, dex: 12, con: 14, int: 10, wis: 10, cha: 10 },
      armorClass: 21,
      hitPoints: { current: 52, max: 52, temp: 0 },
      weaponProficiencies: {
        simple: { tier: 'trained', total: 6 },
        martial: { tier: 'expert', total: 8 },
      },
      equipment: [],
      feats: [],
      features: [],
    });
    const result = buildCharacterCombatant(doc, { position: { x: 0, y: 0 } });
    expect(result.supported).toBe(true);
    if (!result.supported) return;
    // best weapon prof total 8 + STR 18 (+4) = +12.
    expect(result.combatant.attackEffects[0].value).toBe(12);
  });

  it('layers an equipped +1 weapon attack bonus through the shared compiler (5e)', () => {
    const doc = charDoc('dnd-5e-2014', {
      level: 1,
      baseAttributes: { str: 14, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
      armorClass: 12,
      hitPoints: { current: 10, max: 10, temp: 0 },
      equipment: [
        { itemId: 'sword-1', slot: 'mainHand', attuned: false, attackBonus: 1, damageBonus: 1 },
      ],
      feats: [],
      features: [],
    });
    const result = buildCharacterCombatant(doc, { position: { x: 0, y: 0 } });
    expect(result.supported).toBe(true);
    if (!result.supported) return;
    // prof +2 (lvl1) + STR +2 + item +1 = +5 attack.
    expect(result.combatant.attackEffects[0].value).toBe(5);
  });

  it('returns unsupported for M&M and Daggerheart (non-d20 damage models), with a reason', () => {
    for (const systemId of ['mam3e', 'daggerheart'] as const) {
      const result = buildCharacterCombatant(charDoc(systemId, { level: 1, baseAttributes: {} }), {
        position: { x: 0, y: 0 },
      });
      expect(result.supported).toBe(false);
      if (!result.supported) {
        expect(result.reason).toMatch(/non-d20|Toughness|threshold/i);
      }
    }
  });
});

describe('PC vs monster — a real character fights a real goblin end to end', () => {
  it('runs a round where a PC and a goblin attack across factions, dropping HP', () => {
    const pcDoc = charDoc('dnd-5e-2014', {
      level: 5,
      baseAttributes: { str: 18, dex: 12, con: 14, int: 10, wis: 10, cha: 10 },
      armorClass: 18,
      hitPoints: { current: 44, max: 44, temp: 0 },
      equipment: [],
      feats: [],
      features: [],
    });
    const pc = buildCharacterCombatant(pcDoc, {
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
        position: pc.combatant.token.position,
        armorClass: pc.combatant.armorClass,
        hp: { current: pc.combatant.token.hp!.current, max: pc.combatant.token.hp!.max },
        attackEffects: pc.combatant.attackEffects,
        damageEffects: pc.combatant.damageEffects,
        reach: 5,
      },
      {
        tokenId: goblin.token.id,
        faction: 'monsters',
        position: goblin.token.position,
        armorClass: goblin.armorClass,
        hp: { current: goblin.token.hp!.current, max: goblin.token.hp!.max },
        attackEffects: goblin.attackEffects,
        damageEffects: goblin.damageEffects,
        reach: 5,
      },
    ];

    // Try a few seeds; in at least one round, someone takes damage across factions.
    let sawCrossFactionDamage = false;
    for (let i = 0; i < 20 && !sawCrossFactionDamage; i += 1) {
      const round = runCombatRound({ order, seed: `pcfight-${i}`, round: 1 });
      const pcHurtGoblin = round.finalHp['goblin-1'] < goblin.token.hp!.current;
      const goblinHurtPc = round.finalHp[pc.combatant.token.id] < pc.combatant.token.hp!.current;
      if (pcHurtGoblin || goblinHurtPc) sawCrossFactionDamage = true;
      // The PC scored the goblin as a candidate and vice versa.
      expect(round.turns[0].turn.scored.some((s) => s.tokenId === 'goblin-1')).toBe(true);
    }
    expect(sawCrossFactionDamage).toBe(true);
  });

  it('the PC combatant applies damage on a real scene grid', () => {
    const pcDoc = charDoc('dnd-5e-2014', {
      level: 10,
      baseAttributes: { str: 20, dex: 12, con: 16, int: 10, wis: 10, cha: 10 },
      armorClass: 18,
      hitPoints: { current: 80, max: 80, temp: 0 },
      equipment: [],
      feats: [],
      features: [],
    });
    const pc = buildCharacterCombatant(pcDoc, { position: { x: 0, y: 0 }, weaponDie: 12 });
    expect(pc.supported).toBe(true);
    if (!pc.supported) return;

    let scene: SceneDocument = createSceneDocument({ id: 's', name: 'S', systemId: 'dnd-5e-2014' });
    const goblin = buildMonsterCombatant(dnd5eMonstersById.goblin, {
      tokenId: 'goblin-1',
      position: { x: 1, y: 0 },
    });
    const place = resolveSceneAction(
      scene,
      { type: 'place-token', token: goblin.token },
      { eventId: 'p' }
    );
    scene = appendSceneEvent(scene, place.event!);
    const startHp = foldSceneEvents(scene).state.tokens['goblin-1'].hp!.current;

    const order: RoundCombatant[] = [
      {
        tokenId: pc.combatant.token.id,
        faction: 'party',
        position: { x: 0, y: 0 },
        armorClass: pc.combatant.armorClass,
        hp: { current: 80, max: 80 },
        attackEffects: pc.combatant.attackEffects,
        damageEffects: pc.combatant.damageEffects,
        reach: 5,
      },
      {
        tokenId: 'goblin-1',
        faction: 'monsters',
        position: { x: 1, y: 0 },
        armorClass: goblin.armorClass,
        hp: { current: startHp, max: goblin.token.hp!.max },
        attackEffects: goblin.attackEffects,
        damageEffects: goblin.damageEffects,
        reach: 5,
      },
    ];

    // High-level STR-20 PC vs AC-15 goblin: find a round where the PC hits.
    for (let i = 0; i < 30; i += 1) {
      const round = runCombatRound({ order, seed: `apply-${i}`, round: 1 });
      const pcIntent = round.turns[0].intent;
      if (pcIntent && pcIntent.type === 'apply-damage') {
        const apply = resolveSceneAction(scene, pcIntent, { eventId: `dmg-${i}` });
        const applied = appendSceneEvent(scene, apply.event!);
        const after = foldSceneEvents(applied).state.tokens['goblin-1'].hp!.current;
        expect(after).toBeLessThan(startHp);
        return;
      }
    }
    throw new Error('expected the PC to land at least one hit across 30 seeds');
  });
});
