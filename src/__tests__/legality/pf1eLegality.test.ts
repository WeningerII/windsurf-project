/**
 * Build-legality (L9) behavioral tests for Pathfinder 1e.
 *
 * Anti-bootstrap: imports NOTHING from docs/compute-register/**. The legal
 * fixture is grounded in real Pf1eEngine.prepareData output; the illegal
 * fixtures push a single field past its PF1e CRB cap.
 */
import { describe, it, expect } from 'vitest';
import { Pf1eEngine } from '../../systems/pf1e/engine';
import {
  createDefaultPf1eData,
  type Pf1eClassLevel,
  type Pf1eDataModel,
} from '../../systems/pf1e/data-model';
import type { CharacterDocument } from '../../types/core/document';
import { validatePf1eBuild } from '../../rules/legality/pf1e';

const TEST_DATE = new Date('2026-05-01T00:00:00.000Z');

function classLevel(level: number): Pf1eClassLevel {
  return {
    classId: 'rogue',
    level,
    hitDieRolls: Array.from({ length: level }, () => 8),
    bab: 'three-quarter',
    fortSave: 'poor',
    refSave: 'good',
    willSave: 'poor',
    skillPointsPerLevel: 8,
    favoredClassBonus: 'skill',
  };
}

function doc(over: Partial<Pf1eDataModel>): CharacterDocument<Pf1eDataModel> {
  return {
    id: 'pf1e-legality',
    name: 'Legality Character',
    systemId: 'pf1e',
    system: { ...createDefaultPf1eData(), ...over },
    createdAt: TEST_DATE,
    updatedAt: TEST_DATE,
  };
}

// Level-3 rogue with two skills at the PF1e cap (ranks == character level = 3);
// class levels sum to 3.
const legalOver: Partial<Pf1eDataModel> = {
  level: 3,
  classLevels: [classLevel(3)],
  classSkills: ['stealth', 'acrobatics'],
  skillRanks: { stealth: 3, acrobatics: 3 },
};

const engine = new Pf1eEngine();

describe('pf1e build legality', () => {
  it('pf1e flags skill ranks above the character level', () => {
    const legal = engine.prepareData(doc(legalOver)).system;
    const legalResult = validatePf1eBuild(legal);
    expect(legalResult.legal).toBe(true);
    expect(legalResult.violations.some((v) => v.rule === 'pf1e.L9.skill-max-ranks')).toBe(false);

    // Stealth pushed to 4 (> character level 3). Class-skill status does not
    // raise the cap in PF1e — it only adds +3 to the bonus.
    const illegal: Pf1eDataModel = { ...legal, skillRanks: { ...legal.skillRanks, stealth: 4 } };
    const result = validatePf1eBuild(illegal);
    expect(result.legal).toBe(false);
    expect(result.violations.some((v) => v.rule === 'pf1e.L9.skill-max-ranks')).toBe(true);
    const v = result.violations.find((x) => x.rule === 'pf1e.L9.skill-max-ranks');
    expect(v?.limit).toBe(3);
  });

  it('pf1e flags class levels exceeding character level', () => {
    const legal = engine.prepareData(doc(legalOver)).system;
    expect(validatePf1eBuild(legal).legal).toBe(true);

    const illegal: Pf1eDataModel = {
      ...legal,
      level: 3,
      classLevels: [classLevel(3), classLevel(3)],
    };
    const result = validatePf1eBuild(illegal);
    expect(result.legal).toBe(false);
    expect(result.violations.some((v) => v.rule === 'pf1e.L9.class-level-sum')).toBe(true);
  });
});
