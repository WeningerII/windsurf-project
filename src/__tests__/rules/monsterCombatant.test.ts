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

  it('returns undefined for non-attack prose', () => {
    expect(parseAttackFromDescription('The creature can breathe air and water.')).toBeUndefined();
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
