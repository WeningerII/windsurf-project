import type {
  DaggerheartClass,
  DaggerheartFeature,
  DaggerheartSubclass,
} from '../../../../types/daggerheart';

const source = 'Daggerheart SRD 1.0';
const sourceBook = {
  name: 'System Reference Document 1.0',
  url: 'https://www.daggerheart.com/srd/',
};
const lastUpdated = '2026-03-08';

function feature(id: string, name: string, description: string): DaggerheartFeature {
  return { id, name, description };
}

function subclass(
  id: string,
  name: string,
  description: string,
  foundationFeatures: DaggerheartFeature[],
  specializationFeatures: DaggerheartFeature[],
  masteryFeatures: DaggerheartFeature[],
  spellcastTrait?: DaggerheartSubclass['spellcastTrait']
): DaggerheartSubclass {
  return {
    id,
    name,
    description,
    spellcastTrait,
    foundationFeatures,
    specializationFeatures,
    masteryFeatures,
  };
}

export const daggerheartClasses: DaggerheartClass[] = [
  {
    id: 'daggerheart-bard',
    name: 'Bard',
    system: 'daggerheart',
    source,
    version: '1.0',
    lastUpdated,
    sourceBook,
    description:
      'A charismatic performer who rallies allies and turns art, wit, and presence into battlefield leverage.',
    domains: ['Grace', 'Codex'],
    startingEvasion: 10,
    startingHitPoints: 5,
    classItems: ['A romance novel', 'A letter never opened'],
    hopeFeature: feature(
      'bard-make-a-scene',
      'Make a Scene',
      'Spend 3 Hope to distract a nearby target and impose a temporary Difficulty penalty.'
    ),
    classFeatures: [
      feature(
        'bard-rally',
        'Rally',
        'Once per session, give the party Rally Dice that can boost rolls or clear Stress.'
      ),
    ],
    subclasses: [
      subclass(
        'bard-troubadour',
        'Troubadour',
        'A musical support caster who bolsters allies through performance.',
        [
          feature(
            'troubadour-gifted-performer',
            'Gifted Performer',
            'Perform songs that heal, create openings, or grant Hope.'
          ),
        ],
        [
          feature(
            'troubadour-maestro',
            'Maestro',
            'Rally support can also grant Hope or clear Stress.'
          ),
        ],
        [
          feature(
            'troubadour-virtuoso',
            'Virtuoso',
            'Perform each signature song twice per long rest.'
          ),
        ],
        'presence'
      ),
      subclass(
        'bard-wordsmith',
        'Wordsmith',
        'A speaker and storyteller who empowers allies with inspiration and cutting rhetoric.',
        [
          feature(
            'wordsmith-rousing-speech',
            'Rousing Speech',
            'Give a heartfelt speech that clears Stress for allies.'
          ),
          feature(
            'wordsmith-heart-of-a-poet',
            'Heart of a Poet',
            'Spend Hope to add a d4 after a persuasive, impressive, or insulting action.'
          ),
        ],
        [
          feature(
            'wordsmith-eloquent',
            'Eloquent',
            'Once per session, encouragement can supply a useful object, free Help, or extra downtime.'
          ),
        ],
        [
          feature(
            'wordsmith-epic-poetry',
            'Epic Poetry',
            'Upgrade Rally Dice and turn Help into a stronger heroic flourish.'
          ),
        ],
        'presence'
      ),
    ],
  },
  {
    id: 'daggerheart-druid',
    name: 'Druid',
    system: 'daggerheart',
    source,
    version: '1.0',
    lastUpdated,
    sourceBook,
    description:
      'A nature mystic who shifts into beast shapes and channels the wild in subtle or overwhelming ways.',
    domains: ['Sage', 'Arcana'],
    startingEvasion: 10,
    startingHitPoints: 6,
    classItems: ['A small bag of rocks and bones', 'A strange pendant found in the dirt'],
    hopeFeature: feature(
      'druid-evolution',
      'Evolution',
      'Spend 3 Hope to enter Beastform without paying Stress and temporarily improve one trait.'
    ),
    classFeatures: [
      feature(
        'druid-beastform',
        'Beastform',
        'Mark Stress to transform into a tier-appropriate creature from the Beastform list.'
      ),
      feature(
        'druid-wildtouch',
        'Wildtouch',
        'Perform small, harmless nature-based magical effects at will.'
      ),
    ],
    subclasses: [
      subclass(
        'druid-warden-of-the-elements',
        'Warden of the Elements',
        'A druid who channels fire, earth, water, or air as a living mantle.',
        [
          feature(
            'warden-elements-elemental-incarnation',
            'Elemental Incarnation',
            'Channel one element and gain a matching defensive or offensive benefit.'
          ),
        ],
        [
          feature(
            'warden-elements-elemental-aura',
            'Elemental Aura',
            'Once per rest, project an aura whose effect depends on the element you are channeling.'
          ),
        ],
        [
          feature(
            'warden-elements-elemental-dominion',
            'Elemental Dominion',
            'Gain a stronger signature benefit while channeling your chosen element.'
          ),
        ],
        'instinct'
      ),
      subclass(
        'druid-warden-of-renewal',
        'Warden of Renewal',
        'A restorative druid who heals allies and turns Beastform into guardian magic.',
        [
          feature(
            'warden-renewal-clarity-of-nature',
            'Clarity of Nature',
            'Create a calming space that clears Stress during a rest.'
          ),
          feature(
            'warden-renewal-regeneration',
            'Regeneration',
            'Spend 3 Hope to clear Hit Points on a creature you touch.'
          ),
        ],
        [
          feature(
            'warden-renewal-regenerative-reach',
            'Regenerative Reach',
            'Use Regeneration at greater range.'
          ),
          feature(
            'warden-renewal-protection',
            'Warden’s Protection',
            'Once per long rest, spend Hope to heal multiple nearby allies.'
          ),
        ],
        [
          feature(
            'warden-renewal-defender',
            'Defender',
            'While in Beastform, spend Stress to reduce heavy damage taken by a nearby ally.'
          ),
        ],
        'instinct'
      ),
    ],
  },
  {
    id: 'daggerheart-guardian',
    name: 'Guardian',
    system: 'daggerheart',
    source,
    version: '1.0',
    lastUpdated,
    sourceBook,
    description:
      'A relentless protector who anchors the front line and punishes those who threaten allies.',
    domains: ['Valor', 'Blade'],
    startingEvasion: 9,
    startingHitPoints: 7,
    classItems: ['A totem from your mentor', 'A secret key'],
    hopeFeature: feature(
      'guardian-frontline-tank',
      'Frontline Tank',
      'Spend 3 Hope to clear 2 Armor Slots.'
    ),
    classFeatures: [
      feature(
        'guardian-unstoppable',
        'Unstoppable',
        'Once per long rest, enter an escalating stance that reduces physical harm and adds damage.'
      ),
    ],
    subclasses: [
      subclass(
        'guardian-stalwart',
        'Stalwart',
        'A wall of endurance who absorbs punishment for the whole party.',
        [
          feature(
            'stalwart-unwavering',
            'Unwavering',
            'Gain a permanent bonus to damage thresholds.'
          ),
          feature(
            'stalwart-iron-will',
            'Iron Will',
            'Mark extra Armor to reduce the severity of physical damage.'
          ),
        ],
        [
          feature(
            'stalwart-unrelenting',
            'Unrelenting',
            'Further increase your permanent threshold bonus.'
          ),
          feature(
            'stalwart-partners-in-arms',
            'Partners-in-Arms',
            'Mark Armor to reduce damage taken by a nearby ally.'
          ),
        ],
        [
          feature(
            'stalwart-undaunted',
            'Undaunted',
            'Push your permanent threshold bonus even higher.'
          ),
          feature(
            'stalwart-loyal-protector',
            'Loyal Protector',
            'Spend Stress to rush to an endangered ally and take the damage for them.'
          ),
        ]
      ),
      subclass(
        'guardian-vengeance',
        'Vengeance',
        'A punishing defender who turns harm dealt to the party back onto the enemy.',
        [
          feature('vengeance-at-ease', 'At Ease', 'Gain an extra Stress slot.'),
          feature(
            'vengeance-revenge',
            'Revenge',
            'Mark Stress to force a nearby attacker to mark a Hit Point after striking you.'
          ),
        ],
        [
          feature(
            'vengeance-act-of-reprisal',
            'Act of Reprisal',
            'Gain a Proficiency bonus against enemies who hurt nearby allies.'
          ),
        ],
        [
          feature(
            'vengeance-nemesis',
            'Nemesis',
            'Spend Hope to Prioritize a foe and turn favorable Duality results against them.'
          ),
        ]
      ),
    ],
  },
  {
    id: 'daggerheart-ranger',
    name: 'Ranger',
    system: 'daggerheart',
    source,
    version: '1.0',
    lastUpdated,
    sourceBook,
    description:
      'A hunter and wilderness tactician who either fights beside a companion or relentlessly tracks prey.',
    domains: ['Bone', 'Sage'],
    startingEvasion: 12,
    startingHitPoints: 6,
    classItems: ['A trophy from your first kill', 'A seemingly broken compass'],
    hopeFeature: feature(
      'ranger-hold-them-off',
      'Hold Them Off',
      'Spend 3 Hope after a successful weapon attack to apply the same roll to two more adversaries in range.'
    ),
    classFeatures: [
      feature(
        'ranger-focus',
        'Ranger’s Focus',
        'Spend Hope to mark a target as your Focus, track them, pressure them, and reroll against them.'
      ),
    ],
    subclasses: [
      subclass(
        'ranger-beastbound',
        'Beastbound',
        'A ranger whose bond with an animal ally shapes both travel and battle.',
        [
          feature(
            'beastbound-companion',
            'Companion',
            'Gain an animal companion that advances alongside you.'
          ),
        ],
        [
          feature(
            'beastbound-expert-training',
            'Expert Training',
            'Choose an extra advancement option for your companion.'
          ),
          feature(
            'beastbound-battle-bonded',
            'Battle-Bonded',
            'Your companion’s position helps raise your Evasion.'
          ),
        ],
        [
          feature(
            'beastbound-advanced-training',
            'Advanced Training',
            'Choose two more advancement options for your companion.'
          ),
          feature(
            'beastbound-loyal-friend',
            'Loyal Friend',
            'Once per long rest, you or your companion can take a lethal hit for the other.'
          ),
        ],
        'agility'
      ),
      subclass(
        'ranger-wayfinder',
        'Wayfinder',
        'A predator who hunts with precision, pressure, and superior mobility.',
        [
          feature(
            'wayfinder-ruthless-predator',
            'Ruthless Predator',
            'Mark Stress for stronger damage, and make severely damaged prey also mark Stress.'
          ),
          feature(
            'wayfinder-path-forward',
            'Path Forward',
            'Identify the most direct route to a familiar destination.'
          ),
        ],
        [
          feature(
            'wayfinder-elusive-predator',
            'Elusive Predator',
            'Gain an Evasion bonus against attacks from your Focus.'
          ),
        ],
        [
          feature(
            'wayfinder-apex-predator',
            'Apex Predator',
            'Spend Hope before striking your Focus to strip Fear from the GM on a hit.'
          ),
        ],
        'agility'
      ),
    ],
  },
  {
    id: 'daggerheart-rogue',
    name: 'Rogue',
    system: 'daggerheart',
    source,
    version: '1.0',
    lastUpdated,
    sourceBook,
    description:
      'A covert operator who exploits positioning, shadow, and social leverage to win fights unfairly.',
    domains: ['Midnight', 'Grace'],
    startingEvasion: 12,
    startingHitPoints: 6,
    classItems: ['A set of forgery tools', 'A grappling hook'],
    hopeFeature: feature(
      'rogue-dodge',
      'Rogue’s Dodge',
      'Spend 3 Hope to boost Evasion until an attack gets through or you next rest.'
    ),
    classFeatures: [
      feature(
        'rogue-cloaked',
        'Cloaked',
        'Your Hidden state improves into a more persistent form of concealment.'
      ),
      feature(
        'rogue-sneak-attack',
        'Sneak Attack',
        'Add tier-based d6s when you strike from Cloaked or alongside an ally in melee.'
      ),
    ],
    subclasses: [
      subclass(
        'rogue-nightwalker',
        'Nightwalker',
        'A shadow mage who slips through darkness and vanishes on demand.',
        [
          feature(
            'nightwalker-shadow-stepper',
            'Shadow Stepper',
            'Move between shadows, reappearing Cloaked.'
          ),
        ],
        [
          feature(
            'nightwalker-dark-cloud',
            'Dark Cloud',
            'Create a temporary zone of darkness that blocks line of sight.'
          ),
          feature('nightwalker-adrenaline', 'Adrenaline', 'Deal extra damage while Vulnerable.'),
        ],
        [
          feature(
            'nightwalker-fleeting-shadow',
            'Fleeting Shadow',
            'Gain more Evasion and extend the reach of Shadow Stepper.'
          ),
          feature(
            'nightwalker-vanishing-act',
            'Vanishing Act',
            'Mark Stress to become Cloaked instantly and slip free of restraint.'
          ),
        ],
        'finesse'
      ),
      subclass(
        'rogue-syndicate',
        'Syndicate',
        'A fixer who always seems to know someone useful in the current town.',
        [
          feature(
            'syndicate-well-connected',
            'Well-Connected',
            'Whenever you arrive somewhere important, establish a local contact with built-in complications.'
          ),
        ],
        [
          feature(
            'syndicate-contacts-everywhere',
            'Contacts Everywhere',
            'Once per session, call in a shady favor for gear, roll support, or a shadowy sniper.'
          ),
        ],
        [
          feature(
            'syndicate-reliable-backup',
            'Reliable Backup',
            'Call contacts multiple times per session, including defensive and social backup.'
          ),
        ],
        'finesse'
      ),
    ],
  },
  {
    id: 'daggerheart-seraph',
    name: 'Seraph',
    system: 'daggerheart',
    source,
    version: '1.0',
    lastUpdated,
    sourceBook,
    description:
      'A divine champion who protects allies, heals wounds, and brings sacred force to battle.',
    domains: ['Splendor', 'Valor'],
    startingEvasion: 9,
    startingHitPoints: 7,
    classItems: ['A bundle of offerings', 'A sigil of your god'],
    hopeFeature: feature(
      'seraph-life-support',
      'Life Support',
      'Spend 3 Hope to clear a Hit Point on an ally within Close range.'
    ),
    classFeatures: [
      feature(
        'seraph-prayer-dice',
        'Prayer Dice',
        'Roll subclass-based Prayer Dice each session to reduce damage, boost rolls, or generate Hope.'
      ),
    ],
    subclasses: [
      subclass(
        'seraph-divine-wielder',
        'Divine Wielder',
        'A holy warrior whose spirit-empowered weapon dominates the fight.',
        [
          feature(
            'divine-wielder-spirit-weapon',
            'Spirit Weapon',
            'Throw a melee weapon from your hand and mark Stress to hit more targets.'
          ),
          feature(
            'divine-wielder-sparing-touch',
            'Sparing Touch',
            'Once per long rest, clear Hit Points or Stress by touch.'
          ),
        ],
        [
          feature(
            'divine-wielder-devout',
            'Devout',
            'Improve Prayer Dice rolling and gain extra uses of Sparing Touch.'
          ),
        ],
        [
          feature(
            'divine-wielder-sacred-resonance',
            'Sacred Resonance',
            'Matching Spirit Weapon damage dice are doubled.'
          ),
        ],
        'strength'
      ),
      subclass(
        'seraph-winged-sentinel',
        'Winged Sentinel',
        'A divine flier who protects allies and hits harder from the sky.',
        [
          feature(
            'winged-sentinel-wings-of-light',
            'Wings of Light',
            'Fly at will, carry allies, and spend Hope for bonus damage while airborne.'
          ),
        ],
        [
          feature(
            'winged-sentinel-ethereal-visage',
            'Ethereal Visage',
            'Gain Presence advantage while flying and convert successful Presence to fear removal.'
          ),
        ],
        [
          feature(
            'winged-sentinel-ascendant',
            'Ascendant',
            'Gain a permanent Severe threshold bonus.'
          ),
          feature(
            'winged-sentinel-power-of-the-gods',
            'Power of the Gods',
            'Increase the airborne damage bonus from Wings of Light.'
          ),
        ],
        'strength'
      ),
    ],
  },
  {
    id: 'daggerheart-sorcerer',
    name: 'Sorcerer',
    system: 'daggerheart',
    source,
    version: '1.0',
    lastUpdated,
    sourceBook,
    description:
      'An innate mage who channels inherited power as raw elemental force or flexible spell manipulation.',
    domains: ['Arcana', 'Midnight'],
    startingEvasion: 10,
    startingHitPoints: 6,
    classItems: ['A whispering orb', 'A family heirloom'],
    hopeFeature: feature(
      'sorcerer-volatile-magic',
      'Volatile Magic',
      'Spend 3 Hope to reroll any number of damage dice on a magic attack.'
    ),
    classFeatures: [
      feature(
        'sorcerer-arcane-sense',
        'Arcane Sense',
        'Sense magical creatures and objects within Close range.'
      ),
      feature(
        'sorcerer-minor-illusion',
        'Minor Illusion',
        'Create a small visual illusion with a basic Spellcast Roll.'
      ),
      feature(
        'sorcerer-channel-raw-power',
        'Channel Raw Power',
        'Vault a domain card once per long rest to gain Hope or amplify a damage spell.'
      ),
    ],
    subclasses: [
      subclass(
        'sorcerer-elemental-origin',
        'Elemental Origin',
        'A sorcerer whose magic takes the shape of a chosen element.',
        [
          feature(
            'elemental-origin-elementalist',
            'Elementalist',
            'Choose an element and use it for harmless effects or to boost a roll or damage.'
          ),
        ],
        [
          feature(
            'elemental-origin-natural-evasion',
            'Natural Evasion',
            'Mark Stress to raise Evasion against a successful attack.'
          ),
        ],
        [
          feature(
            'elemental-origin-transcendence',
            'Transcendence',
            'Once per long rest, become a stronger elemental manifestation with chosen bonuses.'
          ),
        ],
        'instinct'
      ),
      subclass(
        'sorcerer-primal-origin',
        'Primal Origin',
        'A sorcerer who rewrites magic on the fly to extend range, dice, and targeting.',
        [
          feature(
            'primal-origin-manipulate-magic',
            'Manipulate Magic',
            'Mark Stress after casting or magical attacks to extend or modify the effect.'
          ),
        ],
        [
          feature(
            'primal-origin-enchanted-aid',
            'Enchanted Aid',
            'Help Spellcast Rolls with a stronger die and once per long rest swap an ally’s Duality Dice.'
          ),
        ],
        [
          feature(
            'primal-origin-arcane-charge',
            'Arcane Charge',
            'Store magical charge and cash it out for much stronger spell damage or reactions.'
          ),
        ],
        'instinct'
      ),
    ],
  },
  {
    id: 'daggerheart-warrior',
    name: 'Warrior',
    system: 'daggerheart',
    source,
    version: '1.0',
    lastUpdated,
    sourceBook,
    description:
      'A disciplined weapons master who controls melee space and turns courage or slaughter into momentum.',
    domains: ['Blade', 'Bone'],
    startingEvasion: 11,
    startingHitPoints: 6,
    classItems: ['The drawing of a lover', 'A sharpening stone'],
    hopeFeature: feature(
      'warrior-no-mercy',
      'No Mercy',
      'Spend 3 Hope to gain a lasting attack bonus until your next rest.'
    ),
    classFeatures: [
      feature(
        'warrior-attack-of-opportunity',
        'Attack of Opportunity',
        'Punish enemies who try to leave melee by stopping them, damaging them, or moving with them.'
      ),
      feature(
        'warrior-combat-training',
        'Combat Training',
        'Ignore weapon burden and add level to physical damage rolls.'
      ),
    ],
    subclasses: [
      subclass(
        'warrior-call-of-the-brave',
        'Call of the Brave',
        'A warrior who turns fear and impossible odds into courage for the whole group.',
        [
          feature('brave-courage', 'Courage', 'Gain Hope whenever you fail with Fear.'),
          feature(
            'brave-battle-ritual',
            'Battle Ritual',
            'Once per long rest, prepare for danger to clear Stress and gain Hope.'
          ),
        ],
        [
          feature(
            'brave-rise-to-the-challenge',
            'Rise to the Challenge',
            'When you are badly hurt, roll a d20 as your Hope Die.'
          ),
        ],
        [
          feature(
            'brave-camaraderie',
            'Camaraderie',
            'Improve Tag Team usage for you and your allies.'
          ),
        ]
      ),
      subclass(
        'warrior-call-of-the-slayer',
        'Call of the Slayer',
        'A damage specialist who banks extra dice and shares martial prowess with the party.',
        [
          feature(
            'slayer-slayer',
            'Slayer',
            'Build a pool of Slayer Dice from rolls with Hope and spend them on attacks or damage.'
          ),
        ],
        [
          feature(
            'slayer-weapon-specialist',
            'Weapon Specialist',
            'Spend Hope to add a secondary-weapon die and improve Slayer Die rolling.'
          ),
        ],
        [
          feature(
            'slayer-martial-preparation',
            'Martial Preparation',
            'Unlock a downtime move that grants Slayer Dice to the party.'
          ),
        ]
      ),
    ],
  },
  {
    id: 'daggerheart-wizard',
    name: 'Wizard',
    system: 'daggerheart',
    source,
    version: '1.0',
    lastUpdated,
    sourceBook,
    description:
      'A learned mage who masters prepared magic through either broad scholarship or battlefield spellcraft.',
    domains: ['Codex', 'Splendor'],
    startingEvasion: 11,
    startingHitPoints: 5,
    classItems: ['A book you’re trying to translate', 'A tiny harmless elemental pet'],
    hopeFeature: feature(
      'wizard-not-this-time',
      'Not This Time',
      'Spend 3 Hope to force a nearby adversary to reroll an attack or damage roll.'
    ),
    classFeatures: [
      feature(
        'wizard-prestidigitation',
        'Prestidigitation',
        'Perform subtle harmless magical effects at will.'
      ),
      feature(
        'wizard-strange-patterns',
        'Strange Patterns',
        'Choose a Duality result that grants Hope or clears Stress when rolled.'
      ),
    ],
    subclasses: [
      subclass(
        'wizard-school-of-knowledge',
        'School of Knowledge',
        'A prepared specialist who expands their card access and turns expertise into efficiency.',
        [
          feature(
            'school-knowledge-prepared',
            'Prepared',
            'Take an extra domain card from an accessible domain.'
          ),
          feature(
            'school-knowledge-adept',
            'Adept',
            'Mark Stress instead of spending Hope when utilizing an Experience, and double the modifier.'
          ),
        ],
        [
          feature(
            'school-knowledge-accomplished',
            'Accomplished',
            'Take another extra domain card from an accessible domain.'
          ),
          feature(
            'school-knowledge-perfect-recall',
            'Perfect Recall',
            'Once per rest, reduce a recalled card’s vault cost.'
          ),
        ],
        [
          feature(
            'school-knowledge-brilliant',
            'Brilliant',
            'Take yet another extra domain card from an accessible domain.'
          ),
          feature(
            'school-knowledge-honed-expertise',
            'Honed Expertise',
            'Sometimes use Experiences without spending Hope.'
          ),
        ],
        'knowledge'
      ),
      subclass(
        'wizard-school-of-war',
        'School of War',
        'A combat mage who hardens their defenses and feeds on aggressive magical output.',
        [
          feature('school-war-battlemage', 'Battlemage', 'Gain an extra Hit Point slot.'),
          feature(
            'school-war-face-your-fear',
            'Face Your Fear',
            'Successful attacks with Fear deal extra magic damage.'
          ),
        ],
        [
          feature(
            'school-war-conjure-shield',
            'Conjure Shield',
            'Add Proficiency to Evasion while you have enough Hope.'
          ),
          feature(
            'school-war-fueled-by-fear',
            'Fueled by Fear',
            'Increase the bonus damage from Face Your Fear.'
          ),
        ],
        [
          feature(
            'school-war-thrive-in-chaos',
            'Thrive in Chaos',
            'Mark Stress after a successful hit to force an extra Hit Point on the target.'
          ),
          feature(
            'school-war-have-no-fear',
            'Have No Fear',
            'Increase Face Your Fear damage again.'
          ),
        ],
        'knowledge'
      ),
    ],
  },
];

export const daggerheartClassesById: Record<string, DaggerheartClass> = Object.fromEntries(
  daggerheartClasses.map((entry) => [entry.id, entry])
);

export function getDaggerheartClass(id: string): DaggerheartClass | undefined {
  return daggerheartClassesById[id];
}
