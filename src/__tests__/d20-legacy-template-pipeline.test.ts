import { describe, expect, it } from 'vitest';
import { fighter as fighter35 } from '../data/dnd/3.5e/classes/fighter';
import { wizard as wizard35 } from '../data/dnd/3.5e/classes/wizard';
import { elf as elf35 } from '../data/dnd/3.5e/races/elf';
import { wizard as wizardPf1 } from '../data/pathfinder/1e/classes/wizard';
import { elf as elfPf1 } from '../data/pathfinder/1e/races/elf';
import { createDefaultDnd35eData, Dnd35eDataModel } from '../systems/dnd35e/data-model';
import { Dnd35eEngine } from '../systems/dnd35e/engine';
import { createDefaultPf1eData, Pf1eDataModel } from '../systems/pf1e/data-model';
import { Pf1eEngine } from '../systems/pf1e/engine';
import { CharacterDocument } from '../types/core/document';
import {
  applyD20LegacyClassTemplate,
  applyD20LegacyRaceTemplate,
} from '../utils/d20LegacyTemplate';

function make35Doc(overrides: Partial<Dnd35eDataModel> = {}): CharacterDocument<Dnd35eDataModel> {
  return {
    id: 'legacy-pipeline-35e',
    name: '3.5e Pipeline Hero',
    systemId: 'dnd-3.5e',
    system: { ...createDefaultDnd35eData(), ...overrides },
    createdAt: new Date('2026-03-06T00:00:00.000Z'),
    updatedAt: new Date('2026-03-06T00:00:00.000Z'),
  };
}

function makePf1Doc(overrides: Partial<Pf1eDataModel> = {}): CharacterDocument<Pf1eDataModel> {
  return {
    id: 'legacy-pipeline-pf1',
    name: 'PF1e Pipeline Hero',
    systemId: 'pf1e',
    system: { ...createDefaultPf1eData(), ...overrides },
    createdAt: new Date('2026-03-06T00:00:00.000Z'),
    updatedAt: new Date('2026-03-06T00:00:00.000Z'),
  };
}

describe('D20 legacy template pipeline', () => {
  it('prepares a D&D 3.5e fighter/elf character with derived combat stats', () => {
    const engine = new Dnd35eEngine();
    const templated = applyD20LegacyRaceTemplate(
      applyD20LegacyClassTemplate(
        make35Doc({
          baseAttributes: { str: 14, dex: 10, con: 12, int: 10, wis: 10, cha: 10 },
        }),
        fighter35,
        3
      ),
      elf35
    );
    const prepared = engine.prepareData(templated);

    expect(prepared.system.baseAttackBonus).toBe(3);
    expect(prepared.system.hitPoints.max).toBe(22);
    expect(prepared.system.armorClass.total).toBe(11);
    expect(prepared.system.grapple).toBe(5);
    expect(prepared.system.classSkills).toContain('climb');
  });

  it('prepares a PF1e wizard/elf character with spell slots and save progression', () => {
    const engine = new Pf1eEngine();
    const templated = applyD20LegacyRaceTemplate(
      applyD20LegacyClassTemplate(
        makePf1Doc({
          baseAttributes: { str: 10, dex: 10, con: 12, int: 14, wis: 12, cha: 10 },
        }),
        wizardPf1,
        3
      ),
      elfPf1
    );
    const prepared = engine.prepareData(templated);

    expect(prepared.system.baseAttackBonus).toBe(1);
    expect(prepared.system.hitPoints.max).toBe(17);
    expect(prepared.system.armorClass.total).toBe(11);
    expect(prepared.system.saves.will.total).toBe(4);
    expect(prepared.system.spellsPerDay?.[1]).toEqual({ total: 2, used: 0 });
    expect(prepared.system.spellsPerDay?.[2]).toEqual({ total: 1, used: 0 });
    expect(prepared.system.classSkills).toContain('spellcraft');
  });

  it('prepares a 3.5e fighter/wizard multiclass character with summed BAB and HP', () => {
    const engine = new Dnd35eEngine();
    const templated = applyD20LegacyRaceTemplate(
      applyD20LegacyClassTemplate(
        applyD20LegacyClassTemplate(
          make35Doc({
            baseAttributes: { str: 14, dex: 10, con: 12, int: 14, wis: 10, cha: 10 },
          }),
          fighter35,
          2
        ),
        wizard35,
        3,
        { mode: 'add' }
      ),
      elf35
    );
    const prepared = engine.prepareData(templated);

    expect(prepared.system.level).toBe(5);
    expect(prepared.system.baseAttackBonus).toBe(3);
    expect(prepared.system.hitPoints.max).toBe(26);
    expect(prepared.system.saves.fortitude.base).toBe(4);
    expect(prepared.system.saves.will.base).toBe(3);
    expect(prepared.system.classSkills).toEqual(
      expect.arrayContaining(['climb', 'concentration', 'spellcraft'])
    );
  });
});
