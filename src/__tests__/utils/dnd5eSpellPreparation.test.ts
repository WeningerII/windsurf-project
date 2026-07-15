import { describe, expect, it } from 'vitest';
import { cleric } from '../../data/dnd/5e-2014/classes/cleric';
import { dnd5eClasses } from '../../data/dnd/5e-2014/classes';
import { paladin } from '../../data/dnd/5e-2014/classes/paladin';
import { wizard } from '../../data/dnd/5e-2014/classes/wizard';
import { bard } from '../../data/dnd/5e-2014/classes/bard';
import { fighter } from '../../data/dnd/5e-2014/classes/fighter';
import { dnd5eSpellsById } from '../../data/dnd/5e-2014/spells';
import { dnd5e2024Classes } from '../../data/dnd/5e-2024/classes';
import { dnd5e2024SpellsById } from '../../data/dnd/5e-2024/spells';
import type { CharacterClass } from '../../types/character-options/classes';
import {
  getDnd5eAlwaysPreparedSpellIds,
  getDnd5eAlwaysPreparedSpellSources,
  getDnd5ePreparedCasterSummaries,
  getDnd5eSpellcastingClassSummaries,
} from '../../systems/dnd5e/shared/spellPreparation';

function collectStructuredAlwaysPreparedSpellIds(classes: CharacterClass[]): string[] {
  const collectByLevel = (entry: { alwaysPreparedSpellsByLevel?: Record<number, string[]> }) =>
    Object.values(entry.alwaysPreparedSpellsByLevel ?? {}).flat();

  return classes.flatMap((classData) => [
    ...((classData.alwaysPreparedSpells ?? []).flatMap((grant) => grant.spellIds) || []),
    ...collectByLevel(classData),
    ...classData.subclasses.flatMap((subclass) => [
      ...(subclass.alwaysPreparedSpells ?? []).flatMap((grant) => grant.spellIds),
      ...collectByLevel(subclass),
    ]),
  ]);
}

describe('dnd5e spell preparation summaries', () => {
  it('computes the prepared limit for a single prepared caster', () => {
    const summaries = getDnd5ePreparedCasterSummaries(
      [{ classId: 'wizard', level: 3, hitDieRolls: [6, 4, 5] }],
      [wizard],
      { str: 10, dex: 10, con: 10, int: 16, wis: 10, cha: 10 }
    );

    expect(summaries).toEqual([
      {
        classId: 'wizard',
        className: 'Wizard',
        level: 3,
        ability: 'int',
        preparedLimit: 6,
      },
    ]);
  });

  it('floors half-caster formulas and enforces a minimum of one prepared spell', () => {
    const summaries = getDnd5ePreparedCasterSummaries(
      [{ classId: 'paladin', level: 3, hitDieRolls: [10, 6, 8] }],
      [paladin],
      { str: 16, dex: 10, con: 12, int: 10, wis: 10, cha: 12 }
    );

    expect(summaries[0]).toMatchObject({
      classId: 'paladin',
      preparedLimit: 2,
    });
  });

  it('returns one summary per prepared casting class in a multiclass build', () => {
    const summaries = getDnd5ePreparedCasterSummaries(
      [
        { classId: 'wizard', level: 3, hitDieRolls: [6, 4, 5] },
        { classId: 'cleric', level: 2, hitDieRolls: [8, 5] },
      ],
      [wizard, cleric],
      { str: 10, dex: 10, con: 12, int: 14, wis: 16, cha: 10 }
    );

    expect(summaries).toEqual([
      {
        classId: 'wizard',
        className: 'Wizard',
        level: 3,
        ability: 'int',
        preparedLimit: 5,
      },
      {
        classId: 'cleric',
        className: 'Cleric',
        level: 2,
        ability: 'wis',
        preparedLimit: 5,
      },
    ]);
  });

  it('skips known-only casters with no prepared-caster formula', () => {
    const summaries = getDnd5ePreparedCasterSummaries(
      [{ classId: 'bard', level: 3, hitDieRolls: [6, 4, 5] }],
      [bard],
      { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 16 }
    );

    expect(summaries).toEqual([]);
  });

  it('derives save DC + attack for a single caster using the shared cited helpers', () => {
    // Wizard 3: prof +2, INT 16 (+3) → DC 8+2+3=13, attack +2+3=+5.
    const summaries = getDnd5eSpellcastingClassSummaries(
      [{ classId: 'wizard', level: 3, hitDieRolls: [6, 4, 5] }],
      [wizard],
      { str: 10, dex: 10, con: 10, int: 16, wis: 10, cha: 10 },
      2
    );

    expect(summaries).toEqual([
      {
        classId: 'wizard',
        className: 'Wizard',
        ability: 'int',
        spellSaveDc: 13,
        spellAttackBonus: 5,
      },
    ]);
  });

  it('covers KNOWN casters that the prepared-caster summary omits', () => {
    // Bard has a spellcasting block but no prepared-caster formula, so it is
    // absent from getDnd5ePreparedCasterSummaries yet still has a save DC.
    const classLevels = [{ classId: 'bard', level: 3, hitDieRolls: [6, 4, 5] }];
    const attrs = { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 16 };

    expect(getDnd5ePreparedCasterSummaries(classLevels, [bard], attrs)).toEqual([]);
    // Bard 3: prof +2, CHA 16 (+3) → DC 13, attack +5.
    expect(getDnd5eSpellcastingClassSummaries(classLevels, [bard], attrs, 2)).toEqual([
      { classId: 'bard', className: 'Bard', ability: 'cha', spellSaveDc: 13, spellAttackBonus: 5 },
    ]);
  });

  it('uses total-level proficiency for each class in a multiclass caster', () => {
    // Wizard 3 / Cleric 2 → total level 5 → prof +3 for BOTH.
    const summaries = getDnd5eSpellcastingClassSummaries(
      [
        { classId: 'wizard', level: 3, hitDieRolls: [6, 4, 5] },
        { classId: 'cleric', level: 2, hitDieRolls: [8, 5] },
      ],
      [wizard, cleric],
      { str: 10, dex: 10, con: 12, int: 14, wis: 16, cha: 10 },
      3
    );

    expect(summaries).toEqual([
      // INT 14 (+2): DC 8+3+2=13, attack +5.
      {
        classId: 'wizard',
        className: 'Wizard',
        ability: 'int',
        spellSaveDc: 13,
        spellAttackBonus: 5,
      },
      // WIS 16 (+3): DC 8+3+3=14, attack +6.
      {
        classId: 'cleric',
        className: 'Cleric',
        ability: 'wis',
        spellSaveDc: 14,
        spellAttackBonus: 6,
      },
    ]);
  });

  it('returns nothing for a non-caster class', () => {
    const summaries = getDnd5eSpellcastingClassSummaries(
      [{ classId: 'fighter', level: 5, hitDieRolls: [10, 6, 6, 6, 6] }],
      [fighter],
      { str: 16, dex: 12, con: 14, int: 10, wis: 10, cha: 10 },
      3
    );

    expect(summaries).toEqual([]);
  });

  it('resolves structured always-prepared subclass grants separately from the daily prepared list', () => {
    const spellIds = getDnd5eAlwaysPreparedSpellIds(
      [{ classId: 'cleric', subclassId: 'life-domain', level: 5, hitDieRolls: [8, 5, 5, 5, 5] }],
      [cleric]
    );

    expect(spellIds).toEqual([
      'bless',
      'cure-wounds',
      'lesser-restoration',
      'spiritual-weapon',
      'beacon-of-hope',
      'revivify',
    ]);
  });

  it('returns by-level always-prepared source labels and excludes higher-level grants', () => {
    const sources = getDnd5eAlwaysPreparedSpellSources(
      [{ classId: 'cleric', subclassId: 'life-domain', level: 3, hitDieRolls: [8, 5, 5] }],
      [cleric]
    );

    expect(sources).toEqual([
      {
        spellId: 'bless',
        source: 'Life Domain Spells',
        minLevel: 1,
        countsAgainstPreparedLimit: false,
      },
      {
        spellId: 'cure-wounds',
        source: 'Life Domain Spells',
        minLevel: 1,
        countsAgainstPreparedLimit: false,
      },
      {
        spellId: 'lesser-restoration',
        source: 'Life Domain Spells',
        minLevel: 3,
        countsAgainstPreparedLimit: false,
      },
      {
        spellId: 'spiritual-weapon',
        source: 'Life Domain Spells',
        minLevel: 3,
        countsAgainstPreparedLimit: false,
      },
    ]);
    expect(sources.map((source) => source.spellId)).not.toContain('beacon-of-hope');
  });

  it('documents that SRD wizard schools do not invent always-prepared spell lists', () => {
    const spellIds = getDnd5eAlwaysPreparedSpellIds(
      [{ classId: 'wizard', subclassId: 'evocation', level: 20, hitDieRolls: [] }],
      [wizard]
    );

    expect(spellIds).toEqual([]);
  });

  it('keeps every 2014 structured always-prepared grant backed by shipped spell data', () => {
    const missing = collectStructuredAlwaysPreparedSpellIds(dnd5eClasses).filter(
      (spellId) => !dnd5eSpellsById[spellId]
    );

    expect(missing).toEqual([]);
  });

  it('keeps every 2024 structured always-prepared grant backed by shipped spell data', () => {
    const missing = collectStructuredAlwaysPreparedSpellIds(dnd5e2024Classes).filter(
      (spellId) => !dnd5e2024SpellsById[spellId]
    );

    expect(missing).toEqual([]);
  });
});
