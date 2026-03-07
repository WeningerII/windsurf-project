// Mutants & Masterminds 3e Fortune Advantages

import { Advantage } from '../../../../types/mam/advantages';

export const fortuneAdvantages: Advantage[] = [
  {
    id: 'beginners-luck',
    name: "Beginner's Luck",
    system: 'mam3e',
    source: "Hero's Handbook",
    type: 'fortune',
    ranked: false,
    description: 'Spend a victory point to gain temporary skill ranks.',
    benefit:
      'By spending a victory point, you gain an effective 5 ranks in one skill of your choice you currently have at 4 or fewer ranks, including skills you have no ranks in, even if they normally cannot be used untrained. These temporary ranks last for the duration of the scene.',
  },
  {
    id: 'inspire',
    name: 'Inspire',
    system: 'mam3e',
    source: "Hero's Handbook",
    type: 'fortune',
    ranked: true,
    maxRanks: 5,
    description: 'Spend a victory point to grant allies a bonus.',
    benefit:
      'Once per scene, by taking a standard action and spending a victory point, allies able to interact with you gain a +1 circumstance bonus per rank on all checks until the start of your next round (maximum +5). You do not gain the bonus, only your allies do.',
  },
  {
    id: 'leadership',
    name: 'Leadership',
    system: 'mam3e',
    source: "Hero's Handbook",
    type: 'fortune',
    ranked: false,
    description: 'Spend a victory point to remove a condition from an ally.',
    benefit:
      'As a standard action, you can spend a victory point to remove one of the following conditions from an ally with whom you can interact: dazed, fatigued, or stunned.',
  },
  {
    id: 'luck',
    name: 'Luck',
    system: 'mam3e',
    source: "Hero's Handbook",
    type: 'fortune',
    ranked: true,
    description: 'Reroll die rolls like spending a victory point.',
    benefit:
      'Once per round, you can choose to reroll a die roll, like spending a victory point, including adding 10 to rerolls of 10 or less. You can do this a number of times per session equal to your Luck rank. Maximum rank is half the series power level (rounded down).',
  },
  {
    id: 'seize-initiative',
    name: 'Seize Initiative',
    system: 'mam3e',
    source: "Hero's Handbook",
    type: 'fortune',
    ranked: false,
    description: 'Spend a victory point to go first in initiative.',
    benefit:
      'You can spend a victory point to automatically go first in the initiative order. You may only do so at the start of combat, when you would normally make your initiative check. If multiple characters use this advantage, they roll initiative among themselves.',
  },
  {
    id: 'ultimate-effort',
    name: 'Ultimate Effort',
    system: 'mam3e',
    source: "Hero's Handbook",
    type: 'fortune',
    ranked: false,
    description: 'Spend a victory point to treat a roll as 20.',
    benefit:
      'You can spend a victory point on a particular check and treat the roll as a 20. Choose the check when you acquire this advantage (e.g., Ultimate Aim, Ultimate Resistance, Ultimate Skill). You can take this advantage multiple times for different checks.',
  },
];
