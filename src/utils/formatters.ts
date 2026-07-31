import type { AreaOfEffect, Duration, Range } from '../types/core/common';
import type { CastingTime } from '../types/magic/spells';

/**
 * Render a discriminant token as a caption: 'bonus-action' -> 'Bonus action'.
 *
 * Used for the two shapes the declared unions cannot express — a system that
 * carries the whole field as a bare string (M&M 3e), and a tagged variant whose
 * numeric payload the encoder omitted. In both cases the *type* is still real
 * information, so we print it rather than collapsing to the em-dash: the dash
 * is reserved for "this system has no such concept at all".
 */
function humanizeToken(token: string): string {
  const text = token.trim().replace(/[-_]+/g, ' ');
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Render a spell's casting time for a browser row.
 *
 * `ct` is DECLARED non-optional, but the Dock browses EVERY system's catalog
 * through one component and `loadSpellsForSystem` is not uniformly d20 spells:
 * for `mam3e` it returns `loadMam3ePowers()`, and an M&M power has no casting
 * time at all. The declared type cannot catch that — the shape only diverges at
 * runtime, per system. Reading `ct.amount` unguarded therefore crashed the whole
 * app into its error boundary as soon as the Dock re-keyed to M&M.
 *
 * This is the same cross-system shape problem `formatItemCost` below was written
 * for (M&M prices gear in Equipment Points, Daggerheart may carry nothing); the
 * eviction that made the Dock the single browse route hardened `cost` and missed
 * `castingTime`. Absent is a legitimate value here, not a content defect.
 */
export function formatCastingTime(ct: CastingTime | undefined, fallback = '—'): string {
  if (!ct || typeof ct !== 'object') return fallback;
  // `type` is the only field every encoder agrees on, and the fallthrough below
  // reads it as a string. An object with no `type` is not a system that lacks
  // casting times — it is nothing we can name, so it takes the same fallback.
  if (typeof ct.type !== 'string') return fallback;

  // One discriminant, two encoder shapes. `{type:'hour', hours:24}` and
  // `{type:'hour', amount:1}` BOTH ship (5e-2014 7/7, 5e-2024 11/2, 3.5e 1/10;
  // same split on 'minute', 72 amount-form vs 217 minutes-form). The old
  // `amount > 1` guard meant the amount-form of a single unit fell through to
  // the bare type and rendered 'hour' where its sibling rendered '1 hour'.
  // Read `amount` as the count for the unit-bearing types so both agree; the
  // plural branch below still handles the countable non-unit types ('action').
  const minutes =
    ct.minutes ?? (ct.type === 'minute' || ct.type === 'minutes' ? ct.amount : undefined);
  const hours = ct.hours ?? (ct.type === 'hour' ? ct.amount : undefined);
  const rounds = ct.rounds ?? (ct.type === 'rounds' ? ct.amount : undefined);

  if (minutes) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  if (hours) return `${hours} hour${hours > 1 ? 's' : ''}`;
  if (rounds) return `${rounds} round${rounds > 1 ? 's' : ''}`;
  if (ct.amount && ct.amount > 1) return `${ct.amount} ${ct.type}s`;
  return ct.type.replace(/-/g, ' ');
}

/**
 * Render a spell's range for a browser row.
 *
 * Three absences the declared `Range` union cannot express, all legitimate:
 *
 * 1. The whole field. `loadSpellsForSystem` is not uniformly d20 spells, and
 *    Daggerheart's spell-analog (the domain card) has no range at all — a card
 *    is not a targeted d20 spell. This was the last unguarded dereference left
 *    in this file after `formatCastingTime` shipped its crash.
 * 2. A BARE STRING instead of a tagged object. An M&M 3e power's range is
 *    `'personal' | 'close' | 'ranged' | 'perception'` (src/types/mam/powers.ts),
 *    and `loadMam3ePowers` casts powers straight to `Spell[]` without
 *    reshaping. Reading `.type` off a string yields undefined, so all 61 powers
 *    used to render the literal 'Unknown' — printable, so the existing shape
 *    gate never caught it. M&M's vocabulary overlaps `Range`'s discriminants,
 *    so the value is recoverable: the formatter was just reading a level too
 *    deep.
 * 3. A tagged variant with no payload. Print the shape we do know rather than
 *    interpolating undefined.
 */
export function formatRange(r: Range | string | undefined, fallback = '—'): string {
  if (r == null) return fallback;

  // M&M 3e: the whole range is the discriminant. 'close' -> 'Close', matching
  // what the tagged form renders for the same word.
  if (typeof r === 'string') return humanizeToken(r) || fallback;
  if (typeof r !== 'object' || typeof (r as { type?: unknown }).type !== 'string') return fallback;

  switch (r.type) {
    case 'self':
      return 'Self';
    case 'personal':
      return 'Personal';
    case 'touch':
      return 'Touch';
    case 'sight':
      return 'Sight';
    case 'unlimited':
      return 'Unlimited';
    case 'ranged':
      return r.feet == null ? 'Ranged' : `${r.feet} ft`;
    case 'close':
      return r.feet ? `Close (${r.feet} ft)` : 'Close';
    case 'medium':
      return r.feet ? `Medium (${r.feet} ft)` : 'Medium';
    case 'long':
      return r.feet ? `Long (${r.feet} ft)` : 'Long';
    case 'cone':
      return r.feet == null ? 'Cone' : `${r.feet} ft cone`;
    case 'special':
      // Declared required, but 'varies' below already proves this union ships
      // description-less members; the free text is the only content here, so
      // without it there is nothing to name.
      return r.description || fallback;
    default:
      return 'Unknown';
  }
}

/**
 * Render a spell's duration for a browser row.
 *
 * Same three absences as `formatRange`, for the same reasons: Daggerheart's
 * domain cards carry no duration at all (zero `duration:` keys anywhere under
 * its data), an M&M power's duration is a bare string
 * (`'instant' | 'concentration' | 'sustained' | 'continuous' | 'permanent'`,
 * src/types/mam/powers.ts) which used to render 'Unknown' for all 61 powers,
 * and individual variants ship without their payload (pf2e has four `'varies'`
 * durations with no description).
 */
export function formatDuration(d: Duration | string | undefined, fallback = '—'): string {
  if (d == null) return fallback;

  // M&M 3e: 'sustained' and 'continuous' are not d20 durations at all, so they
  // cannot be routed through the tagged switch — humanize the token instead.
  // ('instant' therefore renders as M&M's own 'Instant', not 5e's
  // 'Instantaneous'; each is the correct caption for its own system.)
  if (typeof d === 'string') return humanizeToken(d) || fallback;
  if (typeof d !== 'object' || typeof (d as { type?: unknown }).type !== 'string') return fallback;

  // A tagged variant missing its count still names a real unit. Degrade to the
  // unit rather than the em-dash — the dash means "no such concept", and
  // collapsing a known-but-uncounted duration into it would hide a data gap.
  const unit = humanizeToken(d.type);

  switch (d.type) {
    case 'instant':
      return 'Instantaneous';
    case 'permanent':
      return 'Permanent';
    case 'unlimited':
      return 'Unlimited';
    case 'rounds':
      return d.rounds == null ? unit : `${d.rounds} round${d.rounds > 1 ? 's' : ''}`;
    case 'rounds-per-level':
      return d.rounds == null ? unit : `${d.rounds} round/level`;
    case 'minutes':
      return d.minutes == null ? unit : `${d.minutes} minute${d.minutes > 1 ? 's' : ''}`;
    case 'minutes-per-level':
      return d.minutes == null ? unit : `${d.minutes} min/level`;
    case 'hours':
      return d.hours == null ? unit : `${d.hours} hour${d.hours > 1 ? 's' : ''}`;
    case 'hours-per-level':
      return d.hours == null ? unit : `${d.hours} hr/level`;
    case 'days-per-level':
      return d.days == null ? unit : `${d.days} day/level`;
    case 'concentration':
      return d.maxDuration ? `Concentration, ${d.maxDuration}` : 'Concentration';
    case 'varies':
      return d.description || 'Varies';
    case 'special':
      // Mirrors 'varies' above: the variant name is the caption when the free
      // text is absent, which pf2e already ships for its sibling member.
      return d.description || 'Special';
    default:
      return 'Unknown';
  }
}

/**
 * Render a spell's area of effect for a browser row.
 *
 * Absence is the MAJORITY case here and is legitimate for every system: 292/319
 * (5e-2014), 288/339 (5e-2024), 581/607 (3.5e), 616/625 (pf1e), 530/546 (pf2e)
 * loaded spells carry no `areaOfEffect`, M&M expresses area through power
 * extras, and 3.5e's cantrips encode it as free text on `spell.area` instead.
 *
 * Unlike its siblings the fallback here defaults to `undefined`, NOT the
 * em-dash: the Dock coalesces (`spell.area ?? formatAreaOfEffect(...)`), so a
 * dash would shadow the free-text area the older catalogs do carry. Callers
 * that render this field alone can pass '—' explicitly.
 */
export function formatAreaOfEffect(
  area: AreaOfEffect | undefined,
  fallback?: string
): string | undefined {
  if (!area || typeof area !== 'object') {
    return fallback;
  }

  switch (area.type) {
    case 'cone':
      return area.feet == null ? fallback : `${area.feet}-foot cone`;
    case 'cube':
      return area.feet == null ? fallback : `${area.feet}-foot cube`;
    case 'cylinder':
      return area.radius == null || area.height == null
        ? fallback
        : `${area.radius}-foot-radius, ${area.height}-foot-high cylinder`;
    case 'line':
      return area.length == null || area.width == null
        ? fallback
        : `${area.length}-foot by ${area.width}-foot line`;
    case 'sphere':
      return area.radius == null ? fallback : `${area.radius}-foot-radius sphere`;
    case 'emanation':
      return area.radius == null ? fallback : `${area.radius}-foot emanation`;
    case 'spread':
      return area.radius == null ? fallback : `${area.radius}-foot spread`;
    default:
      return fallback;
  }
}

/**
 * Render an equipment item's price for a browser row.
 *
 * `Item['cost']` is DECLARED as `{amount, currency}`, but the M&M 3e catalog
 * carries a bare Equipment-Point number and the Daggerheart/hand-written tiers
 * may carry nothing at all. A template literal over the declared shape prints
 * "undefined undefined" for those rows, which is what the per-system in-sheet
 * equipment wrappers each worked around locally. This is the one shared
 * formatter they collapse into, so the Dock (which browses every system's
 * catalog through one component) prints all three shapes correctly.
 *
 * A FOURTH shape: the 3.5e catalog stores cost as a bare string, and 8 of its
 * 207 entries are not a coin amount at all but a rate or a qualifier —
 * 'Varies' (barding), '3 cp/mile' (coach hire), '1 sp/day' (hireling). Those
 * are legitimate prices, not missing ones, so they print verbatim instead of
 * taking the em-dash.
 */
export function formatItemCost(cost: unknown, fallback = '—'): string {
  if (typeof cost === 'number' && Number.isFinite(cost)) {
    // M&M prices gear in Equipment Points, not coin.
    return `${cost} ep`;
  }

  if (typeof cost === 'string') {
    const text = cost.trim();
    if (text) return text;
  }

  if (cost && typeof cost === 'object') {
    const { amount, currency } = cost as { amount?: unknown; currency?: unknown };
    if (typeof amount === 'number' && typeof currency === 'string') {
      return `${amount} ${currency}`;
    }
  }

  return fallback;
}
