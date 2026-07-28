import type { AreaOfEffect, Duration, Range } from '../types/core/common';
import type { CastingTime } from '../types/magic/spells';

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
  if (ct.amount && ct.amount > 1) return `${ct.amount} ${ct.type}s`;
  if (ct.minutes) return `${ct.minutes} minute${ct.minutes > 1 ? 's' : ''}`;
  if (ct.hours) return `${ct.hours} hour${ct.hours > 1 ? 's' : ''}`;
  if (ct.rounds) return `${ct.rounds} round${ct.rounds > 1 ? 's' : ''}`;
  return ct.type.replace(/-/g, ' ');
}

export function formatRange(r: Range): string {
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
      return `${r.feet} ft`;
    case 'close':
      return r.feet ? `Close (${r.feet} ft)` : 'Close';
    case 'medium':
      return r.feet ? `Medium (${r.feet} ft)` : 'Medium';
    case 'long':
      return r.feet ? `Long (${r.feet} ft)` : 'Long';
    case 'cone':
      return `${r.feet} ft cone`;
    case 'special':
      return r.description;
    default:
      return 'Unknown';
  }
}

export function formatDuration(d: Duration): string {
  switch (d.type) {
    case 'instant':
      return 'Instantaneous';
    case 'permanent':
      return 'Permanent';
    case 'unlimited':
      return 'Unlimited';
    case 'rounds':
      return `${d.rounds} round${d.rounds > 1 ? 's' : ''}`;
    case 'rounds-per-level':
      return `${d.rounds} round/level`;
    case 'minutes':
      return `${d.minutes} minute${d.minutes > 1 ? 's' : ''}`;
    case 'minutes-per-level':
      return `${d.minutes} min/level`;
    case 'hours':
      return `${d.hours} hour${d.hours > 1 ? 's' : ''}`;
    case 'hours-per-level':
      return `${d.hours} hr/level`;
    case 'days-per-level':
      return `${d.days} day/level`;
    case 'concentration':
      return `Concentration, ${d.maxDuration}`;
    case 'varies':
      return d.description || 'Varies';
    case 'special':
      return d.description;
    default:
      return 'Unknown';
  }
}

export function formatAreaOfEffect(area: AreaOfEffect | undefined): string | undefined {
  if (!area) {
    return undefined;
  }

  switch (area.type) {
    case 'cone':
      return `${area.feet}-foot cone`;
    case 'cube':
      return `${area.feet}-foot cube`;
    case 'cylinder':
      return `${area.radius}-foot-radius, ${area.height}-foot-high cylinder`;
    case 'line':
      return `${area.length}-foot by ${area.width}-foot line`;
    case 'sphere':
      return `${area.radius}-foot-radius sphere`;
    case 'emanation':
      return `${area.radius}-foot emanation`;
    case 'spread':
      return `${area.radius}-foot spread`;
    default:
      return undefined;
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
 */
export function formatItemCost(cost: unknown, fallback = '—'): string {
  if (typeof cost === 'number' && Number.isFinite(cost)) {
    // M&M prices gear in Equipment Points, not coin.
    return `${cost} ep`;
  }

  if (cost && typeof cost === 'object') {
    const { amount, currency } = cost as { amount?: unknown; currency?: unknown };
    if (typeof amount === 'number' && typeof currency === 'string') {
      return `${amount} ${currency}`;
    }
  }

  return fallback;
}
