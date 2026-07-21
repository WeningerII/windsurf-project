// Hand-authored SRD 3.5 monsters (Open Game Content; olimot/srd-v3.5-md — see
// docs/srd-sources.md). These are creatures the encoder
// (scripts/encode-35e-monsters.mjs) does not emit because they have no single
// structured D35E stat block to intersect (multi-variant creatures printed as
// a size/head-count table). Encoded by hand to the same shape the encoder
// produces (no intrinsic XP — 3.5e awards XP relative to party level, so
// experiencePoints is 0 uniformly), source-tagged 'SRD 3.5', and merged ahead
// of the generated buckets in index.ts so they win on id match.
//
// Rider damage (a salamander's "plus 1d6 fire" heat) follows the encoder
// convention: the primary physical die is the typed damage entry and the
// energy rider stays in the action's prose — never typed onto a natural
// weapon, which the monster-data-integrity suite forbids.

import { Monster } from '../../../../types/creatures/monsters';

export const dnd35eHandAuthoredMonsters: Monster[] = [
  {
    id: 'flamebrother-salamander-35e-monster',
    name: 'Flamebrother Salamander',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    size: 'small',
    type: 'outsider',
    // SRD: "Usually evil (any)"; encoded to the representative evil alignment.
    alignment: 'neutral evil',
    challengeRating: 3,
    experiencePoints: 0,
    armorClass: 19,
    hitPoints: { count: 4, die: 'd8', modifier: 8, notation: '4d8+8' },
    speed: { walk: 20 },
    abilities: { str: 12, dex: 13, con: 14, int: 14, wis: 15, cha: 13 },
    d20Saves: { fort: 6, ref: 5, will: 6 },
    baseAttackBonus: 4,
    senses: ['darkvision 60 ft.'],
    languages: ['Ignan'],
    actions: [
      {
        name: 'Spear',
        description: 'Spear +6 melee (1d6+1/x3 plus 1d6 fire).',
        attackBonus: 6,
        damage: [
          { dice: { count: 1, die: 'd6', modifier: 1, notation: '1d6+1' }, type: 'piercing' },
        ],
      },
      {
        name: 'Tail Slap',
        description: 'Tail slap +4 melee (1d4 plus 1d6 fire).',
        attackBonus: 4,
        damage: [{ dice: { count: 1, die: 'd4', notation: '1d4' }, type: 'bludgeoning' }],
      },
    ],
  },
  {
    id: 'average-salamander-35e-monster',
    name: 'Average Salamander',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    size: 'medium',
    type: 'outsider',
    alignment: 'neutral evil',
    challengeRating: 6,
    experiencePoints: 0,
    armorClass: 18,
    hitPoints: { count: 9, die: 'd8', modifier: 18, notation: '9d8+18' },
    speed: { walk: 20 },
    abilities: { str: 14, dex: 13, con: 14, int: 14, wis: 15, cha: 13 },
    d20Saves: { fort: 8, ref: 7, will: 8 },
    baseAttackBonus: 9,
    senses: ['darkvision 60 ft.'],
    languages: ['Ignan', 'Common'],
    actions: [
      {
        name: 'Spear',
        description: 'Spear +11/+6 melee (1d8+3/x3 plus 1d6 fire).',
        attackBonus: 11,
        damage: [
          { dice: { count: 1, die: 'd8', modifier: 3, notation: '1d8+3' }, type: 'piercing' },
        ],
      },
      {
        name: 'Tail Slap',
        description: 'Tail slap +9 melee (2d6+1 plus 1d6 fire).',
        attackBonus: 9,
        damage: [
          { dice: { count: 2, die: 'd6', modifier: 1, notation: '2d6+1' }, type: 'bludgeoning' },
        ],
      },
    ],
  },
  {
    id: 'noble-salamander-35e-monster',
    name: 'Noble Salamander',
    system: 'dnd-3.5e',
    source: 'SRD 3.5',
    size: 'large',
    type: 'outsider',
    alignment: 'neutral evil',
    challengeRating: 10,
    experiencePoints: 0,
    armorClass: 18,
    hitPoints: { count: 15, die: 'd8', modifier: 45, notation: '15d8+45' },
    speed: { walk: 20 },
    abilities: { str: 22, dex: 13, con: 16, int: 16, wis: 15, cha: 15 },
    d20Saves: { fort: 12, ref: 10, will: 11 },
    baseAttackBonus: 15,
    senses: ['darkvision 60 ft.'],
    languages: ['Ignan', 'Common'],
    actions: [
      {
        name: 'Longspear',
        description: '+3 longspear +23/+18/+13 melee (1d8+9/x3 plus 1d8 fire).',
        attackBonus: 23,
        damage: [
          { dice: { count: 1, die: 'd8', modifier: 9, notation: '1d8+9' }, type: 'piercing' },
        ],
      },
      {
        name: 'Tail Slap',
        description: 'Tail slap +18 melee (2d8+3 plus 1d8 fire).',
        attackBonus: 18,
        damage: [
          { dice: { count: 2, die: 'd8', modifier: 3, notation: '2d8+3' }, type: 'bludgeoning' },
        ],
      },
    ],
  },
];
