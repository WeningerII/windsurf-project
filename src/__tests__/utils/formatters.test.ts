import { describe, expect, it } from 'vitest';
import { formatCastingTime, formatDuration, formatRange } from '../../utils/formatters';

describe('formatCastingTime', () => {
  it.each([
    [{ amount: 2, type: 'action' }, '2 actions'],
    [{ minutes: 1, type: 'minute' }, '1 minute'],
    [{ minutes: 10, type: 'minute' }, '10 minutes'],
    [{ hours: 1, type: 'hour' }, '1 hour'],
    [{ hours: 8, type: 'hour' }, '8 hours'],
    [{ rounds: 1, type: 'round' }, '1 round'],
    [{ rounds: 3, type: 'round' }, '3 rounds'],
    [{ type: 'bonus-action' }, 'bonus action'],
  ])('formats %j as %s', (input, expected) => {
    expect(formatCastingTime(input as never)).toBe(expected);
  });
});

describe('formatRange', () => {
  it.each([
    [{ type: 'self' }, 'Self'],
    [{ type: 'personal' }, 'Personal'],
    [{ type: 'touch' }, 'Touch'],
    [{ type: 'sight' }, 'Sight'],
    [{ type: 'unlimited' }, 'Unlimited'],
    [{ type: 'ranged', feet: 60 }, '60 ft'],
    [{ type: 'close', feet: 25 }, 'Close (25 ft)'],
    [{ type: 'close' }, 'Close'],
    [{ type: 'medium', feet: 100 }, 'Medium (100 ft)'],
    [{ type: 'medium' }, 'Medium'],
    [{ type: 'long', feet: 400 }, 'Long (400 ft)'],
    [{ type: 'long' }, 'Long'],
    [{ type: 'cone', feet: 30 }, '30 ft cone'],
    [{ type: 'special', description: 'See text' }, 'See text'],
    [{ type: 'mystery' }, 'Unknown'],
  ])('formats %j as %s', (input, expected) => {
    expect(formatRange(input as never)).toBe(expected);
  });
});

describe('formatDuration', () => {
  it.each([
    [{ type: 'instant' }, 'Instantaneous'],
    [{ type: 'permanent' }, 'Permanent'],
    [{ type: 'unlimited' }, 'Unlimited'],
    [{ type: 'rounds', rounds: 1 }, '1 round'],
    [{ type: 'rounds', rounds: 5 }, '5 rounds'],
    [{ type: 'rounds-per-level', rounds: 1 }, '1 round/level'],
    [{ type: 'minutes', minutes: 1 }, '1 minute'],
    [{ type: 'minutes', minutes: 10 }, '10 minutes'],
    [{ type: 'minutes-per-level', minutes: 10 }, '10 min/level'],
    [{ type: 'hours', hours: 1 }, '1 hour'],
    [{ type: 'hours', hours: 24 }, '24 hours'],
    [{ type: 'hours-per-level', hours: 1 }, '1 hr/level'],
    [{ type: 'days-per-level', days: 2 }, '2 day/level'],
    [{ type: 'concentration', maxDuration: 'up to 1 minute' }, 'Concentration, up to 1 minute'],
    [{ type: 'varies', description: 'Depends on the tide' }, 'Depends on the tide'],
    [{ type: 'varies' }, 'Varies'],
    [{ type: 'special', description: 'Special duration' }, 'Special duration'],
    [{ type: 'unknown-duration' }, 'Unknown'],
  ])('formats %j as %s', (input, expected) => {
    expect(formatDuration(input as never)).toBe(expected);
  });
});
