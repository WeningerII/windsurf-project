import { describe, expect, it } from 'vitest';
import { pf2eBackgrounds } from '../data/pathfinder/2e/backgrounds';
import { elf } from '../data/pathfinder/2e/ancestries/elf';
import { alchemist } from '../data/pathfinder/2e/classes/alchemist';
import { barbarian } from '../data/pathfinder/2e/classes/barbarian';
import { fighter } from '../data/pathfinder/2e/classes/fighter';
import { monk } from '../data/pathfinder/2e/classes/monk';
import { wizard } from '../data/pathfinder/2e/classes/wizard';
import { createDefaultPf2eData, Pf2eDataModel } from '../systems/pf2e/data-model';
import { Pf2eEngine } from '../systems/pf2e/engine';
import { CharacterDocument } from '../types/core/document';
import {
  applyPf2eAncestryTemplate,
  applyPf2eBackgroundTemplate,
  applyPf2eClassTemplate,
} from '../systems/pf2e/pf2eTemplate';

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
    // CRB heritage (no ability boosts — heritages never grant them).
    const cavernElf = elf.subraces?.find((heritage) => heritage.id === 'cavern');
    const acolyte = pf2eBackgrounds.find((background) => background.id === 'pf2e-bg-acolyte');

    if (!cavernElf || !acolyte) {
      throw new Error('Expected test content to exist.');
    }

    const baseDoc = makeDoc();
    const templated = applyPf2eBackgroundTemplate(
      applyPf2eAncestryTemplate(applyPf2eClassTemplate(baseDoc, wizard, 4), elf, cavernElf),
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

  it('preserves manually trained skills when the class changes (regression: data loss)', () => {
    // Train skills by hand the way the sheet's cycle button does (a 'manual'
    // source), plus one legacy entry with no source at all.
    const wizardDoc = applyPf2eClassTemplate(makeDoc(), wizard, 10);
    wizardDoc.system.skillProficiencies = {
      ...wizardDoc.system.skillProficiencies,
      athletics: { tier: 'expert', total: 0, source: ['manual'] },
      stealth: { tier: 'master', total: 0 },
    };

    const fighterDoc = applyPf2eClassTemplate(wizardDoc, fighter, 10, wizard);

    // Hand-trained skills survive the class swap…
    expect(fighterDoc.system.skillProficiencies.athletics).toMatchObject({ tier: 'expert' });
    expect(fighterDoc.system.skillProficiencies.stealth).toMatchObject({ tier: 'master' });
    // …while the wizard-granted skill is removed with its class.
    expect(fighterDoc.system.skillProficiencies.arcana).toBeUndefined();

    // Clearing the class entirely also keeps manual training.
    const clearedDoc = applyPf2eClassTemplate(fighterDoc, undefined, 10, fighter);
    expect(clearedDoc.system.skillProficiencies.athletics).toMatchObject({ tier: 'expert' });
    expect(clearedDoc.system.skillProficiencies.stealth).toMatchObject({ tier: 'master' });
  });

  it('pins CRB level-1 class profiles for alchemist, barbarian, and monk', () => {
    // CRB p.72: Alchemist — trained Perception; expert Fortitude AND Reflex,
    // trained Will.
    const alchemistDoc = applyPf2eClassTemplate(makeDoc(), alchemist, 1);
    expect(alchemistDoc.system.perceptionProficiency.tier).toBe('trained');
    expect(alchemistDoc.system.saveProficiencies).toMatchObject({
      fortitude: { tier: 'expert' },
      reflex: { tier: 'expert' },
      will: { tier: 'trained' },
    });

    // CRB p.83: Barbarian — expert Perception; expert Fort, trained Reflex,
    // expert Will.
    const barbarianDoc = applyPf2eClassTemplate(makeDoc(), barbarian, 1);
    expect(barbarianDoc.system.perceptionProficiency.tier).toBe('expert');
    expect(barbarianDoc.system.saveProficiencies).toMatchObject({
      fortitude: { tier: 'expert' },
      reflex: { tier: 'trained' },
      will: { tier: 'expert' },
    });

    // CRB p.155: Monk — trained Perception at level 1; expert in all three
    // saves.
    const monkDoc = applyPf2eClassTemplate(makeDoc(), monk, 1);
    expect(monkDoc.system.perceptionProficiency.tier).toBe('trained');
    expect(monkDoc.system.saveProficiencies).toMatchObject({
      fortitude: { tier: 'expert' },
      reflex: { tier: 'expert' },
      will: { tier: 'expert' },
    });
  });

  it('grants a trained class DC on class application (CRB p.29)', () => {
    const fighterDoc = applyPf2eClassTemplate(makeDoc(), fighter, 1);
    expect(fighterDoc.system.classDcProficiency).toMatchObject({
      tier: 'trained',
      source: ['Fighter'],
    });
  });
});
