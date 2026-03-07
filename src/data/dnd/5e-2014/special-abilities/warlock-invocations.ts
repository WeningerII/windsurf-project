import { Feature } from '../../../../types/core/character';

// D&D 5e-2014 Warlock Invocations
// Eldritch Invocations are special abilities available to warlocks

export const warlockInvocations: Feature[] = [
  {
    id: 'invocation-agonizing-blast',
    name: 'Agonizing Blast',
    source: 'Warlock',
    description:
      'When you cast eldritch blast, add your Charisma modifier to the damage it deals on a hit.',
  },
  {
    id: 'invocation-armor-of-shadows',
    name: 'Armor of Shadows',
    source: 'Warlock',
    description:
      'You can cast mage armor on yourself at will, without expending a spell slot or material components.',
  },
  {
    id: 'invocation-ascendant-step',
    name: 'Ascendant Step',
    source: 'Warlock',
    description:
      'You can cast levitate on yourself at will, without expending a spell slot or material components.',
  },
  {
    id: 'invocation-beast-speech',
    name: 'Beast Speech',
    source: 'Warlock',
    description: 'You can cast speak with animals at will, without expending a spell slot.',
  },
  {
    id: 'invocation-beguiling-influence',
    name: 'Beguiling Influence',
    source: 'Warlock',
    description: 'You gain proficiency in the Deception and Persuasion skills.',
  },
  {
    id: 'invocation-book-of-ancient-secrets',
    name: 'Book of Ancient Secrets',
    source: 'Warlock',
    description:
      'You can now inscribe magical rituals in your Book of Shadows. Choose two 1st-level spells that have the ritual tag. You learn these spells and can cast them as rituals.',
  },
  {
    id: 'invocation-devils-sight',
    name: "Devil's Sight",
    source: 'Warlock',
    description:
      "You can see in dim light within 120 feet of you as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray.",
  },
  {
    id: 'invocation-dreadful-word',
    name: 'Dreadful Word',
    source: 'Warlock',
    description:
      "You can cast confusion once using a warlock spell slot. You can't do so again until you finish a long rest.",
  },
  {
    id: 'invocation-eldritch-sight',
    name: 'Eldritch Sight',
    source: 'Warlock',
    description: 'You can cast detect magic at will, without expending a spell slot.',
  },
  {
    id: 'invocation-eldritch-spear',
    name: 'Eldritch Spear',
    source: 'Warlock',
    description: 'When you cast eldritch blast, its range is 300 feet instead of 120 feet.',
  },
  {
    id: 'invocation-fiendish-resilience',
    name: 'Fiendish Resilience',
    source: 'Warlock',
    description:
      'You can choose one damage type when you finish a short or long rest and gain resistance to that damage type until your next rest.',
  },
  {
    id: 'invocation-fiendish-vigor',
    name: 'Fiendish Vigor',
    source: 'Warlock',
    description:
      'You can cast false life on yourself at will as a 1st-level spell, without expending a spell slot or material components.',
  },
  {
    id: 'invocation-gaze-of-two-minds',
    name: 'Gaze of Two Minds',
    source: 'Warlock',
    description:
      'You can use your action to touch a willing humanoid and perceive through its senses until the end of your next turn. As long as the creature is alive and on the same plane of existence as you, you can use your action on subsequent turns to maintain this connection.',
  },
  {
    id: 'invocation-mask-of-many-faces',
    name: 'Mask of Many Faces',
    source: 'Warlock',
    description: 'You can cast disguise self at will, without expending a spell slot.',
  },
  {
    id: 'invocation-one-with-shadows',
    name: 'One with Shadows',
    source: 'Warlock',
    description:
      'When you are in an area of dim light or darkness, you can use your action to become invisible until you move or take an action or reaction.',
  },
  {
    id: 'invocation-sign-of-ill-omen',
    name: 'Sign of Ill Omen',
    source: 'Warlock',
    description:
      "You can cast bestow curse once using a warlock spell slot. You can't do so again until you finish a long rest.",
  },
  {
    id: 'invocation-thief-of-five-fates',
    name: 'Thief of Five Fates',
    source: 'Warlock',
    description:
      "You can cast bane once using a warlock spell slot. You can't do so again until you finish a long rest.",
  },
  {
    id: 'invocation-thirsting-blade',
    name: 'Thirsting Blade',
    source: 'Warlock',
    description:
      'You can attack with your pact weapon twice, instead of once, whenever you take the Attack action on your turn.',
  },
  {
    id: 'invocation-visions-of-distant-realms',
    name: 'Visions of Distant Realms',
    source: 'Warlock',
    description: 'You can cast scrying at will, without expending a spell slot.',
  },
  {
    id: 'invocation-voice-of-the-chain-master',
    name: 'Voice of the Chain Master',
    source: 'Warlock',
    description:
      'You can communicate telepathically with your familiar and perceive through its senses as long as you are on the same plane of existence. Additionally, while perceiving through it, you can also speak through it in your own voice.',
  },
  {
    id: 'invocation-whispers-of-the-grave',
    name: 'Whispers of the Grave',
    source: 'Warlock',
    description: 'You can cast speak with dead at will, without expending a spell slot.',
  },
  {
    id: 'invocation-witch-sight',
    name: 'Witch Sight',
    source: 'Warlock',
    description:
      'You can see the true form of any shapechanger or creature concealed by magic while the creature is within 30 feet of you and within line of sight.',
  },
];

export const warlockInvocationsArray = warlockInvocations;
