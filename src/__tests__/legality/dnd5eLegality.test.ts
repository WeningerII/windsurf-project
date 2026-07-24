/**
 * Build-legality (L9) behavioral tests for D&D 5e — both editions.
 *
 * Anti-bootstrap: imports NOTHING from docs/compute-register/**. Each rule pairs
 * a genuinely-legal fixture (grounded in real Engine.prepareData output) against
 * a hand-constructed illegal fixture pushed one field past its cap.
 */
import { describe, it, expect } from 'vitest';
import { Dnd5eEngine } from '../../systems/dnd5e/engine';
import { Dnd5e2024Engine } from '../../systems/dnd5e-2024/engine';
import { createDefaultDnd5eData, type Dnd5eDataModel } from '../../systems/dnd5e/data-model';
import type { CharacterDocument } from '../../types/core/document';
import { validateDnd5eBuild } from '../../rules/legality/dnd5e';

const TEST_DATE = new Date('2026-05-01T00:00:00.000Z');

function doc(
  systemId: 'dnd-5e-2014' | 'dnd-5e-2024',
  over: Partial<Dnd5eDataModel>
): CharacterDocument<Dnd5eDataModel> {
  return {
    id: 'dnd5e-legality',
    name: 'Legality Character',
    systemId,
    system: { ...createDefaultDnd5eData(), ...over },
    createdAt: TEST_DATE,
    updatedAt: TEST_DATE,
  };
}

// A genuinely-legal level-3 fighter: sum of class levels == character level,
// every ability at or below 20.
const legalOver: Partial<Dnd5eDataModel> = {
  level: 3,
  classLevels: [{ classId: 'fighter', level: 3, hitDieRolls: [10, 6, 6] }],
  baseAttributes: { str: 16, dex: 14, con: 14, int: 10, wis: 12, cha: 8 },
};

const engine2014 = new Dnd5eEngine();
const engine2024 = new Dnd5e2024Engine();

function feat(id: string): Dnd5eDataModel['feats'][number] {
  return { id, name: id, description: '', source: 'SRD' };
}

describe('dnd5e 2014 build legality', () => {
  it('dnd5e 2014 flags a base ability score above 20', () => {
    const legal = engine2014.prepareData(doc('dnd-5e-2014', legalOver)).system;
    const legalResult = validateDnd5eBuild(legal, 'dnd-5e-2014');
    expect(legalResult.legal).toBe(true);
    expect(legalResult.violations.some((v) => v.rule === 'dnd5e2014.L9.ability-score-cap')).toBe(
      false
    );

    const illegal: Dnd5eDataModel = {
      ...legal,
      baseAttributes: { ...legal.baseAttributes, str: 21 },
    };
    const result = validateDnd5eBuild(illegal, 'dnd-5e-2014');
    expect(result.legal).toBe(false);
    expect(result.violations.some((v) => v.rule === 'dnd5e2014.L9.ability-score-cap')).toBe(true);
  });

  it('dnd5e 2014 flags more feats than granted ASI slots', () => {
    // Fighter 6 grants 2 ASI slots (levels 4 and 6). One feat is legal.
    const base: Partial<Dnd5eDataModel> = {
      level: 6,
      classLevels: [{ classId: 'fighter', level: 6, hitDieRolls: [10, 6, 6, 6, 6, 6] }],
      baseAttributes: { str: 16, dex: 14, con: 14, int: 10, wis: 12, cha: 8 },
    };
    const legal = engine2014.prepareData(doc('dnd-5e-2014', base)).system;
    const legalResult = validateDnd5eBuild({ ...legal, feats: [feat('grappler')] }, 'dnd-5e-2014');
    expect(legalResult.violations.some((v) => v.rule === 'dnd5e2014.L7.asi-feat-cadence')).toBe(
      false
    );

    // Three feats exceed the 2 granted slots.
    const illegal: Dnd5eDataModel = {
      ...legal,
      feats: [feat('a'), feat('b'), feat('c')],
    };
    const result = validateDnd5eBuild(illegal, 'dnd-5e-2014');
    expect(result.legal).toBe(false);
    expect(result.violations.some((v) => v.rule === 'dnd5e2014.L7.asi-feat-cadence')).toBe(true);
  });

  it('dnd5e 2014 flags a multiclass build missing an ability prerequisite', () => {
    // Fighter (Str 13 OR Dex 13) + Wizard (Int 13). Legal build meets both.
    const legalMc: Partial<Dnd5eDataModel> = {
      level: 3,
      classLevels: [
        { classId: 'fighter', level: 2, hitDieRolls: [10, 6] },
        { classId: 'wizard', level: 1, hitDieRolls: [6] },
      ],
      baseAttributes: { str: 16, dex: 14, con: 14, int: 13, wis: 12, cha: 8 },
    };
    const legal = engine2014.prepareData(doc('dnd-5e-2014', legalMc)).system;
    const legalResult = validateDnd5eBuild(legal, 'dnd-5e-2014');
    expect(legalResult.violations.some((v) => v.rule === 'dnd5e2014.L9.multiclass-prereq')).toBe(
      false
    );

    // Drop Int below 13 → Wizard prerequisite fails.
    const illegal: Dnd5eDataModel = {
      ...legal,
      baseAttributes: { ...legal.baseAttributes, int: 10 },
    };
    const result = validateDnd5eBuild(illegal, 'dnd-5e-2014');
    expect(result.legal).toBe(false);
    expect(result.violations.some((v) => v.rule === 'dnd5e2014.L9.multiclass-prereq')).toBe(true);
  });

  it('dnd5e 2014 flags class levels exceeding character level', () => {
    const legal = engine2014.prepareData(doc('dnd-5e-2014', legalOver)).system;
    expect(validateDnd5eBuild(legal, 'dnd-5e-2014').legal).toBe(true);

    const illegal: Dnd5eDataModel = {
      ...legal,
      level: 3,
      classLevels: [
        { classId: 'fighter', level: 3, hitDieRolls: [10, 6, 6] },
        { classId: 'wizard', level: 2, hitDieRolls: [6, 4] },
      ],
    };
    const result = validateDnd5eBuild(illegal, 'dnd-5e-2014');
    expect(result.legal).toBe(false);
    expect(result.violations.some((v) => v.rule === 'dnd5e2014.L9.class-level-sum')).toBe(true);
  });
});

describe('dnd5e 2024 build legality', () => {
  it('dnd5e 2024 flags a base ability score above 20', () => {
    const legal = engine2024.prepareData(doc('dnd-5e-2024', legalOver)).system;
    const legalResult = validateDnd5eBuild(legal, 'dnd-5e-2024');
    expect(legalResult.legal).toBe(true);
    expect(legalResult.violations.some((v) => v.rule === 'dnd5e2024.L9.ability-score-cap')).toBe(
      false
    );

    const illegal: Dnd5eDataModel = {
      ...legal,
      baseAttributes: { ...legal.baseAttributes, dex: 22 },
    };
    const result = validateDnd5eBuild(illegal, 'dnd-5e-2024');
    expect(result.legal).toBe(false);
    expect(result.violations.some((v) => v.rule === 'dnd5e2024.L9.ability-score-cap')).toBe(true);
  });

  it('dnd5e 2024 flags more feats than granted ASI slots', () => {
    // Rogue 10 grants 3 ASI slots (levels 4, 8, 10). Two feats are legal.
    const base: Partial<Dnd5eDataModel> = {
      level: 10,
      classLevels: [{ classId: 'rogue', level: 10, hitDieRolls: [8, 5, 5, 5, 5, 5, 5, 5, 5, 5] }],
      baseAttributes: { str: 8, dex: 16, con: 14, int: 12, wis: 12, cha: 10 },
    };
    const legal = engine2024.prepareData(doc('dnd-5e-2024', base)).system;
    const legalResult = validateDnd5eBuild(
      { ...legal, feats: [feat('a'), feat('b')] },
      'dnd-5e-2024'
    );
    expect(legalResult.violations.some((v) => v.rule === 'dnd5e2024.L7.asi-feat-cadence')).toBe(
      false
    );

    // Four feats exceed the 3 granted slots.
    const illegal: Dnd5eDataModel = {
      ...legal,
      feats: [feat('a'), feat('b'), feat('c'), feat('d')],
    };
    const result = validateDnd5eBuild(illegal, 'dnd-5e-2024');
    expect(result.legal).toBe(false);
    expect(result.violations.some((v) => v.rule === 'dnd5e2024.L7.asi-feat-cadence')).toBe(true);
  });

  it('dnd5e 2024 flags a multiclass build missing an ability prerequisite', () => {
    const legalMc: Partial<Dnd5eDataModel> = {
      level: 3,
      classLevels: [
        { classId: 'rogue', level: 2, hitDieRolls: [8, 5] },
        { classId: 'sorcerer', level: 1, hitDieRolls: [6] },
      ],
      baseAttributes: { str: 8, dex: 16, con: 14, int: 10, wis: 12, cha: 14 },
    };
    const legal = engine2024.prepareData(doc('dnd-5e-2024', legalMc)).system;
    const legalResult = validateDnd5eBuild(legal, 'dnd-5e-2024');
    expect(legalResult.violations.some((v) => v.rule === 'dnd5e2024.L9.multiclass-prereq')).toBe(
      false
    );

    // Drop Cha below 13 → Sorcerer prerequisite fails.
    const illegal: Dnd5eDataModel = {
      ...legal,
      baseAttributes: { ...legal.baseAttributes, cha: 11 },
    };
    const result = validateDnd5eBuild(illegal, 'dnd-5e-2024');
    expect(result.legal).toBe(false);
    expect(result.violations.some((v) => v.rule === 'dnd5e2024.L9.multiclass-prereq')).toBe(true);
  });

  it('dnd5e 2024 flags class levels exceeding character level', () => {
    const legal = engine2024.prepareData(doc('dnd-5e-2024', legalOver)).system;
    expect(validateDnd5eBuild(legal, 'dnd-5e-2024').legal).toBe(true);

    const illegal: Dnd5eDataModel = {
      ...legal,
      level: 3,
      classLevels: [{ classId: 'fighter', level: 7, hitDieRolls: [10, 6, 6, 6, 6, 6, 6] }],
    };
    const result = validateDnd5eBuild(illegal, 'dnd-5e-2024');
    expect(result.legal).toBe(false);
    expect(result.violations.some((v) => v.rule === 'dnd5e2024.L9.class-level-sum')).toBe(true);
  });
});
