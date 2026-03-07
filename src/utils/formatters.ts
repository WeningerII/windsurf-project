import type { Duration, Range } from '../types/core/common';
import type { CastingTime } from '../types/magic/spells';

export function formatCastingTime(ct: CastingTime): string {
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
