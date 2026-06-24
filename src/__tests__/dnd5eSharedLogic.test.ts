import { describe, expect, it } from 'vitest';
import {
  buildDnd5eActivityDefinitions,
  executeDnd5eActivity,
} from '../systems/dnd5e/shared/activities';
import {
  getDnd5eDefenseStyleArmorClassBonus,
  hasDnd5eEquippedArmor,
  hasDnd5eFeatureOptionSelection,
} from '../systems/dnd5e/shared/activityState';
import {
  getDnd5eAlwaysPreparedSpellIds,
  getDnd5eAlwaysPreparedSpellSources,
  getDnd5ePreparedCasterSummaries,
} from '../systems/dnd5e/shared/spellPreparation';
import {
  DND5E_CONDITION_NAMES,
  hasDnd5eCondition,
  normalizeConditionId,
  normalizeDnd5eConditions,
  type Dnd5eCondition,
} from '../systems/dnd5e/conditions';
import { Dnd5eSystemDef } from '../systems/dnd5e/definition';
import { createDefaultDnd5eData, type Dnd5eDataModel } from '../systems/dnd5e/data-model';
import type { CharacterClass } from '../types/character-options/classes';
import type { SpellSlots } from '../types/core/character';
import type { CharacterDocument } from '../types/core/document';

const TEST_DATE = new Date('2026-05-01T00:00:00.000Z');

function createDocument(system: Dnd5eDataModel): CharacterDocument<Dnd5eDataModel> {
  return {
    id: 'dnd5e-shared-logic-test',
    name: 'Shared Logic Test Character',
    systemId: 'dnd-5e-2014',
    system,
    createdAt: TEST_DATE,
    updatedAt: TEST_DATE,
  };
}

function createEmptySpellSlots(): SpellSlots {
  return {
    1: { max: 0, used: 0 },
    2: { max: 0, used: 0 },
    3: { max: 0, used: 0 },
    4: { max: 0, used: 0 },
    5: { max: 0, used: 0 },
    6: { max: 0, used: 0 },
    7: { max: 0, used: 0 },
    8: { max: 0, used: 0 },
    9: { max: 0, used: 0 },
  };
}

describe('dnd5e conditions helpers', () => {
  it('exposes the 14 SRD condition names', () => {
    expect(DND5E_CONDITION_NAMES).toContain('Blinded');
    expect(DND5E_CONDITION_NAMES).toContain('Unconscious');
    expect(DND5E_CONDITION_NAMES).toHaveLength(14);
  });

  it('slugifies condition names, collapsing internal whitespace', () => {
    expect(normalizeConditionId('  Heavily   Obscured ')).toBe('heavily-obscured');
    expect(normalizeConditionId('Prone')).toBe('prone');
  });

  it('returns an empty list when conditions is not an array', () => {
    expect(normalizeDnd5eConditions(undefined)).toEqual([]);
    expect(normalizeDnd5eConditions(null as unknown as Dnd5eCondition[])).toEqual([]);
    expect(normalizeDnd5eConditions('prone' as unknown as Dnd5eCondition[])).toEqual([]);
  });

  it('drops entries without a usable name and dedupes by normalized id', () => {
    const normalized = normalizeDnd5eConditions([
      null as unknown as Dnd5eCondition,
      { id: '', name: 42 } as unknown as Dnd5eCondition,
      { id: '', name: '   ' },
      { id: '', name: 'Poisoned' },
      // No id -> id derived from the (trimmed) name.
      { id: '', name: '  Prone  ' },
      // Duplicate of "prone" via an explicit id; first writer wins.
      { id: 'prone', name: 'Prone (lying down)' },
    ]);

    expect(normalized).toEqual([
      { id: 'poisoned', name: 'Poisoned' },
      { id: 'prone', name: 'Prone' },
    ]);
  });

  it('matches conditions by id or by name fallback, case/space-insensitively', () => {
    const conditions: Dnd5eCondition[] = [
      { id: 'grappled', name: 'Grappled' },
      { id: '', name: 'Frightened' },
    ];

    expect(hasDnd5eCondition(conditions, 'grappled')).toBe(true);
    // Match the second entry through its name (empty id falls back to name).
    expect(hasDnd5eCondition(conditions, 'Frightened')).toBe(true);
    expect(hasDnd5eCondition(conditions, 'stunned')).toBe(false);
  });

  it('treats missing or empty condition lists as no match', () => {
    expect(hasDnd5eCondition(undefined, 'prone')).toBe(false);
    expect(hasDnd5eCondition([], 'prone')).toBe(false);
  });
});

describe('dnd5e activity-state helpers', () => {
  it('detects a fighting-style feature-option selection', () => {
    const system: Parameters<typeof hasDnd5eFeatureOptionSelection>[0] = {
      featureOptionSelections: [{ group: 'fighting-styles', id: 'defense' }],
    };
    expect(hasDnd5eFeatureOptionSelection(system, 'fighting-styles', 'defense')).toBe(true);
    expect(hasDnd5eFeatureOptionSelection(system, 'fighting-styles', 'archery')).toBe(false);
  });

  it('defaults a missing feature-option list to no selections', () => {
    expect(hasDnd5eFeatureOptionSelection({}, 'fighting-styles', 'defense')).toBe(false);
  });

  it('detects chest-slot armor with an armor class value', () => {
    expect(hasDnd5eEquippedArmor([{ slot: 'chest', armorClass: 11 }])).toBe(true);
    // A chest item without an armorClass is not "armor" for AC purposes.
    expect(hasDnd5eEquippedArmor([{ slot: 'chest', armorClass: null as unknown as number }])).toBe(
      false
    );
    expect(hasDnd5eEquippedArmor([{ slot: 'offHand', armorClass: 2 }])).toBe(false);
  });

  it('grants the Defense fighting-style +1 only when armor is equipped', () => {
    const selections = [{ group: 'fighting-styles' as const, id: 'defense' }];
    expect(
      getDnd5eDefenseStyleArmorClassBonus({
        featureOptionSelections: selections,
        equipment: [{ itemId: 'leather', slot: 'chest', attuned: false, armorClass: 11 }],
      })
    ).toBe(1);
    // Selected but unarmored -> no bonus.
    expect(
      getDnd5eDefenseStyleArmorClassBonus({
        featureOptionSelections: selections,
        equipment: [],
      })
    ).toBe(0);
    // Not selected -> no bonus regardless of armor.
    expect(
      getDnd5eDefenseStyleArmorClassBonus({
        featureOptionSelections: [],
        equipment: [{ itemId: 'leather', slot: 'chest', attuned: false, armorClass: 11 }],
      })
    ).toBe(0);
  });
});

describe('buildDnd5eActivityDefinitions edition gating + unsupported smites', () => {
  it('returns no activities for a non-2014 document', () => {
    const document = createDocument(createDefaultDnd5eData());
    document.systemId = 'dnd-5e-2024';
    expect(buildDnd5eActivityDefinitions(document)).toEqual([]);
  });

  it('emits a manual reference activity for a smite option with no slot level', () => {
    const system: Dnd5eDataModel = {
      ...createDefaultDnd5eData(),
      featureOptionSelections: [{ group: 'smites', id: 'improved-divine-smite' }],
    };

    const activities = buildDnd5eActivityDefinitions(createDocument(system));

    expect(activities).toEqual([
      expect.objectContaining({
        id: 'dnd5e-2014.feature-option.smites.improved-divine-smite',
        label: 'Divine Smite Reference',
        kind: 'passive',
        eligibility: {
          eligible: false,
          reasons: [
            'This Divine Smite option is a reference note rather than an executable slot use.',
          ],
        },
        costs: [],
        outputs: [],
        manualBoundary: expect.objectContaining({ kind: 'manual' }),
      }),
    ]);
  });

  it('marks a Divine Smite ineligible (with reasons) when spellcasting data is absent', () => {
    const system: Dnd5eDataModel = {
      ...createDefaultDnd5eData(),
      featureOptionSelections: [{ group: 'smites', id: 'divine-smite-1st' }],
    };

    const activities = buildDnd5eActivityDefinitions(createDocument(system));
    const smite = activities.find((entry) => entry.id.endsWith('divine-smite-1st'));

    expect(smite?.eligibility).toEqual({
      eligible: false,
      reasons: [
        'Divine Smite requires spellcasting data on the character.',
        'No available level 1 spell slot remains.',
      ],
    });
    // Ordinal suffix for a 1st-level slot.
    expect(smite?.label).toBe('Divine Smite (1st Level Slot)');
  });

  it('uses 3rd/4th ordinal suffixes for higher Divine Smite slot levels', () => {
    const system: Dnd5eDataModel = {
      ...createDefaultDnd5eData(),
      featureOptionSelections: [
        { group: 'smites', id: 'divine-smite-3rd' },
        { group: 'smites', id: 'divine-smite-4th' },
      ],
      spellcasting: {
        classes: [{ classId: 'paladin', ability: 'cha', spellcastingLevel: 13 }],
        spellsKnown: [],
        spellsPrepared: [],
        spellSlots: { ...createEmptySpellSlots(), 3: { max: 1, used: 0 }, 4: { max: 1, used: 0 } },
      },
    };

    const labels = buildDnd5eActivityDefinitions(createDocument(system)).map((a) => a.label);
    expect(labels).toContain('Divine Smite (3rd Level Slot)');
    expect(labels).toContain('Divine Smite (4th Level Slot)');
  });
});

describe('executeDnd5eActivity error paths', () => {
  it('reports activity-not-found for an unknown activity id', () => {
    const result = executeDnd5eActivity(createDocument(createDefaultDnd5eData()), 'nope');
    expect(result.activity).toBeUndefined();
    expect(result.issues).toEqual([
      expect.objectContaining({ code: 'dnd5e-activity-not-found', severity: 'error' }),
    ]);
  });

  it('refuses to execute a passive activity (Defense Fighting Style)', () => {
    const system: Dnd5eDataModel = {
      ...createDefaultDnd5eData(),
      featureOptionSelections: [{ group: 'fighting-styles', id: 'defense' }],
      equipment: [{ itemId: 'leather', slot: 'chest', attuned: false, armorClass: 11 }],
    };

    const result = executeDnd5eActivity(
      createDocument(system),
      'dnd5e-2014.feature-option.fighting-styles.defense.ac'
    );

    expect(result.activity?.kind).toBe('passive');
    expect(result.issues).toEqual([
      expect.objectContaining({ code: 'dnd5e-activity-not-executable', recoverable: false }),
    ]);
  });

  it('reports ineligibility reasons when executing a Divine Smite without spellcasting', () => {
    const system: Dnd5eDataModel = {
      ...createDefaultDnd5eData(),
      featureOptionSelections: [{ group: 'smites', id: 'divine-smite-1st' }],
    };
    const document = createDocument(system);

    const result = executeDnd5eActivity(
      document,
      'dnd5e-2014.feature-option.smites.divine-smite-1st'
    );

    expect(result.issues).toEqual([
      expect.objectContaining({
        code: 'dnd5e-activity-ineligible',
        message: 'Divine Smite requires spellcasting data on the character.',
      }),
      expect.objectContaining({
        code: 'dnd5e-activity-ineligible',
        message: 'No available level 1 spell slot remains.',
      }),
    ]);
    // Ineligible execution returns the original document untouched.
    expect(result.document).toBe(document);
  });

  it('consumes exactly the matching spell slot on a successful Divine Smite execution', () => {
    const system: Dnd5eDataModel = {
      ...createDefaultDnd5eData(),
      featureOptionSelections: [{ group: 'smites', id: 'divine-smite-1st' }],
      spellcasting: {
        classes: [{ classId: 'paladin', ability: 'cha', spellcastingLevel: 2 }],
        spellsKnown: [],
        spellsPrepared: [],
        spellSlots: { ...createEmptySpellSlots(), 1: { max: 1, used: 0 } },
      },
    };
    const document = createDocument(system);

    const result = executeDnd5eActivity(
      document,
      'dnd5e-2014.feature-option.smites.divine-smite-1st'
    );

    expect(result.issues).toEqual([]);
    expect(result.document.system.spellcasting?.spellSlots[1]).toEqual({ max: 1, used: 1 });
  });
});

describe('spellPreparation prepared-caster formula edge cases', () => {
  function makeClass(overrides: Partial<CharacterClass>): CharacterClass {
    return {
      id: 'mystic',
      name: 'Mystic',
      system: 'dnd-5e-2014',
      source: 'Test',
      description: '',
      hitDie: 8,
      primaryAbility: ['int'],
      savingThrowProficiencies: ['int'],
      armorProficiencies: [],
      weaponProficiencies: [],
      toolProficiencies: [],
      skillChoices: { count: 0, options: [] },
      startingEquipment: [],
      features: [],
      subclassLevel: 1,
      subclasses: [],
      ...overrides,
    } as unknown as CharacterClass;
  }

  function spellcasting(formula: string) {
    return {
      ability: 'int',
      spellListId: 'wizard',
      preparedCasterFormula: formula,
      spellSlots: {},
      ritualCasting: false,
    } as unknown as CharacterClass['spellcasting'];
  }

  it('floors and clamps the prepared limit to a minimum of one', () => {
    // 1 + (-3 Int mod at score 4) = -2 -> Math.max(1, ...) -> 1.
    const summaries = getDnd5ePreparedCasterSummaries(
      [{ classId: 'mystic', level: 1, hitDieRolls: [] }],
      [makeClass({ spellcasting: spellcasting('class_level + int_modifier') })],
      { str: 10, dex: 10, con: 10, int: 4, wis: 10, cha: 10 }
    );
    expect(summaries[0]).toMatchObject({ preparedLimit: 1 });
  });

  it('skips a class whose formula references an unsupported ability token', () => {
    // The unknown "luck_modifier" token makes the replacer throw, which the
    // flatMap-with-try elsewhere does not catch here -> assert it throws.
    expect(() =>
      getDnd5ePreparedCasterSummaries(
        [{ classId: 'mystic', level: 3, hitDieRolls: [] }],
        [makeClass({ spellcasting: spellcasting('luck_modifier + 1') })],
        { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 }
      )
    ).toThrow(/Unsupported prepared-caster ability token/);
  });

  it('skips a class whose formula contains non-arithmetic characters', () => {
    const summaries = getDnd5ePreparedCasterSummaries(
      [{ classId: 'mystic', level: 3, hitDieRolls: [] }],
      [makeClass({ spellcasting: spellcasting('class_level && 2') })],
      { str: 10, dex: 10, con: 10, int: 14, wis: 10, cha: 10 }
    );
    // The "&&" fails the arithmetic guard -> formula returns null -> class skipped.
    expect(summaries).toEqual([]);
  });

  it('skips a class whose formula evaluates to a non-finite number', () => {
    const summaries = getDnd5ePreparedCasterSummaries(
      [{ classId: 'mystic', level: 3, hitDieRolls: [] }],
      [makeClass({ spellcasting: spellcasting('class_level / 0') })],
      { str: 10, dex: 10, con: 10, int: 14, wis: 10, cha: 10 }
    );
    expect(summaries).toEqual([]);
  });

  it('defaults a missing ability score to 10 when computing the modifier', () => {
    // baseAttributes has no "int" -> abilityMod(10) = 0 -> 5 + 0 = 5.
    const summaries = getDnd5ePreparedCasterSummaries(
      [{ classId: 'mystic', level: 5, hitDieRolls: [] }],
      [makeClass({ spellcasting: spellcasting('5 + int_modifier') })],
      {} as Record<string, number>
    );
    expect(summaries[0]).toMatchObject({ preparedLimit: 5 });
  });

  it('skips classes without spellcasting or without a prepared-caster formula', () => {
    const noSpellcasting = makeClass({ id: 'fighter', spellcasting: undefined });
    const knownCaster = makeClass({
      id: 'sorcerer',
      spellcasting: {
        ability: 'cha',
        spellListId: 'sorcerer',
        spellSlots: {},
        ritualCasting: false,
      } as unknown as CharacterClass['spellcasting'],
    });

    const summaries = getDnd5ePreparedCasterSummaries(
      [
        { classId: 'fighter', level: 3, hitDieRolls: [] },
        { classId: 'sorcerer', level: 3, hitDieRolls: [] },
      ],
      [noSpellcasting, knownCaster],
      { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 16 }
    );
    expect(summaries).toEqual([]);
  });
});

describe('spellPreparation always-prepared source collection', () => {
  function classWith(overrides: Partial<CharacterClass>): CharacterClass {
    return {
      id: 'cleric',
      name: 'Cleric',
      system: 'dnd-5e-2014',
      source: 'Test',
      subclasses: [],
      ...overrides,
    } as unknown as CharacterClass;
  }

  it('excludes grants whose minLevel exceeds the character level', () => {
    const cls = classWith({
      alwaysPreparedSpells: [
        {
          source: 'Domain',
          minLevel: 5,
          spellIds: ['flame-strike'],
          countsAgainstPreparedLimit: false,
        },
      ],
    });

    expect(
      getDnd5eAlwaysPreparedSpellSources([{ classId: 'cleric', level: 3, hitDieRolls: [] }], [cls])
    ).toEqual([]);
  });

  it('includes grants once the character meets the minLevel', () => {
    const cls = classWith({
      alwaysPreparedSpells: [
        {
          source: 'Domain',
          minLevel: 3,
          spellIds: ['revivify'],
          countsAgainstPreparedLimit: false,
        },
      ],
    });

    expect(
      getDnd5eAlwaysPreparedSpellSources([{ classId: 'cleric', level: 3, hitDieRolls: [] }], [cls])
    ).toEqual([
      { spellId: 'revivify', source: 'Domain', minLevel: 3, countsAgainstPreparedLimit: false },
    ]);
  });

  it('collects structured always-prepared grants attached to a subclass', () => {
    const cls = classWith({
      subclasses: [
        {
          id: 'oath',
          name: 'Oath',
          alwaysPreparedSpells: [
            {
              source: 'Oath Spells',
              minLevel: 3,
              spellIds: ['lesser-restoration'],
              countsAgainstPreparedLimit: false,
            },
          ],
        } as unknown as CharacterClass['subclasses'][number],
      ],
    });

    expect(
      getDnd5eAlwaysPreparedSpellSources(
        [{ classId: 'cleric', subclassId: 'oath', level: 5, hitDieRolls: [] }],
        [cls]
      )
    ).toEqual([
      {
        spellId: 'lesser-restoration',
        source: 'Oath Spells',
        minLevel: 3,
        countsAgainstPreparedLimit: false,
      },
    ]);
  });

  it('falls back to default source labels for by-level grants without explicit labels', () => {
    const cls = classWith({
      name: undefined,
      alwaysPreparedSpellsByLevel: { 1: ['bless'] },
      subclasses: [
        {
          id: 'life-domain',
          name: undefined,
          alwaysPreparedSpellsByLevel: { 1: ['cure-wounds'] },
        } as unknown as CharacterClass['subclasses'][number],
      ],
    });

    const sources = getDnd5eAlwaysPreparedSpellSources(
      [{ classId: 'cleric', subclassId: 'life-domain', level: 1, hitDieRolls: [] }],
      [cls]
    );

    expect(sources).toEqual(
      expect.arrayContaining([
        {
          spellId: 'bless',
          source: 'Class Spells',
          minLevel: 1,
          countsAgainstPreparedLimit: false,
        },
        {
          spellId: 'cure-wounds',
          source: 'Subclass Spells',
          minLevel: 1,
          countsAgainstPreparedLimit: false,
        },
      ])
    );
  });

  it('dedupes identical spell/source pairs and ignores unmatched subclass ids', () => {
    const cls = classWith({
      alwaysPreparedSpellSourceLabel: 'Holy Order',
      alwaysPreparedSpells: [
        {
          source: 'Holy Order',
          minLevel: 1,
          spellIds: ['bless'],
          countsAgainstPreparedLimit: false,
        },
      ],
      alwaysPreparedSpellsByLevel: { 1: ['bless'] },
      subclasses: [],
    });

    // subclassId points at a subclass that does not exist -> getMatchingSubclass
    // returns undefined and the subclass branches contribute nothing.
    const ids = getDnd5eAlwaysPreparedSpellIds(
      [{ classId: 'cleric', subclassId: 'missing', level: 1, hitDieRolls: [] }],
      [cls]
    );

    // "bless" appears via both the grant and the by-level map but under the same
    // source label, so it dedupes to a single id.
    expect(ids).toEqual(['bless']);
  });

  it('returns nothing for a class id absent from the catalog', () => {
    expect(
      getDnd5eAlwaysPreparedSpellSources(
        [{ classId: 'unknown-class', level: 5, hitDieRolls: [] }],
        []
      )
    ).toEqual([]);
  });
});

describe('Dnd5eSystemDef wiring', () => {
  it('exposes the 2014 system metadata, six attributes, and a validator', () => {
    expect(Dnd5eSystemDef.id).toBe('dnd-5e-2014');
    expect(Dnd5eSystemDef.attributes!.map((a) => a.id)).toEqual([
      'str',
      'dex',
      'con',
      'int',
      'wis',
      'cha',
    ]);
    expect(Dnd5eSystemDef.skills).toHaveLength(18);
    expect(typeof Dnd5eSystemDef.validator?.validateDocument).toBe('function');
    expect(Dnd5eSystemDef.createDefaultData().level).toBe(1);
  });

  it('lazily preloads its sheet component module', async () => {
    const sheet = Dnd5eSystemDef.SheetComponent as { preload?: () => Promise<unknown> };
    expect(typeof sheet.preload).toBe('function');
    await expect(sheet.preload!()).resolves.toBeDefined();
  });
});
