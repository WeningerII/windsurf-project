import { describe, it, expect } from 'vitest';

import { dnd5e2024MonstersById } from '../../data/dnd/5e-2024/monsters';
import { createSeededRng } from '../../scene/seededRng';
import {
  monsterSaveActions,
  normalizeSaveAction,
  parseSaveActionFromDescription,
  resolveAreaEffect,
  saveActionDamageEffects,
  type SaveParticipant,
} from '../../rules';

/**
 * Save-based monster actions (breath weapons / AoE). The attack parser
 * deliberately excludes these; this is the complementary path that lets a dragon
 * actually breathe fire, resolved through the existing area/save resolver.
 */

describe('parseSaveActionFromDescription', () => {
  it('parses a breath weapon: DC, ability, half-on-save, and damage', () => {
    const parsed = parseSaveActionFromDescription(
      'The dragon exhales fire in a 15-foot cone. Each creature in that area must make a DC 11 Dexterity saving throw, taking 22 (5d8) fire damage on a failed save, or half as much on a successful one.'
    );
    expect(parsed).toBeDefined();
    expect(parsed!.saveAbility).toBe('dex');
    expect(parsed!.saveDC).toBe(11);
    expect(parsed!.halfOnSave).toBe(true);
    expect(parsed!.damage).toEqual([{ count: 5, faces: 8, modifier: 0, type: 'fire' }]);
  });

  it('a save that NEGATES (no "half as much") sets halfOnSave false', () => {
    const parsed = parseSaveActionFromDescription(
      'Each creature must make a DC 13 Constitution saving throw, taking 9 (2d8) poison damage on a failed save.'
    );
    expect(parsed!.halfOnSave).toBe(false);
  });

  it('returns undefined for a to-hit attack (not a save action)', () => {
    expect(
      parseSaveActionFromDescription(
        'Melee Weapon Attack: +5 to hit, reach 5 ft. Hit: 7 (1d8 + 3) slashing damage.'
      )
    ).toBeUndefined();
  });

  it('returns undefined for a save with no damage (a pure condition save)', () => {
    expect(
      parseSaveActionFromDescription(
        'Each creature must succeed on a DC 12 Wisdom saving throw or be frightened for 1 minute.'
      )
    ).toBeUndefined();
  });
});

describe('normalizeSaveAction — structured fields are authoritative', () => {
  it('uses structured savingThrow + damage when present', () => {
    const result = normalizeSaveAction({
      name: 'Acid Breath',
      description: 'irrelevant prose',
      savingThrow: { attribute: 'dex', dc: 14, effect: 'half as much damage on a success' },
      damage: [{ dice: { count: 6, die: 'd6', notation: '6d6' }, type: 'acid' }],
    });
    expect(result).toMatchObject({ saveAbility: 'dex', saveDC: 14, halfOnSave: true });
    expect(result!.damage).toEqual([{ count: 6, faces: 6, modifier: 0, type: 'acid' }]);
  });

  it('does not treat a to-hit attack as a save action', () => {
    expect(normalizeSaveAction({ name: 'Bite', description: 'x', attackBonus: 5 })).toBeUndefined();
  });
});

describe('a real shipped dragon breathes fire end to end (AoE resolver)', () => {
  it('Red Dragon Wyrmling Fire Breath: shared 5d8 roll, per-target Dex save, half on save', () => {
    const dragon = dnd5e2024MonstersById['red-dragon-wyrmling-2024'];
    expect(dragon).toBeDefined();

    const saves = monsterSaveActions(dragon);
    const breath = saves.find((s) => /breath/i.test(s.name));
    expect(breath).toBeDefined();
    expect(breath!.saveAbility).toBe('dex');
    expect(breath!.saveDC).toBe(11);
    expect(breath!.halfOnSave).toBe(true);

    // Feed the breath's damage effects into the area/save resolver.
    const participants: SaveParticipant[] = [
      { targetId: 'fighter', saveBonus: -100 }, // always fails -> full
      { targetId: 'rogue', saveBonus: 100 }, // always saves -> half
    ];
    const result = resolveAreaEffect({
      sourceId: 'dragon',
      seed: 'breath-1',
      damageEffects: breath!.damageEffects,
      saveDC: breath!.saveDC,
      halfOnSave: breath!.halfOnSave,
      participants,
    });

    // Shared damage rolled once (5d8 → between 5 and 40), shared across targets.
    expect(result.sharedDamage).toBeGreaterThanOrEqual(5);
    expect(result.sharedDamage).toBeLessThanOrEqual(40);
    const fighter = result.perTarget.find((p) => p.targetId === 'fighter')!;
    const rogue = result.perTarget.find((p) => p.targetId === 'rogue')!;
    expect(fighter.saved).toBe(false);
    expect(fighter.damageTaken).toBe(result.sharedDamage); // full
    expect(rogue.saved).toBe(true);
    expect(rogue.damageTaken).toBe(Math.floor(result.sharedDamage / 2)); // half
  });

  it('is deterministic: same dragon + seed yields the same breath result', () => {
    const dragon = dnd5e2024MonstersById['red-dragon-wyrmling-2024'];
    const breath = monsterSaveActions(dragon).find((s) => /breath/i.test(s.name))!;
    const run = () =>
      resolveAreaEffect({
        sourceId: 'd',
        seed: 'fixed',
        damageEffects: breath.damageEffects,
        saveDC: breath.saveDC,
        halfOnSave: breath.halfOnSave,
        participants: [{ targetId: 'a', saveBonus: 5 }],
      });
    expect(JSON.stringify(run())).toBe(JSON.stringify(run()));
  });

  it('saveActionDamageEffects emits add-die effects keyed to the damage type', () => {
    const dragon = dnd5e2024MonstersById['red-dragon-wyrmling-2024'];
    const breath = dragon.actions.find((a) => /breath/i.test(a.name))!;
    const effects = saveActionDamageEffects(dragon, breath);
    // 5d8 fire -> five add-die(8) on damage.fire.
    const dice = effects.filter((e) => e.operation === 'add-die');
    expect(dice).toHaveLength(5);
    expect(dice.every((e) => e.target === 'damage.fire' && e.value === 8)).toBe(true);
  });
});
