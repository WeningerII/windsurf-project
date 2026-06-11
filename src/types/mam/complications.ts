/**
 * M&M 3e complication — moved out of the data layer (review M-2: types
 * declared inside src/data files).
 */
export interface Complication {
  id: string;
  name: string;
  system: string;
  source: string;
  category:
    | 'motivation'
    | 'accident'
    | 'addiction'
    | 'disability'
    | 'enemy'
    | 'fame'
    | 'hatred'
    | 'honor'
    | 'identity'
    | 'obsession'
    | 'phobia'
    | 'power-loss'
    | 'prejudice'
    | 'relationship'
    | 'reputation'
    | 'responsibility'
    | 'rivalry'
    | 'secret'
    | 'temper'
    | 'weakness'
    | 'other';
  description: string;
  examples: string[];
}
