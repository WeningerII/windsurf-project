import { Monster } from '../../../../types/creatures/monsters';
import { allBeasts } from './beasts';
import { allHumanoids } from './humanoids';
import { allUndead } from './undead';
import { allAberrations } from './aberrations';
import { allCelestials } from './celestials';
import { allConstructs } from './constructs';
import { allDragons } from './dragons';
import { allElementals } from './elementals';
import { allFey } from './fey';
import { allFiends } from './fiends';
import { allGiants } from './giants';
import { allMonstrosities } from './monstrosities';
import { allOozes } from './oozes';
import { allPlants } from './plants';

// All D&D 5e-2024 monsters
export const dnd5e2024Monsters: Monster[] = [
  ...allBeasts,
  ...allHumanoids,
  ...allUndead,
  ...allAberrations,
  ...allCelestials,
  ...allConstructs,
  ...allDragons,
  ...allElementals,
  ...allFey,
  ...allFiends,
  ...allGiants,
  ...allMonstrosities,
  ...allOozes,
  ...allPlants,
];

// By type
export const dnd5e2024MonstersByType = {
  aberrations: allAberrations,
  beasts: allBeasts,
  celestials: allCelestials,
  constructs: allConstructs,
  dragons: allDragons,
  elementals: allElementals,
  fey: allFey,
  fiends: allFiends,
  giants: allGiants,
  humanoids: allHumanoids,
  monstrosities: allMonstrosities,
  oozes: allOozes,
  plants: allPlants,
  undead: allUndead,
};

// Index by ID
export const dnd5e2024MonstersById: Record<string, Monster> = dnd5e2024Monsters.reduce((acc, monster) => {
  acc[monster.id] = monster;
  return acc;
}, {} as Record<string, Monster>);

// Index by CR
export const dnd5e2024MonstersByCR: Record<number, Monster[]> = dnd5e2024Monsters.reduce((acc, monster) => {
  const cr = monster.challengeRating;
  if (!acc[cr]) {
    acc[cr] = [];
  }
  acc[cr].push(monster);
  return acc;
}, {} as Record<number, Monster[]>);

// Helper functions
export function getMonsterById(id: string): Monster | undefined {
  return dnd5e2024MonstersById[id];
}

export function getMonstersByCR(cr: number): Monster[] {
  return dnd5e2024MonstersByCR[cr] || [];
}

export function getMonstersByCRRange(minCR: number, maxCR: number): Monster[] {
  return dnd5e2024Monsters.filter(m => m.challengeRating >= minCR && m.challengeRating <= maxCR);
}

export function getMonstersByType(type: string): Monster[] {
  return dnd5e2024MonstersByType[type as keyof typeof dnd5e2024MonstersByType] || [];
}

// Statistics
export const monsterStats = {
  total: dnd5e2024Monsters.length,
  byType: Object.entries(dnd5e2024MonstersByType).reduce((acc, [type, monsters]) => {
    acc[type] = monsters.length;
    return acc;
  }, {} as Record<string, number>),
  byCR: Object.entries(dnd5e2024MonstersByCR).reduce((acc, [cr, monsters]) => {
    acc[cr] = monsters.length;
    return acc;
  }, {} as Record<string, number>),
};

// Export type collections
export {
  allAberrations,
  allBeasts,
  allCelestials,
  allConstructs,
  allDragons,
  allElementals,
  allFey,
  allFiends,
  allGiants,
  allHumanoids,
  allMonstrosities,
  allOozes,
  allPlants,
  allUndead,
};
