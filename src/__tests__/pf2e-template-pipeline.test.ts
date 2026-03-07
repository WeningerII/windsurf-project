import { describe, expect, it } from 'vitest';
import { pf2eBackgrounds } from '../data/pathfinder/2e/backgrounds';
import { elf } from '../data/pathfinder/2e/ancestries/elf';
import { wizard } from '../data/pathfinder/2e/classes/wizard';
import { createDefaultPf2eData, Pf2eDataModel } from '../systems/pf2e/data-model';
import { Pf2eEngine } from '../systems/pf2e/engine';
import { CharacterDocument } from '../types/core/document';
import {
  applyPf2eAncestryTemplate,
  applyPf2eBackgroundTemplate,
  applyPf2eClassTemplate,
} from '../utils/pf2eTemplate';

function makeDoc(overrides: Partial<Pf2eDataModel> = {}): CharacterDocument<Pf2eDataModel> {
  return {
    id: 'pf2e-pipeline-doc',
    name: 'Pipeline Hero',
    systemId: 'pf2e',
    system: { ...createDefaultPf2eData(), ...overrides },
    createdAt: new Date('2026-03-05T00:00:00.000Z'),
    updatedAt: new Date('2026-03-05T00:00:00.000Z'),
  };
}

describe('PF2e template pipeline', () => {
  const engine = new Pf2eEngine();

  it('prepares a wizard plus elf acolyte with correct derived stats', () => {
    const highElf = elf.subraces?.find((heritage) => heritage.id === 'high-elf');
    const acolyte = pf2eBackgrounds.find((background) => background.id === 'pf2e-bg-acolyte');

    if (!highElf || !acolyte) {
      throw new Error('Expected test content to exist.');
    }

    const baseDoc = makeDoc();
    const templated = applyPf2eBackgroundTemplate(
      applyPf2eAncestryTemplate(applyPf2eClassTemplate(baseDoc, wizard, 4), elf, highElf),
      acolyte
    );
    const prepared = engine.prepareData(templated);

    expect(prepared.system.level).toBe(4);
    expect(prepared.system.keyAbility).toBe('int');
    expect(prepared.system.languages).toEqual(['Common', 'Elven']);
    expect(prepared.system.hitPoints.max).toBe(26);
    expect(prepared.system.armorClass).toBe(17);
    expect(prepared.system.spellcasting).toMatchObject({
      tradition: 'arcane',
      type: 'prepared',
      focusPoints: { current: 1, max: 1 },
    });
    expect(prepared.system.spellcasting?.spellSlots[1]).toEqual({ max: 3, used: 0 });
    expect(prepared.system.spellcasting?.spellSlots[2]).toEqual({ max: 2, used: 0 });
    expect(prepared.system.skillProficiencies.arcana.total).toBe(6);
    expect(prepared.system.skillProficiencies.religion.total).toBe(6);
    expect(prepared.system.loreProficiencies['scribing-lore'].total).toBe(6);
    expect(prepared.system.feats.some((feat) => feat.id === 'student-of-the-canon')).toBe(true);
  });
});
