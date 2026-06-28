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
  executeTacticalTurn,
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

  it('REGRESSION (05-M4): a DEX-based PC uses max(STR, DEX) for the attack bonus', () => {
    // A classic 5e rogue: STR 8 (-1), DEX 18 (+4). STR-only gave prof - 1 = +1
    // — a crippled attacker; finesse-agnostic baseline gives prof + 4 = +6.
    const rogue = charDoc('dnd-5e-2014', {
      level: 3,
      baseAttributes: { str: 8, dex: 18, con: 12, int: 10, wis: 10, cha: 14 },
      armorClass: 15,
      hitPoints: { current: 24, max: 24, temp: 0 },
      equipment: [],
      feats: [],
      features: [],
    });
    const result = buildCharacterCombatant(rogue, { position: { x: 0, y: 0 } });
    expect(result.supported).toBe(true);
    if (!result.supported) return;
    // prof at level 3 = +2, max(STR -1, DEX +4) = +4 -> +6 attack.
    expect(result.combatant.attackEffects[0].value).toBe(6);

    // 3.5e/PF1e: BAB + max(STR, DEX) — Weapon-Finesse-shaped baseline.
    const pf1Rogue = charDoc('pf1e', {
      level: 4,
      baseAttributes: { str: 10, dex: 16, con: 12, int: 10, wis: 10, cha: 10 },
      baseAttackBonus: 3,
      armorClass: { total: 17, touch: 13, flatFooted: 14 },
      hitPoints: { current: 28, max: 28, temp: 0 },
      equipment: [],
      feats: [],
      features: [],
    });
    const pf1Result = buildCharacterCombatant(pf1Rogue, { position: { x: 0, y: 0 } });
    expect(pf1Result.supported).toBe(true);
    if (!pf1Result.supported) return;
    // BAB 3 + max(STR +0, DEX +3) = +6.
    expect(pf1Result.combatant.attackEffects[0].value).toBe(6);
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

  it('REGRESSION (05-L6): an explicit options.faction is honored; default derives from token kind', () => {
    const doc = charDoc('dnd-5e-2014', {
      level: 1,
      baseAttributes: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
      armorClass: 10,
      hitPoints: { current: 8, max: 8, temp: 0 },
      equipment: [],
      feats: [],
      features: [],
    });

    const explicit = buildCharacterCombatant(doc, {
      position: { x: 0, y: 0 },
      faction: 'mercenaries',
    });
    expect(explicit.supported).toBe(true);
    if (explicit.supported) {
      expect(explicit.combatant.faction).toBe('mercenaries');
    }

    const derived = buildCharacterCombatant(doc, { position: { x: 0, y: 0 } });
    expect(derived.supported).toBe(true);
    if (derived.supported) {
      // 'party' is what factionForToken derives for a 'character'-kind token.
      expect(derived.combatant.faction).toBe('party');
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

describe('5e Extra Attack in scene combat (phase 4)', () => {
  it('counts extra-attack features into attacksPerRound and derives speed cells', async () => {
    const { buildCharacterCombatant } = await import('../../rules');
    const { createDefaultDnd5eData } = await import('../../systems/dnd5e/data-model');
    const system = {
      ...createDefaultDnd5eData(),
      speed: 30,
      features: [
        {
          id: 'extra-attack',
          name: 'Extra Attack',
          source: 'Fighter 5',
          description: 'You can attack twice whenever you take the Attack action.',
        },
        {
          id: 'extra-attack-2',
          name: 'Extra Attack (2)',
          source: 'Fighter 11',
          description: 'You can attack three times.',
        },
      ],
    };
    const built = buildCharacterCombatant(
      {
        id: 'fighter-11',
        name: 'Fighter',
        systemId: 'dnd-5e-2014',
        system,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { tokenId: 'f', position: { x: 0, y: 0 } }
    );
    expect(built.supported).toBe(true);
    if (built.supported) {
      // Fighter 11: base attack + two Extra Attack grants = 3 per Attack action.
      expect(built.combatant.attacksPerRound).toBe(3);
      expect(built.combatant.speedCells).toBe(6);
    }
  });
});

describe('5e rider toggles in scene combat (phase 4)', () => {
  it('a raging barbarian with GWM folds both riders into the damage chain', async () => {
    const { buildCharacterCombatant } = await import('../../rules');
    const { createDefaultDnd5eData } = await import('../../systems/dnd5e/data-model');
    const system = {
      ...createDefaultDnd5eData(),
      activeToggles: ['rage', 'great-weapon-master'],
      classLevels: [{ classId: 'barbarian', level: 9, hitDieRolls: [] }],
      features: [{ id: 'rage', name: 'Rage', source: 'Barbarian 1', description: 'RAGE.' }],
      feats: [
        {
          id: 'great-weapon-master',
          name: 'Great Weapon Master',
          source: 'Feat',
          description: '-5/+10.',
        },
      ],
    };
    const built = buildCharacterCombatant(
      {
        id: 'barb',
        name: 'Barb',
        systemId: 'dnd-5e-2014',
        system,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { tokenId: 'b', position: { x: 0, y: 0 } }
    );
    expect(built.supported).toBe(true);
    if (!built.supported) return;
    // Rage at barbarian 9 = +3 damage; GWM = -5 attack / +10 damage.
    const damageAdds = built.combatant.damageEffects
      .filter((effect) => effect.operation === 'add')
      .map((effect) => effect.value);
    expect(damageAdds).toContain(3);
    expect(damageAdds).toContain(10);
    expect(built.combatant.attackEffects.some((effect) => effect.value === -5)).toBe(true);
  });

  it('toggles without the gating feature contribute nothing', async () => {
    const { buildCharacterCombatant } = await import('../../rules');
    const { createDefaultDnd5eData } = await import('../../systems/dnd5e/data-model');
    const built = buildCharacterCombatant(
      {
        id: 'pretender',
        name: 'Pretender',
        systemId: 'dnd-5e-2014',
        system: { ...createDefaultDnd5eData(), activeToggles: ['rage', 'sneak-attack'] },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { tokenId: 'p', position: { x: 0, y: 0 } }
    );
    expect(built.supported).toBe(true);
    if (!built.supported) return;
    expect(built.combatant.damageEffects.some((effect) => /rage|sneak/i.test(effect.label))).toBe(
      false
    );
  });
});

describe('collectDnd5eRiderEffects: Sharpshooter and Divine Smite', () => {
  it('compiles Sharpshooter -5/+10 and Divine Smite 2d8 when gated and active', async () => {
    const { collectDnd5eRiderEffects, availableDnd5eToggles } =
      await import('../../rules/conditions/dnd5eRiders');
    const inputs = {
      activeToggles: ['sharpshooter', 'divine-smite'],
      featureIds: new Set(['divine-smite']),
      featIds: new Set(['sharpshooter']),
      barbarianLevel: 0,
      rogueLevel: 0,
    };
    expect(availableDnd5eToggles(inputs)).toEqual(['sharpshooter', 'divine-smite']);
    const effects = collectDnd5eRiderEffects(inputs);
    const attack = effects.filter((effect) => effect.target === 'attack');
    expect(attack).toHaveLength(1);
    expect(attack[0].value).toBe(-5);
    const flatDamage = effects.filter(
      (effect) => effect.target === 'damage' && effect.operation === 'add'
    );
    expect(flatDamage.map((effect) => effect.value)).toEqual([10]);
    const smiteDice = effects.filter(
      (effect) => effect.operation === 'add-die' && /smite/i.test(effect.label)
    );
    expect(smiteDice).toHaveLength(2);
    expect(smiteDice.every((effect) => effect.value === 8)).toBe(true);
  });

  it('Divine Smite without the feature compiles nothing', async () => {
    const { collectDnd5eRiderEffects } = await import('../../rules/conditions/dnd5eRiders');
    const effects = collectDnd5eRiderEffects({
      activeToggles: ['divine-smite', 'sharpshooter'],
      featureIds: new Set<string>(),
      featIds: new Set<string>(),
      barbarianLevel: 0,
      rogueLevel: 0,
    });
    expect(effects).toHaveLength(0);
  });
});

describe('legacy-d20 iterative attacks (3.5e/PF1e)', () => {
  it('BAB drives attacks per full attack with a -5 iterative step', async () => {
    const { buildCharacterCombatant } = await import('../../rules');
    const build = (baseAttackBonus: number) =>
      buildCharacterCombatant(
        {
          id: `pf1e-${baseAttackBonus}`,
          name: 'Fighter',
          systemId: 'pf1e',
          system: {
            level: Math.max(1, baseAttackBonus),
            baseAttackBonus,
            baseAttributes: { str: 16, dex: 12 },
            hitPoints: { current: 30, max: 30 },
            armorClass: { total: 18 },
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        { tokenId: 't', position: { x: 0, y: 0 } }
      );
    const cases: Array<[number, number]> = [
      [1, 1],
      [5, 1],
      [6, 2],
      [11, 3],
      [16, 4],
      [20, 4],
    ];
    for (const [bab, expected] of cases) {
      const built = build(bab);
      expect(built.supported).toBe(true);
      if (!built.supported) continue;
      expect(built.combatant.attacksPerRound).toBe(expected);
      expect(built.combatant.iterativePenaltyStep).toBe(5);
    }
  });

  it('5e characters keep the full-bonus Multiattack model (no iterative step)', async () => {
    const { buildCharacterCombatant } = await import('../../rules');
    const { createDefaultDnd5eData } = await import('../../systems/dnd5e/data-model');
    const built = buildCharacterCombatant(
      {
        id: 'fiver',
        name: 'Fiver',
        systemId: 'dnd-5e-2014',
        system: createDefaultDnd5eData(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { tokenId: 'f', position: { x: 0, y: 0 } }
    );
    expect(built.supported).toBe(true);
    if (!built.supported) return;
    expect(built.combatant.iterativePenaltyStep).toBeUndefined();
  });
});

describe('PF2e rider toggles in scene combat', () => {
  it('a raging level-11 rogue/barbarian folds CRB riders into the damage chain', async () => {
    const { buildCharacterCombatant } = await import('../../rules');
    const { createDefaultPf2eData } = await import('../../systems/pf2e/data-model');
    const built = buildCharacterCombatant(
      {
        id: 'pf2e-rager',
        name: 'Rager',
        systemId: 'pf2e',
        system: {
          ...createDefaultPf2eData(),
          level: 11,
          activeToggles: ['rage', 'sneak-attack'],
          features: [
            { id: 'rage', name: 'Rage', source: 'Barbarian 1', description: 'RAGE.' },
            { id: 'sneak-attack', name: 'Sneak Attack', source: 'Rogue 1', description: 'SA.' },
          ],
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { tokenId: 'r', position: { x: 0, y: 0 } }
    );
    expect(built.supported).toBe(true);
    if (!built.supported) return;
    const riders = built.combatant.damageEffects.filter((effect) =>
      /rage|sneak/i.test(effect.label)
    );
    // Rage +2 flat, Sneak Attack 3d6 at level 11.
    expect(riders.filter((effect) => effect.operation === 'add').map((e) => e.value)).toEqual([2]);
    expect(riders.filter((effect) => effect.operation === 'add-die')).toHaveLength(3);
  });

  it('PF2e sneak attack dice scale at 5/11/17 and gate on the feature', async () => {
    const { pf2eSneakAttackDice, collectPf2eRiderEffects } =
      await import('../../rules/conditions/pf2eRiders');
    expect([1, 4, 5, 11, 17, 20].map(pf2eSneakAttackDice)).toEqual([1, 1, 2, 3, 4, 4]);
    expect(
      collectPf2eRiderEffects({
        activeToggles: ['rage', 'sneak-attack'],
        featureIds: new Set<string>(),
        level: 20,
      })
    ).toHaveLength(0);
  });
});

describe('5e sneak attack dice (phase 4)', () => {
  it('scale at ceil(rogue level / 2)', async () => {
    const { sneakAttackDice } = await import('../../rules/conditions/dnd5eRiders');
    expect([1, 2, 3, 4, 5, 11, 20].map(sneakAttackDice)).toEqual([1, 1, 2, 2, 3, 6, 10]);
  });
});

describe('PF1e Power Attack rider', () => {
  it('compiles the formula-fixed trade and scales with BAB', async () => {
    const { pf1ePowerAttackTrade, collectD20LegacyRiderEffects, availableD20LegacyToggles } =
      await import('../../rules/conditions/d20LegacyRiders');
    expect(pf1ePowerAttackTrade(0)).toEqual({ penalty: 1, bonus: 2 });
    expect(pf1ePowerAttackTrade(4)).toEqual({ penalty: 2, bonus: 4 });
    expect(pf1ePowerAttackTrade(20)).toEqual({ penalty: 6, bonus: 12 });
    const effects = collectD20LegacyRiderEffects({
      systemId: 'pf1e',
      activeToggles: ['power-attack'],
      featIds: new Set(['power-attack']),
      baseAttackBonus: 8,
    });
    expect(effects.find((e) => e.target === 'attack')?.value).toBe(3);
    expect(effects.find((e) => e.target === 'damage')?.value).toBe(6);
    // 3.5e's choose-N trade is a per-roll player choice: never compiled.
    expect(
      collectD20LegacyRiderEffects({
        systemId: 'dnd-3.5e',
        activeToggles: ['power-attack'],
        featIds: new Set(['power-attack']),
        baseAttackBonus: 8,
      })
    ).toHaveLength(0);
    expect(
      availableD20LegacyToggles({ systemId: 'dnd-3.5e', featIds: new Set(['power-attack']) })
    ).toHaveLength(0);
  });

  it('folds into the PF1e combatant when toggled and feat-gated', async () => {
    const { buildCharacterCombatant } = await import('../../rules');
    const built = buildCharacterCombatant(
      {
        id: 'pf1e-pa',
        name: 'Smasher',
        systemId: 'pf1e',
        system: {
          level: 8,
          baseAttackBonus: 8,
          baseAttributes: { str: 18, dex: 10 },
          hitPoints: { current: 60, max: 60 },
          armorClass: { total: 19 },
          activeToggles: ['power-attack'],
          feats: [{ id: 'power-attack', name: 'Power Attack', description: '' }],
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { tokenId: 'p', position: { x: 0, y: 0 } }
    );
    expect(built.supported).toBe(true);
    if (!built.supported) return;
    expect(
      built.combatant.attackEffects.some(
        (effect) => effect.operation === 'subtract' && effect.value === 3
      )
    ).toBe(true);
    expect(
      built.combatant.damageEffects.some(
        (effect) => effect.value === 6 && /power attack/i.test(effect.label)
      )
    ).toBe(true);
  });
});

describe('buildCharacterCombatant — equipped weapon damage (versatile)', () => {
  const longsword = {
    itemId: 'longsword',
    slot: 'mainHand' as const,
    attuned: false,
    weaponDamage: { count: 1, die: 8 },
    weaponVersatileDie: 10,
    weaponProperties: ['versatile'],
  };

  function weaponDie(result: ReturnType<typeof buildCharacterCombatant>) {
    if (!result.supported) return undefined;
    return result.combatant.damageEffects.find((effect) => effect.operation === 'add-die')?.value;
  }

  function doc(equipment: unknown[]) {
    return charDoc('dnd-5e-2014', {
      level: 1,
      baseAttributes: { str: 16, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
      armorClass: 12,
      hitPoints: { current: 10, max: 10, temp: 0 },
      equipment,
      feats: [],
      features: [],
    });
  }

  it('5e Versatile: rolls the larger die when wielded two-handed (empty off-hand)', () => {
    const result = buildCharacterCombatant(doc([longsword]), { position: { x: 0, y: 0 } });
    expect(weaponDie(result)).toBe(10); // 1d10 two-handed
  });

  it('5e Versatile: rolls the base die when a shield occupies the off-hand', () => {
    const result = buildCharacterCombatant(
      doc([longsword, { itemId: 'shield', slot: 'offHand', attuned: false, shieldBonus: 2 }]),
      { position: { x: 0, y: 0 } }
    );
    expect(weaponDie(result)).toBe(8); // 1d8 one-handed
  });

  it('falls back to the placeholder die when no weapon data is present', () => {
    const result = buildCharacterCombatant(doc([]), { position: { x: 0, y: 0 } });
    expect(weaponDie(result)).toBe(6); // d6 baseline, unchanged
  });
});

describe('buildCharacterCombatant — two-weapon fighting (off-hand)', () => {
  const mainLight = {
    itemId: 'shortsword-main',
    slot: 'mainHand' as const,
    attuned: false,
    weaponDamage: { count: 1, die: 6 },
    weaponProperties: ['light'],
  };
  const offLight = {
    itemId: 'shortsword-off',
    slot: 'offHand' as const,
    attuned: false,
    weaponDamage: { count: 1, die: 6 },
    weaponProperties: ['light'],
  };

  function doc(equipment: unknown[], features: unknown[] = []) {
    return charDoc('dnd-5e-2014', {
      level: 1,
      baseAttributes: { str: 16, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
      armorClass: 12,
      hitPoints: { current: 10, max: 10, temp: 0 },
      equipment,
      feats: [],
      features,
    });
  }

  function offHandAbilityMod(result: ReturnType<typeof buildCharacterCombatant>) {
    if (!result.supported || !result.combatant.offHandAttack) return undefined;
    return result.combatant.offHandAttack.damageEffects.find((e) => e.operation === 'add')?.value;
  }

  it('grants an off-hand attack whose damage omits the ability modifier', () => {
    const result = buildCharacterCombatant(doc([mainLight, offLight]), {
      position: { x: 0, y: 0 },
    });
    expect(result.supported).toBe(true);
    if (!result.supported) return;
    expect(result.combatant.offHandAttack).toBeDefined();
    expect(offHandAbilityMod(result)).toBe(0); // STR +3 NOT added by default
  });

  it('the Two-Weapon Fighting style adds the ability modifier to off-hand damage', () => {
    const result = buildCharacterCombatant(
      doc(
        [mainLight, offLight],
        [
          {
            id: 'fighting-style-two-weapon-fighting',
            name: 'Two-Weapon Fighting',
            source: 'Fighter',
          },
        ]
      ),
      { position: { x: 0, y: 0 } }
    );
    expect(offHandAbilityMod(result)).toBe(3); // STR +3 now added
  });

  it('no off-hand attack without an equipped off-hand light weapon', () => {
    const result = buildCharacterCombatant(doc([mainLight]), { position: { x: 0, y: 0 } });
    if (!result.supported) return;
    expect(result.combatant.offHandAttack).toBeUndefined();
  });

  it('the off-hand attack fires as an extra resolved attack in a turn', () => {
    const built = buildCharacterCombatant(doc([mainLight, offLight]), { position: { x: 0, y: 0 } });
    if (!built.supported) return;
    const combatant = built.combatant;
    const turn = executeTacticalTurn({
      actor: {
        tokenId: 'pc-1',
        faction: 'party',
        position: { x: 0, y: 0 },
        attackEffects: combatant.attackEffects,
        damageEffects: combatant.damageEffects,
        offHandAttack: combatant.offHandAttack,
        reach: 1,
      },
      targets: [
        {
          tokenId: 'goblin',
          faction: 'monsters',
          position: { x: 1, y: 0 },
          armorClass: 5,
          hp: { current: 50, max: 50 },
        },
      ],
      seed: 'twf-1',
    });
    // One Attack-action attack + one off-hand bonus attack.
    expect(turn.attacks.length).toBe(2);
  });
});
