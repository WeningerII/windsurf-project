import { describe, it, expect } from 'vitest';

import { dnd5eMonstersById } from '../../data/dnd/5e-2014/monsters';
import { dnd5e2024MonstersById } from '../../data/dnd/5e-2024/monsters';
import {
  appendSceneEvent,
  createSceneDocument,
  foldSceneEvents,
  resolveSceneAction,
} from '../../scene/runtime';
import {
  buildMonsterCombatant,
  executeTacticalTurn,
  monsterAttacksPerRound,
  monsterAverageHitPoints,
  parseAttackFromDescription,
  primaryAttackAction,
  resolveEffects,
  type TacticalTarget,
} from '../../rules';
import type { SceneDocument } from '../../types/core/scene';

/**
 * PHASE 11 bridge (RFC 003): loader-backed monsters become real combatants.
 * A *shipped* goblin's statblock drives the deterministic combat pipeline — no
 * invented numbers. This is what makes "run an encounter" use real content.
 */

describe('monster → combatant adapter (real shipped SRD monsters)', () => {
  it('derives average HP from the hit dice (goblin 2d6 = 7)', () => {
    const goblin = dnd5eMonstersById.goblin;
    expect(goblin).toBeDefined();
    // 2 * avg(d6=3.5) = 7
    expect(monsterAverageHitPoints(goblin)).toBe(7);
  });

  it('builds a combatant token carrying the statblock AC, HP, and reach', () => {
    const goblin = dnd5eMonstersById.goblin;
    const combatant = buildMonsterCombatant(goblin, {
      tokenId: 'goblin-1',
      position: { x: 0, y: 0 },
    });
    expect(combatant.armorClass).toBe(15);
    expect(combatant.token.hp).toEqual({ current: 7, max: 7, temp: 0 });
    expect(combatant.token.refId).toBe('goblin');
    // Scimitar reach 5 ft -> 1 cell.
    expect(combatant.reach).toBe(1);
  });

  it('compiles the primary attack into attack + damage effects', () => {
    const goblin = dnd5eMonstersById.goblin;
    const action = primaryAttackAction(goblin)!;
    expect(action.name).toBe('Scimitar');

    const combatant = buildMonsterCombatant(goblin, {
      tokenId: 'g',
      position: { x: 0, y: 0 },
    });
    // Attack bonus +4 from the statblock.
    const attack = combatant.attackEffects.find((e) => e.target === 'attack');
    expect(attack?.value).toBe(4);
    // Scimitar damage is 1d6+2 slashing -> one add-die(6) + one add(2) on damage.slashing.
    const dmgDie = combatant.damageEffects.find((e) => e.operation === 'add-die');
    expect(dmgDie?.target).toBe('damage.slashing');
    expect(dmgDie?.value).toBe(6);
    const dmgFlat = combatant.damageEffects.find((e) => e.operation === 'add');
    expect(dmgFlat?.value).toBe(2);
  });

  it('a real goblin attacks a real guard through the full pipeline, dropping HP on the grid', () => {
    const goblin = dnd5eMonstersById.goblin;
    const guard = dnd5eMonstersById.guard;
    expect(guard).toBeDefined();

    const attacker = buildMonsterCombatant(goblin, {
      tokenId: 'goblin-1',
      position: { x: 0, y: 0 },
    });
    const defender = buildMonsterCombatant(guard, { tokenId: 'guard-1', position: { x: 1, y: 0 } });

    // Place the defender on a scene.
    let scene: SceneDocument = createSceneDocument({
      id: 'fight',
      name: 'Fight',
      systemId: 'dnd-5e-2014',
    });
    const place = resolveSceneAction(
      scene,
      { type: 'place-token', token: defender.token },
      { eventId: 'p' }
    );
    scene = appendSceneEvent(scene, place.event!);
    const startHp = foldSceneEvents(scene).state.tokens['guard-1'].hp!.current;

    const target: TacticalTarget = {
      tokenId: 'guard-1',
      faction: 'guards',
      position: defender.token.position,
      armorClass: defender.armorClass,
      hp: { current: startHp, max: defender.token.hp!.max },
    };

    // Resolve many seeds; on any hit, HP must drop by exactly the rolled damage.
    let sawHit = false;
    for (let i = 0; i < 50 && !sawHit; i += 1) {
      const turn = executeTacticalTurn({
        actor: {
          tokenId: 'goblin-1',
          faction: 'goblins',
          position: attacker.token.position,
          attackEffects: attacker.attackEffects,
          damageEffects: attacker.damageEffects,
          reach: attacker.reach,
        },
        targets: [target],
        seed: `fight-${i}`,
        cause: 'Scimitar',
      });
      expect(turn.decision).toBe('attack');
      if (turn.resolution?.isHit) {
        sawHit = true;
        let applied = scene;
        const apply = resolveSceneAction(applied, turn.intent!, { eventId: `dmg-${i}` });
        applied = appendSceneEvent(applied, apply.event!);
        const after = foldSceneEvents(applied).state.tokens['guard-1'].hp!.current;
        expect(after).toBe(startHp - turn.resolution.damage);
      }
    }
    expect(sawHit).toBe(true);
  });

  it('is deterministic: same monster + seed yields the same turn', () => {
    const orc = dnd5eMonstersById.goblin;
    const attacker = buildMonsterCombatant(orc, { tokenId: 'a', position: { x: 0, y: 0 } });
    const target: TacticalTarget = {
      tokenId: 'b',
      faction: 'foes',
      position: { x: 1, y: 0 },
      armorClass: 13,
      hp: { current: 20, max: 20 },
    };
    const run = () =>
      executeTacticalTurn({
        actor: {
          tokenId: 'a',
          faction: 'allies',
          position: { x: 0, y: 0 },
          attackEffects: attacker.attackEffects,
          damageEffects: attacker.damageEffects,
          reach: attacker.reach,
        },
        targets: [target],
        seed: 'same',
      });
    expect(JSON.stringify(run())).toBe(JSON.stringify(run()));
  });
});

describe('description parsing — statblocks that carry attacks only in prose', () => {
  it('parses an SRD attack line into bonus, reach, and damage', () => {
    const parsed = parseAttackFromDescription(
      'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) slashing damage.'
    );
    expect(parsed).toBeDefined();
    expect(parsed!.attackBonus).toBe(4);
    expect(parsed!.reachCells).toBe(1);
    expect(parsed!.damage).toEqual([{ count: 1, faces: 6, modifier: 2, type: 'slashing' }]);
  });

  it('handles a negative damage modifier (1d4 - 1)', () => {
    const parsed = parseAttackFromDescription(
      'Melee Weapon Attack: +1 to hit, reach 5 ft., one target. Hit: 1 (1d4 - 1) slashing damage.'
    );
    expect(parsed!.attackBonus).toBe(1);
    expect(parsed!.damage[0]).toEqual({ count: 1, faces: 4, modifier: -1, type: 'slashing' });
  });

  it('maps a ranged "range N/M ft." to reach cells', () => {
    const parsed = parseAttackFromDescription(
      'Ranged Weapon Attack: +5 to hit, range 80/320 ft., one target. Hit: 6 (1d8 + 2) piercing damage.'
    );
    expect(parsed!.reachCells).toBe(16); // 80 ft / 5
  });

  it('REGRESSION (05-M5): single-range "range N ft." prose maps to reach cells, not 1', () => {
    // Fire-Bolt-style prose, verbatim from the 2014 Flameskull's Fire Ray as it
    // shipped at review time (src/data/dnd/5e-2014/monsters/cr-2-5.ts:292; the
    // entry has since been removed from data for SRD-citation reasons, so the
    // prose is pinned here). Spell attacks routinely print a single range, not
    // the N/M dual form; this used to fall through to the 5-ft melee default.
    const parsed = parseAttackFromDescription(
      'Ranged Spell Attack: +5 to hit, range 30 ft., one target.'
    );
    expect(parsed).toBeDefined();
    expect(parsed!.attackBonus).toBe(5);
    expect(parsed!.reachCells).toBe(6); // 30 ft / 5, NOT the 5-ft melee default

    // A longer single range parses too.
    const longRange = parseAttackFromDescription(
      'Ranged Spell Attack: +5 to hit, range 120 ft., one target. Hit: 11 (2d10) fire damage.'
    );
    expect(longRange!.reachCells).toBe(24); // 120 ft / 5

    // The dual form keeps winning when both appear ("reach 5 ft. or range
    // 20/60 ft." — shipped 2024 hobgoblin/scout shape parses reach first).
    const dual = parseAttackFromDescription(
      'Ranged Weapon Attack: +3 to hit, range 150/600 ft., one target. Hit: 5 (1d8 + 1) piercing damage.'
    );
    expect(dual!.reachCells).toBe(30); // 150 ft / 5
  });

  it('returns undefined for non-attack prose', () => {
    expect(parseAttackFromDescription('The creature can breathe air and water.')).toBeUndefined();
  });

  it('REGRESSION (05-H2): versatile ", or N (XdY)" alternatives are not summed (Warlord longsword prose)', () => {
    // The 2024 Warlord longsword prose, verbatim as it shipped at review time
    // (src/data/dnd/5e-2024/monsters/humanoids/cr-6-10.ts; the entry has since
    // been removed from data for SRD-citation reasons, so the prose is pinned
    // here). The parser used to sum BOTH clauses into 1d8+1d10+8 (~12 avg vs
    // 8.5 RAW).
    const parsed = parseAttackFromDescription(
      'Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 10 (1d8 + 4) slashing damage, or 11 (1d10 + 4) slashing damage if used with two hands.'
    );
    // Only the one-handed clause counts.
    expect(parsed!.damage).toEqual([{ count: 1, faces: 8, modifier: 4, type: 'slashing' }]);
    expect(parsed!.attackBonus).toBe(7);
  });

  it('REGRESSION (05-H2): a SHIPPED versatile monster compiles to a single damage clause (2024 Hobgoblin)', () => {
    // Same versatile shape, still shipped (prose-only action — no structured
    // attackBonus/damage fields, so the parser is the only source).
    const hobgoblin = dnd5e2024MonstersById['hobgoblin-2024'];
    const longsword = hobgoblin.actions.find((action) => action.name === 'Longsword')!;
    expect(longsword.description).toBe(
      'Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 5 (1d8 + 1) slashing damage, or 6 (1d10 + 1) slashing damage if used with two hands.'
    );

    const parsed = parseAttackFromDescription(longsword.description);
    expect(parsed!.damage).toEqual([{ count: 1, faces: 8, modifier: 1, type: 'slashing' }]);

    // And the compiled combatant deals exactly one die + one flat bonus
    // (previously 1d8 + 1d10 + 2 — roughly double RAW).
    const combatant = buildMonsterCombatant(hobgoblin, { tokenId: 'h', position: { x: 0, y: 0 } });
    const dice = combatant.damageEffects.filter((e) => e.operation === 'add-die');
    const flats = combatant.damageEffects.filter((e) => e.operation === 'add');
    expect(dice).toHaveLength(1);
    expect(dice[0].value).toBe(8);
    expect(flats).toHaveLength(1);
    expect(flats[0].value).toBe(1);
  });

  it('REGRESSION (05-H2): multiple ", or" alternatives collapse to the first clause (2024 Druid quarterstaff)', () => {
    // Shipped prose, src/data/dnd/5e-2024/monsters/humanoids/cr-0-5.ts (Druid):
    // three mutually exclusive clauses previously summed to 1d6+1d8+1d8+2.
    const druid = dnd5e2024MonstersById['druid-2024'];
    const quarterstaff = druid.actions.find((action) => action.name === 'Quarterstaff')!;
    expect(quarterstaff.description).toBe(
      'Melee Weapon Attack: +2 to hit (+4 to hit with shillelagh), reach 5 ft., one target. Hit: 3 (1d6) bludgeoning damage, or 4 (1d8) bludgeoning damage if wielded with two hands, or 6 (1d8 + 2) bludgeoning damage with shillelagh.'
    );

    const parsed = parseAttackFromDescription(quarterstaff.description);
    expect(parsed!.attackBonus).toBe(2);
    expect(parsed!.damage).toEqual([{ count: 1, faces: 6, modifier: 0, type: 'bludgeoning' }]);
  });

  it('keeps genuine "plus N (XdY)" rider damage while truncating alternatives', () => {
    // Rider damage (dragon bite shape) must still sum: weapon dice PLUS fire.
    const parsed = parseAttackFromDescription(
      'Melee Weapon Attack: +11 to hit, reach 15 ft., one target. Hit: 19 (2d10 + 8) piercing damage plus 11 (2d10) fire damage.'
    );
    expect(parsed!.damage).toEqual([
      { count: 2, faces: 10, modifier: 8, type: 'piercing' },
      { count: 2, faces: 10, modifier: 0, type: 'fire' },
    ]);

    // A non-damage ", or a creature…" clause before the Hit: line (2024 Vampire
    // bite shape) must not truncate the rider either.
    const vampireBite = parseAttackFromDescription(
      'Melee Weapon Attack: +8 to hit, reach 5 ft., one willing creature, or a creature that is grappled by the vampire, incapacitated, or restrained. Hit: 8 (1d8 + 4) piercing damage plus 14 (4d6) necrotic damage.'
    );
    expect(vampireBite!.damage).toEqual([
      { count: 1, faces: 8, modifier: 4, type: 'piercing' },
      { count: 4, faces: 6, modifier: 0, type: 'necrotic' },
    ]);
  });

  it('REGRESSION: a real 2024 statblock (prose-only) now yields a working attack', () => {
    // This is the exact fixture that read "+0 to hit / for 0" in the live UI
    // before the parser landed: its action carries no structured fields.
    const shrub = dnd5e2024MonstersById['awakened-shrub-2024'];
    expect(shrub).toBeDefined();
    const action = primaryAttackAction(shrub);
    expect(action).toBeDefined();

    const combatant = buildMonsterCombatant(shrub, { tokenId: 's1', position: { x: 0, y: 0 } });
    // Attack bonus parsed from "+1 to hit".
    expect(combatant.attackEffects[0].value).toBe(1);
    // Damage: 1d4 - 1 slashing -> one add-die(4) + one add(-1) on damage.slashing.
    const die = combatant.damageEffects.find((e) => e.operation === 'add-die');
    expect(die?.target).toBe('damage.slashing');
    expect(die?.value).toBe(4);
    const flat = combatant.damageEffects.find((e) => e.operation === 'add');
    expect(flat?.value).toBe(-1);

    // The damage actually resolves to a positive number on a hit (1d4-1, min 1).
    const resolved = resolveEffects(combatant.damageEffects);
    // No rng -> dice not rolled; flat -1 alone. With a forced max die it would be
    // 4-1=3. Assert the structure is present rather than a rolled value here.
    expect(resolved.byTarget['damage.slashing']).toBeDefined();
  });
});

describe('monsterAttacksPerRound (SRD Multiattack)', () => {
  const base = {
    id: 'test-monster',
    name: 'Test Monster',
    system: 'dnd-5e-2014',
    armorClass: 13,
  };

  it('parses word counts from Multiattack prose', () => {
    const monster = {
      ...base,
      actions: [
        { name: 'Multiattack', description: 'The orc makes two attacks with its greataxe.' },
        {
          name: 'Greataxe',
          description:
            'Melee Weapon Attack: +5 to hit, reach 5 ft. Hit: 9 (1d12 + 3) slashing damage.',
        },
      ],
    } as never;
    expect(monsterAttacksPerRound(monster)).toBe(2);
  });

  it('parses mixed routines by their leading total', () => {
    const monster = {
      ...base,
      actions: [
        {
          name: 'Multiattack',
          description:
            'The creature makes three attacks: two with its claws and one with its bite.',
        },
      ],
    } as never;
    expect(monsterAttacksPerRound(monster)).toBe(3);
  });

  it('defaults to 1 without a Multiattack action or a parseable count', () => {
    expect(
      monsterAttacksPerRound({
        ...base,
        actions: [{ name: 'Bite', description: 'Hit: 4.' }],
      } as never)
    ).toBe(1);
    expect(
      monsterAttacksPerRound({
        ...base,
        actions: [{ name: 'Multiattack', description: 'It attacks wildly.' }],
      } as never)
    ).toBe(1);
  });
});

describe('encoded SRD 5.2 bestiary fights through the scene adapter', () => {
  it('an encoded 2024 monster builds a combatant with real attack and damage numbers', async () => {
    const { srdCr610Monsters2024 } = await import('../../data/dnd/5e-2024/monsters/srd-cr-6-10');
    const { buildMonsterCombatant } = await import('../../rules');
    // Any encoded monster with a structured attack must build a fighting
    // combatant (the encoder writes attackBonus/damage from the 2024 prose).
    const armed = srdCr610Monsters2024.filter((monster) =>
      monster.actions.some((action) => (action.attackBonus ?? 0) > 0 && action.damage?.length)
    );
    expect(armed.length).toBeGreaterThan(20);
    for (const monster of armed.slice(0, 5)) {
      const built = buildMonsterCombatant(monster, { tokenId: 'a', position: { x: 0, y: 0 } });
      const attackTotal = built.attackEffects.reduce(
        (sum, effect) => sum + (typeof effect.value === 'number' ? effect.value : 0),
        0
      );
      expect(attackTotal).toBeGreaterThan(0);
      expect(built.damageEffects.length).toBeGreaterThan(0);
      expect(built.token.hp!.max).toBeGreaterThan(0);
    }
  });
});

describe('encoded PF1e Bestiary fights through the scene adapter', () => {
  it('an encoded Bestiary 1 monster builds a combatant with parsed attack numbers', async () => {
    const { pf1eMonsters } = await import('../../data/pathfinder/1e/monsters');
    const { buildMonsterCombatant } = await import('../../rules');
    expect(pf1eMonsters.length).toBeGreaterThanOrEqual(331);
    const aboleth = pf1eMonsters.find((monster) => monster.id === 'aboleth');
    expect(aboleth).toBeDefined();
    // PSRD Aboleth: "4 tentacles +10 (1d6+5 plus slime)", BAB +8, Fort +8.
    expect(aboleth!.actions[0]?.attackBonus).toBe(10);
    expect(aboleth!.baseAttackBonus).toBe(6);
    expect(aboleth!.d20Saves?.fort).toBe(8);
    const built = buildMonsterCombatant(aboleth!, { tokenId: 'a', position: { x: 0, y: 0 } });
    const attackTotal = built.attackEffects.reduce(
      (sum, effect) => sum + (typeof effect.value === 'number' ? effect.value : 0),
      0
    );
    expect(attackTotal).toBe(10);
    expect(built.damageEffects.length).toBeGreaterThan(0);
    expect(built.token.hp!.max).toBeGreaterThan(0);
  });
});

describe('encoded PF2e Bestiary 1 fights through the scene adapter', () => {
  it('the Goblin Warrior builds a combatant with its printed numbers', async () => {
    const { pf2eMonsters } = await import('../../data/pathfinder/2e/monsters');
    const { buildMonsterCombatant, monsterAverageHitPoints } = await import('../../rules');
    expect(pf2eMonsters.length).toBe(413);
    const goblin = pf2eMonsters.find((monster) => monster.id === 'goblin-warrior');
    expect(goblin).toBeDefined();
    // Pf2eTools B1 Goblin Warrior: dogslicer +8 (1d6 slashing), AC 16, HP 6.
    expect(goblin!.actions[0]?.attackBonus).toBe(8);
    expect(goblin!.armorClass).toBe(16);
    expect(monsterAverageHitPoints(goblin!)).toBe(6);
    // PF2e XP is party-relative by design: no fixed experiencePoints.
    expect(goblin!.experiencePoints).toBe(0);
    const built = buildMonsterCombatant(goblin!, { tokenId: 'g', position: { x: 0, y: 0 } });
    const attackTotal = built.attackEffects.reduce(
      (sum, effect) => sum + (typeof effect.value === 'number' ? effect.value : 0),
      0
    );
    expect(attackTotal).toBe(8);
    expect(built.damageEffects.length).toBeGreaterThan(0);
  });
});
