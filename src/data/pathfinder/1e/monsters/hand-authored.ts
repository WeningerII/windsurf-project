// Hand-authored PF1e Bestiary 1 monsters (Open Game Content via the PRD; see
// docs/srd-sources.md). These are creatures the encoder
// (scripts/encode-pf1e-monsters.mjs) cannot emit — e.g. stat blocks whose HP
// line carries class levels / mixed Hit Dice ("17 (3 HD; 2d8+1d10+3)") that
// parseHp's single-die pattern rejects. Encoded by hand to the same shape the
// encoder produces, source-tagged 'Bestiary', and merged ahead of the
// generated buckets in index.ts so they win on name match and survive
// regeneration (the encoder treats index names it did not emit as the
// hand-written baseline and skips them).

import { Monster } from '../../../../types/creatures/monsters';

export const pf1eHandAuthoredMonsters: Monster[] = [
  {
    id: 'skeletal-champion',
    name: 'Skeletal Champion',
    system: 'pf1e',
    source: 'Bestiary',
    size: 'medium',
    type: 'undead',
    alignment: 'neutral evil',
    challengeRating: 2,
    experiencePoints: 600,
    armorClass: 21,
    // Printed HP 17 (3 HD; 2d8+1d10+3). The mixed racial/class dice collapse to
    // a single-die DiceRoll (the catalog shape): 3 HD as d8 plus the undead's
    // Charisma-to-HP bonus (Cha 12 -> +1 x 3 HD), average 16.5 ~ 17.
    hitPoints: { count: 3, die: 'd8', modifier: 3, notation: '3d8+3' },
    speed: { walk: 30 },
    abilities: { str: 17, dex: 13, con: 0, int: 9, wis: 10, cha: 12 },
    d20Saves: { fort: 3, ref: 1, will: 3 },
    baseAttackBonus: 2,
    skills: { intimidate: 7, perception: 6, stealth: -1 },
    senses: ['darkvision 60 ft.', 'Perception +6'],
    languages: [],
    actions: [
      {
        name: 'Mwk Longsword',
        description: 'Melee: mwk longsword +7 (1d8+3/19-20)',
        attackBonus: 7,
        damage: [
          { dice: { count: 1, die: 'd8', modifier: 3, notation: '1d8+3' }, type: 'slashing' },
        ],
      },
    ],
    description:
      'This armored skeleton stands in a battle-ready pose, its weapon held high as cold blue light shines in its eye sockets.',
    environment: ['any'],
  },
];
