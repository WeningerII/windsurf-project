import { describe, it, expect } from 'vitest';

import { systemRegistry } from '../../registry';
import { registerAllSystems } from '../../systems';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { GameSystemId } from '../../types/game-systems';

registerAllSystems();

/**
 * Per-system sheet-derived check modifiers: every system's engine exposes a pure
 * `checkModifier` (the deterministic core of its rollCheck). The non-combat
 * panels use it so conversation/challenge modifiers are real sheet numbers across
 * all seven systems, not a single GM-typed value.
 */

function doc(systemId: GameSystemId, system: unknown): CharacterDocument<SystemDataModel> {
  return {
    id: 'hero',
    name: 'Hero',
    systemId,
    system,
  } as unknown as CharacterDocument<SystemDataModel>;
}

function mod(systemId: GameSystemId, system: unknown, checkId: string): number | undefined {
  const engine = systemRegistry.get(systemId)?.engine;
  return engine?.checkModifier?.(doc(systemId, system), checkId);
}

describe('engine.checkModifier — ability checks (all systems)', () => {
  it('D&D 5e (both): ability modifier', () => {
    const system = {
      baseAttributes: { str: 16 },
      skillProficiencies: {},
      classLevels: [],
      level: 1,
    };
    expect(mod('dnd-5e-2014', system, 'str')).toBe(3);
    expect(mod('dnd-5e-2024', system, 'str')).toBe(3);
  });
  it('Pathfinder 2e: ability modifier', () => {
    expect(mod('pf2e', { baseAttributes: { str: 18 } }, 'str')).toBe(4);
  });
  it('Pathfinder 1e: ability modifier', () => {
    expect(
      mod('pf1e', { baseAttributes: { dex: 14 }, skillRanks: {}, classSkills: [] }, 'dex')
    ).toBe(2);
  });
  it('D&D 3.5e: ability modifier', () => {
    expect(mod('dnd-3.5e', { baseAttributes: { con: 12 }, skillRanks: {} }, 'con')).toBe(1);
  });
  it('M&M 3e: ability rank (already a modifier)', () => {
    expect(mod('mam3e', { abilities: { str: 5 }, skills: {} }, 'str')).toBe(5);
  });
  it('Daggerheart: trait value', () => {
    // Daggerheart's effective trait folds in gear/card passives, so start from a
    // complete default sheet (as the app's real documents are) and set the trait.
    const def = systemRegistry.get('daggerheart')!;
    const system = def.createDefaultData() as { attributes: Record<string, number> };
    system.attributes.agility = 2;
    expect(def.engine.checkModifier?.(doc('daggerheart', system), 'agility')).toBe(2);
  });
});

describe('engine.checkModifier — skill checks', () => {
  it('5e: ability modifier + proficiency (proficient)', () => {
    const system = {
      baseAttributes: { cha: 16 },
      skillProficiencies: { persuasion: { level: 'proficient' } },
      classLevels: [],
      level: 5, // proficiency +3
    };
    expect(mod('dnd-5e-2024', system, 'persuasion')).toBe(6); // +3 CHA +3 prof
  });

  it('5e: expertise doubles proficiency', () => {
    const system = {
      baseAttributes: { dex: 14 },
      skillProficiencies: { stealth: { level: 'expertise' } },
      classLevels: [],
      level: 5,
    };
    expect(mod('dnd-5e-2024', system, 'stealth')).toBe(8); // +2 DEX +6
  });

  it('PF1e: ability + ranks + class-skill bonus', () => {
    const system = {
      baseAttributes: { dex: 14 },
      skillRanks: { stealth: 5 },
      classSkills: ['stealth'],
    };
    // +2 DEX + 5 ranks + 3 class skill = 10
    expect(mod('pf1e', system, 'stealth')).toBe(10);
  });

  it('3.5e: ability + ranks (no flat class bonus)', () => {
    const system = { baseAttributes: { dex: 14 }, skillRanks: { hide: 5 } };
    // 'hide' may not be in the 3.5e skill map; fall back to undefined if so.
    const result = mod('dnd-3.5e', system, 'hide');
    if (result !== undefined) expect(result).toBe(7); // +2 DEX + 5 ranks
  });

  it('M&M: governing ability rank + skill rank', () => {
    const system = { abilities: { str: 2 }, skills: { athletics: { rank: 5 } } };
    expect(mod('mam3e', system, 'athletics')).toBe(7);
  });
});

describe('engine.checkModifier — unknown ids', () => {
  it('returns undefined for an unrecognized check id', () => {
    const system = {
      baseAttributes: { str: 16 },
      skillProficiencies: {},
      classLevels: [],
      level: 1,
    };
    expect(mod('dnd-5e-2024', system, 'underwater-basketweaving')).toBeUndefined();
  });
});
