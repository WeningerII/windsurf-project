/**
 * Build-legality (L9) behavioral tests for D&D 3.5e.
 *
 * Anti-bootstrap: imports NOTHING from docs/compute-register/**. The legal
 * fixture is grounded in real Dnd35eEngine.prepareData output; the illegal
 * fixtures push a single field past its SRD 3.5 cap.
 */
import { describe, it, expect } from 'vitest';
import { Dnd35eEngine } from '../../systems/dnd35e/engine';
import {
  createDefaultDnd35eData,
  type Dnd35eClassLevel,
  type Dnd35eDataModel,
} from '../../systems/dnd35e/data-model';
import type { CharacterDocument } from '../../types/core/document';
import { validateDnd35eBuild } from '../../rules/legality/dnd35e';

const TEST_DATE = new Date('2026-05-01T00:00:00.000Z');

function classLevel(level: number): Dnd35eClassLevel {
  return {
    classId: 'fighter',
    level,
    hitDieRolls: Array.from({ length: level }, () => 10),
    bab: 'full',
    fortSave: 'good',
    refSave: 'poor',
    willSave: 'poor',
    skillPointsPerLevel: 2,
  };
}

function doc(over: Partial<Dnd35eDataModel>): CharacterDocument<Dnd35eDataModel> {
  return {
    id: 'dnd35e-legality',
    name: 'Legality Character',
    systemId: 'dnd-3.5e',
    system: { ...createDefaultDnd35eData(), ...over },
    createdAt: TEST_DATE,
    updatedAt: TEST_DATE,
  };
}

// Level-3 fighter: class-skill "climb" at the class cap (level+3 = 6),
// cross-class "hide" at its cap (⌊(level+3)/2⌋ = 3); class levels sum to 3.
const legalOver: Partial<Dnd35eDataModel> = {
  level: 3,
  classLevels: [classLevel(3)],
  classSkills: ['climb'],
  skillRanks: { climb: 6, hide: 3 },
};

const engine = new Dnd35eEngine();

describe('dnd35e build legality', () => {
  it('dnd35e flags skill ranks above the class-skill maximum', () => {
    const legal = engine.prepareData(doc(legalOver)).system;
    const legalResult = validateDnd35eBuild(legal);
    expect(legalResult.legal).toBe(true);
    expect(legalResult.violations.some((v) => v.rule === 'dnd35e.L9.skill-max-ranks')).toBe(false);

    // Class skill "climb" pushed to 7 (> level+3 = 6).
    const illegal: Dnd35eDataModel = { ...legal, skillRanks: { ...legal.skillRanks, climb: 7 } };
    const result = validateDnd35eBuild(illegal);
    expect(result.legal).toBe(false);
    expect(result.violations.some((v) => v.rule === 'dnd35e.L9.skill-max-ranks')).toBe(true);
    const v = result.violations.find((x) => x.rule === 'dnd35e.L9.skill-max-ranks');
    expect(v?.limit).toBe(6);
  });

  it('dnd35e flags class levels exceeding character level', () => {
    const legal = engine.prepareData(doc(legalOver)).system;
    expect(validateDnd35eBuild(legal).legal).toBe(true);

    const illegal: Dnd35eDataModel = {
      ...legal,
      level: 3,
      classLevels: [classLevel(3), classLevel(2)],
    };
    const result = validateDnd35eBuild(illegal);
    expect(result.legal).toBe(false);
    expect(result.violations.some((v) => v.rule === 'dnd35e.L9.class-level-sum')).toBe(true);
  });
});
