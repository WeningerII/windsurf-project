import { Species } from '../../../../types/character-options/species';

export const halfOrc: Species = {
  id: 'half-orc',
  name: 'Half-Orc',
  system: 'pf1e',
  source: 'Core Rulebook',
  
  abilityScoreIncrease: [
    { type: 'choice', choice: { count: 1, options: ['str', 'dex', 'con', 'int', 'wis', 'cha'], label: 'Choose one ability score' }, values: [2] },
  ],
  
  size: 'medium',
  speed: 30,
  
  languages: {
    automatic: ['Common', 'Orc'],
    choice: { count: 0, options: ['Abyssal', 'Draconic', 'Giant', 'Gnoll', 'Goblin'], label: 'Bonus languages' },
  },
  
  traits: [
    { id: 'darkvision', name: 'Darkvision', source: 'Half-Orc', description: 'Half-orcs can see in the dark up to 60 feet.' },
    { id: 'intimidating', name: 'Intimidating', source: 'Half-Orc', description: 'Half-orcs receive a +2 racial bonus on Intimidate checks.' },
    { id: 'orc-blood', name: 'Orc Blood', source: 'Half-Orc', description: 'Half-orcs count as both humans and orcs for any effect related to race.' },
    { id: 'orc-ferocity', name: 'Orc Ferocity', source: 'Half-Orc', description: 'Once per day, when a half-orc is brought below 0 hit points but not killed, he can fight on for 1 more round as if disabled. At the end of his next turn, unless brought to above 0 hit points, he immediately falls unconscious and begins dying.' },
    { id: 'weapon-familiarity', name: 'Weapon Familiarity', source: 'Half-Orc', description: 'Half-orcs are proficient with greataxes and falchions and treat any weapon with the word "orc" in its name as a martial weapon.' },
  ],
  
  description: 'Half-orcs are monstrosities, their tragic births the result of perversion and violence—or at least, that\'s how other races see them.',
  ageInfo: 'Half-orcs reach adulthood at 14 and rarely live longer than 75 years.',
  alignmentTendency: 'Half-orcs tend toward chaos.',
  sizeDescription: 'Half-orcs are Medium creatures and have no bonuses or penalties due to their size.',
};
