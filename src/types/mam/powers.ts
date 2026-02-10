/**
 * Mutants & Masterminds 3e Power Types
 * 
 * Defines powers for M&M 3e superhero system. Powers are purchased with
 * power points and can be modified with extras and flaws.
 * 
 * @module types/mam/powers
 */

/**
 * M&M 3e Power definition
 * 
 * Powers are the core mechanic of M&M 3e. Each power has a base cost
 * and can be ranked up, modified with extras (increase cost) or flaws (decrease cost).
 * 
 * @example
 * ```typescript
 * const damage: Power = {
 *   id: 'damage',
 *   name: 'Damage',
 *   system: 'mam3e',
 *   type: 'attack',
 *   action: 'standard',
 *   range: 'close',
 *   duration: 'instant',
 *   baseCost: 1,
 *   perRank: true,
 *   description: 'You deal damage to a target',
 *   effects: ['Damage'],
 *   source: "Hero's Handbook"
 * };
 * ```
 */
export interface Power {
  id: string;
  name: string;
  system: 'mam3e';
  source: string;
  
  type: PowerType;
  action: ActionType;
  range: PowerRange;
  duration: PowerDuration;
  
  baseCost: number;
  perRank: boolean;
  
  descriptors?: string[];
  extras?: string[];
  flaws?: string[];
  
  description: string;
  effects: string[];
}

/**
 * Power type categories for organization
 */
export type PowerType = 'attack' | 'defense' | 'movement' | 'sensory' | 'general' | 'control';

/**
 * Action types for M&M 3e turn economy
 */
export type ActionType = 'standard' | 'move' | 'free' | 'reaction' | 'none';

/**
 * Power range categories
 * 
 * - personal: Affects only the user
 * - close: Touch range
 * - ranged: Distance (rank × 30 feet typically)
 * - perception: Line of sight
 */
export type PowerRange = 'personal' | 'close' | 'ranged' | 'perception';

/**
 * Power duration types
 * 
 * - instant: One-time effect
 * - concentration: Requires concentration (free action per round)
 * - sustained: Requires free action to maintain
 * - continuous: Always on, no action required
 * - permanent: Cannot be turned off
 */
export type PowerDuration = 'instant' | 'concentration' | 'sustained' | 'continuous' | 'permanent';
