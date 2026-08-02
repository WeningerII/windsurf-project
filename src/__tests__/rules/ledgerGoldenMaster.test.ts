/**
 * RFC 003 CONSOLIDATION GATE — behavior equivalence for the contribution ledger.
 *
 * `docs/rfc/003-rules-ir-and-effects.md` Phase 3 ("ledger unification") re-backed
 * every per-system `contributionLedger.ts` builder onto ONE shared resolver:
 * each builder now compiles `EffectInstance[]`, folds them through
 * `resolveEffects`, and projects them with `toContributionLedger`. The RFC's
 * stated equivalence discipline for that migration was "existing ledger tests
 * must pass unchanged" — but those tests assert hand-picked properties
 * (row sums equal the engine value, a named source appears, a bare character
 * yields nothing). They do not pin the ledger's FULL output, so a change to the
 * shared fold that alters a row's id, label, category, operation, ordering, or
 * an untested target passes every one of them.
 *
 * This file is the missing half: a golden master of the COMPLETE projected
 * ledger for all seven systems. It asserts nothing about correctness — the
 * per-system tests own that — and everything about *equivalence*. Any edit to
 * `rules/ir/ledgerView.ts`, `rules/resolver/resolve.ts`, `rules/compile/*`, or a
 * builder that moves a single field of a single row fails here, in the system it
 * moved it in.
 *
 * WHY THE INPUTS ARE NOT INVENTED. Every case is built from the system's own
 * `createDefault*Data()` factory plus explicit, typed overrides, and the two
 * d20-legacy cases are run through the REAL engines' `prepareData` first. A
 * fixture that hand-writes its input shape drifts from the type it claims to
 * describe; these cannot.
 *
 * TO BUMP THE MASTERS DELIBERATELY (a real, reviewed behavior change):
 *   UPDATE_LEDGER_GOLDEN=1 npx vitest run src/__tests__/rules/ledgerGoldenMaster.test.ts
 * and read the diff. An unexplained diff is a regression, not a rebase.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import type { ContributionLedgerEntry } from '../../types/core/contributionLedger';
import type { GameSystemId } from '../../types/game-systems';
import type { CharacterDocument, SystemDataModel } from '../../types/core/document';
import type { Feat, SpellSlots } from '../../types/core/character';

import { resolveCharacterEffects } from '../../rules';
import { buildDnd5eContributionLedger } from '../../systems/dnd5e/shared/contributionLedger';
import { buildD20LegacyContributionLedger } from '../../systems/d20-legacy/contributionLedger';
import { buildPf2eContributionLedger } from '../../systems/pf2e/contributionLedger';
import { buildMam3eContributionLedger } from '../../systems/mam3e/contributionLedger';
import { buildDaggerheartContributionLedger } from '../../systems/daggerheart/contributionLedger';

import { createDefaultDnd5eData, type Dnd5eDataModel } from '../../systems/dnd5e/data-model';
import {
  createDefaultDnd5e2024Data,
  type Dnd5e2024DataModel,
} from '../../systems/dnd5e-2024/data-model';
import {
  createDefaultDnd35eData,
  type Dnd35eClassLevel,
  type Dnd35eDataModel,
} from '../../systems/dnd35e/data-model';
import {
  createDefaultPf1eData,
  type Pf1eClassLevel,
  type Pf1eDataModel,
} from '../../systems/pf1e/data-model';
import { createDefaultPf2eData, type Pf2eDataModel } from '../../systems/pf2e/data-model';
import { createDefaultMam3eData, type Mam3eDataModel } from '../../systems/mam3e/data-model';
import {
  createDefaultDaggerheartData,
  type DaggerheartDataModel,
} from '../../systems/daggerheart/data-model';
import { Dnd35eEngine } from '../../systems/dnd35e/engine';
import { Pf1eEngine } from '../../systems/pf1e/engine';
import type { Power } from '../../types/mam/powers';

const GOLDEN_PATH = path.resolve(process.cwd(), 'src/__tests__/rules/ledger-golden-master.json');
const TEST_DATE = new Date('2026-05-01T00:00:00.000Z');

/** The seven systems this repo ships. A case is required for every one. */
const ALL_SYSTEMS = [
  'dnd-5e-2014',
  'dnd-5e-2024',
  'dnd-3.5e',
  'pf1e',
  'pf2e',
  'mam3e',
  'daggerheart',
] as const satisfies readonly GameSystemId[];

/**
 * COMPILE-TIME exhaustiveness. The runtime anti-vacuity test below checks CASES
 * against `ALL_SYSTEMS` — but `ALL_SYSTEMS` is hand-written, so an eighth member
 * added to `GameSystemId` would leave that test passing while the gate quietly
 * stopped covering the new system: a hole in exactly the shape the anti-vacuity
 * test claims to forbid. This alias resolves to `never` only while every
 * `GameSystemId` is listed above; otherwise it fails to typecheck, naming the
 * uncovered system.
 */
type AssertNever<T extends never> = T;
const UNCOVERED_SYSTEMS: AssertNever<Exclude<GameSystemId, (typeof ALL_SYSTEMS)[number]>>[] = [];

function doc<T extends SystemDataModel>(
  id: string,
  systemId: GameSystemId,
  system: T
): CharacterDocument<T> {
  return { id, name: id, systemId, system, createdAt: TEST_DATE, updatedAt: TEST_DATE };
}

function emptySpellSlots(): SpellSlots {
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

// ── 5e (both editions) ──────────────────────────────────────────────────────
// One shared shape, applied to each edition's own default data. The builder is
// edition-parameterized (`loadClassesForSystem(systemId)` resolves a DIFFERENT
// class catalog, and `systemId` is stamped on every row), so the two editions
// are genuinely two cases, not one case run twice.

const FIVE_E_EQUIPMENT = [
  {
    itemId: 'leather-armor',
    slot: 'chest' as const,
    attuned: false,
    armorClass: 11,
    armorType: 'light' as const,
  },
  { itemId: 'shield', slot: 'offHand' as const, attuned: false, shieldBonus: 2 },
  // Bonus-bearing gear, so the resolver-projected slice of the ledger is not empty.
  { itemId: 'ring-of-protection', slot: 'ring1' as const, attuned: true, acBonus: 1 },
  {
    itemId: 'longsword-plus-1',
    slot: 'mainHand' as const,
    attuned: false,
    customName: '+1 Longsword',
    attackBonus: 1,
    damageBonus: 1,
    damageType: 'slashing',
  },
];

const FIVE_E_TEMPLATE_STATE = {
  classDerivedProficiencies: {
    armor: ['light', 'medium'],
    weapons: ['simple'],
    tools: [],
    savingThrows: ['wis', 'cha'],
  },
  backgroundDerived: { tools: ['herbalism-kit'], languages: ['celestial'] },
  featDerivedAutomation: {
    abilityScores: { wis: 1 },
    armor: ['heavy'],
    weapons: [],
    tools: [],
    languages: [],
    savingThrows: [],
  },
};

const FIVE_E_ABILITIES = { str: 10, dex: 14, con: 12, int: 10, wis: 16, cha: 10 };

/**
 * Cleric 3, not 1, on purpose. Life Domain grants its always-prepared spells at
 * CLASS LEVEL 1 in 2014 and at 3 in 2024 (SRD 5.2 picks a subclass at 3), so a
 * level-1 case exercises the always-prepared branch in one edition and skips it
 * entirely in the other. Level 3 fires it in both — and the masters still differ,
 * which is the RAW difference made visible rather than hidden.
 */
const FIVE_E_LEVEL = 3;

function dnd5e2014Document(): CharacterDocument<Dnd5eDataModel> {
  const system: Dnd5eDataModel = {
    ...createDefaultDnd5eData(),
    level: FIVE_E_LEVEL,
    baseAttributes: FIVE_E_ABILITIES,
    classLevels: [
      { classId: 'cleric', subclassId: 'life-domain', level: FIVE_E_LEVEL, hitDieRolls: [] },
    ],
    spellcasting: {
      classes: [{ classId: 'cleric', ability: 'wis', spellcastingLevel: FIVE_E_LEVEL }],
      spellsKnown: [],
      spellsPrepared: [],
      spellSlots: emptySpellSlots(),
    },
    equipment: FIVE_E_EQUIPMENT,
    templateState: FIVE_E_TEMPLATE_STATE,
  };
  return doc('golden-dnd5e-2014', 'dnd-5e-2014', system);
}

function dnd5e2024Document(): CharacterDocument<Dnd5e2024DataModel> {
  const system: Dnd5e2024DataModel = {
    ...createDefaultDnd5e2024Data(),
    level: FIVE_E_LEVEL,
    baseAttributes: FIVE_E_ABILITIES,
    classLevels: [
      { classId: 'cleric', subclassId: 'life-domain', level: FIVE_E_LEVEL, hitDieRolls: [] },
    ],
    spellcasting: {
      classes: [{ classId: 'cleric', ability: 'wis', spellcastingLevel: FIVE_E_LEVEL }],
      spellsKnown: [],
      spellsPrepared: [],
      spellSlots: emptySpellSlots(),
    },
    equipment: FIVE_E_EQUIPMENT,
    templateState: FIVE_E_TEMPLATE_STATE,
  };
  return doc('golden-dnd5e-2024', 'dnd-5e-2024', system);
}

// ── d20-legacy (3.5e + PF1e) ────────────────────────────────────────────────

function cl35(over: Partial<Dnd35eClassLevel>): Dnd35eClassLevel {
  return {
    classId: 'fighter',
    level: 1,
    hitDieRolls: [],
    bab: 'full',
    fortSave: 'good',
    refSave: 'poor',
    willSave: 'poor',
    skillPointsPerLevel: 2,
    ...over,
  };
}

function cl1(over: Partial<Pf1eClassLevel>): Pf1eClassLevel {
  return {
    classId: 'fighter',
    level: 1,
    hitDieRolls: [],
    bab: 'full',
    fortSave: 'good',
    refSave: 'poor',
    willSave: 'poor',
    skillPointsPerLevel: 2,
    favoredClassBonus: 'hp',
    ...over,
  };
}

/**
 * 3.5e: multiclass BAB, a good/poor save spread with a misc modifier, synergy
 * ranks that fire, and TWO differently-typed AC bonuses (enhancement + deflection)
 * so the typed-stacking discipline is inside the master.
 */
function dnd35eDocument(): CharacterDocument<Dnd35eDataModel> {
  const system: Dnd35eDataModel = {
    ...createDefaultDnd35eData(),
    baseAttributes: { str: 16, dex: 12, con: 14, int: 10, wis: 10, cha: 10 },
    classLevels: [
      cl35({ classId: 'fighter', level: 5, bab: 'full' }),
      cl35({ classId: 'wizard', level: 4, bab: 'half', fortSave: 'poor', willSave: 'good' }),
    ],
    saves: {
      fortitude: { base: 0, ability: 0, misc: 1, total: 0 },
      reflex: { base: 0, ability: 0, misc: 0, total: 0 },
      will: { base: 0, ability: 0, misc: 0, total: 0 },
    },
    skillRanks: { tumble: 5, jump: 5, bluff: 8, 'handle-animal': 3 },
    equipment: [
      {
        itemId: 'chain-shirt-plus-1',
        name: '+1 Chain Shirt',
        slot: 'chest',
        equipped: true,
        armorClass: 4,
        armorType: 'light',
        acBonus: 1,
        bonusType: 'enhancement',
      },
      {
        // Insight, not deflection: `BonusType` has no `deflection` member.
        // See the KNOWN-GAP test at the bottom of this file.
        itemId: 'dusty-rose-ioun-stone',
        name: 'Dusty Rose Ioun Stone',
        slot: 'head',
        equipped: true,
        acBonus: 1,
        bonusType: 'insight',
      },
    ],
  };
  return new Dnd35eEngine().prepareData(doc('golden-dnd35e', 'dnd-3.5e', system));
}

/** PF1e: three-quarter BAB, two good saves, and NO synergy rows (no subsystem). */
function pf1eDocument(): CharacterDocument<Pf1eDataModel> {
  const system: Pf1eDataModel = {
    ...createDefaultPf1eData(),
    baseAttributes: { str: 16, dex: 12, con: 14, int: 10, wis: 10, cha: 10 },
    classLevels: [
      cl1({
        classId: 'cleric',
        level: 6,
        bab: 'three-quarter',
        fortSave: 'good',
        willSave: 'good',
      }),
    ],
    skillRanks: { acrobatics: 6, bluff: 8, 'handle-animal': 6 },
    equipment: [
      {
        // Enhancement, not natural armor: `BonusType` has no `natural` member.
        // See the KNOWN-GAP test at the bottom of this file.
        itemId: 'breastplate-plus-2',
        name: '+2 Breastplate',
        slot: 'chest',
        equipped: true,
        armorClass: 6,
        armorType: 'medium',
        acBonus: 2,
        bonusType: 'enhancement',
      },
    ],
  };
  return new Pf1eEngine().prepareData(doc('golden-pf1e', 'pf1e', system));
}

// ── PF2e ────────────────────────────────────────────────────────────────────

/**
 * PF2e: an equipped item-bucket AC bonus PLUS two value-bearing status
 * conditions (frightened 2, sickened 1), so the master carries the
 * worst-per-bucket stacking the `pf2e-status` policy applies.
 */
function pf2eDocument(): CharacterDocument<Pf2eDataModel> {
  const system: Pf2eDataModel = {
    ...createDefaultPf2eData(),
    baseAttributes: { str: 10, dex: 14, con: 12, int: 10, wis: 12, cha: 10 },
    equipment: [
      {
        itemId: 'bracers-of-armor',
        name: 'Bracers of Armor',
        bulk: 1,
        equipped: true,
        acBonus: 1,
        pf2eBucket: 'item',
      },
    ],
    conditions: [
      { id: 'frightened', name: 'Frightened', value: 2 },
      { id: 'sickened', name: 'Sickened', value: 1 },
      { id: 'clumsy', name: 'Clumsy', value: 1 },
    ],
  };
  return doc('golden-pf2e', 'pf2e', system);
}

// ── M&M 3e ──────────────────────────────────────────────────────────────────

function mam3ePower(over: Partial<Power> = {}): Power {
  return {
    id: 'damage',
    name: 'Damage',
    system: 'mam3e',
    source: "Hero's Handbook",
    type: 'attack',
    action: 'standard',
    range: 'close',
    duration: 'instant',
    baseCost: 1,
    perRank: true,
    rank: 5,
    description: 'Damage effect.',
    effects: ['Damage'],
    ...over,
  };
}

/**
 * M&M: a power with an extra, a flaw AND an unrecognized modifier id, so the
 * master carries both the cost math and the manual-boundary row shape.
 */
function mam3eDocument(): CharacterDocument<Mam3eDataModel> {
  const system: Mam3eDataModel = {
    ...createDefaultMam3eData(),
    powers: [
      mam3ePower({
        extras: ['area'],
        flaws: ['limited'],
        modifierRanks: { area: 2, limited: 1 },
      }),
      mam3ePower({
        id: 'protection',
        name: 'Protection',
        type: 'defense',
        duration: 'permanent',
        rank: 4,
        extras: ['not-a-real-modifier-id'],
      }),
    ],
  };
  return doc('golden-mam3e', 'mam3e', system);
}

// ── Daggerheart ─────────────────────────────────────────────────────────────

const DAGGERHEART_ATTRIBUTES = {
  agility: 3,
  strength: 1,
  finesse: 2,
  instinct: 0,
  presence: 1,
  knowledge: 0,
};

function daggerheartCard(
  id: string,
  name: string,
  domain: string,
  level: number,
  location: 'loadout' | 'vault'
) {
  return { id, name, domain, level, location, description: '' };
}

/**
 * Daggerheart, ARMORED: equipped armor + flat-bonus and derived-bonus loadout
 * cards. Covers the resolver-projected additive slice, including the two derived
 * terms whose MAGNITUDE is computed from character state
 * (`evasion-half-trait`, `severe-threshold-proficiency`). The vault card must
 * contribute nothing — an inert row here would mean loadout gating regressed.
 */
function daggerheartArmoredDocument(): CharacterDocument<DaggerheartDataModel> {
  const system: DaggerheartDataModel = {
    ...createDefaultDaggerheartData(),
    level: 5,
    attributes: DAGGERHEART_ATTRIBUTES,
    armorId: 'daggerheart-armor-gambeson-armor-tier-1',
    domainCards: [
      daggerheartCard('blade-fortified-armor', 'Fortified Armor', 'blade', 2, 'loadout'),
      daggerheartCard('bone-i-see-it-coming', 'I See It Coming', 'bone', 1, 'loadout'),
      daggerheartCard('valor-rise-up', 'Rise Up', 'valor', 2, 'loadout'),
      daggerheartCard('valor-armorer', 'Armorer', 'valor', 1, 'vault'),
    ],
  };
  return doc('golden-daggerheart-armored', 'daggerheart', system);
}

/**
 * Daggerheart, UNARMORED with Bare Bones. This case exists for ONE row: the
 * `unarmored-defense-by-tier` override, whose value is an OBJECT
 * (`{armorScore, majorThreshold, severeThreshold}`) that the IR's `EffectValue`
 * (`number | string | number[] | null`) provably cannot carry. It is therefore
 * the one Daggerheart contribution that is NOT a resolver projection but a
 * hand-built `ContributionLedgerEntry`, stitched back in at its source position.
 *
 * That residual is exactly what a consolidation gate must pin hardest: it is the
 * row with no shared implementation behind it, so nothing else in the suite
 * would notice if its shape, position or provenance drifted.
 */
function daggerheartUnarmoredDocument(): CharacterDocument<DaggerheartDataModel> {
  const system: DaggerheartDataModel = {
    ...createDefaultDaggerheartData(),
    level: 5,
    attributes: DAGGERHEART_ATTRIBUTES,
    armorId: '',
    domainCards: [
      daggerheartCard('valor-bare-bones', 'Bare Bones', 'valor', 1, 'loadout'),
      daggerheartCard('bone-i-see-it-coming', 'I See It Coming', 'bone', 1, 'loadout'),
    ],
  };
  return doc('golden-daggerheart-unarmored', 'daggerheart', system);
}

// ── The cases ───────────────────────────────────────────────────────────────

interface GoldenCase {
  /** Stable key into the golden file. Renaming one is a deliberate bump. */
  id: string;
  systemId: GameSystemId;
  build: () => Promise<ContributionLedgerEntry[]>;
}

const CASES: readonly GoldenCase[] = [
  {
    id: 'dnd-5e-2014/cleric-armor-shield-magic-items',
    systemId: 'dnd-5e-2014',
    build: async () =>
      (await buildDnd5eContributionLedger(dnd5e2014Document(), 'dnd-5e-2014')).entries,
  },
  {
    id: 'dnd-5e-2024/cleric-armor-shield-magic-items',
    systemId: 'dnd-5e-2024',
    build: async () =>
      (await buildDnd5eContributionLedger(dnd5e2024Document(), 'dnd-5e-2024')).entries,
  },
  {
    id: 'dnd-3.5e/fighter-wizard-saves-synergy-typed-ac',
    systemId: 'dnd-3.5e',
    build: async () => buildD20LegacyContributionLedger(dnd35eDocument(), 'dnd-3.5e').entries,
  },
  {
    id: 'pf1e/cleric-bab-saves-natural-armor',
    systemId: 'pf1e',
    build: async () => buildD20LegacyContributionLedger(pf1eDocument(), 'pf1e').entries,
  },
  {
    id: 'pf2e/item-ac-plus-status-conditions',
    systemId: 'pf2e',
    build: async () => buildPf2eContributionLedger(pf2eDocument()).entries,
  },
  {
    id: 'mam3e/power-cost-extras-flaws-and-unknown-modifier',
    systemId: 'mam3e',
    build: async () => buildMam3eContributionLedger(mam3eDocument()).entries,
  },
  {
    id: 'daggerheart/armored-loadout-cards-and-derived-passives',
    systemId: 'daggerheart',
    build: async () => buildDaggerheartContributionLedger(daggerheartArmoredDocument()).entries,
  },
  {
    id: 'daggerheart/unarmored-bare-bones-object-valued-override',
    systemId: 'daggerheart',
    build: async () => buildDaggerheartContributionLedger(daggerheartUnarmoredDocument()).entries,
  },
];

// ── Resolved totals: the half a ledger master structurally cannot see ────────

/**
 * `resolveEffects` returns `ledger: applicable` — every effect that passed its
 * CONDITION guard, *before* stacking discipline is applied. `effectToLedgerEntry`
 * then drops `stackPolicy` entirely, because `ContributionLedgerEntry` has no
 * such field. Two consequences, both of which would make a ledger-only master a
 * gate with a hole in it:
 *
 *   1. A row that stacking DISCARDS from the total is still in the ledger, so
 *      the ledger is byte-identical whether 3.5e takes largest-of-type or sums.
 *   2. Changing `equipStackPolicy` — the single function encoding the per-system
 *      stacking rules the whole consolidation rests on — moves no ledger row.
 *
 * So the master captures resolved `byTarget` totals too. Each case deliberately
 * puts TWO bonuses of the SAME discipline in competition, which is the only
 * arrangement in which the policies produce different numbers:
 *
 *   - 5e / Daggerheart / M&M ('sum')          → +1 and +2 both apply  = +3
 *   - 3.5e / PF1e ({bonusType:'enhancement'}) → largest only          = +2
 *   - PF2e ('pf2e-item')                      → highest in bucket     = +2
 */
const COMPETING_AC_ITEMS = [
  { itemId: 'lesser-ac-item', customName: 'Lesser AC item', acBonus: 1 },
  { itemId: 'greater-ac-item', customName: 'Greater AC item', acBonus: 2 },
];

/**
 * A feat-sourced AC modifier alongside the two items, so the master also pins
 * how `compileModifierEffects` targets and stacks against equipment. `Modifier`
 * carries no `target`; `type: 'armor-class'` is what resolves to target `'ac'`.
 */
const COMPETING_AC_FEAT: Feat = {
  id: 'golden-ac-feat',
  name: 'Golden AC Feat',
  description: '',
  source: 'golden-master',
  modifiers: [{ value: 1, type: 'armor-class', source: 'Golden AC Feat' }],
};

interface ResolvedCase {
  id: string;
  systemId: GameSystemId;
  resolve: () => Record<string, number>;
}

const RESOLVED_CASES: readonly ResolvedCase[] = ALL_SYSTEMS.map((systemId) => ({
  id: `${systemId}/competing-same-discipline-ac-bonuses`,
  systemId,
  resolve: () => {
    const { result } = resolveCharacterEffects(systemId, {
      baseArmorClass: 10,
      equipment: COMPETING_AC_ITEMS,
      feats: [COMPETING_AC_FEAT],
    });
    return Object.fromEntries(
      Object.entries(result.byTarget).map(([target, resolved]) => [target, resolved.total])
    );
  },
}));

interface GoldenFile {
  ledgers: Record<string, ContributionLedgerEntry[]>;
  resolvedTotals: Record<string, Record<string, number>>;
}

async function captureAll(): Promise<GoldenFile> {
  const ledgers: GoldenFile['ledgers'] = {};
  for (const testCase of CASES) {
    ledgers[testCase.id] = await testCase.build();
  }
  const resolvedTotals: GoldenFile['resolvedTotals'] = {};
  for (const testCase of RESOLVED_CASES) {
    resolvedTotals[testCase.id] = testCase.resolve();
  }
  return { ledgers, resolvedTotals };
}

function readGolden(): GoldenFile {
  if (!existsSync(GOLDEN_PATH)) {
    throw new Error(
      `Missing ledger golden master at ${GOLDEN_PATH}. Capture it with UPDATE_LEDGER_GOLDEN=1.`
    );
  }
  return JSON.parse(readFileSync(GOLDEN_PATH, 'utf8')) as GoldenFile;
}

describe('RFC 003 ledger consolidation — behavior-equivalence golden master', () => {
  if (process.env.UPDATE_LEDGER_GOLDEN === '1') {
    it('CAPTURE MODE: rewrites the golden master from current code', async () => {
      // Written through Prettier with the repo's own config, so a re-capture on
      // UNCHANGED code produces a zero-line diff. A raw `JSON.stringify` here
      // disagrees with the checked-in file on array wrapping alone, which would
      // bury every real row change under a screenful of reformatting — the exact
      // failure mode the "read the diff" instruction above exists to prevent.
      const prettier = await import('prettier');
      const options = await prettier.resolveConfig(GOLDEN_PATH);
      writeFileSync(
        GOLDEN_PATH,
        // Indent-2 input, not compact: Prettier's JSON printer preserves an
        // object's expanded form when its first key starts on a new line, so
        // this keeps one row-field per line (readable diffs) while still letting
        // Prettier collapse the short arrays exactly as the checked-in file has
        // them.
        await prettier.format(JSON.stringify(await captureAll(), null, 2), {
          ...options,
          filepath: GOLDEN_PATH,
          parser: 'json',
        }),
        'utf8'
      );
      expect(existsSync(GOLDEN_PATH)).toBe(true);
    });
    return;
  }

  const golden = readGolden();

  /**
   * ANTI-VACUITY. A golden master of `[]` passes forever while explaining
   * nothing, and a case list missing a system is a gate with a hole in exactly
   * the shape of the untested system. `buildDnd5eContributionLedger` is called
   * with 'dnd-5e-2024' by `useDnd5eContributionLedger` on every 2024 sheet, and
   * before this file EVERY ledger test passed 'dnd-5e-2014'.
   */
  it('covers all seven systems, and every case produces rows', () => {
    // Consumes the compile-time guard declared above, so `noUnusedLocals` keeps
    // it alive: it is unconditionally empty at runtime and load-bearing at
    // typecheck time.
    expect(UNCOVERED_SYSTEMS).toHaveLength(0);
    const covered = new Set(CASES.map((c) => c.systemId));
    for (const systemId of ALL_SYSTEMS) {
      expect([...covered], `${systemId} has no golden ledger case`).toContain(systemId);
    }
    expect(Object.keys(golden.ledgers).sort()).toEqual([...CASES].map((c) => c.id).sort());
    expect(Object.keys(golden.resolvedTotals).sort()).toEqual(
      [...RESOLVED_CASES].map((c) => c.id).sort()
    );
    for (const testCase of CASES) {
      expect(
        golden.ledgers[testCase.id].length,
        `${testCase.id} must produce rows`
      ).toBeGreaterThan(0);
    }
  });

  it.each(CASES.map((c) => [c.id, c] as const))(
    'ledger output is unchanged — %s',
    async (_id, testCase) => {
      expect(await testCase.build()).toEqual(golden.ledgers[testCase.id]);
    }
  );

  it.each(RESOLVED_CASES.map((c) => [c.id, c] as const))(
    'resolved totals are unchanged — %s',
    (_id, testCase) => {
      expect(testCase.resolve()).toEqual(golden.resolvedTotals[testCase.id]);
    }
  );

  /**
   * The stacking disciplines must actually DIFFER in the captured masters. If
   * every system resolved the same total, the resolved half of this gate would
   * be pinning a constant and could not tell `equipStackPolicy` had collapsed.
   */
  /**
   * KNOWN GAP, pinned deliberately so the golden master above is not read as a
   * blessing of it.
   *
   * RFC 003 states: "`BonusType` already exists in `src/types/core/common.ts`
   * and already includes `size`, `dodge`, `enhancement`, `circumstance`,
   * `insight`, etc. — it is exactly the d20/PF stacking vocabulary, reused
   * as-is. No new bonus types are needed."
   *
   * That is false against the tree. The union is:
   *   enhancement | circumstance | racial | insight | luck | proficiency |
   *   alchemical | divine | dodge | armor-class | damage | ability-score |
   *   attack | saving-throw | skill | untyped
   *
   * `size` is NOT a member — nor are `deflection`, `natural`, `sacred`,
   * `profane`, `morale`, `competence`, `resistance`, `shield` or `armor`, all of
   * which are core d20/PF named bonus types. Six of the members that ARE present
   * (`armor-class`, `damage`, `attack`, `saving-throw`, `skill`, `ability-score`)
   * name TARGETS, not stacking types — an overloading `modifierEffects.ts`
   * already documents.
   *
   * The consequence is a real rules defect, not a typing nit. A +1 deflection
   * ring cannot be tagged, so `item.bonusType ?? 'enhancement'` files it under
   * enhancement; largest-of-type then discards it against +1 enhancement armor.
   * The character is a point of AC short — while the LEDGER still shows the
   * ring's row, because `resolveEffects` returns `applicable` (pre-stacking).
   * "Explain a value" and "produce a value" disagree, which is the exact
   * divergence RFC 003 was written to remove.
   *
   * This test asserts the CURRENT (wrong) number on purpose. Widening
   * `BonusType` is an RFC-level change to a published IR type and is not done
   * here; when it happens, this test fails and points at its own fix.
   */
  it('KNOWN GAP: untypeable d20 named bonuses collapse into enhancement', () => {
    const { result } = resolveCharacterEffects('dnd-3.5e', {
      baseArmorClass: 10,
      equipment: [
        { itemId: 'chain-shirt-plus-1', acBonus: 1, bonusType: 'enhancement' },
        // A +1 ring of protection. Its bonus is DEFLECTION, which the union
        // cannot express, so it silently becomes a second enhancement bonus.
        { itemId: 'ring-of-protection-plus-1', acBonus: 1 },
      ],
    });

    // RAW: 10 + 1 (enhancement) + 1 (deflection) = 12.
    expect(result.byTarget.ac.total).toBe(11);
    // …yet the ledger still carries the ring's row, so provenance overstates
    // what resolution actually applied.
    expect(
      result.ledger.filter((effect) => effect.target === 'ac' && effect.source.kind === 'item')
    ).toHaveLength(2);
  });

  it('the captured totals prove the per-system stacking disciplines are distinct', () => {
    const acFor = (systemId: GameSystemId) =>
      golden.resolvedTotals[`${systemId}/competing-same-discipline-ac-bonuses`].ac;

    // 'sum': base 10 + 1 + 2 + 1 (feat) = 14.
    for (const systemId of ['dnd-5e-2014', 'dnd-5e-2024', 'mam3e', 'daggerheart'] as const) {
      expect(acFor(systemId), `${systemId} sums`).toBe(14);
    }
    // Largest-per-named-type / highest-per-bucket keeps strictly less.
    for (const systemId of ['dnd-3.5e', 'pf1e', 'pf2e'] as const) {
      expect(acFor(systemId), `${systemId} does not sum`).toBeLessThan(14);
    }
  });
});
