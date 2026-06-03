import { describe, it, expect } from 'vitest';

import { buildThreatMap, influenceAt, type ThreatSource } from '../../rules';

/**
 * Threat fields: the spatial substrate. Each enemy stamps the cells it could
 * attack this turn (move + reach, or ranged range), summed across enemies, so a
 * cell several foes can hit reads as more dangerous. Deterministic integer math.
 */

const GRID = { width: 30, height: 30 };

describe('buildThreatMap', () => {
  it('threatens every cell a melee foe could move-and-strike, and nothing beyond', () => {
    const melee: ThreatSource = { position: { x: 5, y: 5 }, reach: 1, speed: 6, threat: 10 };
    const map = buildThreatMap({ sources: [melee], ...GRID });

    expect(influenceAt(map, { x: 5, y: 5 })).toBe(10); // its own cell
    expect(influenceAt(map, { x: 12, y: 5 })).toBe(10); // distance 7 = speed+reach
    expect(influenceAt(map, { x: 13, y: 5 })).toBe(0); // distance 8 — just out of envelope
  });

  it('sums the threat of overlapping foes', () => {
    const a: ThreatSource = { position: { x: 5, y: 5 }, reach: 1, speed: 6, threat: 10 };
    const b: ThreatSource = { position: { x: 6, y: 5 }, reach: 1, speed: 6, threat: 3 };
    const map = buildThreatMap({ sources: [a, b], ...GRID });
    // A cell both can reach carries the combined danger.
    expect(influenceAt(map, { x: 5, y: 5 })).toBe(13);
  });

  it('projects a ranged foe out to its range', () => {
    const archer: ThreatSource = {
      position: { x: 0, y: 0 },
      reach: 1,
      speed: 0,
      range: 12,
      threat: 5,
    };
    const map = buildThreatMap({ sources: [archer], ...GRID });
    expect(influenceAt(map, { x: 10, y: 0 })).toBe(5); // within range
    expect(influenceAt(map, { x: 13, y: 0 })).toBe(0); // beyond range
  });

  it('does not threaten another elevation — a grounded foe leaves the air safe', () => {
    const melee: ThreatSource = { position: { x: 5, y: 5, z: 0 }, reach: 1, speed: 6, threat: 10 };
    const map = buildThreatMap({ sources: [melee], ...GRID });
    expect(influenceAt(map, { x: 5, y: 5, z: 0 })).toBe(10);
    expect(influenceAt(map, { x: 5, y: 5, z: 6 })).toBe(0); // 30 ft overhead — out of reach
  });

  it('clamps to the grid (no out-of-bounds stamping) and reads 0 off-field', () => {
    const corner: ThreatSource = { position: { x: 0, y: 0 }, reach: 1, speed: 6, threat: 4 };
    const map = buildThreatMap({ sources: [corner], ...GRID });
    expect(influenceAt(map, { x: 0, y: 0 })).toBe(4);
    expect(influenceAt(map, { x: 7, y: 0 })).toBe(4); // edge of envelope, in bounds
    expect(influenceAt(map, { x: 20, y: 20 })).toBe(0); // far away, untouched
    // Nothing with a negative coordinate was ever stamped.
    expect([...map.keys()].every((k) => !k.includes('-'))).toBe(true);
  });
});
