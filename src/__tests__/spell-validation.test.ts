import { describe, expect, it } from 'vitest';
import * as dnd5e2014SpellsModule from '../data/dnd/5e-2014/spells';
import * as dnd5e2024SpellsModule from '../data/dnd/5e-2024/spells';
import * as dnd35eSpellsModule from '../data/dnd/3.5e/spells';
import * as pf1eSpellsModule from '../data/pathfinder/1e/spells';
import * as pf2eSpellsModule from '../data/pathfinder/2e/spells';
import type { Spell } from '../types/magic/spells';

type SpellModule = {
  allSpells: Spell[];
  spellsByLevel: Record<number, Spell[]>;
  spellsById: Record<string, Spell>;
  spellsByClass: Record<string, Spell[]>;
  spellsBySchool: Record<string, Spell[]>;
  spellStats: {
    total: number;
    byLevel: Record<number, number>;
    byClass: Record<string, number>;
    bySchool: Record<string, number>;
  };
  spellIdAliases: Record<string, string>;
  spellsByClassAndLevel?: Record<string, Record<number, Spell[]>>;
  getSpell: (id: string) => Spell | undefined;
} & Record<string, unknown>;

const spellModules: Array<{
  label: string;
  systemId: string;
  maxLevel: number;
  module: SpellModule;
  allowedDuplicateNames?: string[];
}> = [
  {
    label: 'D&D 5e (2014)',
    systemId: 'dnd-5e-2014',
    maxLevel: 9,
    module: dnd5e2014SpellsModule as SpellModule,
  },
  {
    label: 'D&D 5e (2024)',
    systemId: 'dnd-5e-2024',
    maxLevel: 9,
    module: dnd5e2024SpellsModule as SpellModule,
  },
  {
    label: 'D&D 3.5e',
    systemId: 'dnd-3.5e',
    maxLevel: 9,
    module: dnd35eSpellsModule as SpellModule,
  },
  {
    label: 'Pathfinder 1e',
    systemId: 'pf1e',
    maxLevel: 9,
    module: pf1eSpellsModule as SpellModule,
  },
  {
    label: 'Pathfinder 2e',
    systemId: 'pf2e',
    maxLevel: 10,
    module: pf2eSpellsModule as SpellModule,
  },
];

const VALID_SCHOOLS = [
  'abjuration',
  'conjuration',
  'divination',
  'enchantment',
  'evocation',
  'illusion',
  'necromancy',
  'transmutation',
  'arcane',
  'divine',
  'occult',
  'primal',
];
const DND5E_ATTACK_PATTERN = /(ranged|melee)\s+spell attack/i;
const TOUCH_ATTACK_PATTERN =
  /(ranged|melee)\s+touch attack|touch attack to hit|make a (ranged|melee) touch attack/i;
const SPELL_ATTACK_PATTERN = /(ranged|melee)?\s*spell attack|touch attack/i;
const SAVE_TEXT_PATTERN =
  /\bbasic\s+(Fortitude|Reflex|Will)\s+save\b|\b(?:must\s+)?attempt\s+(?:an?|the)?\s*(Fortitude|Reflex|Will|Intelligence|Wisdom|Dexterity|Constitution)\s+save\b/i;

function getDuplicateNames(spells: Spell[]): string[] {
  const counts = new Map<string, number>();
  spells.forEach((spell) => {
    counts.set(spell.name, (counts.get(spell.name) ?? 0) + 1);
  });
  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([name]) => name)
    .sort();
}

function stableFingerprintValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(stableFingerprintValue);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, entryValue]) => [key, stableFingerprintValue(entryValue)])
    );
  }

  return value;
}

function getVariantFingerprint(spell: Spell): string {
  const {
    id: _id,
    classes: _classes,
    levelsByClass: _levelsByClass,
    description: _description,
    ...rest
  } = spell;
  return JSON.stringify(stableFingerprintValue(rest));
}

function collectRawSpells(module: SpellModule, maxLevel: number): Spell[] {
  const rawSpells = [...((module.cantrips as Spell[] | undefined) ?? [])];

  for (let level = 1; level <= maxLevel; level += 1) {
    rawSpells.push(...((module[`level${level}Spells`] as Spell[] | undefined) ?? []));
  }

  return rawSpells;
}

function getRawSpellById(module: SpellModule, maxLevel: number, id: string): Spell {
  const spell = collectRawSpells(module, maxLevel).find((entry) => entry.id === id);
  expect(spell).toBeTruthy();
  return spell!;
}

describe('Spell Data Validation', () => {
  describe.each(spellModules)('$label', ({ systemId, maxLevel, module, allowedDuplicateNames }) => {
    const { allSpells, spellsByLevel, spellsById, spellsByClass, spellsBySchool, spellStats } =
      module;

    it('uses the normalized catalog surface', () => {
      expect(Array.isArray(allSpells)).toBe(true);
      expect(typeof spellsByLevel).toBe('object');
      expect(typeof spellsById).toBe('object');
      expect(typeof spellsByClass).toBe('object');
      expect(typeof spellsBySchool).toBe('object');
      expect(typeof spellStats.total).toBe('number');
    });

    it('has no duplicate spell ids in the canonical catalog', () => {
      const ids = allSpells.map((spell) => spell.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('has only intentional duplicate spell names', () => {
      const duplicateNames = getDuplicateNames(allSpells);

      if (systemId === 'dnd-3.5e') {
        duplicateNames.forEach((name) => {
          const spells = allSpells.filter((spell) => spell.name === name);
          expect(spells.length).toBeGreaterThan(1);
          spells.forEach((spell) => {
            expect(spell.levelsByClass).toBeTruthy();
            expect(Object.keys(spell.levelsByClass ?? {}).length).toBeGreaterThan(0);
          });
        });
        return;
      }

      expect(duplicateNames).toEqual((allowedDuplicateNames ?? []).sort());
    });

    it('has internally consistent by-level counts', () => {
      const byLevelTotal = Object.values(spellsByLevel).reduce(
        (sum, spells) => sum + spells.length,
        0
      );
      expect(byLevelTotal).toBe(allSpells.length);
      expect(spellStats.total).toBe(allSpells.length);
    });

    it('has at least one spell at each reachable level', () => {
      for (let level = 0; level <= maxLevel; level += 1) {
        expect((spellsByLevel[level] ?? []).length).toBeGreaterThan(0);
      }
    });

    it('has valid required fields on every spell', () => {
      allSpells.forEach((spell) => {
        expect(spell.id).toMatch(/^[a-z][a-z0-9-]*$/);
        expect(spell.name.length).toBeGreaterThan(0);
        expect(spell.system).toBe(systemId);
        expect(spell.source.length).toBeGreaterThan(0);
        expect(spell.level).toBeGreaterThanOrEqual(0);
        expect(spell.level).toBeLessThanOrEqual(maxLevel);
        expect(VALID_SCHOOLS).toContain(spell.school);
        expect(spell.castingTime?.type).toBeTruthy();
        expect(spell.range?.type).toBeTruthy();
        expect(spell.duration?.type).toBeTruthy();
        expect(typeof spell.components?.verbal).toBe('boolean');
        expect(typeof spell.components?.somatic).toBe('boolean');
        expect(typeof spell.components?.material).toBe('boolean');
        expect(typeof spell.concentration).toBe('boolean');
        expect(typeof spell.ritual).toBe('boolean');
        expect(spell.description.length).toBeGreaterThan(10);
        expect(spell.classes.length).toBeGreaterThan(0);
      });
    });

    it('keeps school and class indexes aligned with the canonical spell list', () => {
      const bySchoolTotal = Object.values(spellsBySchool).reduce(
        (sum, spells) => sum + spells.length,
        0
      );
      const byClassTotal = Object.values(spellsByClass).reduce(
        (sum, spells) => sum + spells.length,
        0
      );

      expect(bySchoolTotal).toBe(allSpells.length);
      expect(byClassTotal).toBeGreaterThanOrEqual(allSpells.length);
    });
  });

  it('stores class level mappings directly in PF1e raw spell files', () => {
    collectRawSpells(pf1eSpellsModule as SpellModule, 9).forEach((spell) => {
      expect(spell.levelsByClass).toBeTruthy();
      expect(spell.levelsByClass).toEqual(
        Object.fromEntries(spell.classes.map((className) => [className, spell.level]))
      );
    });
  });

  it('stores PF1e touch and ray attack rolls as structured flags', () => {
    collectRawSpells(pf1eSpellsModule as SpellModule, 9)
      .filter((spell) => TOUCH_ATTACK_PATTERN.test(spell.description))
      .forEach((spell) => {
        expect(spell.attackRoll).toBe(true);
      });
  });

  it('stores explicit 3.5e touch and ray attack rolls as structured flags', () => {
    collectRawSpells(dnd35eSpellsModule as SpellModule, 9)
      .filter((spell) => TOUCH_ATTACK_PATTERN.test(spell.description))
      .forEach((spell) => {
        expect(spell.attackRoll).toBe(true);
      });
  });

  it('collapses structured-identical 3.5e class-split variants in the canonical catalog', () => {
    const fingerprints = dnd35eSpellsModule.allSpells.map(getVariantFingerprint);
    expect(new Set(fingerprints).size).toBe(fingerprints.length);
    expect(dnd35eSpellsModule.spellIdAliases['create-water-cleric-35e']).toBe('create-water-35e');
    expect(dnd35eSpellsModule.getSpell('create-water-cleric-35e')?.id).toBe('create-water-35e');
    expect(dnd35eSpellsModule.spellIdAliases['cure-minor-wounds-cleric-35e']).toBe(
      'cure-minor-wounds-druid-35e'
    );
    expect(dnd35eSpellsModule.getSpell('cure-minor-wounds-cleric-35e')?.id).toBe(
      'cure-minor-wounds-druid-35e'
    );
  });

  it('stores explicit 5e spell attack rolls in raw spell files for both editions', () => {
    [dnd5e2014SpellsModule, dnd5e2024SpellsModule].forEach((spellModule) => {
      collectRawSpells(spellModule as SpellModule, 9)
        .filter((spell) => DND5E_ATTACK_PATTERN.test(spell.description))
        .forEach((spell) => {
          expect(spell.attackRoll).toBe(true);
        });
    });
  });

  it('stores curated 5e save metadata directly in raw spell files', () => {
    const curated2014SaveIds = [
      'light',
      'stinking-cloud',
      'sickening-radiance',
      'wall-of-stone',
      'awaken',
      'reverse-gravity',
      'power-word-stun',
      'maze',
      'imprisonment',
    ];
    const curated2024SaveIds = [
      'friends',
      'light',
      'ray-of-sickness',
      'blinding-smite',
      'stinking-cloud',
      'sickening-radiance',
      'awaken',
      'wall-of-stone',
      'chain-lightning',
      'reverse-gravity',
      'maze',
      'power-word-stun',
    ];

    curated2014SaveIds.forEach((id) => {
      const spell = getRawSpellById(dnd5e2014SpellsModule as SpellModule, 9, id);
      expect(spell.savingThrow).toBeTruthy();
      expect(spell.savingThrowText).toBeTruthy();
    });

    curated2024SaveIds.forEach((id) => {
      const spell = getRawSpellById(dnd5e2024SpellsModule as SpellModule, 9, id);
      expect(spell.savingThrow).toBeTruthy();
      expect(spell.savingThrowText).toBeTruthy();
    });
  });

  it('stores browser-visible target or effect metadata for the curated parity spell set', () => {
    const curated5e2014MetadataIds = [
      'light',
      'awaken',
      'wall-of-stone',
      'blinding-smite',
      'maze',
      'power-word-stun',
      'imprisonment',
    ];
    const curated5e2024MetadataIds = [
      'friends',
      'light',
      'ray-of-sickness',
      'blinding-smite',
      'awaken',
      'wall-of-stone',
      'chain-lightning',
      'maze',
      'power-word-stun',
    ];
    const curatedPf2eMetadataIds = ['teleport-pf2e', 'time-stop-9-pf2e', 'wish-pf2e'];

    curated5e2014MetadataIds.forEach((id) => {
      const spell = getRawSpellById(dnd5e2014SpellsModule as SpellModule, 9, id);
      expect(Boolean(spell.target || spell.effect)).toBe(true);
    });

    curated5e2024MetadataIds.forEach((id) => {
      const spell = getRawSpellById(dnd5e2024SpellsModule as SpellModule, 9, id);
      expect(Boolean(spell.target || spell.effect)).toBe(true);
    });

    curatedPf2eMetadataIds.forEach((id) => {
      const spell = getRawSpellById(pf2eSpellsModule as SpellModule, 10, id);
      expect(Boolean(spell.target || spell.effect)).toBe(true);
    });
  });

  it('stores browser-visible metadata for the curated high-rank PF2e parity set', () => {
    const curatedPf2eHighRankMetadataIds = [
      'energy-aegis-pf2e',
      'forcecage-7-pf2e',
      'plane-shift-pf2e',
      'power-word-blind-7-pf2e',
      'regenerate-7-pf2e',
      'reverse-gravity-pf2e',
      'maze-pf2e',
      'power-word-stun-8-pf2e',
      'prismatic-wall-8-pf2e',
      'sunburst-8-pf2e',
      'disjunction-pf2e',
      'gate-9-pf2e',
      'implosion-pf2e',
      'power-word-kill-9-pf2e',
      'shapechange-9-pf2e',
      'cataclysm-10-pf2e',
      'fabricated-truth-pf2e',
      'revival-pf2e',
    ];

    curatedPf2eHighRankMetadataIds.forEach((id) => {
      const spell = getRawSpellById(pf2eSpellsModule as SpellModule, 10, id);
      expect(Boolean(spell.target || spell.effect || spell.area || spell.areaOfEffect)).toBe(true);
    });
  });

  it('keeps core 5e shared spell save and area metadata aligned across editions', () => {
    const sharedParityIds = ['light', 'stinking-cloud', 'sickening-radiance', 'reverse-gravity'];

    sharedParityIds.forEach((id) => {
      const spell2014 = getRawSpellById(dnd5e2014SpellsModule as SpellModule, 9, id);
      const spell2024 = getRawSpellById(dnd5e2024SpellsModule as SpellModule, 9, id);

      expect(spell2024.savingThrow).toEqual(spell2014.savingThrow);
      expect(Boolean(spell2024.savingThrowText)).toBe(Boolean(spell2014.savingThrowText));
      expect(spell2024.areaOfEffect).toEqual(spell2014.areaOfEffect);
    });
  });

  it('preserves class level mappings for 3.5e spells', () => {
    dnd35eSpellsModule.allSpells.forEach((spell) => {
      expect(spell.levelsByClass).toBeTruthy();
      expect(Object.keys(spell.levelsByClass ?? {}).length).toBeGreaterThan(0);
    });
  });

  it('stores traditions directly in PF2e raw spell files', () => {
    collectRawSpells(pf2eSpellsModule as SpellModule, 10).forEach((spell) => {
      expect(spell.traditions?.length).toBeGreaterThan(0);
    });
  });

  it('stores cantrip heightening directly in PF2e raw spell files', () => {
    (((pf2eSpellsModule as SpellModule).cantrips as Spell[] | undefined) ?? []).forEach((spell) => {
      expect(spell.heightening).toBeTruthy();
      expect(spell.heightening?.mode).toBe('cantrip');
    });
  });

  it('stores fixed PF2e heightening for canonicalized cross-rank spells', () => {
    ['teleport-pf2e', 'time-stop-9-pf2e', 'wish-pf2e'].forEach((id) => {
      const spell = getRawSpellById(pf2eSpellsModule as SpellModule, 10, id);
      expect(spell.heightening).toBeTruthy();
      expect(spell.heightening?.mode).toBe('fixed');
      expect(spell.heightening?.summary).toBeTruthy();
      expect(Object.keys(spell.heightening?.ranks ?? {}).length).toBeGreaterThan(0);
    });
  });

  it('stores PF2e attack rolls and save text when descriptions already state them', () => {
    const rawPf2eSpells = collectRawSpells(pf2eSpellsModule as SpellModule, 10);

    rawPf2eSpells
      .filter((spell) => SPELL_ATTACK_PATTERN.test(spell.description))
      .forEach((spell) => {
        expect(spell.attackRoll).toBe(true);
      });

    rawPf2eSpells
      .filter((spell) => SAVE_TEXT_PATTERN.test(spell.description))
      .forEach((spell) => {
        expect(spell.savingThrow).toBeTruthy();
        expect(spell.savingThrowText).toBeTruthy();
      });
  });

  it('resolves canonical spell aliases for 5e 2024 duplicates', () => {
    expect(dnd5e2024SpellsModule.spellIdAliases).toMatchObject({
      'tensors-floating-disk': 'tensers-floating-disk',
      'otilukes-resilience-6': 'otilukes-resilience-4',
    });
    expect(dnd5e2024SpellsModule.getSpell('tensors-floating-disk')?.id).toBe(
      'tensers-floating-disk'
    );
    expect(dnd5e2024SpellsModule.spellsById['tensors-floating-disk']?.id).toBe(
      'tensers-floating-disk'
    );
  });

  it('resolves canonical spell aliases for PF2e cross-rank duplicates', () => {
    expect(pf2eSpellsModule.spellIdAliases).toMatchObject({
      'teleport-7-pf2e': 'teleport-pf2e',
      'time-stop-pf2e': 'time-stop-9-pf2e',
      'wish-9-pf2e': 'wish-pf2e',
    });
    expect(pf2eSpellsModule.getSpell('teleport-7-pf2e')?.id).toBe('teleport-pf2e');
    expect(pf2eSpellsModule.getSpell('time-stop-pf2e')?.id).toBe('time-stop-9-pf2e');
    expect(pf2eSpellsModule.getSpell('wish-9-pf2e')?.id).toBe('wish-pf2e');
  });
});
