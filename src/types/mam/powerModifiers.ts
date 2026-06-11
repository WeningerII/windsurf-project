/**
 * M&M 3e power modifier (extra/flaw) — moved out of the data layer
 * (review M-2: types declared inside src/data files).
 */
export interface PowerModifier {
  id: string;
  name: string;
  system: string;
  source: string;
  type: 'extra' | 'flaw';
  costPerRank: number; // Flat cost modifier per rank (can be fractional like +0.5)
  flatCost?: number; // One-time flat cost
  description: string;
  effects: string[];
}
