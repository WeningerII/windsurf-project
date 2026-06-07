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
  'pf1e-alter-self',
  'pf1e-animate-rope',
  'pf1e-arcane-lock',
  'pf1e-arcane-sight',
  'pf1e-augury',
  'pf1e-bears-endurance-mass',
  'pf1e-blink',
  'pf1e-bulls-strength-mass',
  'pf1e-call-lightning-storm',
  'pf1e-cats-grace-mass',
  'pf1e-charm-animal',
  'pf1e-command-greater',
  'pf1e-commune',
  'pf1e-commune-with-nature',
  'pf1e-comprehend-languages',
  'pf1e-contact-other-plane',
  'pf1e-contingency',
  'pf1e-create-greater-undead',
  'pf1e-cure-critical-wounds-mass',
  'pf1e-cure-minor-wounds',
  'pf1e-cure-moderate-wounds-mass',
  'pf1e-cure-serious-wounds-mass',
  'pf1e-deeper-darkness',
  'pf1e-detect-chaos',
  'pf1e-detect-good',
  'pf1e-detect-law',
  'pf1e-disguise-self',
  'pf1e-dispel-chaos',
  'pf1e-dispel-good',
  'pf1e-dispel-law',
  'pf1e-dispel-magic-greater',
  'pf1e-divination',
  'pf1e-dream',
  'pf1e-eagles-splendor-mass',
  'pf1e-enlarge-person-mass',
  'pf1e-entropic-shield',
  'pf1e-erase',
  'pf1e-ethereal-jaunt',
  'pf1e-etherealness',
  'pf1e-expeditious-retreat',
  'pf1e-fabricate',
  'pf1e-false-life',
  'pf1e-false-vision',
  'pf1e-find-traps',
  'pf1e-fire-shield',
  'pf1e-floating-disk',
  'pf1e-forcecage',
  'pf1e-forceful-hand',
  'pf1e-glibness',
  'pf1e-globe-of-invulnerability-greater',
  'pf1e-glyph-of-warding-greater',
  'pf1e-grasping-hand',
  'pf1e-greater-arcane-sight',
  'pf1e-greater-prying-eyes',
  'pf1e-greater-shadow-evocation',
  'pf1e-heal-mass',
  'pf1e-heroism-greater',
  'pf1e-hold-animal',
  'pf1e-hold-portal',
  'pf1e-inflict-critical-wounds',
  'pf1e-inflict-critical-wounds-mass',
  'pf1e-inflict-moderate-wounds',
  'pf1e-inflict-moderate-wounds-mass',
  'pf1e-inflict-serious-wounds',
  'pf1e-inflict-serious-wounds-mass',
  'pf1e-interposing-hand',
  'pf1e-invisibility-purge',
  'pf1e-iron-body',
  'pf1e-know-direction',
  'pf1e-legend-lore',
  'pf1e-locate-creature',
  'pf1e-longstrider',
  'pf1e-mages-faithful-hound',
  'pf1e-mages-magnificent-mansion',
  'pf1e-mages-private-sanctum',
  'pf1e-mages-sword',
  'pf1e-magic-circle-against-chaos',
  'pf1e-magic-circle-against-good',
  'pf1e-magic-circle-against-law',
  'pf1e-magic-fang-greater',
  'pf1e-major-creation',
  'pf1e-make-whole',
  'pf1e-mass-misdirection',
  'pf1e-maze',
  'pf1e-meld-into-stone',
  'pf1e-mirror-image',
  'pf1e-misdirection',
  'pf1e-moment-of-prescience',
  'pf1e-mount',
  'pf1e-nystuls-magic-aura',
  'pf1e-overland-flight',
  'pf1e-owls-wisdom-mass',
  'pf1e-permanent-image',
  'pf1e-phantom-steed',
  'pf1e-planar-ally',
  'pf1e-planar-ally-greater',
  'pf1e-polar-ray',
  'pf1e-prismatic-sphere',
  'pf1e-programmed-image',
  'pf1e-protection-from-chaos',
  'pf1e-protection-from-good',
  'pf1e-protection-from-law',
  'pf1e-prying-eyes',
  'pf1e-rage',
  'pf1e-read-magic',
  'pf1e-restoration-greater',
  'pf1e-reversal-of-fortune',
  'pf1e-righteous-might',
  'pf1e-scintillating-pattern',
  'pf1e-scrying-greater',
  'pf1e-secret-page',
  'pf1e-shades',
  'pf1e-shapechange',
  'pf1e-shield',
  'pf1e-simulacrum',
  'pf1e-speak-with-animals',
  'pf1e-speak-with-plants',
  'pf1e-spectral-hand',
  'pf1e-spell-immunity-greater',
  'pf1e-spell-turning',
  'pf1e-stone-tell',
  'pf1e-summon-instrument',
  'pf1e-summon-monster-ii',
  'pf1e-summon-monster-iii',
  'pf1e-summon-monster-iv',
  'pf1e-summon-monster-ix',
  'pf1e-summon-monster-v',
  'pf1e-summon-monster-vi',
  'pf1e-summon-monster-vii',
  'pf1e-summon-monster-viii',
  'pf1e-summon-natures-ally-ii',
  'pf1e-summon-natures-ally-iii',
  'pf1e-summon-natures-ally-iv',
  'pf1e-summon-natures-ally-ix',
  'pf1e-summon-natures-ally-v',
  'pf1e-summon-natures-ally-vi',
  'pf1e-summon-natures-ally-vii',
  'pf1e-summon-natures-ally-viii',
  'pf1e-symbol-of-pain',
  'pf1e-symbol-of-weakness',
  'pf1e-sympathetic-vibration',
  'pf1e-time-stop',
  'pf1e-tiny-hut',
  'pf1e-touch-of-idiocy',
  'pf1e-transformation',
  'pf1e-tree-shape',
  'pf1e-tree-stride',
  'pf1e-true-resurrection',
  'pf1e-true-strike',
  'pf1e-unseen-servant',
  'pf1e-waves-of-exhaustion',
  'pf1e-whispering-wind',
  'pf1e-zone-of-silence',
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
