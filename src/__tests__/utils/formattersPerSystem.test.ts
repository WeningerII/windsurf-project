import { beforeAll, describe, expect, it } from 'vitest';
import {
  loadDaggerheartArmorForSystem,
  loadDaggerheartConsumablesForSystem,
  loadDaggerheartDomainCardsForSystem,
  loadDaggerheartLootForSystem,
  loadDaggerheartWeaponsForSystem,
  loadEquipmentForSystem,
  loadSpellsForSystem,
} from '../../utils/dataLoader';
import {
  formatAreaOfEffect,
  formatCastingTime,
  formatDuration,
  formatItemCost,
  formatRange,
} from '../../utils/formatters';
import { dnd35eEquipment } from '../../data/dnd/3.5e/equipment';
import type { GameSystemId } from '../../types/game-systems';

/**
 * WORK PLAN §6.6 — the per-system fixture test over the shared browser row.
 *
 * The five formatters in `src/utils/formatters.ts` are the whole Dock browser
 * row (`src/dock/Dock.tsx` L273-282, L317), and the Dock browses SEVEN systems'
 * catalogs through ONE component. Their declared parameter types
 * (`CastingTime`, `Range`, `Duration`, `AreaOfEffect`, `Item['cost']`) describe
 * a d20 spell — which is not what every loader returns. The divergence exists
 * only at runtime, per system, so the compiler is blind to it and so is any
 * hand-written fixture: writing `{ type: 'action', amount: 1 }` by hand just
 * re-encodes the assumption that shipped the crash.
 *
 * So every fixture here comes from the REAL loaders. `sharedFormatterShapes`
 * (src/__tests__/dock/) is the printability gate over the same catalogs;
 * `formatters.test.ts` pins the happy-path captions. This file is the one that
 * fails when a system's actual shape stops matching what the formatter assumes,
 * which is the regression that shipped: `formatCastingTime` read `ct.amount` on
 * an M&M power that has no casting time at all, and took the whole page into its
 * error boundary. It was caught by an e2e smoke test, and only because it was
 * fatal — `formatRange` had been rendering the literal 'Unknown' on 100% of the
 * same catalog for as long, silently, because a wrong string is still printable.
 *
 * The rule this file enforces, per formatter, per system:
 *
 *   A row that HAS the field renders that field — never the em-dash, never
 *   'Unknown', never a leaked 'undefined'. A row that does NOT have the field
 *   renders the absent-concept fallback and nothing else.
 *
 * The em-dash is therefore load-bearing: it means "this system has no such
 * concept", and it must not be reachable from data that is merely shaped
 * differently from a 5e spell.
 */

const SYSTEMS: GameSystemId[] = [
  'dnd-5e-2014',
  'dnd-5e-2024',
  'dnd-3.5e',
  'pf1e',
  'pf2e',
  'mam3e',
  'daggerheart',
];

/** The absent-concept caption every formatter but `formatAreaOfEffect` uses. */
const ABSENT = '—';

/**
 * A loaded catalog entry read as the untyped bag it actually is. The declared
 * `Spell`/`Item` types are exactly what this file exists to distrust, so the
 * fields are read off a `Record` and cast only at the formatter call.
 */
type CatalogRow = { id: string } & Record<string, unknown>;

const spellRows = new Map<GameSystemId, CatalogRow[]>();
const itemRows = new Map<GameSystemId, CatalogRow[]>();

/**
 * Load the catalogs once for the whole file. Every loader is `await`ed to
 * completion here, so no dynamic import is still in flight when the suite ends
 * and the run cannot finish on an unhandled rejection.
 */
beforeAll(async () => {
  for (const system of SYSTEMS) {
    spellRows.set(system, (await loadSpellsForSystem(system)) as unknown as CatalogRow[]);
    itemRows.set(system, (await loadEquipmentForSystem(system)) as unknown as CatalogRow[]);
  }

  // Daggerheart is the one system whose browse catalogs the shared loaders do
  // not serve: `loadSpellsForSystem('daggerheart')` and
  // `loadEquipmentForSystem('daggerheart')` both fall through to `return []`,
  // so the Dock renders zero daggerheart rows today. Its catalogs live behind
  // dedicated loaders instead, and THOSE are the rows that would flow through
  // this row builder the moment daggerheart is wired in — a domain card is the
  // spell analog, and the inventory is the equipment analog. They are the real
  // fixture for the "field is absent for this whole system" contract, so the
  // daggerheart lane of the matrix below is driven from them rather than left
  // vacuously empty.
  spellRows.set(
    'daggerheart',
    (await loadDaggerheartDomainCardsForSystem('daggerheart')) as unknown as CatalogRow[]
  );
  itemRows.set('daggerheart', [
    ...((await loadDaggerheartWeaponsForSystem('daggerheart')) as unknown as CatalogRow[]),
    ...((await loadDaggerheartArmorForSystem('daggerheart')) as unknown as CatalogRow[]),
    ...((await loadDaggerheartLootForSystem('daggerheart')) as unknown as CatalogRow[]),
    ...((await loadDaggerheartConsumablesForSystem('daggerheart')) as unknown as CatalogRow[]),
  ]);
}, 60000);

function spellRowsFor(system: GameSystemId): CatalogRow[] {
  const rows = spellRows.get(system);
  if (!rows) throw new Error(`spell catalog for ${system} was never loaded`);
  return rows;
}

function itemRowsFor(system: GameSystemId): CatalogRow[] {
  const rows = itemRows.get(system);
  if (!rows) throw new Error(`equipment catalog for ${system} was never loaded`);
  return rows;
}

/** Call the formatter and fail with the offending row's id if it throws. */
function render(
  format: (value: unknown) => string | undefined,
  value: unknown,
  label: string
): string | undefined {
  let rendered: string | undefined;
  expect(() => {
    rendered = format(value);
  }, `${label} threw`).not.toThrow();
  return rendered;
}

/** A rendered caption for a field the row DOES have must name that field. */
function expectNamesTheValue(rendered: string | undefined, label: string): string {
  expect(typeof rendered, `${label} did not return a string`).toBe('string');
  const text = rendered as string;
  expect(text.trim(), `${label} rendered blank`).not.toBe('');
  expect(text, `${label} rendered the absent-concept dash for a field the row HAS`).not.toBe(
    ABSENT
  );
  expect(text, `${label} fell through to the unknown-discriminant branch`).not.toBe('Unknown');
  expect(text.toLowerCase(), `${label} leaked an absent value into the caption`).not.toContain(
    'undefined'
  );
  expect(text, `${label} leaked NaN into the caption`).not.toContain('NaN');
  return text;
}

interface SpellFieldUnderTest {
  name: string;
  field: string;
  format: (value: unknown) => string | undefined;
  /** What "this system has no such concept" renders as for this formatter. */
  absent: string | undefined;
}

/**
 * `formatAreaOfEffect` is the deliberate odd one out: its absent rendering is
 * `undefined`, not the em-dash, because the Dock coalesces
 * `spell.area ?? formatAreaOfEffect(spell.areaOfEffect)` and a dash would
 * shadow the free-text area 3.5e (93 spells) and pf1e (115) actually carry.
 */
const SPELL_FIELDS: SpellFieldUnderTest[] = [
  {
    name: 'formatCastingTime',
    field: 'castingTime',
    format: (value) => formatCastingTime(value as never),
    absent: ABSENT,
  },
  {
    name: 'formatRange',
    field: 'range',
    format: (value) => formatRange(value as never),
    absent: ABSENT,
  },
  {
    name: 'formatDuration',
    field: 'duration',
    format: (value) => formatDuration(value as never),
    absent: ABSENT,
  },
  {
    name: 'formatAreaOfEffect',
    field: 'areaOfEffect',
    format: (value) => formatAreaOfEffect(value as never),
    absent: undefined,
  },
];

describe.each(SPELL_FIELDS)(
  '$name over every shipped catalog',
  ({ name, field, format, absent }) => {
    it.each(SYSTEMS)(
      '%s: returns a string for every row, and the absent fallback only where the field is absent',
      (system) => {
        const rows = spellRowsFor(system);
        // Guards the matrix against going vacuously green if a loader regresses
        // to an empty catalog — a passing test over zero rows proves nothing.
        expect(rows.length, `${system} loaded no spell rows to format`).toBeGreaterThan(0);

        for (const row of rows) {
          const label = `${name}(${system}/${row.id}.${field})`;
          const rendered = render(format, row[field], label);

          if (row[field] == null) {
            expect(rendered, `${label} is absent and must take the fallback`).toBe(absent);
            continue;
          }

          expectNamesTheValue(rendered, label);
        }
      }
    );
  }
);

describe('formatItemCost over every shipped catalog', () => {
  it.each(SYSTEMS)(
    '%s: returns a string for every equipment row, whatever shape the price is in',
    (system) => {
      const rows = itemRowsFor(system);
      expect(rows.length, `${system} loaded no equipment rows to format`).toBeGreaterThan(0);

      for (const row of rows) {
        const label = `formatItemCost(${system}/${row.id}.cost)`;
        const rendered = render((value) => formatItemCost(value), row.cost, label);

        if (row.cost == null) {
          expect(rendered, `${label} is absent and must take the fallback`).toBe(ABSENT);
          continue;
        }

        expectNamesTheValue(rendered, label);
      }
    }
  );
});

/**
 * Below: the individual (formatter x system) divergences the audit found, each
 * asserted against the shape the loader actually delivers rather than against a
 * literal. Where the assertion could be satisfied by re-implementing the
 * formatter it is written as a property of the output instead (the caption
 * preserves the system's own vocabulary; two encoder shapes agree), so the test
 * cannot drift into a copy of the code it is checking.
 */

describe('formatRange x mam3e — the whole field is a bare string, not a tagged object', () => {
  it("preserves the power's own range vocabulary instead of the unknown-discriminant caption", () => {
    // src/types/mam/powers.ts declares PowerRange as a string union, and
    // loadMam3ePowers casts Power[] straight to Spell[] without reshaping, so
    // `range` arrives as 'personal' | 'close' | 'ranged' | 'perception'.
    // Reading `.type` off a string yields undefined -> every power rendered
    // 'Unknown', which is printable and therefore invisible to the shape gate.
    for (const row of spellRowsFor('mam3e')) {
      const label = `mam3e/${row.id}.range`;
      expect(typeof row.range, `${label} is no longer a bare string`).toBe('string');

      const rendered = expectNamesTheValue(formatRange(row.range as string), label);
      expect(rendered.toLowerCase(), `${label} lost the vocabulary word`).toBe(
        String(row.range).toLowerCase()
      );
      expect(rendered[0], `${label} is not captioned`).toBe(rendered[0].toUpperCase());
    }
  });
});

describe('formatDuration x mam3e — the whole field is a bare string, not a tagged object', () => {
  it('captions durations d20 has no member for, rather than collapsing them', () => {
    // 'sustained' (37 of 61 powers) and 'continuous' are not d20 durations at
    // all, so they cannot route through the tagged switch under any encoder.
    for (const row of spellRowsFor('mam3e')) {
      const label = `mam3e/${row.id}.duration`;
      expect(typeof row.duration, `${label} is no longer a bare string`).toBe('string');

      const rendered = expectNamesTheValue(formatDuration(row.duration as string), label);
      expect(rendered.toLowerCase(), `${label} lost the vocabulary word`).toBe(
        String(row.duration).toLowerCase()
      );
    }
  });
});

describe('formatCastingTime x mam3e — the field does not exist for this system', () => {
  it('takes the fallback for every power rather than dereferencing it', () => {
    // The shipped crash, pinned against real data: a power has no casting time,
    // and that is a fact about M&M, not a content defect to be "fixed" in the
    // catalog.
    const rows = spellRowsFor('mam3e');
    for (const row of rows) {
      expect(row.castingTime, `mam3e/${row.id} unexpectedly grew a castingTime`).toBeUndefined();
      expect(formatCastingTime(row.castingTime as never), `mam3e/${row.id}.castingTime`).toBe(
        ABSENT
      );
    }
  });
});

describe('formatAreaOfEffect x mam3e — the field does not exist for this system', () => {
  it('returns nothing at all so the caller can fall back to its own free text', () => {
    for (const row of spellRowsFor('mam3e')) {
      expect(row.areaOfEffect, `mam3e/${row.id} unexpectedly grew an areaOfEffect`).toBeUndefined();
      expect(
        formatAreaOfEffect(row.areaOfEffect as never),
        `mam3e/${row.id}.areaOfEffect`
      ).toBeUndefined();
    }
  });
});

describe('formatItemCost x mam3e — the price is a bare number, not {amount, currency}', () => {
  it('prices every item in Equipment Points rather than printing undefined undefined', () => {
    for (const row of itemRowsFor('mam3e')) {
      const label = `mam3e/${row.id}.cost`;
      expect(typeof row.cost, `${label} is no longer a bare number`).toBe('number');

      const rendered = expectNamesTheValue(formatItemCost(row.cost), label);
      expect(rendered, `${label} dropped M&M's unit`).toBe(`${row.cost as number} ep`);
    }
  });
});

describe('formatItemCost x dnd-3.5e — the catalog prices in free text, not always in coin', () => {
  /**
   * This is the one divergence the shared loader HIDES rather than exposes.
   * `normalizeLegacyEquipment` (src/utils/dataLoader.ts:346) seeds every 3.5e
   * item with `{amount: 0, currency: 'gp'}` and overwrites it only when the raw
   * string matches /^([\d,.]+)\s*(cp|sp|gp|pp)$/ — so the entries that are a
   * rate or a qualifier rather than a coin amount ('Varies', '3 cp/mile',
   * '1 sp/day') arrive at the formatter already laundered into a well-formed
   * FALSE '0 gp'. That is a live defect, and it is upstream of this file: the
   * formatter cannot tell a laundered zero from pf2e's legitimately free items.
   *
   * The fixture is therefore the shipped 3.5e catalog module itself, which is
   * the loader's own input and still real data — not a hand-written literal.
   * It pins that the raw shape renders correctly the moment the normalizer
   * stops rewriting it.
   */
  it('prints a non-coin price verbatim instead of taking the em-dash', () => {
    const raw = [
      ...dnd35eEquipment.weapons,
      ...dnd35eEquipment.armor,
      ...dnd35eEquipment.shields,
      ...dnd35eEquipment.adventuringGear,
    ] as unknown as CatalogRow[];
    expect(raw.length, 'the 3.5e catalog module loaded no entries').toBeGreaterThan(0);

    for (const item of raw) {
      if (typeof item.cost !== 'string' || item.cost.trim() === '') continue;
      const label = `dnd-3.5e/${item.id}.cost (raw)`;

      const rendered = expectNamesTheValue(formatItemCost(item.cost), label);
      expect(rendered, `${label} did not survive the formatter intact`).toBe(item.cost.trim());
    }
  });
});

describe('formatCastingTime x the d20 systems — one discriminant, two encoder shapes', () => {
  /**
   * 5e-2014 ships 7 `{type:'hour', amount:N}` alongside 7 `{type:'hour',
   * hours:N}`; 5e-2024 ships 11 against 2; 3.5e 1 against 10; 'minute' splits
   * the same way (5e-2014: 34 amount-form vs 14 minutes-form). Both shapes are
   * a count of a named unit, so both must render the count — the amount-form
   * used to fall through to the bare type and render 'hour' where its sibling
   * rendered '1 hour'.
   */
  const UNIT_OF: Record<string, string> = {
    minute: 'minute',
    minutes: 'minute',
    hour: 'hour',
    hours: 'hour',
    round: 'round',
    rounds: 'round',
  };

  const D20_SYSTEMS: GameSystemId[] = ['dnd-5e-2014', 'dnd-5e-2024', 'dnd-3.5e', 'pf1e', 'pf2e'];

  it.each(D20_SYSTEMS)(
    '%s: a counted unit renders its count whichever encoder shape carries it',
    (system) => {
      const captionsPerCount = new Map<string, Set<string>>();
      let counted = 0;

      for (const row of spellRowsFor(system)) {
        const ct = row.castingTime as Record<string, unknown> | undefined;
        if (!ct || typeof ct !== 'object' || typeof ct.type !== 'string') continue;

        const unit = UNIT_OF[ct.type];
        if (!unit) continue; // 'action', 'standard', 'reaction' — not a unit.

        const label = `formatCastingTime(${system}/${row.id}.castingTime)`;
        const rendered = expectNamesTheValue(formatCastingTime(ct as never), label);

        expect(rendered, `${label} dropped the count`).toMatch(/^\d+ (minute|hour|round)s?$/);
        expect(rendered, `${label} renamed the unit`).toContain(unit);

        const count = ct.amount ?? ct.minutes ?? ct.hours ?? ct.rounds;
        expect(rendered, `${label} rendered a count the data does not carry`).toBe(
          `${count as number} ${unit}${(count as number) > 1 ? 's' : ''}`
        );

        const key = `${count as number} ${unit}`;
        const seen = captionsPerCount.get(key) ?? new Set<string>();
        seen.add(rendered);
        captionsPerCount.set(key, seen);
        counted += 1;
      }

      expect(counted, `${system} has no counted-unit casting times left to check`).toBeGreaterThan(
        0
      );

      // The invariant the split violated: the same count of the same unit must
      // read identically no matter which encoder wrote it.
      for (const [key, captions] of captionsPerCount) {
        expect(
          [...captions],
          `${system} renders ${key} differently depending on the encoder shape`
        ).toHaveLength(1);
      }
    }
  );
});

describe('formatDuration x every system — a tagged variant shipped without its payload', () => {
  /**
   * pf2e ships four `{type: 'varies'}` with no description. The variant name is
   * still real information, so it degrades to the humanized unit rather than to
   * the em-dash, which would claim the spell has no duration at all.
   */
  const NEEDS_A_PAYLOAD = new Set([
    'rounds',
    'rounds-per-level',
    'minutes',
    'minutes-per-level',
    'hours',
    'hours-per-level',
    'days-per-level',
    'concentration',
    'varies',
    'special',
  ]);

  it.each(SYSTEMS)('%s: names the variant rather than interpolating undefined', (system) => {
    for (const row of spellRowsFor(system)) {
      const duration = row.duration as Record<string, unknown> | undefined;
      if (!duration || typeof duration !== 'object' || typeof duration.type !== 'string') continue;
      if (!NEEDS_A_PAYLOAD.has(duration.type)) continue;
      if (Object.keys(duration).length > 1) continue; // payload present — covered above.

      const label = `formatDuration(${system}/${row.id}.duration)`;
      const rendered = expectNamesTheValue(formatDuration(duration as never), label);
      expect(rendered.toLowerCase(), `${label} lost the variant name`).toContain(
        duration.type.split('-')[0]
      );
    }
  });
});

describe('daggerheart — the shared browse route serves it no rows at all', () => {
  it('returns an empty catalog from the shared loaders while its own catalogs are populated', async () => {
    // Pins the routing gap the absent-field lane above is standing in for: if
    // daggerheart is ever wired into the shared loaders, this test goes red and
    // the matrix should be re-pointed at `loadSpellsForSystem` for it too.
    expect(await loadSpellsForSystem('daggerheart')).toHaveLength(0);
    expect(await loadEquipmentForSystem('daggerheart')).toHaveLength(0);

    expect(spellRowsFor('daggerheart').length).toBeGreaterThan(0);
    expect(itemRowsFor('daggerheart').length).toBeGreaterThan(0);
  });

  it('carries none of the four spell fields on a domain card, and none of them crash', () => {
    // A domain card is not a targeted d20 spell: no casting time, no range, no
    // duration, no area. Every one of those is a whole-parameter absence, which
    // is the dereference `formatRange`/`formatDuration` were still missing a
    // guard for after `formatCastingTime` shipped its fix.
    for (const row of spellRowsFor('daggerheart')) {
      for (const { name, field, format, absent } of SPELL_FIELDS) {
        const label = `${name}(daggerheart/${row.id}.${field})`;
        expect(row[field], `${label} unexpectedly present`).toBeUndefined();
        expect(render(format, row[field], label), label).toBe(absent);
      }
    }
  });

  it('prices nothing, and says so with the fallback rather than undefined undefined', () => {
    // Daggerheart's inventory definitions carry no cost field at all
    // (src/types/daggerheart.ts) — the game does not price gear in coin.
    for (const row of itemRowsFor('daggerheart')) {
      const label = `formatItemCost(daggerheart/${row.id}.cost)`;
      expect(row.cost, `${label} unexpectedly present`).toBeUndefined();
      expect(formatItemCost(row.cost), label).toBe(ABSENT);
    }
  });
});
