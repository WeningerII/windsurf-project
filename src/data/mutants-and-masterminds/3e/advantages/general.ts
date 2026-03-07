// Mutants & Masterminds 3e General Advantages

import { Advantage } from '../../../../types/mam/advantages';

export const generalAdvantages: Advantage[] = [
  {
    id: 'assessment',
    name: 'Assessment',
    system: 'mam3e',
    source: "Hero's Handbook",
    type: 'general',
    ranked: false,
    description: "Size up an opponent's combat capabilities.",
    benefit:
      "Choose a target you can accurately perceive and have the GM make a secret Insight check for you as a free action, opposed by the target's Deception. If you win, the GM tells you the target's attack and defense bonuses relative to yours. Each additional degree of success reveals one bonus exactly.",
  },
  {
    id: 'benefit',
    name: 'Benefit',
    system: 'mam3e',
    source: "Hero's Handbook",
    type: 'general',
    ranked: true,
    description: 'Gain a significant perquisite or fringe benefit.',
    benefit:
      'You have some significant perquisite or fringe benefit. Examples include: Alternate Identity, Ambidexterity, Cipher, Diplomatic Immunity, Security Clearance, Status, Wealth. Benefits may come in ranks for improved levels of the same benefit.',
  },
  {
    id: 'diehard',
    name: 'Diehard',
    system: 'mam3e',
    source: "Hero's Handbook",
    type: 'general',
    ranked: false,
    description: 'Automatically stabilize when dying.',
    benefit:
      'When your condition becomes dying, you automatically stabilize on the following round without any need for a Stamina check, although further damage can still kill you.',
  },
  {
    id: 'eidetic-memory',
    name: 'Eidetic Memory',
    system: 'mam3e',
    source: "Hero's Handbook",
    type: 'general',
    ranked: false,
    description: 'Perfect recall of everything you experience.',
    benefit:
      "You have perfect recall of everything you've experienced. You have a +5 circumstance bonus on checks to remember things, including resistance checks against effects that alter or erase memories. You can also make Expertise skill checks to answer questions as if you were trained.",
  },
  {
    id: 'equipment',
    name: 'Equipment',
    system: 'mam3e',
    source: "Hero's Handbook",
    type: 'general',
    ranked: true,
    description: 'Gain equipment points.',
    benefit:
      'You have 5 points per rank in this advantage to spend on equipment, including vehicles and headquarters.',
  },
  {
    id: 'extraordinary-effort',
    name: 'Extraordinary Effort',
    system: 'mam3e',
    source: "Hero's Handbook",
    type: 'general',
    ranked: false,
    description: 'Gain two benefits from extra effort.',
    benefit:
      'When using extra effort, you can gain two of the listed benefits, even stacking two of the same type. However, you are exhausted starting the turn after your extraordinary effort. Spending a victory point reduces the cost to merely fatigued.',
  },
  {
    id: 'fearless',
    name: 'Fearless',
    system: 'mam3e',
    source: "Hero's Handbook",
    type: 'general',
    ranked: false,
    description: 'Immune to fear effects.',
    benefit:
      'You are immune to fear effects of all sorts, essentially the same as an Immunity to Fear effect.',
  },
  {
    id: 'great-endurance',
    name: 'Great Endurance',
    system: 'mam3e',
    source: "Hero's Handbook",
    type: 'general',
    ranked: false,
    description: 'Bonus on checks involving endurance.',
    benefit:
      'You have a +5 bonus on checks to avoid becoming fatigued and checks to hold your breath, avoid damage from starvation or thirst, avoid damage from hot or cold environments, and to resist suffocation and drowning.',
  },
  {
    id: 'instant-up',
    name: 'Instant Up',
    system: 'mam3e',
    source: "Hero's Handbook",
    type: 'general',
    ranked: false,
    description: 'Stand up from prone as a free action.',
    benefit:
      'You can go from prone to standing as a free action without the need for an Acrobatics skill check.',
  },
  {
    id: 'interpose',
    name: 'Interpose',
    system: 'mam3e',
    source: "Hero's Handbook",
    type: 'general',
    ranked: false,
    description: 'Take an attack meant for an ally.',
    benefit:
      'Once per round, when an ally within range of your normal movement is hit by an attack, you can place yourself between the attacker and your ally as a reaction, making you the target instead. Cannot be used against area effects or perception range attacks.',
  },
  {
    id: 'languages',
    name: 'Languages',
    system: 'mam3e',
    source: "Hero's Handbook",
    type: 'general',
    ranked: true,
    description: 'Know additional languages.',
    benefit:
      'You know additional languages. With 1 rank you know one additional language. For each additional rank, you double your additional known languages: 2 at rank 2, 4 at rank 3, 8 at rank 4, etc. Characters are assumed to be fluent in any languages they know.',
  },
  {
    id: 'minion',
    name: 'Minion',
    system: 'mam3e',
    source: "Hero's Handbook",
    type: 'general',
    ranked: true,
    description: 'Gain a minion character.',
    benefit:
      'You have a follower or minion built as an independent character with (advantage rank × 15) character points, subject to normal power level limits. Minions do not earn character points; you must spend your own to improve them.',
  },
  {
    id: 'second-chance',
    name: 'Second Chance',
    system: 'mam3e',
    source: "Hero's Handbook",
    type: 'general',
    ranked: true,
    description: 'Reroll a failed check against a specific hazard.',
    benefit:
      'Choose a particular hazard (such as falling, being tripped, mind control, or a specific power effect). If you fail a check against that hazard, you can make another immediately and use the better result. You can take this advantage multiple times for different hazards.',
  },
  {
    id: 'sidekick',
    name: 'Sidekick',
    system: 'mam3e',
    source: "Hero's Handbook",
    type: 'general',
    ranked: true,
    description: 'Gain a sidekick character.',
    benefit:
      "You have a sidekick built as an independent character with (advantage rank × 5) character points, subject to the series power level. A sidekick is a full character rather than a minion. You can spend your own victory points on your sidekick's behalf.",
  },
  {
    id: 'teamwork',
    name: 'Teamwork',
    system: 'mam3e',
    source: "Hero's Handbook",
    type: 'general',
    ranked: false,
    description: 'Improved bonus when aiding allies.',
    benefit:
      'When you support a team check, you have a +5 circumstance bonus to your check. This bonus also applies to the aid action and team attacks.',
  },
  {
    id: 'trance',
    name: 'Trance',
    system: 'mam3e',
    source: "Hero's Handbook",
    type: 'general',
    ranked: false,
    description: 'Enter a deep meditative trance.',
    benefit:
      'Through breathing and bodily control, you can slip into a deep trance (requires a minute of meditation and a DC 15 Awareness check). While in trance, you add Awareness to Stamina for holding breath, poison and disease effects are suspended, and you appear dead to casual observation.',
  },
];
