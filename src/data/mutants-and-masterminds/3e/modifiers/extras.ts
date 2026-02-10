// M&M 3e Power Extras - Hero's Handbook

export interface PowerModifier {
  id: string;
  name: string;
  system: string;
  source: string;
  type: 'extra' | 'flaw';
  costPerRank: number; // Flat cost modifier per rank (can be fractional like +0.5)
  flatCost?: number; // One-time flat cost
  description: string;
  effects: string[];
}

export const accurate: PowerModifier = {
  id: 'accurate', name: 'Accurate', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 1,
  description: 'An effect with this extra is especially accurate.',
  effects: ['+2 bonus to attack checks per rank of this extra.'],
};

export const affects_corporeal: PowerModifier = {
  id: 'affects-corporeal', name: 'Affects Corporeal', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 1,
  description: 'An incorporeal being can use an effect with this extra on the corporeal world.',
  effects: ['Effect works on corporeal targets while you are incorporeal.'],
};

export const affects_insubstantial: PowerModifier = {
  id: 'affects-insubstantial', name: 'Affects Insubstantial', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 0, flatCost: 1,
  description: 'An effect with this extra can affect insubstantial targets.',
  effects: ['Rank 1: Half effect on insubstantial', 'Rank 2: Full effect on insubstantial'],
};

export const affects_objects: PowerModifier = {
  id: 'affects-objects', name: 'Affects Objects', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 0, flatCost: 1,
  description: 'This modifier allows effects normally resisted by Fortitude to work on non-living objects.',
  effects: ['Effect works on objects (uses Toughness instead of Fortitude).'],
};

export const affects_others: PowerModifier = {
  id: 'affects-others', name: 'Affects Others', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 0, flatCost: 1,
  description: 'This extra allows you to give a personal effect to someone else.',
  effects: ['Personal range effect can be used on others at touch range.'],
};

export const alternate_effect: PowerModifier = {
  id: 'alternate-effect', name: 'Alternate Effect', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 0, flatCost: 1,
  description: 'Creates an alternate use for a power that can\'t be used at the same time as the base effect.',
  effects: ['1 point: Alternate Effect', '2 points: Dynamic Alternate Effect'],
};

export const area: PowerModifier = {
  id: 'area', name: 'Area', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 1,
  description: 'This extra allows an effect to cover an area.',
  effects: ['Burst: radius equal to (rank x 30) feet', 'Cloud: radius equal to (rank x 15) feet, provides concealment', 'Cone: cone (rank x 60) feet long', 'Cylinder: (rank x 30) feet radius, (rank x 30) feet tall', 'Line: line (rank x 5) feet wide, (rank x 30) feet long', 'Perception: affects all targets the user can perceive', 'Shapeable: (rank x 30) 5-foot cubes'],
};

export const attack: PowerModifier = {
  id: 'attack', name: 'Attack', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 0,
  description: 'This extra makes a personal effect usable on others as an attack.',
  effects: ['Costs 0 but changes effect to require an attack roll and resistance check.'],
};

export const contagious: PowerModifier = {
  id: 'contagious', name: 'Contagious', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 1,
  description: 'Contagious effects work on both the target and anyone coming into contact with the target.',
  effects: ['Effect spreads to anyone touching the target.'],
};

export const continuous: PowerModifier = {
  id: 'continuous', name: 'Continuous', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 1,
  description: 'A continuous effect is always "on" once activated, requiring no action.',
  effects: ['Effect remains active without requiring an action to maintain.'],
};

export const dimensional: PowerModifier = {
  id: 'dimensional', name: 'Dimensional', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 0, flatCost: 1,
  description: 'This effect can work on targets in other dimensions.',
  effects: ['Rank 1: One other dimension', 'Rank 2: Any of a related group of dimensions', 'Rank 3: Any dimension'],
};

export const extended_range: PowerModifier = {
  id: 'extended-range', name: 'Extended Range', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 0, flatCost: 1,
  description: 'This extra increases the range of an effect.',
  effects: ['Each rank doubles the effect\'s range.'],
};

export const homing: PowerModifier = {
  id: 'homing', name: 'Homing', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 0, flatCost: 1,
  description: 'This extra allows a missed ranged attack to try again.',
  effects: ['Each rank allows one additional attack attempt if the initial attack misses.'],
};

export const impervious: PowerModifier = {
  id: 'impervious', name: 'Impervious', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 1,
  description: 'A defense with this extra is highly resistant.',
  effects: ['Resistance ignores effects with a rank equal to or less than half the Impervious rank (rounded up).'],
};

export const incurable: PowerModifier = {
  id: 'incurable', name: 'Incurable', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 0, flatCost: 1,
  description: 'Effects with this extra cannot be removed by Healing or Regeneration.',
  effects: ['Damage from this effect cannot be healed by powers; only natural recovery.'],
};

export const increased_duration: PowerModifier = {
  id: 'increased-duration', name: 'Increased Duration', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 1,
  description: 'This extra increases an effect\'s duration.',
  effects: ['Instant becomes Concentration', 'Concentration becomes Sustained', 'Sustained becomes Continuous', 'Continuous becomes Permanent'],
};

export const increased_mass: PowerModifier = {
  id: 'increased-mass', name: 'Increased Mass', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 0, flatCost: 1,
  description: 'This extra increases the mass rank an effect can carry.',
  effects: ['Each rank adds +1 to the mass rank the effect can carry.'],
};

export const increased_range: PowerModifier = {
  id: 'increased-range', name: 'Increased Range', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 1,
  description: 'This extra increases an effect\'s range.',
  effects: ['Close becomes Ranged', 'Ranged becomes Perception'],
};

export const indirect: PowerModifier = {
  id: 'indirect', name: 'Indirect', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 0, flatCost: 1,
  description: 'An effect with this extra can originate from a point other than you.',
  effects: ['Rank 1: Fixed point away from you', 'Rank 2: Any point away from you, directed toward you', 'Rank 3: Any point, any direction', 'Rank 4: Any point, any direction, can change origin point'],
};

export const innate: PowerModifier = {
  id: 'innate', name: 'Innate', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 0, flatCost: 1,
  description: 'An effect with this extra is an innate part of your nature and cannot be Nullified.',
  effects: ['Effect cannot be Nullified.'],
};

export const insidious: PowerModifier = {
  id: 'insidious', name: 'Insidious', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 0, flatCost: 1,
  description: 'This effect is subtle and difficult to detect.',
  effects: ['Target is unaware of the effect until it\'s too late.'],
};

export const linked: PowerModifier = {
  id: 'linked', name: 'Linked', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 0, flatCost: 0,
  description: 'Two or more effects are linked together.',
  effects: ['Effects activate together and share a single action. If one fails, they all fail.'],
};

export const multiattack: PowerModifier = {
  id: 'multiattack', name: 'Multiattack', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 1,
  description: 'This extra allows an effect to hit multiple targets or hit one target multiple times.',
  effects: ['Attack multiple targets at -2 per additional target', 'Or attack one target with +2 to effect for every 5 points attack exceeds defense (max +5)'],
};

export const penetrating: PowerModifier = {
  id: 'penetrating', name: 'Penetrating', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 0, flatCost: 1,
  description: 'This extra allows an effect to overcome Impervious Resistance.',
  effects: ['Each rank negates 1 rank of Impervious.'],
};

export const precise: PowerModifier = {
  id: 'precise', name: 'Precise', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 0, flatCost: 1,
  description: 'You can use this effect to perform tasks requiring fine control.',
  effects: ['Allows fine manipulation with the effect.'],
};

export const reach: PowerModifier = {
  id: 'reach', name: 'Reach', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 0, flatCost: 1,
  description: 'This extra extends a close range effect\'s reach.',
  effects: ['Each rank extends reach by 5 feet.'],
};

export const reaction: PowerModifier = {
  id: 'reaction', name: 'Reaction', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 3,
  description: 'This extra allows an effect to activate as a reaction.',
  effects: ['Effect activates as a reaction to a defined circumstance.'],
};

export const reversible: PowerModifier = {
  id: 'reversible', name: 'Reversible', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 0, flatCost: 1,
  description: 'You can remove any lasting effect on a target at will.',
  effects: ['You can remove the effect at will as a free action.'],
};

export const ricochet: PowerModifier = {
  id: 'ricochet', name: 'Ricochet', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 0, flatCost: 1,
  description: 'You can bounce a ranged effect off a surface to hit a target.',
  effects: ['Each rank allows one bounce to ignore cover.'],
};

export const secondary_effect: PowerModifier = {
  id: 'secondary-effect', name: 'Secondary Effect', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 1,
  description: 'An instant effect with this extra affects the target once and then again on the following round.',
  effects: ['Effect applies again on the round after it first hits.'],
};

export const selective: PowerModifier = {
  id: 'selective', name: 'Selective', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 1,
  description: 'You can choose targets within an area effect.',
  effects: ['Choose which targets in an area are affected.'],
};

export const sleep: PowerModifier = {
  id: 'sleep', name: 'Sleep', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 0, flatCost: 0,
  description: 'For Affliction powers, changes the third degree to Asleep instead of Incapacitated.',
  effects: ['Target falls Asleep instead of becoming Incapacitated.'],
};

export const split: PowerModifier = {
  id: 'split', name: 'Split', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 0, flatCost: 1,
  description: 'You can split your effect\'s ranks between multiple targets.',
  effects: ['Each rank allows you to engage one additional target, splitting ranks between them.'],
};

export const subtle: PowerModifier = {
  id: 'subtle', name: 'Subtle', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 0, flatCost: 1,
  description: 'This effect is difficult to detect or completely undetectable.',
  effects: ['Rank 1: Effect is subtle (DC 20 to notice)', 'Rank 2: Effect is completely undetectable'],
};

export const sustained: PowerModifier = {
  id: 'sustained', name: 'Sustained', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 0, flatCost: 0,
  description: 'A lasting effect that requires a free action to maintain.',
  effects: ['Effect lasts as long as you take a free action each round to maintain it.'],
};

export const triggered: PowerModifier = {
  id: 'triggered', name: 'Triggered', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 0, flatCost: 1,
  description: 'This effect activates under a specific circumstance.',
  effects: ['Each rank allows one trigger condition to be set. Effect activates when triggered.'],
};

export const variable_descriptor: PowerModifier = {
  id: 'variable-descriptor', name: 'Variable Descriptor', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 0, flatCost: 1,
  description: 'You can change the descriptors of an effect.',
  effects: ['Rank 1: Change between a close group of descriptors (e.g., fire, heat, plasma)', 'Rank 2: Change between a broad group of descriptors (e.g., any energy type)'],
};

export const cumulative: PowerModifier = {
  id: 'cumulative', name: 'Cumulative', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 1,
  description: 'Successive uses of this effect add together.',
  effects: ['Multiple uses stack, combining their ranks.'],
};

export const feature: PowerModifier = {
  id: 'feature', name: 'Feature', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 0, flatCost: 1,
  description: 'Adds a feature or benefit to an effect.',
  effects: ['1 point per minor feature added to the effect.'],
};

export const improved_critical: PowerModifier = {
  id: 'improved-critical', name: 'Improved Critical', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 0, flatCost: 1,
  description: 'Your effect scores critical hits more easily.',
  effects: ['Each rank reduces critical threat range by 1 (19-20, then 18-20, etc.).'],
};

export const improved_range: PowerModifier = {
  id: 'improved-range', name: 'Improved Range', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 0, flatCost: 1,
  description: 'Increases the distance increment of a ranged effect.',
  effects: ['Each rank increases range increment by 50%.'],
};

export const incurable_extra: PowerModifier = {
  id: 'incurable-extra', name: 'Incurable', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 0, flatCost: 1,
  description: 'Damage from this effect is harder to heal.',
  effects: ['Requires two successful Treatment or Healing checks instead of one.'],
};

export const increased_action: PowerModifier = {
  id: 'increased-action', name: 'Increased Action', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 1,
  description: 'Changes the time required to use an effect.',
  effects: ['Standard becomes Move action', 'Move becomes Free action', 'Free becomes Reaction'],
};

export const line_of_sight: PowerModifier = {
  id: 'line-of-sight', name: 'Line of Sight', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 1,
  description: 'Effect works on any target you can see.',
  effects: ['Range becomes line of sight.'],
};

export const migration: PowerModifier = {
  id: 'migration', name: 'Migration', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 1,
  description: 'You can move an effect from one target to another.',
  effects: ['Transfer effect to a new target as a move action.'],
};

export const penetrating_extra: PowerModifier = {
  id: 'penetrating-extra', name: 'Penetrating', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 0, flatCost: 1,
  description: 'Your effect overcomes Impervious Resistance.',
  effects: ['Each rank negates 5 ranks of Impervious.'],
};

export const progression: PowerModifier = {
  id: 'progression', name: 'Progression', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 0, flatCost: 1,
  description: 'Increases a trait measured on the progression table.',
  effects: ['Each rank moves one step up the progression table.'],
};

export const range: PowerModifier = {
  id: 'range', name: 'Range', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 1,
  description: 'Changes the range of an effect.',
  effects: ['Close becomes Ranged', 'Ranged becomes Perception'],
};

export const reduced_action: PowerModifier = {
  id: 'reduced-action', name: 'Reduced Action', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 1,
  description: 'Reduces the time needed to use an effect.',
  effects: ['Full action becomes Standard', 'Standard becomes Move', 'Move becomes Free'],
};

export const reflect: PowerModifier = {
  id: 'reflect', name: 'Reflect', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 1,
  description: 'You can reflect attacks back at the attacker.',
  effects: ['Make attack check to reflect attack back at attacker.'],
};

export const restore: PowerModifier = {
  id: 'restore', name: 'Restore', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 1,
  description: 'Your effect can restore lost traits or remove conditions.',
  effects: ['Removes negative conditions or restores diminished traits.'],
};

export const second_chance: PowerModifier = {
  id: 'second-chance', name: 'Second Chance', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 0, flatCost: 1,
  description: 'Allows a second resistance check against an effect.',
  effects: ['Target gets a second chance to resist.'],
};

export const split_attack: PowerModifier = {
  id: 'split-attack', name: 'Split Attack', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 0, flatCost: 1,
  description: 'Divide your attack among multiple targets.',
  effects: ['Each rank allows targeting one additional opponent.'],
};

export const stabilize: PowerModifier = {
  id: 'stabilize', name: 'Stabilize', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 0, flatCost: 1,
  description: 'Your effect stabilizes dying characters.',
  effects: ['Can stabilize a dying character.'],
};

export const subtle_extra: PowerModifier = {
  id: 'subtle-extra', name: 'Subtle', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 0, flatCost: 1,
  description: 'Your effect is harder to detect.',
  effects: ['Rank 1: DC 20 to notice', 'Rank 2: Completely undetectable'],
};

export const variable: PowerModifier = {
  id: 'variable', name: 'Variable', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 1,
  description: 'You can vary the effects of your power.',
  effects: ['Rank 1: 1 point variable', 'Rank 2: 2 points variable'],
};

export const zone: PowerModifier = {
  id: 'zone', name: 'Zone', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 1,
  description: 'Creates a zone that affects anyone entering it.',
  effects: ['Area persists and affects anyone who enters.'],
};

export const affects_substantial: PowerModifier = {
  id: 'affects-substantial', name: 'Affects Substantial', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 0, flatCost: 1,
  description: 'An insubstantial effect can affect solid targets.',
  effects: ['Insubstantial effect works on solid targets.'],
};

export const damaging: PowerModifier = {
  id: 'damaging', name: 'Damaging', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 1,
  description: 'Adds damage to a non-damaging effect.',
  effects: ['Effect also inflicts damage.'],
};

export const multiattack_extra: PowerModifier = {
  id: 'multiattack-extra', name: 'Multiattack', system: 'mam3e', source: "Hero's Handbook",
  type: 'extra', costPerRank: 1,
  description: 'Multiple attacks against one or more targets.',
  effects: ['Attack multiple targets or increase effect against one.'],
};

export const extras: PowerModifier[] = [
  accurate, affects_corporeal, affects_insubstantial, affects_objects, affects_others,
  alternate_effect, area, attack, contagious, continuous, dimensional, extended_range,
  homing, impervious, incurable, increased_duration, increased_mass, increased_range,
  indirect, innate, insidious, linked, multiattack, penetrating, precise, reach,
  reaction, reversible, ricochet, secondary_effect, selective, sleep, split,
  subtle, sustained, triggered, variable_descriptor, cumulative, feature, improved_critical,
  improved_range, incurable_extra, increased_action, line_of_sight, migration,
  penetrating_extra, progression, range, reduced_action, reflect, restore,
  second_chance, split_attack, stabilize, subtle_extra, variable, zone,
  affects_substantial, damaging, multiattack_extra,
];
