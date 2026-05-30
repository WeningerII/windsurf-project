export interface SeededRng {
  next(): number;
  nextInt(maxExclusive: number): number;
  rollDie(sides: number): number;
}

export function createSeededRng(seed: string | number): SeededRng {
  let state = hashSeed(String(seed));

  return {
    next() {
      state = (state + 0x6d2b79f5) >>> 0;
      let value = state;
      value = Math.imul(value ^ (value >>> 15), value | 1);
      value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    },
    nextInt(maxExclusive: number) {
      if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
        throw new Error('nextInt requires a positive integer upper bound.');
      }
      return Math.floor(this.next() * maxExclusive);
    },
    rollDie(sides: number) {
      if (!Number.isInteger(sides) || sides <= 0) {
        throw new Error('rollDie requires a positive integer side count.');
      }
      return this.nextInt(sides) + 1;
    },
  };
}

function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
