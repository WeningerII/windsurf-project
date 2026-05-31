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
        expect(duplicateNames).toEqual([]);
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

  it('merges purely-level-divergent 3.5e class-split variants and preserves per-class levels', () => {
    const cureModerate = dnd35eSpellsModule.getSpell('cure-moderate-wounds-cleric-35e');
    expect(cureModerate?.level).toBe(2);
    expect(cureModerate?.classes).toEqual(['cleric', 'druid']);
    expect(cureModerate?.levelsByClass).toMatchObject({ cleric: 2, druid: 3 });

    const druidAlias = dnd35eSpellsModule.spellIdAliases['cure-moderate-wounds-druid-35e'];
    expect(druidAlias).toBe('cure-moderate-wounds-cleric-35e');
    expect(dnd35eSpellsModule.getSpell('cure-moderate-wounds-druid-35e')?.id).toBe(
      'cure-moderate-wounds-cleric-35e'
    );

    const heal = dnd35eSpellsModule.getSpell('heal-cleric-35e');
    expect(heal?.level).toBe(6);
    expect(heal?.levelsByClass).toMatchObject({ cleric: 6, druid: 7 });
    expect(dnd35eSpellsModule.getSpell('heal-druid-35e')?.id).toBe('heal-cleric-35e');

    const levelDivergentAliases: Record<
      string,
      { canonical: string; levelsByClass: Record<string, number> }
    > = {
      'fire-trap-druid-35e': {
        canonical: 'fire-trap-35e',
        levelsByClass: { druid: 2, sorcerer: 4, wizard: 4 },
      },
      'animate-dead-cleric-35e': {
        canonical: 'animate-dead-35e',
        levelsByClass: { cleric: 3, sorcerer: 4, wizard: 4 },
      },
      'bestow-curse-cleric-35e': {
        canonical: 'bestow-curse-35e',
        levelsByClass: { cleric: 3, sorcerer: 4, wizard: 4 },
      },
      'contagion-druid-35e': {
        canonical: 'contagion-35e',
        levelsByClass: { cleric: 3, druid: 3, sorcerer: 4, wizard: 4 },
      },
      'stone-shape-druid-35e': {
        canonical: 'stone-shape-35e',
        levelsByClass: { cleric: 3, druid: 3, sorcerer: 4, wizard: 4 },
      },
      'tongues-cleric-35e': {
        canonical: 'tongues-35e',
        levelsByClass: { bard: 3, cleric: 4, sorcerer: 3, wizard: 3 },
      },
      'dismissal-cleric-35e': {
        canonical: 'dismissal-35e',
        levelsByClass: { cleric: 4, sorcerer: 5, wizard: 5 },
      },
      'stoneskin-druid-35e': {
        canonical: 'stoneskin-35e',
        levelsByClass: { druid: 5, sorcerer: 4, wizard: 4 },
      },
      'wall-fire-druid-35e': {
        canonical: 'wall-of-fire-35e',
        levelsByClass: { druid: 5, sorcerer: 4, wizard: 4 },
      },
      'antimagic-field-cleric-35e': {
        canonical: 'antimagic-field-35e',
        levelsByClass: { cleric: 8, sorcerer: 6, wizard: 6 },
      },
      'repulsion-cleric-35e': {
        canonical: 'repulsion-35e',
        levelsByClass: { cleric: 7, sorcerer: 6, wizard: 6 },
      },
    };

    Object.entries(levelDivergentAliases).forEach(([aliasId, { canonical, levelsByClass }]) => {
      const spell = dnd35eSpellsModule.getSpell(aliasId);
      expect(spell?.id).toBe(canonical);
      expect(spell?.levelsByClass).toEqual(levelsByClass);
    });
  });

  it('reconciles 3.5e school-divergent canonical/stub entries to their SRD school', () => {
    const detectMagic = dnd35eSpellsModule.getSpell('detect-magic-35e');
    expect(detectMagic?.school).toBe('divination');
    expect(dnd35eSpellsModule.getSpell('detect-magic-druid-35e')?.id).toBe('detect-magic-35e');

    const removeDisease = dnd35eSpellsModule.getSpell('remove-disease-35e');
    expect(removeDisease?.school).toBe('conjuration');
    expect(dnd35eSpellsModule.getSpell('remove-disease-druid-35e')?.id).toBe('remove-disease-35e');

    const detectPoison = dnd35eSpellsModule.getSpell('detect-poison-35e');
    expect(detectPoison?.school).toBe('divination');
    expect(dnd35eSpellsModule.getSpell('detect-poison-druid-35e')?.id).toBe('detect-poison-35e');

    const light = dnd35eSpellsModule.getSpell('light-35e');
    expect(light?.school).toBe('evocation');
    expect(dnd35eSpellsModule.getSpell('light-cleric-35e')?.id).toBe('light-35e');
    expect(dnd35eSpellsModule.getSpell('light-druid-35e')?.id).toBe('light-35e');
  });

  it('collapses 3.5e description stubs into the canonical spell entry', () => {
    const stubAliases: Record<string, string> = {
      'mending-druid-35e': 'mending-35e',
      'read-magic-druid-35e': 'read-magic-35e',
      'hold-person-cleric-35e': 'hold-person-35e',
      'dispel-magic-cleric-35e': 'dispel-magic-35e',
      'summon-monster-iii-cleric-35e': 'summon-monster-3-35e',
      'death-ward-cleric-35e': 'death-ward-35e',
      'dimensional-anchor-cleric-35e': 'dimensional-anchor-35e',
      'divination-cleric-35e': 'divination-35e',
      'freedom-movement-druid-35e': 'freedom-of-movement-35e',
      'ice-storm-druid-35e': 'ice-storm-35e',
      'scrying-druid-35e': 'scrying-35e',
      'spell-immunity-cleric-35e': 'spell-immunity-35e',
      'spell-resistance-cleric-35e': 'spell-resistance-35e',
      'summon-monster-v-cleric-35e': 'summon-monster-5-35e',
      'true-seeing-cleric-35e': 'true-seeing-6-35e',
      'true-seeing-35e': 'true-seeing-6-35e',
      'bears-endurance-mass-druid-35e': 'bears-endurance-mass-35e',
      'create-undead-cleric-35e': 'create-undead-35e',
      'dispel-magic-greater-cleric-35e': 'dispel-magic-greater-6-35e',
      'find-path-druid-35e': 'find-the-path-35e',
      'geas-quest-cleric-35e': 'geas-quest-35e',
      'harm-cleric-35e': 'harm-35e',
      'heroes-feast-cleric-35e': 'heroes-feast-35e',
      'move-earth-druid-35e': 'move-earth-35e',
      'symbol-fear-cleric-35e': 'symbol-of-fear-35e',
      'symbol-persuasion-cleric-35e': 'symbol-of-persuasion-35e',
      'undeath-death-cleric-35e': 'undeath-to-death-35e',
      'sunbeam-druid-35e': 'sunbeam-35e',
      'discern-location-cleric-35e': 'discern-location-35e',
      'foresight-druid-35e': 'foresight-35e',
    };

    Object.entries(stubAliases).forEach(([aliasId, canonicalId]) => {
      expect(dnd35eSpellsModule.getSpell(aliasId)?.id).toBe(canonicalId);
    });

    expect(dnd35eSpellsModule.getSpell('read-magic-druid-35e')?.classes).toEqual([
      'bard',
      'cleric',
      'druid',
      'paladin',
      'ranger',
      'sorcerer',
      'wizard',
    ]);
    expect(dnd35eSpellsModule.getSpell('true-seeing-cleric-35e')?.levelsByClass).toEqual({
      cleric: 5,
      druid: 7,
      sorcerer: 5,
      wizard: 5,
    });
  });

  it('records explicit 3.5e unknown-divergent duplicate resolutions', () => {
    const manuallyResolvedAliases: Record<
      string,
      { canonical: string; levelsByClass: Record<string, number> }
    > = {
      'flare-druid-35e': {
        canonical: 'flare-35e',
        levelsByClass: { druid: 0, sorcerer: 0, wizard: 0 },
      },
      'protection-energy-druid-35e': {
        canonical: 'protection-from-energy-35e',
        levelsByClass: { cleric: 3, druid: 3, ranger: 3, sorcerer: 3, wizard: 3 },
      },
      'chain-lightning-35e': {
        canonical: 'chain-lightning-6-35e',
        levelsByClass: { sorcerer: 6, wizard: 6 },
      },
      'suggestion-mass-8-35e': {
        canonical: 'suggestion-mass-35e',
        levelsByClass: { bard: 6, sorcerer: 6, wizard: 6 },
      },
      'summon-monster-vii-cleric-35e': {
        canonical: 'summon-monster-7-35e',
        levelsByClass: { bard: 7, cleric: 7, sorcerer: 7, wizard: 7 },
      },
      'gate-cleric-35e': {
        canonical: 'gate-35e',
        levelsByClass: { cleric: 9, sorcerer: 9, wizard: 9 },
      },
      'shapechange-druid-35e': {
        canonical: 'shapechange-35e',
        levelsByClass: { druid: 9, wizard: 9 },
      },
    };

    Object.entries(manuallyResolvedAliases).forEach(([aliasId, { canonical, levelsByClass }]) => {
      const spell = dnd35eSpellsModule.getSpell(aliasId);
      expect(spell?.id).toBe(canonical);
      expect(spell?.levelsByClass).toEqual(levelsByClass);
    });
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
    // Sickening Radiance is SRD 5.2 / 2024-only; it is not in SRD 5.1, so it was
    // removed from the 2014 catalog and no longer appears in this 2014 list.
    const curated2014SaveIds = [
      'light',
      'stinking-cloud',
      'wall-of-stone',
      'awaken',
      'reverse-gravity',
      'power-word-stun',
      'maze',
      'imprisonment',
    ];
    // Friends, Blinding Smite, and Sickening Radiance are not in SRD 5.2 and were
    // removed from the 2024 catalog.
    const curated2024SaveIds = [
      'light',
      'ray-of-sickness',
      'stinking-cloud',
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
      // Blinding Smite, Feign Death, and Beast Sense are SRD 5.2 / 2024-only and
      // were removed from the 2014 catalog (not in SRD 5.1).
      'light',
      'awaken',
      'wall-of-stone',
      'maze',
      'power-word-stun',
      'imprisonment',
      'guidance',
      'resistance',
      'jump',
      'longstrider',
      'mage-armor',
      'barkskin',
      'darkvision',
      'fly',
      'revivify',
      'bestow-curse',
      'freedom-of-movement',
    ];
    // Friends, Blinding Smite, Beast Sense, and the homebrew Otiluke's Resilience
    // are not in SRD 5.2 and were removed from the 2024 catalog.
    const curated5e2024MetadataIds = [
      'light',
      'ray-of-sickness',
      'awaken',
      'wall-of-stone',
      'chain-lightning',
      'maze',
      'power-word-stun',
      'resistance',
      'spare-the-dying',
      'jump',
      'longstrider',
      'mage-armor',
      'barkskin',
      'darkvision',
      'fly',
      'revivify',
      'freedom-of-movement',
      'foresight',
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

  it('stores explicit touch targets for curated 5e touch-spell metadata', () => {
    const curated2014TouchTargets: Record<string, string> = {
      'spare-the-dying': '1 living creature with 0 hit points you touch',
      'cure-wounds': '1 creature you touch',
      mending: '1 object you touch',
      'shocking-grasp': '1 creature you touch',
      shillelagh: '1 club or quarterstaff you are holding',
      identify: '1 object you touch',
      'inflict-wounds': '1 creature you touch',
      heroism: '1 willing creature you touch',
      'protection-from-evil-and-good': '1 willing creature you touch',
      invisibility: '1 creature you touch',
      'lesser-restoration': '1 creature you touch',
      'enhance-ability': '1 creature you touch',
      'arcane-lock': '1 closed door, window, gate, chest, or other entryway you touch',
      'continual-flame': '1 object you touch',
      'gentle-repose': '1 corpse or other remains you touch',
      'protection-from-energy': '1 willing creature you touch',
      nondetection:
        '1 willing creature, place, or object no larger than 10 feet in any dimension you touch',
      'remove-curse': '1 creature or object you touch',
      tongues: '1 creature you touch',
      'stone-shape':
        '1 stone object of Medium size or smaller or a section of stone no more than 5 feet in any dimension',
      'death-ward': '1 creature you touch',
      stoneskin: '1 willing creature you touch',
      'raise-dead': '1 dead creature you touch',
      'greater-restoration': '1 creature you touch',
      'true-seeing': '1 willing creature you touch',
      resurrection: '1 dead creature you touch',
      'true-resurrection': '1 creature you touch',
    };

    const curated2024TouchTargets: Record<string, string> = {
      'cure-wounds': '1 creature you touch',
      mending: '1 object you touch',
      'shocking-grasp': '1 creature you touch',
      shillelagh: '1 club or quarterstaff you are holding',
      identify: '1 object you touch',
      heroism: '1 willing creature you touch',
      'inflict-wounds': '1 creature you touch',
      'protection-from-evil-and-good': '1 willing creature you touch',
      'arcane-lock': '1 closed door, window, gate, chest, or other entryway you touch',
      'continual-flame': '1 object you touch',
      'enhance-ability': '1 creature you touch',
      'gentle-repose': '1 corpse or other remains you touch',
      invisibility: '1 creature you touch',
      'lesser-restoration': '1 creature you touch',
      'magic-weapon': '1 nonmagical weapon you touch',
      'protection-from-poison': '1 creature you touch',
      'spider-climb': '1 willing creature you touch',
      'bestow-curse': '1 creature you touch',
      'gaseous-form': '1 willing creature you touch',
      nondetection:
        '1 willing creature, place, or object no larger than 10 feet in any dimension you touch',
      'protection-from-energy': '1 willing creature you touch',
      'remove-curse': '1 creature or object you touch',
      tongues: '1 creature you touch',
      'death-ward': '1 creature you touch',
      'stone-shape':
        '1 stone object of Medium size or smaller or a section of stone no more than 5 feet in any dimension',
      stoneskin: '1 willing creature you touch',
      'greater-restoration': '1 creature you touch',
      'raise-dead': '1 dead creature you touch',
      'true-seeing': '1 willing creature you touch',
      regenerate: '1 creature you touch',
      resurrection: '1 dead creature you touch',
      'mind-blank': '1 willing creature you touch',
      'true-resurrection': '1 creature you touch',
    };

    Object.entries(curated2014TouchTargets).forEach(([id, target]) => {
      expect(getRawSpellById(dnd5e2014SpellsModule as SpellModule, 9, id).target).toBe(target);
    });

    Object.entries(curated2024TouchTargets).forEach(([id, target]) => {
      expect(getRawSpellById(dnd5e2024SpellsModule as SpellModule, 9, id).target).toBe(target);
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
    // Sickening Radiance dropped: SRD 5.2-only, removed from the 2014 catalog.
    const sharedParityIds = ['light', 'stinking-cloud', 'reverse-gravity'];

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

  it('stores spell-resistance detail for legacy raw spells that expose spell resistance', () => {
    [dnd35eSpellsModule, pf1eSpellsModule].forEach((spellModule) => {
      collectRawSpells(spellModule as SpellModule, 9)
        .filter((spell) => spell.spellResistance)
        .forEach((spell) => {
          expect(spell.spellResistanceDetail).toBeTruthy();
        });
    });
  });

  it('stores traditions directly in PF2e raw spell files', () => {
    collectRawSpells(pf2eSpellsModule as SpellModule, 10).forEach((spell) => {
      expect(spell.traditions?.length).toBeGreaterThan(0);
    });
  });

  it('stores derived PF2e spell traits directly in raw spell files', () => {
    collectRawSpells(pf2eSpellsModule as SpellModule, 10).forEach((spell) => {
      expect(spell.traits?.length).toBeGreaterThan(0);
      expect(new Set(spell.traits).size).toBe(spell.traits?.length);
      expect(spell.traits).toContain(spell.school);

      if (spell.level === 0) {
        expect(spell.traits).toContain('cantrip');
      }

      if (spell.attackRoll) {
        expect(spell.traits).toContain('attack');
      }

      if (spell.components.verbal) {
        expect(spell.traits).toContain('concentrate');
      }

      if (spell.components.somatic || spell.components.material) {
        expect(spell.traits).toContain('manipulate');
      }
    });
  });

  it('stores cantrip heightening directly in PF2e raw spell files', () => {
    (((pf2eSpellsModule as SpellModule).cantrips as Spell[] | undefined) ?? []).forEach((spell) => {
      expect(spell.heightening).toBeTruthy();
      expect(spell.heightening?.mode).toBe('cantrip');
    });
  });

  it('stores AoN-verified heightening for the curated PF2e CRB parity set', () => {
    const intervalHeightening = [
      { id: 'burning-hands-pf2e', interval: 1 },
      { id: 'magic-missile-pf2e', interval: 2 },
      { id: 'sound-burst-pf2e', interval: 1 },
      { id: 'fireball-pf2e', interval: 1 },
      { id: 'lightning-bolt-pf2e', interval: 1 },
      { id: 'disintegrate-6-pf2e', interval: 1 },
    ];
    const fixedHeightening = [
      'command-pf2e',
      'fear-pf2e',
      'jump-pf2e',
      'haste-pf2e',
      'slow-pf2e',
      'heroism-pf2e',
    ];

    intervalHeightening.forEach(({ id, interval }) => {
      const spell = getRawSpellById(pf2eSpellsModule as SpellModule, 10, id);
      expect(spell.heightening, `${id} heightening`).toBeTruthy();
      expect(spell.heightening?.mode, `${id} heightening mode`).toBe('interval');
      expect(spell.heightening?.interval, `${id} heightening interval`).toBe(interval);
    });

    fixedHeightening.forEach((id) => {
      const spell = getRawSpellById(pf2eSpellsModule as SpellModule, 10, id);
      expect(spell.heightening, `${id} heightening`).toBeTruthy();
      expect(spell.heightening?.mode, `${id} heightening mode`).toBe('fixed');
      expect(spell.heightening?.ranks, `${id} heightening ranks`).toBeTruthy();
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

  it('resolves the canonical Floating Disk alias for the 5e 2024 typo id', () => {
    // Tenser's Floating Disk was renamed to its SRD name (Floating Disk); the
    // Otiluke's Resilience duplicates were non-SRD and removed.
    expect(dnd5e2024SpellsModule.spellIdAliases).toMatchObject({
      'tensors-floating-disk': 'floating-disk',
    });
    expect(dnd5e2024SpellsModule.getSpell('tensors-floating-disk')?.id).toBe('floating-disk');
    expect(dnd5e2024SpellsModule.spellsById['tensors-floating-disk']?.id).toBe('floating-disk');
    expect(
      dnd5e2024SpellsModule.allSpells.some((spell) => /^otilukes-resilience(-\d+)?$/.test(spell.id))
    ).toBe(false);
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
