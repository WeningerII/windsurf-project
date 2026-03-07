import { describe, expect, it } from 'vitest';
import { fighter as fighter35 } from '../../data/dnd/3.5e/classes/fighter';
import { wizard as wizard35 } from '../../data/dnd/3.5e/classes/wizard';
import { elf as elf35 } from '../../data/dnd/3.5e/races/elf';
import { human as human35 } from '../../data/dnd/3.5e/races/human';
import { createDefaultDnd35eData, Dnd35eDataModel } from '../../systems/dnd35e/data-model';
import { createDefaultPf1eData, Pf1eDataModel } from '../../systems/pf1e/data-model';
import { CharacterDocument } from '../../types/core/document';
import {
  applyD20LegacyClassTemplate,
  applyD20LegacyRaceTemplate,
  removeD20LegacyClassTemplate,
} from '../../utils/d20LegacyTemplate';
import { wizard as wizardPf1 } from '../../data/pathfinder/1e/classes/wizard';
import { fighter as fighterPf1 } from '../../data/pathfinder/1e/classes/fighter';
import { halfling as halflingPf1 } from '../../data/pathfinder/1e/races/halfling';
import { human as humanPf1 } from '../../data/pathfinder/1e/races/human';
import { duelist as duelistPf1 } from '../../data/pathfinder/1e/prestige-classes/duelist';

function make35Doc(overrides: Partial<Dnd35eDataModel> = {}): CharacterDocument<Dnd35eDataModel> {
  return {
    id: 'd20-template-35e',
    name: 'Legacy Hero',
    systemId: 'dnd-3.5e',
    system: { ...createDefaultDnd35eData(), ...overrides },
    createdAt: new Date('2026-03-06T00:00:00.000Z'),
    updatedAt: new Date('2026-03-06T00:00:00.000Z'),
  };
}

function makePf1Doc(overrides: Partial<Pf1eDataModel> = {}): CharacterDocument<Pf1eDataModel> {
  return {
    id: 'd20-template-pf1',
    name: 'Pathfinder Hero',
    systemId: 'pf1e',
    system: { ...createDefaultPf1eData(), ...overrides },
    createdAt: new Date('2026-03-06T00:00:00.000Z'),
    updatedAt: new Date('2026-03-06T00:00:00.000Z'),
  };
}

describe('applyD20LegacyClassTemplate', () => {
  it('seeds 3.5e class progressions, hit dice, and class skills', () => {
    const updated = applyD20LegacyClassTemplate(make35Doc(), fighter35, 3);

    expect(updated.system.classLevels[0]).toMatchObject({
      classId: 'fighter',
      level: 3,
      hitDieRolls: [10, 6, 6],
      bab: 'full',
      fortSave: 'good',
      refSave: 'poor',
      willSave: 'poor',
      skillPointsPerLevel: 2,
    });
    expect(updated.system.classSkills).toEqual(fighter35.skillProficiencies.options);
    expect(updated.system.level).toBe(3);
    expect(updated.system.hitPoints).toMatchObject({ max: 22, current: 22 });
    expect(updated.system.features.map((feature) => feature.id)).toEqual([
      'bonus-feat-1',
      'bonus-feat-2',
      'fighter-3',
    ]);
  });

  it('replaces the primary 3.5e class cleanly when switching classes', () => {
    const fighterDoc = applyD20LegacyClassTemplate(make35Doc(), fighter35, 2);
    const wizardDoc = applyD20LegacyClassTemplate(fighterDoc, wizard35, 2);

    expect(wizardDoc.system.classLevels).toHaveLength(1);
    expect(wizardDoc.system.classLevels[0]).toMatchObject({
      classId: 'wizard',
      level: 2,
      hitDieRolls: [4, 3],
      bab: 'half',
      fortSave: 'poor',
      refSave: 'poor',
      willSave: 'good',
      skillPointsPerLevel: 2,
    });
    expect(wizardDoc.system.classSkills).toEqual(wizard35.skillProficiencies.options);
    expect(wizardDoc.system.hitPoints).toMatchObject({ max: 7, current: 7 });
    expect(wizardDoc.system.features.some((feature) => feature.id === 'bonus-feat-1')).toBe(false);
    expect(wizardDoc.system.features.map((feature) => feature.id)).toContain('spellcasting');
  });

  it('applies PF1e class profiles and favored-class defaults', () => {
    const updated = applyD20LegacyClassTemplate(makePf1Doc(), wizardPf1, 3);

    expect(updated.system.classLevels[0]).toMatchObject({
      classId: 'wizard',
      level: 3,
      hitDieRolls: [6, 4, 4],
      bab: 'half',
      fortSave: 'poor',
      refSave: 'poor',
      willSave: 'good',
      skillPointsPerLevel: 2,
      favoredClassBonus: 'hp',
    });
    expect(updated.system.classSkills).toContain('spellcraft');
    expect(updated.system.hitPoints).toMatchObject({ max: 17, current: 17 });
    expect(updated.system.features.map((feature) => feature.id)).toContain('arcane-bond');
  });

  it('applies vetted PF1e prestige-class profiles with the corrected hit die', () => {
    const updated = applyD20LegacyClassTemplate(makePf1Doc(), duelistPf1, 2);

    expect(updated.system.classLevels[0]).toMatchObject({
      classId: 'duelist',
      level: 2,
      hitDieRolls: [10, 6],
      bab: 'full',
      fortSave: 'poor',
      refSave: 'good',
      willSave: 'poor',
      skillPointsPerLevel: 4,
      favoredClassBonus: 'hp',
    });
    expect(updated.system.classSkills).toEqual(
      expect.arrayContaining(['acrobatics', 'bluff', 'sense-motive'])
    );
    expect(updated.system.hitPoints).toMatchObject({ max: 18, current: 18 });
    expect(updated.system.features.map((feature) => feature.id)).toEqual(
      expect.arrayContaining(['canny-defense', 'precise-strike', 'improved-reaction'])
    );
  });

  it('adds and removes 3.5e multiclass rows without clobbering other class progressions', () => {
    const fighterDoc = applyD20LegacyClassTemplate(make35Doc(), fighter35, 2);
    const multiclassDoc = applyD20LegacyClassTemplate(fighterDoc, wizard35, 3, {
      mode: 'add',
    });
    const strippedDoc = removeD20LegacyClassTemplate(multiclassDoc, 'wizard');

    expect(multiclassDoc.system.classLevels).toMatchObject([
      { classId: 'fighter', level: 2, hitDieRolls: [10, 6] },
      { classId: 'wizard', level: 3, hitDieRolls: [4, 3, 3] },
    ]);
    expect(multiclassDoc.system.level).toBe(5);
    expect(multiclassDoc.system.classSkills).toEqual(
      expect.arrayContaining(['climb', 'concentration', 'spellcraft'])
    );
    expect(multiclassDoc.system.features.map((feature) => feature.id)).toEqual(
      expect.arrayContaining(['bonus-feat-2', 'scribe-scroll', 'spellcasting'])
    );
    expect(strippedDoc.system.classLevels).toMatchObject([{ classId: 'fighter', level: 2 }]);
    expect(strippedDoc.system.level).toBe(2);
    expect(strippedDoc.system.classSkills).not.toContain('spellcraft');
    expect(strippedDoc.system.features.some((feature) => feature.id === 'scribe-scroll')).toBe(
      false
    );
  });

  it('updates PF1e multiclass rows in place and preserves the other class', () => {
    const wizardDoc = applyD20LegacyClassTemplate(makePf1Doc(), wizardPf1, 2);
    const multiclassDoc = applyD20LegacyClassTemplate(wizardDoc, fighterPf1, 1, {
      mode: 'add',
    });
    const updatedFighterDoc = applyD20LegacyClassTemplate(multiclassDoc, fighterPf1, 3, {
      mode: 'replace',
      targetClassId: 'fighter',
    });

    expect(multiclassDoc.system.classLevels).toMatchObject([
      { classId: 'wizard', level: 2, favoredClassBonus: 'hp' },
      { classId: 'fighter', level: 1, favoredClassBonus: 'hp' },
    ]);
    expect(updatedFighterDoc.system.classLevels).toMatchObject([
      { classId: 'wizard', level: 2, favoredClassBonus: 'hp' },
      { classId: 'fighter', level: 3, hitDieRolls: [10, 6, 6], favoredClassBonus: 'hp' },
    ]);
    expect(updatedFighterDoc.system.level).toBe(5);
    expect(updatedFighterDoc.system.classSkills).toEqual(
      expect.arrayContaining(['spellcraft', 'climb'])
    );
  });
});

describe('applyD20LegacyRaceTemplate', () => {
  it('swaps fixed D&D 3.5e racial ability adjustments on race change', () => {
    const elfDoc = applyD20LegacyRaceTemplate(make35Doc(), elf35);
    const humanDoc = applyD20LegacyRaceTemplate(elfDoc, human35, elf35);

    expect(elfDoc.system.baseAttributes.dex).toBe(12);
    expect(elfDoc.system.baseAttributes.con).toBe(8);
    expect(humanDoc.system.baseAttributes.dex).toBe(10);
    expect(humanDoc.system.baseAttributes.con).toBe(10);
    expect(humanDoc.system.speciesId).toBe('human');
    expect(humanDoc.system.sizeCategory).toBe('medium');
    expect(humanDoc.system.speed).toBe(30);
    expect(elfDoc.system.features.map((feature) => feature.id)).toContain('low-light-vision');
    expect(humanDoc.system.features.some((feature) => feature.source === 'Elf')).toBe(false);
  });

  it('reverts PF1e fixed racial adjustments and size changes cleanly', () => {
    const halflingDoc = applyD20LegacyRaceTemplate(makePf1Doc(), halflingPf1);
    const humanDoc = applyD20LegacyRaceTemplate(halflingDoc, humanPf1, halflingPf1);

    expect(halflingDoc.system.baseAttributes).toMatchObject({ str: 8, dex: 12, cha: 12 });
    expect(halflingDoc.system.sizeCategory).toBe('small');
    expect(halflingDoc.system.speed).toBe(20);
    expect(humanDoc.system.baseAttributes).toMatchObject({
      str: 10,
      dex: 10,
      con: 10,
      int: 10,
      wis: 10,
      cha: 10,
    });
    expect(humanDoc.system.sizeCategory).toBe('medium');
    expect(humanDoc.system.speed).toBe(30);
    expect(halflingDoc.system.features.map((feature) => feature.id)).toContain('fearless');
    expect(humanDoc.system.features.some((feature) => feature.source === 'Halfling')).toBe(false);
  });
});
