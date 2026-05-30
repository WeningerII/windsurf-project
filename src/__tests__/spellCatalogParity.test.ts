import { describe, expect, it } from 'vitest';
import * as dnd5e2014SpellsModule from '../data/dnd/5e-2014/spells';
import * as dnd5e2024SpellsModule from '../data/dnd/5e-2024/spells';
import * as dnd35eSpellsModule from '../data/dnd/3.5e/spells';
import * as pf1eSpellsModule from '../data/pathfinder/1e/spells';
import * as pf2eSpellsModule from '../data/pathfinder/2e/spells';
import type { Spell } from '../types/magic/spells';

const spellModules = [
  dnd5e2014SpellsModule,
  dnd5e2024SpellsModule,
  dnd35eSpellsModule,
  pf1eSpellsModule,
  pf2eSpellsModule,
];

type SpellModule = {
  allSpells: Spell[];
};

const DND35E_SOURCE_BLOCKED_SPELL_IDS = [
  'bleed-35e',
  'mass-misdirection-35e',
  'reversal-of-fortune-35e',
] as const;

// These AoN source pages do not expose a Saving Throw row. Keep this list
// explicit so source-backed PF1e save coverage cannot regress silently.
const PF1E_SOURCE_ROWS_WITHOUT_SAVING_THROW = [
  'pf1e-know-direction',
  'pf1e-read-magic',
  'pf1e-comprehend-languages',
  'pf1e-expeditious-retreat',
  'pf1e-shield',
  'pf1e-alter-self',
  'pf1e-mirror-image',
  'pf1e-blink',
  'pf1e-contact-other-plane',
  'pf1e-time-stop',
] as const;

const fieldCoverageBaselines: Array<{
  label: string;
  module: SpellModule;
  minimums: {
    browserMetadata?: number;
    classLevelMappings?: number;
    heightening?: number;
    savingThrowRows?: number;
    sourceUrls?: number;
    spellResistanceDetails?: number;
    structuredCastingTime?: number;
    structuredComponents?: number;
    traits?: number;
    traditions?: number;
  };
}> = [
  {
    label: 'dnd-5e-2014',
    module: dnd5e2014SpellsModule,
    minimums: {
      browserMetadata: 77,
      heightening: 63,
    },
  },
  {
    label: 'dnd-5e-2024',
    module: dnd5e2024SpellsModule,
    minimums: {
      browserMetadata: 113,
      heightening: 101,
    },
  },
  {
    label: 'dnd-3.5e',
    module: dnd35eSpellsModule,
    minimums: {
      browserMetadata: 200,
      classLevelMappings: 428,
      savingThrowRows: 300,
      sourceUrls: 425,
      spellResistanceDetails: 300,
      structuredCastingTime: 428,
      structuredComponents: 428,
    },
  },
  {
    label: 'pf1e',
    module: pf1eSpellsModule,
    minimums: {
      browserMetadata: 80,
      classLevelMappings: 134,
      savingThrowRows: 120,
      sourceUrls: 134,
      structuredCastingTime: 134,
      structuredComponents: 134,
    },
  },
  {
    label: 'pf2e',
    module: pf2eSpellsModule,
    minimums: {
      browserMetadata: 36,
      heightening: 60,
      traits: 143,
      traditions: 143,
    },
  },
];

function countBrowserMetadata(spells: Spell[]) {
  return spells.filter((spell) =>
    Boolean(spell.target || spell.effect || spell.area || spell.areaOfEffect)
  ).length;
}

function countHeightening(spells: Spell[]) {
  return spells.filter((spell) => Boolean(spell.heightening || spell.atHigherLevels)).length;
}

function countClassLevelMappings(spells: Spell[]) {
  return spells.filter(
    (spell) => spell.levelsByClass && Object.keys(spell.levelsByClass).length > 0
  ).length;
}

function countSavingThrowRows(spells: Spell[]) {
  return spells.filter((spell) => Boolean(spell.savingThrowText || spell.savingThrow)).length;
}

function countSpellResistanceDetails(spells: Spell[]) {
  return spells.filter((spell) => Boolean(spell.spellResistanceDetail)).length;
}

function countStructuredCastingTime(spells: Spell[]) {
  return spells.filter((spell) => Boolean(spell.castingTime?.type)).length;
}

function countStructuredComponents(spells: Spell[]) {
  return spells.filter(
    (spell) =>
      typeof spell.components?.verbal === 'boolean' &&
      typeof spell.components?.somatic === 'boolean' &&
      typeof spell.components?.material === 'boolean'
  ).length;
}

function countSourceUrls(spells: Spell[]) {
  return spells.filter((spell) => Boolean(spell.sourceUrl)).length;
}

function countTraditions(spells: Spell[]) {
  return spells.filter((spell) => (spell.traditions?.length ?? 0) > 0).length;
}

function countTraits(spells: Spell[]) {
  return spells.filter((spell) => (spell.traits?.length ?? 0) > 0).length;
}

function getSpellById(spells: Spell[], id: string) {
  const spell = spells.find((entry) => entry.id === id);
  expect(spell, `${id} should exist`).toBeTruthy();
  return spell as Spell;
}

function sortedIds(ids: readonly string[]) {
  return [...ids].sort((left, right) => left.localeCompare(right));
}

describe('Spell Catalog Parity', () => {
  spellModules.forEach((spellModule) => {
    describe(spellModule.allSpells[0]?.system ?? 'unknown', () => {
      it('exports the shared helper surface', () => {
        expect(Array.isArray(spellModule.allSpells)).toBe(true);
        expect(typeof spellModule.spellsByLevel).toBe('object');
        expect(typeof spellModule.spellsById).toBe('object');
        expect(typeof spellModule.spellsByClass).toBe('object');
        expect(typeof spellModule.spellsBySchool).toBe('object');
        expect(typeof spellModule.spellStats).toBe('object');
        expect(typeof spellModule.spellIdAliases).toBe('object');
        expect(typeof spellModule.getSpell).toBe('function');
        expect('spellsByClassAndLevel' in spellModule).toBe(true);
      });

      it('keeps stats aligned with the canonical spell list', () => {
        expect(spellModule.spellStats.total).toBe(spellModule.allSpells.length);
        expect(
          Object.values(spellModule.spellsByLevel).reduce((sum, spells) => sum + spells.length, 0)
        ).toBe(spellModule.allSpells.length);
      });
    });
  });

  it('keeps explicit spell-field coverage at or above the accepted parity baseline', () => {
    fieldCoverageBaselines.forEach(({ label, module, minimums }) => {
      const { allSpells } = module;

      if (minimums.browserMetadata != null) {
        expect(
          countBrowserMetadata(allSpells),
          `${label} browser metadata coverage`
        ).toBeGreaterThanOrEqual(minimums.browserMetadata);
      }

      if (minimums.classLevelMappings != null) {
        expect(
          countClassLevelMappings(allSpells),
          `${label} class-level mapping coverage`
        ).toBeGreaterThanOrEqual(minimums.classLevelMappings);
      }

      if (minimums.heightening != null) {
        expect(
          countHeightening(allSpells),
          `${label} heightening/scaling coverage`
        ).toBeGreaterThanOrEqual(minimums.heightening);
      }

      if (minimums.savingThrowRows != null) {
        expect(
          countSavingThrowRows(allSpells),
          `${label} explicit saving throw row coverage`
        ).toBeGreaterThanOrEqual(minimums.savingThrowRows);
      }

      if (minimums.sourceUrls != null) {
        expect(countSourceUrls(allSpells), `${label} source URL coverage`).toBeGreaterThanOrEqual(
          minimums.sourceUrls
        );
      }

      if (minimums.spellResistanceDetails != null) {
        expect(
          countSpellResistanceDetails(allSpells),
          `${label} spell-resistance detail coverage`
        ).toBeGreaterThanOrEqual(minimums.spellResistanceDetails);
      }

      if (minimums.structuredCastingTime != null) {
        expect(
          countStructuredCastingTime(allSpells),
          `${label} structured casting-time coverage`
        ).toBeGreaterThanOrEqual(minimums.structuredCastingTime);
      }

      if (minimums.structuredComponents != null) {
        expect(
          countStructuredComponents(allSpells),
          `${label} structured components coverage`
        ).toBeGreaterThanOrEqual(minimums.structuredComponents);
      }

      if (minimums.traits != null) {
        expect(countTraits(allSpells), `${label} trait coverage`).toBeGreaterThanOrEqual(
          minimums.traits
        );
      }

      if (minimums.traditions != null) {
        expect(countTraditions(allSpells), `${label} tradition coverage`).toBeGreaterThanOrEqual(
          minimums.traditions
        );
      }
    });
  });

  it('keeps curated 3.5e SRD raw metadata exactness checks', () => {
    const fireball = getSpellById(dnd35eSpellsModule.allSpells, 'fireball-3-35e');
    expect(fireball.sourceUrl).toBe('https://www.d20srd.org/srd/spells/fireball.htm');
    expect(fireball.castingTime).toEqual({ type: 'standard', amount: 1 });
    expect(fireball.area).toBe('20-ft.-radius spread');
    expect(fireball.savingThrowText).toBe('Reflex half');
    expect(fireball.savingThrow).toEqual({
      attribute: 'dex',
      success: 'half',
      description: 'Reflex half',
    });

    const animateDead = getSpellById(dnd35eSpellsModule.allSpells, 'animate-dead-35e');
    expect(animateDead.sourceUrl).toBe('https://www.d20srd.org/srd/spells/animateDead.htm');
    expect(animateDead.components.materialCost).toBe(25);
    expect(animateDead.components.materialConsumed).toBe(true);
    expect(animateDead.savingThrowText).toBe('None');

    const holdPerson = getSpellById(dnd35eSpellsModule.allSpells, 'hold-person-35e');
    expect(holdPerson.sourceUrl).toBe('https://www.d20srd.org/srd/spells/holdPerson.htm');
    expect(holdPerson.components.focus).toBe(true);
    expect(holdPerson.components.divineFocus).toBe(true);
    expect(holdPerson.savingThrowText).toBe('Will negates; see text');
    expect(holdPerson.spellResistance).toBe(true);

    const callLightning = getSpellById(dnd35eSpellsModule.allSpells, 'call-lightning-druid-35e');
    expect(callLightning.castingTime).toEqual({ type: 'rounds', rounds: 1 });
    expect(callLightning.effect).toBe('One or more 30-ft.-long vertical lines of lightning');

    const sourceBlockedIds = dnd35eSpellsModule.allSpells
      .filter((spell) => !spell.sourceUrl)
      .map((spell) => spell.id);
    expect(sortedIds(sourceBlockedIds)).toEqual(sortedIds(DND35E_SOURCE_BLOCKED_SPELL_IDS));
  });

  it('keeps curated PF1e AoN raw metadata exactness checks', () => {
    const alarm = getSpellById(pf1eSpellsModule.allSpells, 'pf1e-alarm');
    expect(alarm.sourceUrl).toBe('https://www.aonprd.com/SpellDisplay.aspx?ItemName=Alarm');
    expect(alarm.area).toBe('20-ft.-radius emanation centered on a point in space');
    expect(alarm.components.focusDescription).toBe(
      'a tiny bell and a piece of very fine silver wire'
    );
    expect(alarm.components.divineFocus).toBe(true);
    expect(alarm.savingThrowText).toBe('none');

    const charmPerson = getSpellById(pf1eSpellsModule.allSpells, 'pf1e-charm-person');
    expect(charmPerson.sourceUrl).toBe(
      'https://www.aonprd.com/SpellDisplay.aspx?ItemName=Charm%20Person'
    );
    expect(charmPerson.target).toBe('one humanoid creature');
    expect(charmPerson.savingThrowText).toBe('Will negates');

    const fireball = getSpellById(pf1eSpellsModule.allSpells, 'pf1e-fireball');
    expect(fireball.sourceUrl).toBe('https://www.aonprd.com/SpellDisplay.aspx?ItemName=Fireball');
    expect(fireball.castingTime).toEqual({ type: 'standard', amount: 1 });
    expect(fireball.area).toBe('20-ft.-radius spread');
    expect(fireball.savingThrowText).toBe('Reflex half');

    const scrying = getSpellById(pf1eSpellsModule.allSpells, 'pf1e-scrying');
    expect(scrying.components.materialDescription).toBe('a pool of water');
    expect(scrying.components.focusDescription).toBe('a silver mirror worth 1,000 gp');
    expect(scrying.components.focus).toBe(true);
  });

  it('keeps every PF1e source-backed explicit saving throw row captured', () => {
    const sourceBackedRowsWithoutSave = pf1eSpellsModule.allSpells
      .filter((spell) => spell.sourceUrl && !spell.savingThrowText && !spell.savingThrow)
      .map((spell) => spell.id);

    expect(sortedIds(sourceBackedRowsWithoutSave)).toEqual(
      sortedIds(PF1E_SOURCE_ROWS_WITHOUT_SAVING_THROW)
    );
  });
});
