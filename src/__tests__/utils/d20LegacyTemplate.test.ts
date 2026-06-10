import { describe, expect, it } from 'vitest';
import { fighter as fighter35 } from '../../data/dnd/3.5e/classes/fighter';
import { cleric as cleric35 } from '../../data/dnd/3.5e/classes/cleric';
import { wizard as wizard35 } from '../../data/dnd/3.5e/classes/wizard';
import { arcaneArcher as arcaneArcher35 } from '../../data/dnd/3.5e/prestige-classes/arcane-archer';
import { assassin as assassin35 } from '../../data/dnd/3.5e/prestige-classes/assassin';
import { blackguard as blackguard35 } from '../../data/dnd/3.5e/prestige-classes/blackguard';
import { dragonDisciple as dragonDisciple35 } from '../../data/dnd/3.5e/prestige-classes/dragon-disciple';
import { duelist as duelist35 } from '../../data/dnd/3.5e/prestige-classes/duelist';
import { dwarvenDefender as dwarvenDefender35 } from '../../data/dnd/3.5e/prestige-classes/dwarven-defender';
import { eldritchKnight as eldritchKnight35 } from '../../data/dnd/3.5e/prestige-classes/eldritch-knight';
import { loremaster as loremaster35 } from '../../data/dnd/3.5e/prestige-classes/loremaster';
import { mysticTheurge as mysticTheurge35 } from '../../data/dnd/3.5e/prestige-classes/mystic-theurge';
import { elf as elf35 } from '../../data/dnd/3.5e/races/elf';
import { human as human35 } from '../../data/dnd/3.5e/races/human';
import { createDefaultDnd35eData, Dnd35eDataModel } from '../../systems/dnd35e/data-model';
import { Dnd35eEngine } from '../../systems/dnd35e/engine';
import { createDefaultPf1eData, Pf1eDataModel } from '../../systems/pf1e/data-model';
import { Pf1eEngine } from '../../systems/pf1e/engine';
import { CharacterDocument } from '../../types/core/document';
import {
  applyD20LegacyClassTemplate,
  applyD20LegacyRaceTemplate,
  removeD20LegacyClassTemplate,
} from '../../utils/d20LegacyTemplate';
import { exportDocuments, importDocuments } from '../../utils/documentStorage';
import { wizard as wizardPf1 } from '../../data/pathfinder/1e/classes/wizard';
import { cleric as clericPf1 } from '../../data/pathfinder/1e/classes/cleric';
import { sorcerer as sorcererPf1 } from '../../data/pathfinder/1e/classes/sorcerer';
import { fighter as fighterPf1 } from '../../data/pathfinder/1e/classes/fighter';
import { halfling as halflingPf1 } from '../../data/pathfinder/1e/races/halfling';
import { human as humanPf1 } from '../../data/pathfinder/1e/races/human';
import { dragonDisciple as dragonDisciplePf1 } from '../../data/pathfinder/1e/prestige-classes/dragon-disciple';
import { duelist as duelistPf1 } from '../../data/pathfinder/1e/prestige-classes/duelist';
import { loreMaster as loreMasterPf1 } from '../../data/pathfinder/1e/prestige-classes/lore-master';
import { mysticTheurge as mysticTheurgePf1 } from '../../data/pathfinder/1e/prestige-classes/mystic-theurge';

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

  it('applies vetted 3.5e prestige classes with the normalized class profile and spell slots', () => {
    const arcaneArcherDoc = applyD20LegacyClassTemplate(make35Doc(), arcaneArcher35, 2);
    const assassinDoc = applyD20LegacyClassTemplate(make35Doc(), assassin35, 4);
    const blackguardDoc = applyD20LegacyClassTemplate(make35Doc(), blackguard35, 5);
    const dragonDiscipleDoc = applyD20LegacyClassTemplate(make35Doc(), dragonDisciple35, 4);
    const duelistDoc = applyD20LegacyClassTemplate(make35Doc(), duelist35, 2);
    const dwarvenDefenderDoc = applyD20LegacyClassTemplate(make35Doc(), dwarvenDefender35, 3);

    expect(arcaneArcherDoc.system.classLevels[0]).toMatchObject({
      classId: 'arcane-archer-35e',
      level: 2,
      hitDieRolls: [8, 5],
      bab: 'full',
      fortSave: 'good',
      refSave: 'good',
      willSave: 'poor',
      skillPointsPerLevel: 4,
    });
    expect(arcaneArcherDoc.system.classSkills).toEqual(
      expect.arrayContaining(['hide', 'spot', 'survival'])
    );
    expect(arcaneArcherDoc.system.features.map((feature) => feature.id)).toEqual(
      expect.arrayContaining(['enhance-arrow-1-35e', 'imbue-arrow-35e'])
    );

    expect(assassinDoc.system.classLevels[0]).toMatchObject({
      classId: 'assassin-35e',
      level: 4,
      hitDieRolls: [6, 4, 4, 4],
      bab: 'three-quarter',
      fortSave: 'poor',
      refSave: 'good',
      willSave: 'poor',
      skillPointsPerLevel: 4,
    });
    expect(assassinDoc.system.classSkills).toEqual(
      expect.arrayContaining(['hide', 'move-silently', 'use-magic'])
    );
    expect(assassinDoc.system.features.map((feature) => feature.id)).toEqual(
      expect.arrayContaining([
        'death-attack-35e',
        'assassin-sneak-attack-1-35e',
        'assassin-spellcasting-35e',
        'save-against-poison-2-35e',
      ])
    );

    expect(blackguardDoc.system.classLevels[0]).toMatchObject({
      classId: 'blackguard-35e',
      level: 5,
      hitDieRolls: [10, 6, 6, 6, 6],
      bab: 'full',
      fortSave: 'good',
      refSave: 'poor',
      willSave: 'poor',
      skillPointsPerLevel: 2,
    });
    expect(blackguardDoc.system.classSkills).toEqual(
      expect.arrayContaining(['concentration', 'intimidate', 'ride'])
    );
    expect(blackguardDoc.system.features.map((feature) => feature.id)).toEqual(
      expect.arrayContaining([
        'aura-of-evil-35e',
        'dark-blessing-35e',
        'blackguard-spellcasting-35e',
        'command-undead-35e',
        'blackguard-sneak-attack-1-35e',
        'fiendish-servant-35e',
      ])
    );

    expect(dragonDiscipleDoc.system.classLevels[0]).toMatchObject({
      classId: 'dragon-disciple-35e',
      level: 4,
      hitDieRolls: [12, 7, 7, 7],
      bab: 'three-quarter',
      fortSave: 'good',
      refSave: 'poor',
      willSave: 'good',
      skillPointsPerLevel: 2,
    });
    expect(dragonDiscipleDoc.system.classSkills).toEqual(
      expect.arrayContaining(['concentration', 'diplomacy', 'knowledge'])
    );
    expect(dragonDiscipleDoc.system.features.map((feature) => feature.id)).toEqual(
      expect.arrayContaining([
        'dragon-disciple-natural-armor-1-35e',
        'dragon-disciple-bonus-spell-1-35e',
        'dragon-disciple-strength-1-35e',
        'dragon-disciple-claws-and-bite-35e',
        'dragon-disciple-breath-weapon-2d8-35e',
        'dragon-disciple-natural-armor-2-35e',
      ])
    );

    expect(duelistDoc.system.classLevels[0]).toMatchObject({
      classId: 'duelist-35e',
      level: 2,
      hitDieRolls: [10, 6],
      bab: 'full',
      fortSave: 'poor',
      refSave: 'good',
      willSave: 'poor',
      skillPointsPerLevel: 4,
    });
    expect(duelistDoc.system.classSkills).toEqual(
      expect.arrayContaining(['bluff', 'sense-motive', 'tumble'])
    );
    expect(duelistDoc.system.features.map((feature) => feature.id)).toEqual(
      expect.arrayContaining(['canny-defense-35e', 'improved-reaction-2-35e'])
    );

    expect(dwarvenDefenderDoc.system.classLevels[0]).toMatchObject({
      classId: 'dwarven-defender-35e',
      level: 3,
      hitDieRolls: [12, 7, 7],
      bab: 'full',
      fortSave: 'good',
      refSave: 'poor',
      willSave: 'good',
      skillPointsPerLevel: 2,
    });
    expect(dwarvenDefenderDoc.system.classSkills).toEqual(
      expect.arrayContaining(['craft', 'listen', 'sense-motive'])
    );
    expect(dwarvenDefenderDoc.system.features.map((feature) => feature.id)).toEqual(
      expect.arrayContaining([
        'ac-bonus-1-35e',
        'defensive-stance-1-35e',
        'uncanny-dodge-dwarven-defender-35e',
        'defensive-stance-2-35e',
      ])
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
      // 3.5e PHB: max hit die only at character level 1 — the wizard levels
      // taken later all seed the d4 average (3).
      { classId: 'wizard', level: 3, hitDieRolls: [3, 3, 3] },
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

  it('preserves tracked and prepared legacy spell state when class templates change', () => {
    const wizardDoc = applyD20LegacyClassTemplate(
      make35Doc({
        spellsKnown: ['magic-missile', 'shield'],
        preparedSpellsByLevel: {
          1: ['magic-missile', 'magic-missile'],
        },
      }),
      wizard35,
      3
    );
    const leveledDoc = applyD20LegacyClassTemplate(wizardDoc, wizard35, 4);
    const multiclassDoc = applyD20LegacyClassTemplate(leveledDoc, fighter35, 1, {
      mode: 'add',
    });

    expect(leveledDoc.system.spellsKnown).toEqual(['magic-missile', 'shield']);
    expect(leveledDoc.system.preparedSpellsByLevel).toEqual({
      1: ['magic-missile', 'magic-missile'],
    });
    expect(multiclassDoc.system.spellsKnown).toEqual(['magic-missile', 'shield']);
    expect(multiclassDoc.system.preparedSpellsByLevel).toEqual({
      1: ['magic-missile', 'magic-missile'],
    });
  });

  it('seeds spellcasting-advancement targets for normalized 3.5e prestige casters', () => {
    const wizardClericDoc = applyD20LegacyClassTemplate(
      applyD20LegacyClassTemplate(make35Doc(), wizard35, 3),
      cleric35,
      3,
      { mode: 'add' }
    );
    const mysticTheurgeDoc = applyD20LegacyClassTemplate(wizardClericDoc, mysticTheurge35, 2, {
      mode: 'add',
    });
    const eldritchKnightDoc = applyD20LegacyClassTemplate(
      applyD20LegacyClassTemplate(make35Doc(), wizard35, 5),
      eldritchKnight35,
      3,
      { mode: 'add' }
    );
    const loremasterDoc = applyD20LegacyClassTemplate(wizardClericDoc, loremaster35, 1, {
      mode: 'add',
    });

    expect(mysticTheurgeDoc.system.classLevels[2]).toMatchObject({
      classId: 'mystic-theurge-35e',
      spellcastingSelections: ['wizard', 'cleric'],
    });
    expect(eldritchKnightDoc.system.classLevels[1]).toMatchObject({
      classId: 'eldritch-knight-35e',
      spellcastingSelections: ['wizard'],
    });
    expect(loremasterDoc.system.classLevels[2]).toMatchObject({
      classId: 'loremaster-35e',
      spellcastingSelections: ['wizard'],
    });
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

    // PF1e CRB (Favored Class): a character has exactly ONE favored class, so
    // only the first class row defaults to the +1 HP/level bonus; rows added
    // later default to 'other' (no automatic bonus).
    expect(multiclassDoc.system.classLevels).toMatchObject([
      { classId: 'wizard', level: 2, favoredClassBonus: 'hp' },
      { classId: 'fighter', level: 1, favoredClassBonus: 'other' },
    ]);
    expect(updatedFighterDoc.system.classLevels).toMatchObject([
      { classId: 'wizard', level: 2, favoredClassBonus: 'hp' },
      // The fighter row was added second, so even its first level seeds the
      // d10 average (6) — max HP belongs to character level 1 only.
      { classId: 'fighter', level: 3, hitDieRolls: [6, 6, 6], favoredClassBonus: 'other' },
    ]);
    expect(updatedFighterDoc.system.level).toBe(5);
    expect(updatedFighterDoc.system.classSkills).toEqual(
      expect.arrayContaining(['spellcraft', 'climb'])
    );
  });

  it('seeds spellcasting-advancement targets for PF1e prestige casters', () => {
    const wizardClericDoc = applyD20LegacyClassTemplate(
      applyD20LegacyClassTemplate(makePf1Doc(), wizardPf1, 3),
      clericPf1,
      3,
      { mode: 'add' }
    );
    const mysticTheurgeDoc = applyD20LegacyClassTemplate(wizardClericDoc, mysticTheurgePf1, 2, {
      mode: 'add',
    });
    const loreMasterDoc = applyD20LegacyClassTemplate(wizardClericDoc, loreMasterPf1, 1, {
      mode: 'add',
    });
    const wizardSorcererDoc = applyD20LegacyClassTemplate(
      applyD20LegacyClassTemplate(makePf1Doc(), wizardPf1, 3),
      sorcererPf1,
      3,
      { mode: 'add' }
    );
    const dragonDiscipleDoc = applyD20LegacyClassTemplate(wizardSorcererDoc, dragonDisciplePf1, 2, {
      mode: 'add',
    });

    expect(mysticTheurgeDoc.system.classLevels[2]).toMatchObject({
      classId: 'mystic-theurge',
      spellcastingSelections: ['wizard', 'cleric'],
    });
    expect(loreMasterDoc.system.classLevels[2]).toMatchObject({
      classId: 'lore-master',
      spellcastingSelections: ['wizard'],
    });
    expect(dragonDiscipleDoc.system.classLevels[2]).toMatchObject({
      classId: 'dragon-disciple',
      spellcastingSelections: ['sorcerer'],
    });
  });

  it('clears stale prestige spellcasting advancement on class row replacement and removal without deleting manual spell state', () => {
    const dnd35eEngine = new Dnd35eEngine();
    const pf1eEngine = new Pf1eEngine();
    const dnd35eManualExtras: NonNullable<Dnd35eDataModel['manualSpellcastingExtras']> = {
      domainSlotConsumedByLevel: { 1: true },
      spontaneousConversionReference: 'cure',
    };
    const pf1eManualExtras: NonNullable<Pf1eDataModel['manualSpellcastingExtras']> = {
      specialistSlotConsumedByLevel: { 1: true },
      dragonDiscipleBonusSlots: { total: 1, used: 1 },
    };

    const eldritchKnightDoc = applyD20LegacyClassTemplate(
      applyD20LegacyClassTemplate(
        make35Doc({
          spellsKnown: ['magic-missile-1-35e', 'shield-1-35e'],
          preparedSpellsByLevel: { 1: ['magic-missile-1-35e'] },
          manualSpellcastingExtras: dnd35eManualExtras,
        }),
        wizard35,
        5
      ),
      eldritchKnight35,
      3,
      { mode: 'add' }
    );
    const preparedEldritchKnightDoc = dnd35eEngine.prepareData({
      ...eldritchKnightDoc,
      system: {
        ...eldritchKnightDoc.system,
        spellsPerDay: { 4: { total: 0, used: 1 } },
      },
    });
    const replacedEldritchKnightDoc = dnd35eEngine.prepareData(
      applyD20LegacyClassTemplate(preparedEldritchKnightDoc, fighter35, 2, {
        mode: 'replace',
        targetClassId: 'eldritch-knight-35e',
      })
    );
    const removedEldritchKnightDoc = dnd35eEngine.prepareData(
      removeD20LegacyClassTemplate(preparedEldritchKnightDoc, 'eldritch-knight-35e')
    );

    expect(preparedEldritchKnightDoc.system.classLevels[1]).toMatchObject({
      classId: 'eldritch-knight-35e',
      spellcastingSelections: ['wizard'],
    });
    expect(preparedEldritchKnightDoc.system.spellsPerDay?.[4]?.total).toBeGreaterThan(0);
    expect(replacedEldritchKnightDoc.system.classLevels[1]).toMatchObject({ classId: 'fighter' });
    expect(replacedEldritchKnightDoc.system.classLevels[1]).not.toHaveProperty(
      'spellcastingSelections'
    );
    expect(replacedEldritchKnightDoc.system.spellsPerDay?.[4]).toEqual({ total: 0, used: 0 });
    expect(replacedEldritchKnightDoc.system.spellsKnown).toEqual([
      'magic-missile-1-35e',
      'shield-1-35e',
    ]);
    expect(replacedEldritchKnightDoc.system.preparedSpellsByLevel).toEqual({
      1: ['magic-missile-1-35e'],
    });
    expect(replacedEldritchKnightDoc.system.manualSpellcastingExtras).toEqual(dnd35eManualExtras);
    expect(removedEldritchKnightDoc.system.classLevels).toMatchObject([{ classId: 'wizard' }]);
    expect(removedEldritchKnightDoc.system.spellsPerDay?.[4]).toEqual({ total: 0, used: 0 });
    expect(removedEldritchKnightDoc.system.manualSpellcastingExtras).toEqual(dnd35eManualExtras);

    const mysticTheurgeDoc = applyD20LegacyClassTemplate(
      applyD20LegacyClassTemplate(
        applyD20LegacyClassTemplate(
          makePf1Doc({
            spellsKnown: ['magic-missile-pf1e', 'cure-light-wounds-pf1e'],
            preparedSpellsByLevel: { 1: ['magic-missile-pf1e'] },
            manualSpellcastingExtras: pf1eManualExtras,
          }),
          wizardPf1,
          3
        ),
        clericPf1,
        3,
        { mode: 'add' }
      ),
      mysticTheurgePf1,
      2,
      { mode: 'add' }
    );
    const preparedMysticTheurgeDoc = pf1eEngine.prepareData({
      ...mysticTheurgeDoc,
      system: {
        ...mysticTheurgeDoc.system,
        spellsPerDay: { 3: { total: 0, used: 1 } },
      },
    });
    const replacedMysticTheurgeDoc = pf1eEngine.prepareData(
      applyD20LegacyClassTemplate(preparedMysticTheurgeDoc, fighterPf1, 2, {
        mode: 'replace',
        targetClassId: 'mystic-theurge',
      })
    );
    const removedMysticTheurgeDoc = pf1eEngine.prepareData(
      removeD20LegacyClassTemplate(preparedMysticTheurgeDoc, 'mystic-theurge')
    );

    expect(preparedMysticTheurgeDoc.system.classLevels[2]).toMatchObject({
      classId: 'mystic-theurge',
      spellcastingSelections: ['wizard', 'cleric'],
    });
    expect(preparedMysticTheurgeDoc.system.spellsPerDay?.[3]?.total).toBeGreaterThan(0);
    expect(replacedMysticTheurgeDoc.system.classLevels[2]).toMatchObject({ classId: 'fighter' });
    expect(replacedMysticTheurgeDoc.system.classLevels[2]).not.toHaveProperty(
      'spellcastingSelections'
    );
    expect(replacedMysticTheurgeDoc.system.spellsPerDay?.[3]).toEqual({ total: 0, used: 0 });
    expect(replacedMysticTheurgeDoc.system.spellsKnown).toEqual([
      'magic-missile-pf1e',
      'cure-light-wounds-pf1e',
    ]);
    expect(replacedMysticTheurgeDoc.system.preparedSpellsByLevel).toEqual({
      1: ['magic-missile-pf1e'],
    });
    expect(replacedMysticTheurgeDoc.system.manualSpellcastingExtras).toEqual(pf1eManualExtras);
    expect(removedMysticTheurgeDoc.system.classLevels).toMatchObject([
      { classId: 'wizard' },
      { classId: 'cleric' },
    ]);
    expect(removedMysticTheurgeDoc.system.spellsPerDay?.[3]).toEqual({ total: 0, used: 0 });
    expect(removedMysticTheurgeDoc.system.manualSpellcastingExtras).toEqual(pf1eManualExtras);
  });

  it('round-trips prestige spellcasting selections and merged slots through import/export', () => {
    const dnd35eEngine = new Dnd35eEngine();
    const pf1eEngine = new Pf1eEngine();
    const dndMysticTheurgeDoc = applyD20LegacyClassTemplate(
      applyD20LegacyClassTemplate(
        applyD20LegacyClassTemplate(make35Doc(), wizard35, 3),
        cleric35,
        3,
        { mode: 'add' }
      ),
      mysticTheurge35,
      2,
      { mode: 'add' }
    );
    const pf1MysticTheurgeDoc = applyD20LegacyClassTemplate(
      applyD20LegacyClassTemplate(
        applyD20LegacyClassTemplate(makePf1Doc(), wizardPf1, 3),
        clericPf1,
        3,
        { mode: 'add' }
      ),
      mysticTheurgePf1,
      2,
      { mode: 'add' }
    );
    const preparedDnd35e = dnd35eEngine.prepareData({
      ...dndMysticTheurgeDoc,
      system: {
        ...dndMysticTheurgeDoc.system,
        spellsPerDay: {
          1: { total: 0, used: 1 },
          2: { total: 0, used: 1 },
        },
      },
    });
    const preparedPf1e = pf1eEngine.prepareData({
      ...pf1MysticTheurgeDoc,
      system: {
        ...pf1MysticTheurgeDoc.system,
        spellsPerDay: {
          1: { total: 0, used: 1 },
          2: { total: 0, used: 1 },
        },
      },
    });

    const [importedDnd35e, importedPf1e] = importDocuments(
      exportDocuments([preparedDnd35e, preparedPf1e])
    ) as [CharacterDocument<Dnd35eDataModel>, CharacterDocument<Pf1eDataModel>];
    const hydratedDnd35e = dnd35eEngine.prepareData(importedDnd35e);
    const hydratedPf1e = pf1eEngine.prepareData(importedPf1e);

    expect(hydratedDnd35e.system.classLevels[2]).toMatchObject({
      classId: 'mystic-theurge-35e',
      spellcastingSelections: ['wizard', 'cleric'],
    });
    expect(hydratedPf1e.system.classLevels[2]).toMatchObject({
      classId: 'mystic-theurge',
      spellcastingSelections: ['wizard', 'cleric'],
    });
    expect(hydratedDnd35e.system.spellsPerDay?.[2]?.total).toBeGreaterThan(0);
    expect(hydratedPf1e.system.spellsPerDay?.[2]?.total).toBeGreaterThan(0);
    expect(hydratedDnd35e.system.spellsPerDay?.[1]?.used).toBe(1);
    expect(hydratedPf1e.system.spellsPerDay?.[1]?.used).toBe(1);
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

describe('class data carries d20 progressions (review H-3)', () => {
  it('3.5e wizard: half BAB, poor Fort/Ref, good Will (SRD)', () => {
    expect(wizard35.d20Profile).toEqual({
      bab: 'half',
      fortSave: 'poor',
      refSave: 'poor',
      willSave: 'good',
    });
    // The bogus 5e-style two-ability save list is gone from d20 data.
    expect(wizard35.savingThrowProficiencies).toBeUndefined();
  });

  it('PF1e alchemist resolves its own data profile instead of the old all-poor fallback', async () => {
    const { pf1eClasses } = await import('../../data/pathfinder/1e/classes');
    const alchemist = Object.values(pf1eClasses).find((entry) => entry.id === 'alchemist');
    expect(alchemist).toBeDefined();
    // Pathfinder SRD (Alchemist): 3/4 BAB, good Fort and Ref, poor Will —
    // this class was absent from the deleted hardcoded table entirely.
    expect(alchemist!.d20Profile).toEqual({
      bab: 'three-quarter',
      fortSave: 'good',
      refSave: 'good',
      willSave: 'poor',
    });
  });
});
