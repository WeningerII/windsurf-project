/**
 * The application's single dice-randomness primitive. One `Rng` interface, two
 * sources of entropy:
 *   - `createSeededRng(seed)` — deterministic (mulberry32). Same seed ⇒ identical
 *     sequence, so scene replay, encounter drafting, and L3 damage tests are
 *     reproducible.
 *   - `createLiveRng()` — non-deterministic per call (backed by `Math.random`),
 *     for ad-hoc in-sheet rolls where the user wants a fresh result each click.
 *
 * Both share the SAME die mechanics (`nextInt`/`rollDie`), so every die — d4, d8,
 * d10, d12, d20, d100, anything 1..N — rolls through one tested code path.
 */

export interface Rng {
  /** A float in [0, 1). */
  next(): number;
  /** A uniform integer in [0, maxExclusive). */
  nextInt(maxExclusive: number): number;
  /** A die roll in [1, sides]. */
  rollDie(sides: number): number;
}

/**
 * Back-compat alias. Historically every Rng was seeded; `createLiveRng` is not,
 * so prefer `Rng` in new code. Kept so existing `SeededRng` imports keep working.
 */
export type SeededRng = Rng;

/** Build an `Rng` from a `next()` entropy source; the die mechanics are shared. */
function buildRng(next: () => number): Rng {
  return {
    next,
    nextInt(maxExclusive: number): number {
      if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
        throw new Error('nextInt requires a positive integer upper bound.');
      }
      return Math.floor(this.next() * maxExclusive);
    },
    rollDie(sides: number): number {
      if (!Number.isInteger(sides) || sides <= 0) {
        throw new Error('rollDie requires a positive integer side count.');
      }
      return this.nextInt(sides) + 1;
    },
  };
}

export function createSeededRng(seed: string | number): Rng {
  let state = hashSeed(String(seed));
  // mulberry32: a small, fast, well-distributed PRNG. State is captured here so
  // the sequence depends only on the seed.
  return buildRng(() => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  });
}

/**
 * A non-seeded `Rng` for transient UI rolls (attack/save/check buttons, scratch
 * rolls). Statistically identical to the previous inline `Math.floor(Math.random()
 * * N) + 1`, but routed through the shared, tested die mechanics so checks and
 * damage share one path. Inject `createSeededRng` instead when determinism is
 * required (scene replay, tests, reproducible damage).
 */
export function createLiveRng(): Rng {
  return buildRng(() => Math.random());
}

function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
