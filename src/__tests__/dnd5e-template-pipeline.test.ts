import { describe, expect, it } from 'vitest';
import { fighter } from '../data/dnd/5e-2014/classes/fighter';
import { wizard } from '../data/dnd/5e-2014/classes/wizard';
import { cleric } from '../data/dnd/5e-2014/classes/cleric';
import { elf } from '../data/dnd/5e-2014/species/elf';
import { human } from '../data/dnd/5e-2014/species/human';
import { createDefaultDnd5eData, Dnd5eDataModel } from '../systems/dnd5e/data-model';
import { Dnd5eEngine } from '../systems/dnd5e/engine';
import { CharacterDocument } from '../types/core/document';
import { applyDnd5eClassTemplate } from '../systems/dnd5e/shared/classTemplate';
import { applyDnd5eSpeciesTemplate } from '../systems/dnd5e/shared/speciesTemplate';

function makeDoc(overrides: Partial<Dnd5eDataModel> = {}): CharacterDocument<Dnd5eDataModel> {
  return {
    id: 'pipeline-doc',
    name: 'Pipeline Hero',
    systemId: 'dnd-5e-2014',
    system: { ...createDefaultDnd5eData(), ...overrides },
    createdAt: new Date('2026-03-01T00:00:00.000Z'),
    updatedAt: new Date('2026-03-01T00:00:00.000Z'),
  };
}

describe('D&D 5e template pipeline', () => {
  const engine = new Dnd5eEngine();

  it('prepares a fighter plus elf character with correct derived stats', () => {
    const baseDoc = makeDoc({
      baseAttributes: { str: 10, dex: 10, con: 14, int: 10, wis: 10, cha: 10 },
    });
    const templated = applyDnd5eSpeciesTemplate(applyDnd5eClassTemplate(baseDoc, fighter, 3), elf);
    const prepared = engine.prepareData(templated);

    expect(prepared.system.level).toBe(3);
    expect(prepared.system.hitPoints.max).toBe(28);
    expect(prepared.system.hitDice).toEqual([
      { classId: 'fighter', die: 'd10', total: 3, remaining: 3 },
    ]);
    expect(prepared.system.armorClass).toBe(11);
    expect(prepared.system.savingThrowProficiencies).toEqual(['str', 'con']);
    expect(prepared.system.skillProficiencies.perception?.source).toContain('Elf');
  });

  it('prepares a wizard plus human character with seeded spell slots', () => {
    const templated = applyDnd5eSpeciesTemplate(
      applyDnd5eClassTemplate(makeDoc(), wizard, 3),
      human
    );
    const prepared = engine.prepareData(templated);

    expect(prepared.system.hitDice).toEqual([
      { classId: 'wizard', die: 'd6', total: 3, remaining: 3 },
    ]);
    expect(prepared.system.spellcasting?.classes).toMatchObject([
      { classId: 'wizard', ability: 'int', spellcastingLevel: 3 },
    ]);
    expect(prepared.system.spellcasting?.spellSlots[1]).toEqual({ max: 4, used: 0 });
    expect(prepared.system.spellcasting?.spellSlots[2]).toEqual({ max: 2, used: 0 });
  });

  it('prepares multiclass full casters with combined spell slots and per-class hit dice', () => {
    const templated = applyDnd5eSpeciesTemplate(
      applyDnd5eClassTemplate(
        applyDnd5eClassTemplate(
          makeDoc({
            baseAttributes: { str: 10, dex: 10, con: 14, int: 14, wis: 14, cha: 10 },
          }),
          wizard,
          3
        ),
        cleric,
        2,
        { mode: 'add' }
      ),
      human
    );
    const prepared = engine.prepareData(templated);

    expect(prepared.system.level).toBe(5);
    expect(prepared.system.hitDice).toEqual([
      { classId: 'wizard', die: 'd6', total: 3, remaining: 3 },
      { classId: 'cleric', die: 'd8', total: 2, remaining: 2 },
    ]);
    expect(prepared.system.spellcasting?.classes).toMatchObject([
      { classId: 'wizard', ability: 'int', spellcastingLevel: 3 },
      { classId: 'cleric', ability: 'wis', spellcastingLevel: 2 },
    ]);
    expect(prepared.system.spellcasting?.spellSlots[1]).toEqual({ max: 4, used: 0 });
    expect(prepared.system.spellcasting?.spellSlots[2]).toEqual({ max: 3, used: 0 });
    expect(prepared.system.spellcasting?.spellSlots[3]).toEqual({ max: 2, used: 0 });
  });
});
