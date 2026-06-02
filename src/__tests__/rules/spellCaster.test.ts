import { describe, it, expect } from 'vitest';

import {
  casterSpellAreaActions,
  resolveSceneAreaEffect,
  spellAreaAction,
  spellSaveDC,
  type ResolveCombatStats,
} from '../../rules';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { Spell } from '../../types/magic/spells';
import type { SceneMarker, SceneState, SceneToken } from '../../types/core/scene';

/**
 * Player spellcasting → the scene area path: a save-based AoE spell (fireball)
 * becomes a SceneAreaAction and resolves through the same participant /
 * line-of-effect / per-system-save bridge a breath weapon uses.
 */

// A partial fireball, carrying only the fields the adapter reads.
const fireball = {
  id: 'fireball',
  name: 'Fireball',
  level: 3,
  areaOfEffect: { type: 'sphere', radius: 20 },
  savingThrow: { attribute: 'dex', success: 'half' },
  damage: { base: { count: 8, die: 'd6', notation: '8d6' }, type: 'fire' },
} as unknown as Spell;

const magicMissile = {
  id: 'magic-missile',
  name: 'Magic Missile',
  level: 1,
  damage: { base: { count: 1, die: 'd4', modifier: 1, notation: '1d4+1' }, type: 'force' },
} as unknown as Spell; // no area, no save → not an area action

/** Minimal caster: level, ability scores, and a spellcasting block. */
function caster(opts: {
  ability: string;
  score: number;
  level: number;
  known?: string[];
}): CharacterDocument<SystemDataModel> {
  return {
    id: 'wizard',
    name: 'Wizard',
    systemId: 'dnd-5e-2024',
    system: {
      level: opts.level,
      baseAttributes: { [opts.ability.toLowerCase()]: opts.score },
      spellcasting: {
        classes: [{ classId: 'wizard', ability: opts.ability, spellcastingLevel: opts.level }],
        spellsKnown: opts.known ?? [],
        spellsPrepared: [],
        spellSlots: {},
      },
    },
  } as unknown as CharacterDocument<SystemDataModel>;
}

describe('spellAreaAction', () => {
  it('converts fireball into a save-based area action', () => {
    const doc = caster({ ability: 'INT', score: 16, level: 5 }); // mod +3, prof +3
    const action = spellAreaAction(fireball, doc, 'dnd-5e-2024');
    expect(action).toBeDefined();
    expect(action!.name).toBe('Fireball');
    expect(action!.saveAbility).toBe('dex');
    expect(action!.saveDC).toBe(14); // 8 + 3 prof + 3 INT
    expect(action!.halfOnSave).toBe(true);
    expect(action!.area).toEqual({ type: 'sphere', radius: 20 });
    const dice = action!.damageEffects.filter((e) => e.operation === 'add-die');
    expect(dice).toHaveLength(8);
    expect(dice.every((e) => e.target === 'damage.fire' && e.value === 6)).toBe(true);
  });

  it('returns undefined for a spell without area/save/damage', () => {
    const doc = caster({ ability: 'INT', score: 16, level: 5 });
    expect(spellAreaAction(magicMissile, doc, 'dnd-5e-2024')).toBeUndefined();
  });
});

describe('spellSaveDC by system', () => {
  const doc = caster({ ability: 'CHA', score: 18, level: 9 }); // mod +4, prof +4
  it('5e: 8 + proficiency + ability', () => {
    expect(spellSaveDC(doc, fireball, 'dnd-5e-2024')).toBe(16); // 8 + 4 + 4
  });
  it('PF2e: 10 + proficiency + ability', () => {
    expect(spellSaveDC(doc, fireball, 'pf2e')).toBe(18); // 10 + 4 + 4
  });
  it('3.5e: 10 + spell level + ability', () => {
    expect(spellSaveDC(doc, fireball, 'dnd-3.5e')).toBe(17); // 10 + 3 + 4
  });
});

describe('casterSpellAreaActions', () => {
  it('lists only the known AoE damage spells', () => {
    const doc = caster({
      ability: 'INT',
      score: 16,
      level: 5,
      known: ['fireball', 'magic-missile'],
    });
    const spellsById = new Map<string, Spell>([
      ['fireball', fireball],
      ['magic-missile', magicMissile],
    ]);
    const actions = casterSpellAreaActions(doc, spellsById, 'dnd-5e-2024');
    expect(actions.map((a) => a.name)).toEqual(['Fireball']);
  });
});

describe('a PC casts fireball end to end (scene area bridge)', () => {
  function token(
    id: string,
    x: number,
    y: number,
    kind: SceneToken['kind'] = 'monster'
  ): SceneToken {
    return {
      id,
      name: id,
      kind,
      position: { x, y },
      size: 1,
      hp: { current: 30, max: 30, temp: 0 },
    };
  }
  function scene(tokens: SceneToken[], markers: SceneMarker[] = []): SceneState {
    return {
      sceneId: 's',
      name: 'S',
      systemId: 'dnd-5e-2024',
      grid: { width: 30, height: 30, cellSize: 5 },
      tokens: Object.fromEntries(tokens.map((t) => [t.id, t])),
      markers: Object.fromEntries(markers.map((m) => [m.id, m])),
      initiative: [],
      round: 1,
      seed: 'seed',
    };
  }
  const resolveStats: ResolveCombatStats = () => ({
    attackEffects: [],
    damageEffects: [],
    armorClass: 10,
    reach: 1,
    saveBonus: () => -100, // everyone fails → full damage, deterministic
  });

  it('catches every enemy in the 20-ft sphere and excludes one behind a wall', () => {
    const doc = caster({ ability: 'INT', score: 16, level: 5 });
    const action = spellAreaAction(fireball, doc, 'dnd-5e-2024')!;
    // Wizard at origin; sphere centered on (8,0). Goblins clustered there; one
    // shielded by a wall between the blast center and itself.
    const state = scene(
      [
        token('wizard', 0, 0, 'character'),
        token('g1', 8, 0),
        token('g2', 9, 0),
        token('g3', 11, 0), // behind the wall at (10,0) relative to center (8,0)
      ],
      [
        {
          id: 'w',
          kind: 'terrain',
          label: 'Wall',
          position: { x: 10, y: 0 },
          width: 1,
          height: 1,
          effects: [{ target: 'cover', operation: 'set', value: 'total', label: 'Wall' }],
        },
      ]
    );
    const out = resolveSceneAreaEffect({
      state,
      sourceId: 'wizard',
      action,
      aim: { x: 8, y: 0 },
      resolveStats,
      seed: 'fb',
    });
    expect(out.affectedIds).toContain('g1');
    expect(out.affectedIds).toContain('g2');
    expect(out.affectedIds).not.toContain('g3'); // total cover from the blast point
    expect(out.affectedIds).not.toContain('wizard'); // the caster isn't caught
  });
});
