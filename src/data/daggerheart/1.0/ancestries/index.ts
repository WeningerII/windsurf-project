import type { DaggerheartAncestry, DaggerheartFeature } from '../../../../types/daggerheart';

const source = 'Daggerheart SRD 1.0';
const sourceBook = {
  name: 'System Reference Document 1.0',
  url: 'https://www.daggerheart.com/srd/',
};
const lastUpdated = '2026-03-08';

function feature(id: string, name: string, description: string): DaggerheartFeature {
  return { id, name, description };
}

function ancestry(
  id: string,
  name: string,
  description: string,
  firstFeature: DaggerheartFeature,
  secondFeature: DaggerheartFeature
): DaggerheartAncestry {
  return {
    id,
    name,
    system: 'daggerheart',
    source,
    version: '1.0',
    lastUpdated,
    sourceBook,
    description,
    features: [firstFeature, secondFeature],
  };
}

export const daggerheartAncestries: DaggerheartAncestry[] = [
  ancestry(
    'clank',
    'Clank',
    'A sentient constructed being whose bespoke body is built for a purpose and can be repaired or modified over time.',
    feature(
      'clank-purposeful-design',
      'Purposeful Design',
      'Choose an Experience tied to your original purpose and gain a permanent +1 bonus to it.'
    ),
    feature(
      'clank-efficient',
      'Efficient',
      'During a short rest, you can choose one long-rest move instead of a short-rest move.'
    )
  ),
  ancestry(
    'drakona',
    'Drakona',
    'A draconic humanoid with scales, great longevity, and an inherited elemental breath.',
    feature(
      'drakona-scales',
      'Scales',
      'When you would take Severe damage, mark a Stress to mark 1 fewer Hit Point.'
    ),
    feature(
      'drakona-elemental-breath',
      'Elemental Breath',
      'Choose an element; your breath is a Very Close Instinct weapon that deals d8 magic damage with your Proficiency.'
    )
  ),
  ancestry(
    'dwarf',
    'Dwarf',
    'A compact, sturdy humanoid with remarkable resilience and a body built to endure punishment.',
    feature(
      'dwarf-thick-skin',
      'Thick Skin',
      'When you take Minor damage, you can mark 2 Stress instead of marking a Hit Point.'
    ),
    feature(
      'dwarf-increased-fortitude',
      'Increased Fortitude',
      'Spend 3 Hope to halve incoming physical damage.'
    )
  ),
  ancestry(
    'elf',
    'Elf',
    'A tall, keen-sensed humanoid who rests through celestial trance rather than normal sleep.',
    feature(
      'elf-quick-reactions',
      'Quick Reactions',
      'Mark a Stress to gain advantage on a reaction roll.'
    ),
    feature(
      'elf-celestial-trance',
      'Celestial Trance',
      'During a rest, enter a trance to choose one additional downtime move.'
    )
  ),
  ancestry(
    'faerie',
    'Faerie',
    'A winged person with insectile features and a knack for bending fortune and movement.',
    feature(
      'faerie-luckbender',
      'Luckbender',
      'Once per session, after you or a willing ally within Close range makes an action roll, spend 3 Hope to reroll the Duality Dice.'
    ),
    feature(
      'faerie-wings',
      'Wings',
      'You can fly, and while airborne you can mark a Stress after an attack to gain +2 Evasion against it.'
    )
  ),
  ancestry(
    'faun',
    'Faun',
    'A caprine humanoid known for powerful legs, horns, and agile leaps over obstacles.',
    feature(
      'faun-caprine-leap',
      'Caprine Leap',
      'Leap anywhere within Close range as part of normal movement.'
    ),
    feature(
      'faun-kick',
      'Kick',
      'After a successful melee attack, mark a Stress to deal 2d6 extra damage and knock back yourself or the target to Very Close.'
    )
  ),
  ancestry(
    'firbolg',
    'Firbolg',
    'A broad, furred bovine humanoid with charging power and difficult-to-shake endurance.',
    feature(
      'firbolg-charge',
      'Charge',
      'After moving from Far or Very Far into melee with Agility, mark a Stress to deal 1d12 physical damage to all targets within Melee range.'
    ),
    feature(
      'firbolg-unshakable',
      'Unshakable',
      'When you would mark a Stress, roll a d6; on a 6, you do not mark it.'
    )
  ),
  ancestry(
    'fungril',
    'Fungril',
    'A fungal person whose mycelial senses and bond with death grant unusual forms of communication and insight.',
    feature(
      'fungril-network',
      'Fungril Network',
      'Make an Instinct Roll to communicate with other fungril across any distance.'
    ),
    feature(
      'fungril-death-connection',
      'Death Connection',
      'While touching a recent corpse, mark a Stress to pull one memory tied to a chosen emotion or sensation.'
    )
  ),
  ancestry(
    'galapa',
    'Galapa',
    'A turtle-like person whose shell serves as powerful natural protection.',
    feature(
      'galapa-shell',
      'Shell',
      'Gain a bonus to your damage thresholds equal to your Proficiency.'
    ),
    feature(
      'galapa-retract',
      'Retract',
      'Mark a Stress to pull into your shell, gaining resistance to physical damage while losing movement and suffering disadvantage on action rolls.'
    )
  ),
  ancestry(
    'giant',
    'Giant',
    'A towering humanoid with long reach and the toughness expected of a much larger frame.',
    feature(
      'giant-endurance',
      'Endurance',
      'Gain an additional Hit Point slot at character creation.'
    ),
    feature(
      'giant-reach',
      'Reach',
      'Treat Melee weapons, abilities, and features as though they have Very Close range.'
    )
  ),
  ancestry(
    'goblin',
    'Goblin',
    'A small, sharp-eyed, sharp-eared trickster whose senses help them slip through danger.',
    feature('goblin-surefooted', 'Surefooted', 'Ignore disadvantage on Agility Rolls.'),
    feature(
      'goblin-danger-sense',
      'Danger Sense',
      'Once per rest, mark a Stress to force an adversary to reroll an attack against you or an ally within Very Close range.'
    )
  ),
  ancestry(
    'halfling',
    'Halfling',
    'A small traveler with a knack for luck, orientation, and shared momentum.',
    feature(
      'halfling-luckbringer',
      'Luckbringer',
      'At the start of each session, everyone in your party gains a Hope.'
    ),
    feature(
      'halfling-internal-compass',
      'Internal Compass',
      'When you roll a 1 on your Hope Die, you can reroll it.'
    )
  ),
  ancestry(
    'human',
    'Human',
    'An adaptable endurance-based people who recover through grit and second chances.',
    feature(
      'human-high-stamina',
      'High Stamina',
      'Gain an additional Stress slot at character creation.'
    ),
    feature(
      'human-adaptability',
      'Adaptability',
      'When you fail a roll that used one of your Experiences, mark a Stress to reroll.'
    )
  ),
  ancestry(
    'infernis',
    'Infernis',
    'A horned descendant of the Circles Below whose fear and menace can be turned into power.',
    feature(
      'infernis-fearless',
      'Fearless',
      'When you roll with Fear, you can mark 2 Stress to turn it into a roll with Hope instead.'
    ),
    feature(
      'infernis-dread-visage',
      'Dread Visage',
      'You have advantage on rolls to intimidate hostile creatures.'
    )
  ),
  ancestry(
    'katari',
    'Katari',
    'A feline person with quick instincts, claws, and explosive bursts of poised movement.',
    feature(
      'katari-feline-instincts',
      'Feline Instincts',
      'When you make an Agility Roll, spend 2 Hope to reroll your Hope Die.'
    ),
    feature(
      'katari-retracting-claws',
      'Retracting Claws',
      'Make an Agility attack in Melee; on a success, the target becomes temporarily Vulnerable.'
    )
  ),
  ancestry(
    'orc',
    'Orc',
    'A tusked powerhouse whose stubborn durability pairs naturally with brutal close-range force.',
    feature(
      'orc-sturdy',
      'Sturdy',
      'When you have 1 Hit Point remaining, attacks against you have disadvantage.'
    ),
    feature(
      'orc-tusks',
      'Tusks',
      'After a successful melee attack, spend a Hope to deal an extra 1d6 damage with your tusks.'
    )
  ),
  ancestry(
    'ribbet',
    'Ribbet',
    'An amphibious frog-like person whose tongue, movement, and water affinity are always useful.',
    feature('ribbet-amphibious', 'Amphibious', 'You can breathe and move naturally underwater.'),
    feature(
      'ribbet-long-tongue',
      'Long Tongue',
      'Use your tongue to grab objects within Close range, or mark a Stress to attack at Close with Finesse for d12 physical damage.'
    )
  ),
  ancestry(
    'simiah',
    'Simiah',
    'A simian climber with excellent balance, dexterous limbs, and nimble movement.',
    feature(
      'simiah-natural-climber',
      'Natural Climber',
      'Gain advantage on Agility Rolls that involve balancing or climbing.'
    ),
    feature(
      'simiah-nimble',
      'Nimble',
      'Gain a permanent +1 bonus to your Evasion at character creation.'
    )
  ),
  ancestry(
    'mixed-ancestry',
    'Mixed Ancestry',
    'A person whose lineage draws from more than one ancestry and whose features can reflect multiple traditions at once.',
    feature(
      'mixed-ancestry-heritage-term',
      'Self-Defined Heritage',
      'Choose the term, presentation, and identity that best describe your mixed lineage.'
    ),
    feature(
      'mixed-ancestry-feature-pair',
      'Feature Pair',
      'Choose the first feature from one ancestry and the second feature from another ancestry in your lineage.'
    )
  ),
];

export const daggerheartAncestriesById: Record<string, DaggerheartAncestry> = Object.fromEntries(
  daggerheartAncestries.map((entry) => [entry.id, entry])
);

export function getDaggerheartAncestry(id: string): DaggerheartAncestry | undefined {
  return daggerheartAncestriesById[id];
}
