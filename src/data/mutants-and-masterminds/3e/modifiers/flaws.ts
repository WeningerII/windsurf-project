// M&M 3e Power Flaws - Hero's Handbook

import { PowerModifier } from './extras';

export const activation: PowerModifier = {
  id: 'activation',
  name: 'Activation',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  costPerRank: 0,
  flatCost: -1,
  description: 'A power with this flaw requires an action to activate.',
  effects: ['-1: Move action to activate', '-2: Standard action to activate'],
};

export const check_required: PowerModifier = {
  id: 'check-required',
  name: 'Check Required',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  costPerRank: 0,
  flatCost: -1,
  description: 'You must make a skill check to use this effect.',
  effects: ['Requires a skill check (DC 10 + effect rank) to use the effect.'],
};

export const diminished_range: PowerModifier = {
  id: 'diminished-range',
  name: 'Diminished Range',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  costPerRank: 0,
  flatCost: -1,
  description: 'This flaw reduces the range of an effect.',
  effects: ['Each rank reduces range by one step: Perception to Ranged, Ranged to Close.'],
};

export const distracting: PowerModifier = {
  id: 'distracting',
  name: 'Distracting',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  costPerRank: -1,
  description: 'Using this effect is distracting.',
  effects: ['You are Vulnerable while using this effect.'],
};

export const fades: PowerModifier = {
  id: 'fades',
  name: 'Fades',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  costPerRank: -1,
  description: 'Each time you use this effect, it becomes less effective.',
  effects: ['Effect loses 1 rank each time it is used. Recovers after 1 hour of rest.'],
};

export const feedback: PowerModifier = {
  id: 'feedback',
  name: 'Feedback',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  costPerRank: -1,
  description: 'You suffer when this effect is countered or damaged.',
  effects: ["You take damage equal to the effect's rank when it is countered or damaged."],
};

export const grab_based: PowerModifier = {
  id: 'grab-based',
  name: 'Grab-Based',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  costPerRank: -1,
  description: 'This effect requires you to grab the target first.',
  effects: ['You must successfully grab a target before using this effect.'],
};

export const inaccurate: PowerModifier = {
  id: 'inaccurate',
  name: 'Inaccurate',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  costPerRank: -1,
  description: 'An effect with this flaw is difficult to use accurately.',
  effects: ['-2 penalty to attack checks per rank of this flaw.'],
};

export const limited: PowerModifier = {
  id: 'limited',
  name: 'Limited',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  costPerRank: -1,
  description: 'The effect is limited in some way.',
  effects: ['Effect only works under specific circumstances or against specific targets.'],
};

export const noticeable: PowerModifier = {
  id: 'noticeable',
  name: 'Noticeable',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  costPerRank: 0,
  flatCost: -1,
  description: 'A permanent effect with this flaw is obvious and easily noticed.',
  effects: ['Permanent effect is obviously visible or otherwise detectable.'],
};

export const permanent: PowerModifier = {
  id: 'permanent',
  name: 'Permanent',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  // Duration flaw: reduces cost by 1 point per rank (Hero's Handbook, Flaws).
  costPerRank: -1,
  description: 'This effect is always "on" and cannot be turned off.',
  effects: ['Effect cannot be turned off or controlled. Also reduces cost by 1 per rank.'],
};

export const quirk: PowerModifier = {
  id: 'quirk',
  name: 'Quirk',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  costPerRank: 0,
  flatCost: -1,
  description: 'A minor drawback or limitation associated with an effect.',
  effects: ['Minor limitation that occasionally comes up but is not a major hindrance.'],
};

export const reduced_range: PowerModifier = {
  id: 'reduced-range',
  name: 'Reduced Range',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  costPerRank: -1,
  description: 'This flaw reduces the range of an effect.',
  effects: [
    'Perception becomes Ranged (-1)',
    'Ranged becomes Close (-1)',
    'Close becomes Touch (-1)',
  ],
};

export const removable: PowerModifier = {
  id: 'removable',
  name: 'Removable',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  costPerRank: 0,
  flatCost: -1,
  description: 'An effect with this flaw is tied to a device that can be taken away.',
  effects: [
    '-1 per 5 points: Removable (requires a standard action to remove)',
    '-2 per 5 points: Easily Removable (can be removed as a move action or grabbed)',
  ],
};

export const resistible: PowerModifier = {
  id: 'resistible',
  name: 'Resistible',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  costPerRank: -1,
  description: 'This effect can be resisted by an additional defense.',
  effects: ['Effect requires an additional resistance check beyond normal.'],
};

export const sense_dependent: PowerModifier = {
  id: 'sense-dependent',
  name: 'Sense-Dependent',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  costPerRank: -1,
  description: 'This effect depends on a target being able to perceive it.',
  effects: ['Effect only works if target can perceive it through a specific sense.'],
};

export const side_effect: PowerModifier = {
  id: 'side-effect',
  name: 'Side Effect',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  costPerRank: -1,
  description: 'Using this effect causes an undesirable side effect.',
  effects: ['-1: Side effect occurs on failed use', '-2: Side effect always occurs'],
};

export const tiring: PowerModifier = {
  id: 'tiring',
  name: 'Tiring',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  costPerRank: -1,
  description: 'Using this effect is tiring.',
  effects: ['After using the effect, you suffer a level of fatigue.'],
};

export const uncontrolled: PowerModifier = {
  id: 'uncontrolled',
  name: 'Uncontrolled',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  costPerRank: -1,
  description: 'You have no control over this effect.',
  effects: ['Effect activates and operates independently of your will; GM controls when and how.'],
};

export const unreliable: PowerModifier = {
  id: 'unreliable',
  name: 'Unreliable',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  costPerRank: -1,
  description: 'This effect is unreliable.',
  effects: [
    'Roll d20 before use: on 10 or less, effect fails. Or: 5 uses before requiring hour rest.',
  ],
};

export const concentration: PowerModifier = {
  id: 'concentration',
  name: 'Concentration',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  costPerRank: -1,
  description: 'Maintaining this effect requires concentration.',
  effects: [
    'Requires concentration to maintain. Broken if you are dazed, stunned, or fail concentration check.',
  ],
};

export const continuous_flaw: PowerModifier = {
  id: 'continuous-flaw',
  name: 'Continuous',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  // Duration flaw: reduces cost by 1 point per rank (Hero's Handbook, Flaws).
  costPerRank: -1,
  description: 'The effect is always on and cannot be turned off easily.',
  effects: ['Effect is always active. Reduces cost by 1 per rank.'],
};

export const delayed: PowerModifier = {
  id: 'delayed',
  name: 'Delayed',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  costPerRank: -1,
  description: 'This effect takes time to activate.',
  effects: ['Effect does not activate until one round after use.'],
};

export const diminished: PowerModifier = {
  id: 'diminished',
  name: 'Diminished',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  costPerRank: -1,
  description: 'The effect is weaker than normal.',
  effects: ['Effect operates at half normal rank (rounded down).'],
};

export const exhausting: PowerModifier = {
  id: 'exhausting',
  name: 'Exhausting',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  costPerRank: -1,
  description: 'Using this effect is extremely tiring.',
  effects: ['After using the effect, you are exhausted.'],
};

export const full_power: PowerModifier = {
  id: 'full-power',
  name: 'Full Power',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  costPerRank: -1,
  description: 'You cannot reduce the power level of this effect.',
  effects: ['Effect always operates at full rank; cannot power attack or pull punches.'],
};

export const increased_duration_flaw: PowerModifier = {
  id: 'increased-duration-flaw',
  name: 'Increased Duration',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  costPerRank: 0,
  description: 'The effect lasts longer than you want.',
  effects: ['Cannot turn off effect; it lasts its full duration.'],
};

export const instant: PowerModifier = {
  id: 'instant',
  name: 'Instant',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  // Duration flaw: reduces cost by 1 point per rank (Hero's Handbook, Flaws).
  costPerRank: -1,
  description: 'Sustained effect becomes instant duration.',
  effects: ['Sustained becomes Instant. Reduces cost by 1 per rank.'],
};

export const limited_to_condition: PowerModifier = {
  id: 'limited-to-condition',
  name: 'Limited to Condition',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  costPerRank: -1,
  description: 'Effect only works under specific conditions.',
  effects: ['Only functions in specific circumstances (e.g., at night, when angry).'],
};

export const linked_flaw: PowerModifier = {
  id: 'linked-flaw',
  name: 'Linked',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  costPerRank: 0,
  description: 'This effect is tied to another effect.',
  effects: ['Cannot be used separately from linked effect.'],
};

export const mental_flaw: PowerModifier = {
  id: 'mental-flaw',
  name: 'Mental',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  costPerRank: -1,
  description: 'Effect is mental and does not work on mindless targets.',
  effects: ['Does not affect mindless targets.'],
};

export const no_range: PowerModifier = {
  id: 'no-range',
  name: 'No Range',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  costPerRank: -1,
  description: 'A ranged effect becomes close range.',
  effects: ['Ranged effect becomes Close or Touch range.'],
};

export const nuisance: PowerModifier = {
  id: 'nuisance',
  name: 'Nuisance',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  costPerRank: 0,
  flatCost: -1,
  description: 'The effect is a minor inconvenience.',
  effects: ['Effect is very minor and rarely matters.'],
};

export const objects_only: PowerModifier = {
  id: 'objects-only',
  name: 'Objects Only',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  costPerRank: -1,
  description: 'Effect only works on objects, not living things.',
  effects: ['Cannot affect living creatures.'],
};

export const proportional: PowerModifier = {
  id: 'proportional',
  name: 'Proportional',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  costPerRank: -1,
  description: 'Effect strength is tied to another trait.',
  effects: ['Effect rank equals another trait rank.'],
};

export const random: PowerModifier = {
  id: 'random',
  name: 'Random',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  costPerRank: -1,
  description: 'Effect is unpredictable.',
  effects: ['GM determines what the effect does each time.'],
};

export const reaction_flaw: PowerModifier = {
  id: 'reaction-flaw',
  name: 'Reaction',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  costPerRank: 0,
  description: 'Effect activates as an uncontrolled reaction.',
  effects: ['Effect activates automatically in response to trigger.'],
};

export const uncontrollable: PowerModifier = {
  id: 'uncontrollable',
  name: 'Uncontrollable',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  costPerRank: -1,
  description: 'You cannot control when or how the effect activates.',
  effects: ['Effect activates randomly or uncontrollably.'],
};

export const vulnerable: PowerModifier = {
  id: 'vulnerable',
  name: 'Vulnerable',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  costPerRank: -1,
  description: 'Using effect leaves you vulnerable.',
  effects: ['You are vulnerable to attacks while using this effect.'],
};

export const wall: PowerModifier = {
  id: 'wall',
  name: 'Wall',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  costPerRank: 0,
  description: 'Area effect becomes a wall.',
  effects: ['Area becomes a wall or barrier.'],
};

export const weak_point: PowerModifier = {
  id: 'weak-point',
  name: 'Weak Point',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  costPerRank: -1,
  description: 'Defense has a weak point that negates it.',
  effects: ['Defense has a vulnerability that bypasses it entirely.'],
};

export const close_range_only: PowerModifier = {
  id: 'close-range-only',
  name: 'Close Range Only',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  costPerRank: -1,
  description: 'Ranged effect only works at close range.',
  effects: ['Effect range reduced to close/touch only.'],
};

export const limited_uses: PowerModifier = {
  id: 'limited-uses',
  name: 'Limited Uses',
  system: 'mam3e',
  source: "Hero's Handbook",
  type: 'flaw',
  costPerRank: -1,
  description: 'Effect has limited uses before requiring rest.',
  effects: ['Can only be used a certain number of times before requiring recovery.'],
};

export const flaws: PowerModifier[] = [
  activation,
  check_required,
  diminished_range,
  distracting,
  fades,
  feedback,
  grab_based,
  inaccurate,
  limited,
  noticeable,
  permanent,
  quirk,
  reduced_range,
  removable,
  resistible,
  sense_dependent,
  side_effect,
  tiring,
  uncontrolled,
  unreliable,
  concentration,
  continuous_flaw,
  delayed,
  diminished,
  exhausting,
  full_power,
  increased_duration_flaw,
  instant,
  limited_to_condition,
  linked_flaw,
  mental_flaw,
  no_range,
  nuisance,
  objects_only,
  proportional,
  random,
  reaction_flaw,
  uncontrollable,
  vulnerable,
  wall,
  weak_point,
  close_range_only,
  limited_uses,
];
