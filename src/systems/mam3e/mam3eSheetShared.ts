import type { Power } from '../../types/mam/powers';
import type { Mam3eConditionTrack } from './data-model';

export function createEmptyMam3eConditionTrack(): Mam3eConditionTrack {
  return {
    bruised: 0,
    dazed: false,
    staggered: false,
    incapacitated: false,
  };
}

export function createEmptyMam3ePower(id: string): Power {
  return {
    id,
    name: 'New Power',
    system: 'mam3e',
    source: 'Custom',
    type: 'attack',
    action: 'standard',
    range: 'close',
    duration: 'instant',
    baseCost: 1,
    perRank: true,
    rank: 1,
    extras: [],
    flaws: [],
    modifierRanks: {},
    description: '',
    effects: [],
  };
}
