import { Monster } from '../../../../types/creatures/monsters';
import { dnd5eCR0to1Monsters } from './cr-0-1';
import { dnd5eCR2to5Monsters } from './cr-2-5';
import { dnd5eCR6to10Monsters } from './cr-6-10';
import { dnd5eCR11PlusMonsters } from './cr-11-plus';

// All monsters
export const dnd5eMonsters: Monster[] = [
  ...dnd5eCR0to1Monsters,
  ...dnd5eCR2to5Monsters,
  ...dnd5eCR6to10Monsters,
  ...dnd5eCR11PlusMonsters,
];

// By Challenge Rating ranges
export const dnd5eMonstersByCR = {
  cr0to1: dnd5eCR0to1Monsters,
  cr2to5: dnd5eCR2to5Monsters,
  cr6to10: dnd5eCR6to10Monsters,
  cr11Plus: dnd5eCR11PlusMonsters,
};

// Index by ID
export const dnd5eMonstersById: Record<string, Monster> = dnd5eMonsters.reduce((acc, monster) => {
  acc[monster.id] = monster;
  return acc;
}, {} as Record<string, Monster>);

// Index by CR
export const dnd5eMonstersByExactCR: Record<number, Monster[]> = dnd5eMonsters.reduce((acc, monster) => {
  const cr = monster.challengeRating;
  if (!acc[cr]) {
    acc[cr] = [];
  }
  acc[cr].push(monster);
  return acc;
}, {} as Record<number, Monster[]>);

// Index by Type
export const dnd5eMonstersByType: Record<string, Monster[]> = dnd5eMonsters.reduce((acc, monster) => {
  const type = monster.type;
  if (!acc[type]) {
    acc[type] = [];
  }
  acc[type].push(monster);
  return acc;
}, {} as Record<string, Monster[]>);

// Index by Size
export const dnd5eMonstersBySize: Record<string, Monster[]> = dnd5eMonsters.reduce((acc, monster) => {
  const size = monster.size;
  if (!acc[size]) {
    acc[size] = [];
  }
  acc[size].push(monster);
  return acc;
}, {} as Record<string, Monster[]>);

// Index by Environment
export const dnd5eMonstersByEnvironment: Record<string, Monster[]> = dnd5eMonsters.reduce((acc, monster) => {
  if (monster.environment) {
    monster.environment.forEach(env => {
      if (!acc[env]) {
        acc[env] = [];
      }
      acc[env].push(monster);
    });
  }
  return acc;
}, {} as Record<string, Monster[]>);

// Statistics
export const monsterStats = {
  total: dnd5eMonsters.length,
  byCRRange: {
    cr0to1: dnd5eCR0to1Monsters.length,
    cr2to5: dnd5eCR2to5Monsters.length,
    cr6to10: dnd5eCR6to10Monsters.length,
    cr11Plus: dnd5eCR11PlusMonsters.length,
  },
  byType: Object.entries(dnd5eMonstersByType).reduce((acc, [type, monsters]) => {
    acc[type] = monsters.length;
    return acc;
  }, {} as Record<string, number>),
  bySize: Object.entries(dnd5eMonstersBySize).reduce((acc, [size, monsters]) => {
    acc[size] = monsters.length;
    return acc;
  }, {} as Record<string, number>),
};

// Helper functions
export function getMonsterById(id: string): Monster | undefined {
  return dnd5eMonstersById[id];
}

export function getMonstersByCR(cr: number): Monster[] {
  return dnd5eMonstersByExactCR[cr] || [];
}

export function getMonstersByCRRange(minCR: number, maxCR: number): Monster[] {
  return dnd5eMonsters.filter(m => m.challengeRating >= minCR && m.challengeRating <= maxCR);
}

export function getMonstersByType(type: string): Monster[] {
  return dnd5eMonstersByType[type] || [];
}

export function getMonstersByEnvironment(environment: string): Monster[] {
  return dnd5eMonstersByEnvironment[environment] || [];
}

export function calculateEncounterXP(monsters: Monster[]): number {
  return monsters.reduce((total, monster) => total + monster.experiencePoints, 0);
}

// Export individual collections
export { 
  dnd5eCR0to1Monsters, 
  dnd5eCR2to5Monsters, 
  dnd5eCR6to10Monsters,
  dnd5eCR11PlusMonsters,
};
