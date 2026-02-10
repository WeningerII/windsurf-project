// Master Data Index - All Game Systems

// D&D Systems
export * as dnd5e2024 from './dnd/5e-2024/metadata';
export * as dnd5e2014 from './dnd/5e-2014/metadata';
export * as dnd35e from './dnd/3.5e/metadata';

// Pathfinder Systems
export * as pf1e from './pathfinder/1e/metadata';
export * as pf2e from './pathfinder/2e/metadata';

// Other Systems
export * as mm3e from './mutants-and-masterminds/3e/metadata';

// System Registry - uses canonical IDs from types/game-systems.ts
import type { GameSystemId } from '../types/game-systems';

export const systemRegistry: Record<GameSystemId, {
  id: GameSystemId;
  name: string;
  abbr: string;
  srdVersion?: string;
  metadata: () => Promise<unknown>;
}> = {
  'dnd-5e-2024': {
    id: 'dnd-5e-2024',
    name: 'D&D 5th Edition (2024)',
    abbr: 'D&D 5e (2024)',
    srdVersion: '5.2',
    metadata: () => import('./dnd/5e-2024/metadata'),
  },
  'dnd-5e-2014': {
    id: 'dnd-5e-2014',
    name: 'D&D 5th Edition (2014)',
    abbr: 'D&D 5e (2014)',
    srdVersion: '5.1',
    metadata: () => import('./dnd/5e-2014/metadata'),
  },
  'dnd-3.5e': {
    id: 'dnd-3.5e',
    name: 'D&D 3.5 Edition',
    abbr: 'D&D 3.5e',
    srdVersion: '3.5',
    metadata: () => import('./dnd/3.5e/metadata'),
  },
  'pf1e': {
    id: 'pf1e',
    name: 'Pathfinder 1st Edition',
    abbr: 'PF1e',
    metadata: () => import('./pathfinder/1e/metadata'),
  },
  'pf2e': {
    id: 'pf2e',
    name: 'Pathfinder 2nd Edition',
    abbr: 'PF2e',
    metadata: () => import('./pathfinder/2e/metadata'),
  },
  'mam3e': {
    id: 'mam3e',
    name: 'Mutants & Masterminds 3rd Edition',
    abbr: 'M&M 3e',
    metadata: () => import('./mutants-and-masterminds/3e/metadata'),
  },
};

// Re-export the canonical type
export type { GameSystemId } from '../types/game-systems';
