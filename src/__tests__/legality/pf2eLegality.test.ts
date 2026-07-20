/**
 * Build-legality (L9) behavioral tests for Pathfinder 2e.
 *
 * Anti-bootstrap: imports NOTHING from docs/compute-register/**. The legal
 * fixture is grounded in real Pf2eEngine.prepareData output; the illegal
 * fixtures push a single field past its PF2e CRB cap.
 */
import { describe, it, expect } from 'vitest';
import { Pf2eEngine } from '../../systems/pf2e/engine';
import { createDefaultPf2eData, type Pf2eDataModel } from '../../systems/pf2e/data-model';
import type { CharacterDocument } from '../../types/core/document';
import { validatePf2eBuild } from '../../rules/legality/pf2e';

const TEST_DATE = new Date('2026-05-01T00:00:00.000Z');

function doc(over: Partial<Pf2eDataModel>): CharacterDocument<Pf2eDataModel> {
  return {
    id: 'pf2e-legality',
    name: 'Legality Character',
    systemId: 'pf2e',
    system: { ...createDefaultPf2eData(), ...over },
    createdAt: TEST_DATE,
    updatedAt: TEST_DATE,
  };
}

const engine = new Pf2eEngine();

describe('pf2e build legality', () => {
  it('pf2e flags a level-1 ability score above 18', () => {
    // Level-1 character with every starting score at or below 18.
    const legal = engine.prepareData(
      doc({ level: 1, baseAttributes: { str: 18, dex: 14, con: 12, int: 10, wis: 10, cha: 8 } })
    ).system;
    const legalResult = validatePf2eBuild(legal);
    expect(legalResult.legal).toBe(true);
    expect(legalResult.violations.some((v) => v.rule === 'pf2e.L9.ability-score-cap')).toBe(false);

    const illegal: Pf2eDataModel = {
      ...legal,
      level: 1,
      baseAttributes: { ...legal.baseAttributes, str: 19 },
    };
    const result = validatePf2eBuild(illegal);
    expect(result.legal).toBe(false);
    expect(result.violations.some((v) => v.rule === 'pf2e.L9.ability-score-cap')).toBe(true);
    const v = result.violations.find((x) => x.rule === 'pf2e.L9.ability-score-cap');
    expect(v?.limit).toBe(18);
  });

  it('pf2e flags a proficiency total above the level-plus-tier budget', () => {
    const legal = engine.prepareData(doc({ level: 1 })).system;
    const legalResult = validatePf2eBuild(legal);
    expect(legalResult.legal).toBe(true);
    expect(legalResult.violations.some((v) => v.rule === 'pf2e.L9.proficiency-budget')).toBe(false);

    // A trained skill at level 1 may total at most level + 2 = 3; push it to 99.
    const illegal: Pf2eDataModel = {
      ...legal,
      level: 1,
      skillProficiencies: {
        ...legal.skillProficiencies,
        acrobatics: { tier: 'trained', total: 99 },
      },
    };
    const result = validatePf2eBuild(illegal);
    expect(result.legal).toBe(false);
    expect(result.violations.some((v) => v.rule === 'pf2e.L9.proficiency-budget')).toBe(true);
    const v = result.violations.find((x) => x.rule === 'pf2e.L9.proficiency-budget');
    expect(v?.limit).toBe(3);
  });
});
